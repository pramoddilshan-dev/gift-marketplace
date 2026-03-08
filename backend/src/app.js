import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import sequelize from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded product images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.get("/health", (req, res) => {
  res.send("Server is healthy 🚀");
});

// Global error handler so multer / other middleware errors return JSON
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Server error" });
});

sequelize.sync()
  .then(() => console.log("✅ Database synced"))
  .catch(err => console.error("❌ DB error:", err));

export default app;
