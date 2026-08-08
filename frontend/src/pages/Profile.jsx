import { useAuth } from "../context/AuthContext";

// This page is only reachable through <ProtectedRoute>, so by the time
// it renders we can safely assume `user` is populated.
const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">{user.username.charAt(0).toUpperCase()}</div>
        <h2>{user.username}</h2>
        <p className="profile-email">{user.email}</p>

        <div className="profile-details">
          <div className="detail-row">
            <span>User ID</span>
            <span>{user._id}</span>
          </div>
          <div className="detail-row">
            <span>Joined</span>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
