import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wraps any page that should only be visible to logged-in users.
// While we're still checking auth status, show a loading state instead
// of flashing a redirect.
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Checking authentication...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
 
};

export default ProtectedRoute;
