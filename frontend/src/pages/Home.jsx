import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const Home = () => {
  const { user } = useAuth();
const { posts, postsLoading } = useAuth();

  // NOT LOGGED IN
  if (!user) {
    return (
      <div>
        <h1>Welcome to ZafTube</h1>

        <p>Login to watch whats happening in the world!</p>

        <Link to="/login" className="auth-btn bton">
          Login
        </Link>

        <Link to="/register" className="auth-btn secondary">
          Register 
        </Link>
      </div>
    );
  }

  // LOGGED IN
  return (
    <>
  
      <div className="home-container">
    
        <div className="side-bar"></div>
        <div className="feed-bar">
     
          <div className="feed-content">
        
            {posts.map((post) => (
              <div key={post.id} className="feed-content">
            
                <div key={post.id} className="feed-content-div">
              
                  <img  
                   className="feed-image"
                    src={`https://jfewggk5sn5hjdsng6q4zm6u.sx.ameerhmzx.com/uploads/${post.image}`}
                    alt={post.title} 
                    
                  />
                  <div className="feed-title-div">
                    
                    <h2 className="title">{post.title}</h2>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
