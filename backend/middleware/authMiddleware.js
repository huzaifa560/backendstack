import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware that protects private routes.
// It reads the JWT from the HTTP-only cookie, verifies it, and attaches
// the corresponding user document to req.user for use in controllers.
const protect = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user to the request, excluding the password field
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user no longer exists" });
    }

    next(); // token valid -> continue to the actual route handler
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({ message: "Not authorized, invalid or expired token" });
  }
};

export default protect;
