import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= Database =================
connectDB();

const app = express();

// ================= Middleware =================

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ================= Routes =================

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// ================= Uploads =================

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= Health Check =================

app.get("/", (req, res) => {
  res.json({
    message: "API is running...",
  });
});

// ================= Error Handler =================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Something went wrong on the server",
  });
});

// ================= Server =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  );
});
