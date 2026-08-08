import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import upload from "../pages/Upload"
import ManagePosts from "../pages/ManagePosts"
import logoutIcon from "../components/logout.png"
import pencil from "../components/pencil.png"

import home from "../components/home.png"

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); // asks server to clear the cookie
      logout(); // clear local state
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        🔐 ZafTube
      </Link>


      <div className="navbar-links ">
        <Link className="upload-link"  to="/">
        
        <img className="pencilicon" src={home} alt="manage"></img>
        
        
        
        
        </Link>


        {user ? (
          <>
            

              <Link className="upload-link" to="/manage">
               <img className="pencilicon" src={pencil} alt="manage"></img>
              
              </Link>

            <button className="navbar-btn upload-link" onClick={handleLogout}>
              Logout  <img className="logouticon" src={logoutIcon} alt="Upload" />
            </button>
          </>
        ) : (
          <>
           
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
