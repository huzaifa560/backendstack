import express from "express";
import {
  createPost,
  getPosts,
  getMyPosts,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public - anyone can view the feed
router.get("/", getPosts);

// Private - must come before "/:id"-style routes if we ever add one
router.get("/mine", protect, getMyPosts);

// Private - only logged-in users can post
router.post("/", protect, upload.single("image"), createPost);

// Private - ownership is enforced inside the controller
router.put("/:id", protect, upload.single("image"), updatePost);
router.delete("/:id", protect, deletePost);

export default router;
