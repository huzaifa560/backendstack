// Upload.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Upload = () => {
  const { user, posts, setPosts } = useAuth();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // =========================
  // CHECK LOGIN
  // =========================
  if (!user) {
    return (
      <div>
        <h2>Please login first</h2>

        <button onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    );
  }

  // =========================
  // UPLOAD POST
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setMessage("Please enter a title");
      return;
    }

    if (!image) {
      setMessage("Please select an image");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("image", image);

      const response = await fetch(
        "http://localhost:5000/api/posts",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      // Add newly created post to context
      setPosts([data.post || data, ...posts]);

      setTitle("");
      setImage(null);

      document.getElementById("imageInput").value = "";

      setMessage("Post uploaded successfully!");

      // Optional: go back home
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      console.error(error);
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">

      <div className="upload-container">

        <h1>Upload Post</h1>

        <form onSubmit={handleSubmit}>

          {/* TITLE */}
          <div>
            <label>Title</label>

            <input
              type="text"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* IMAGE */}
          <div>
            <label>Image</label>

            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          {/* PREVIEW */}
          {image && (
            <div>
              <p>Preview:</p>

              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                width="300"
              />
            </div>
          )}

          {/* BUTTON */}
          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload Post"}
          </button>

        </form>

        {message && <p>{message}</p>}

      </div>

    </div>
  );
};

export default Upload;