import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import Upload from "./pages/Upload";
import ManagePosts from "./pages/ManagePosts";

function App() {
  return (
    <AuthProvider>
      {/* Global toast notifications, rendered once at the top level */}
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/manage" element={<ManagePosts/>}/>

          <Route path="/upload" element={<Upload />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
              
            }
          />
        </Routes>
      </main>
    </AuthProvider>
  );
}

export default App;
