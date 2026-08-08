import mongoose from "mongoose";

// Schema for an image post. Every post belongs to exactly one user
// (the "user" field), which is how we know who's allowed to edit/delete it.
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title cannot be empty"],
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    image: {
      // Filename only (as stored on disk in backend/uploads).
      // The frontend builds the full URL from this.
      type: String,
      required: [true, "Image is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
