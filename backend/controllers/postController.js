import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Post from "../models/Post.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "..", "uploads");

// Helper: delete a file from the uploads folder, ignoring "doesn't exist" errors
const deleteImageFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(uploadsDir, filename);
  fs.unlink(filePath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Failed to delete image file:", err.message);
    }
  });
};

// @desc    Create a new post (title + image). Logged-in users only.
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      if (req.file) deleteImageFile(req.file.filename); // clean up orphaned upload
      return res.status(400).json({ message: "Title is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "An image file is required" });
    }

    const post = await Post.create({
      title: title.trim(),
      image: req.file.filename,
      user: req.user._id,
    });

    const populated = await post.populate("user", "username");

    res.status(201).json(populated);
  } catch (error) {
    if (req.file) deleteImageFile(req.file.filename);
    console.error("Create post error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all posts (public feed), newest first
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "username");

    res.status(200).json(posts);
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get only the logged-in user's own posts (for the manage page)
// @route   GET /api/posts/mine
// @access  Private
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("user", "username");

    res.status(200).json(posts);
  } catch (error) {
    console.error("Get my posts error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a post's title and/or image. Only the post's creator may do this.
// @route   PUT /api/posts/:id
// @access  Private (owner only)
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      if (req.file) deleteImageFile(req.file.filename);
      return res.status(404).json({ message: "Post not found" });
    }

    // Ownership check -- only the user who created the post can edit it
    if (post.user.toString() !== req.user._id.toString()) {
      if (req.file) deleteImageFile(req.file.filename);
      return res.status(403).json({ message: "You can only edit your own posts" });
    }

    const { title } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        if (req.file) deleteImageFile(req.file.filename);
        return res.status(400).json({ message: "Title cannot be empty" });
      }
      post.title = title.trim();
    }

    if (req.file) {
      const oldImage = post.image;
      post.image = req.file.filename;
      deleteImageFile(oldImage); // remove the replaced file
    }

    await post.save();
    const populated = await post.populate("user", "username");

    res.status(200).json(populated);
  } catch (error) {
    if (req.file) deleteImageFile(req.file.filename);
    console.error("Update post error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a post. Only the post's creator may do this.
// @route   DELETE /api/posts/:id
// @access  Private (owner only)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ownership check -- only the user who created the post can delete it
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    deleteImageFile(post.image);
    await post.deleteOne();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
