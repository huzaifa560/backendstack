import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";


const ManagePosts = () => {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [saving, setSaving] = useState(false);

  // =========================
  // GET MY POSTS
  // =========================
  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const { data } = await api.get("/posts/mine");

        setPosts(data);
      } catch (error) {
        console.error(
          "Error fetching posts:",
          error.response?.data || error
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyPosts();
    } else {
      setLoading(false);
    }
  }, [user]);

  // =========================
  // START EDITING
  // =========================
  const startEdit = (post) => {
    setEditingId(post._id);
    setEditTitle(post.title);
    setEditImage(null);
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditImage(null);
  };

  // =========================
  // SAVE EDIT
  // =========================
  const saveEdit = async (postId) => {
    if (!editTitle.trim()) {
      alert("Title cannot be empty");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("title", editTitle);

      if (editImage) {
        formData.append("image", editImage);
      }

      const { data } = await api.put(
        `/posts/${postId}`,
        formData
      );

      const updatedPost = data.post || data;

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post._id === postId ? updatedPost : post
        )
      );

      setEditingId(null);
      setEditTitle("");
      setEditImage(null);

      alert("Post updated successfully!");
    } catch (error) {
      console.error(
        "Update error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update post"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE POST
  // =========================
  const deletePost = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/posts/${postId}`);

      setPosts((currentPosts) =>
        currentPosts.filter(
          (post) => post._id !== postId
        )
      );

      alert("Post deleted successfully!");
    } catch (error) {
      console.error(
        "Delete error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "You cannot delete this post"
      );
    }
  };

  // =========================
  // NOT LOGGED IN
  // =========================
  if (!user) {
    return (
      <div className="manage-page">
        <div className="manage-login">
          <h2>Please login first</h2>

          <Link
            to="/login"
            className="manage-login-btn"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="manage-page">
        <h2>Loading your posts...</h2>
      </div>
    );
  }

  // =========================
  // MAIN PAGE
  // =========================
  return (
    <div className="manage-page">

      {/* HEADER */}
      <div className="manage-header">
        <div>
          <h1>Manage Posts</h1>
          <p>Your uploaded posts</p>
        </div>

        <Link
          to="/upload"
          className="upload-btn"
        >
          + Upload Post
        </Link>
      </div>

      {/* NO POSTS */}
      {posts.length === 0 ? (
        <div className="no-posts">
          <h2>
            You haven't uploaded any posts yet.
          </h2>

          <Link to="/upload">
            Upload your first post
          </Link>
        </div>
      ) : (

        /* POSTS */
        <div className="manage-grid">

          {posts.map((post) => (
            <div
              className="manage-card"
              key={post._id}
            >

              {/* ======================
                  NORMAL VIEW
              ======================= */}
              {editingId !== post._id && (
                <>
                  <img
                    src={`http://localhost:5000/uploads/${post.image}`}
                    alt={post.title}
                    className="manage-image"
                  />

                  <div className="manage-info">

                    <h2>{post.title}</h2>

                    <p>Your post</p>

                    <div className="manage-actions">

                      {/* VIEW */}
                      <Link
                        to={`/post/${post._id}`}
                        className="view-btn"
                      >
                        View
                      </Link>

                      {/* EDIT */}
                      <button
                        className="edit-btn"
                        onClick={() =>
                          startEdit(post)
                        }
                      >
                        Edit
                      </button>

                      {/* DELETE */}
                      <button
                        className="delete-btn"
                        onClick={() =>
                          deletePost(post._id)
                        }
                      >
                        Delete
                      </button>

                    </div>
                  </div>
                </>
              )}

              {/* ======================
                  EDIT MODE
              ======================= */}
              {editingId === post._id && (
                <div className="edit-box">

                  <h2>Edit Post</h2>

                  {/* TITLE */}
                  <label>Title</label>

                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) =>
                      setEditTitle(e.target.value)
                    }
                    placeholder="Post title"
                  />

                  {/* CURRENT IMAGE */}
                  <label>Current Image</label>

                  <img
                    src={`http://localhost:5000/uploads/${post.image}`}
                    alt={post.title}
                    className="edit-image"
                  />

                  {/* NEW IMAGE */}
                  <label>Change Image</label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setEditImage(
                        e.target.files[0]
                      )
                    }
                  />

                  {/* BUTTONS */}
                  <div className="edit-actions">

                    <button
                      className="save-btn"
                      onClick={() =>
                        saveEdit(post._id)
                      }
                      disabled={saving}
                    >
                      {saving
                        ? "Saving..."
                        : "Save Changes"}
                    </button>

                    <button
                      className="cancel-btn"
                      onClick={cancelEdit}
                      disabled={saving}
                    >
                      Cancel
                    </button>

                  </div>
                </div>
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default ManagePosts;