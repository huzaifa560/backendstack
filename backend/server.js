import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));


// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --- Middleware ---
app.use(express.json()); // parse incoming JSON request bodies
app.use(cookieParser()); // parse cookies attached to incoming requests (needed to read the JWT cookie)

// CORS must be configured carefully so that cookies can be sent
// cross-origin between the frontend (e.g. localhost:5173) and backend
// (e.g. localhost:5000).
app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://zaftube.vercel.app/", // exact frontend origin (not "*")
    credentials: true, // allows the browser to send/receive cookies
  })
);

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Serve uploaded post images as static files (e.g. /uploads/12345-abcd.jpg)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Simple health-check route



app.get("/", (req, res) => {
  res.send("API is running...");
});

// --- Global error handler (catches anything not handled in controllers) ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  );
});
