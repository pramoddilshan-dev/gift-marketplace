import "dotenv/config";
import express from "express"; // ✅ FIX: import express
import app from "./src/app.js";
import sequelize from "./src/config/database.js";
import User from "./src/models/User.js"; // import your models
import testRoutes from "./src/routes/testRoutes.js";
import path from "path";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Sync all models
    await sequelize.sync({ alter: true }); // Creates tables if they don't exist
    console.log("All models synced successfully!");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("DB connection failed:", error);
  }
};

app.use("/api/test", testRoutes);

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

startServer();
