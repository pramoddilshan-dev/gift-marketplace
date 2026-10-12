import "dotenv/config";
import express from "express"; // ✅ FIX: import express
import app from "./src/app.js";
import sequelize from "./src/config/database.js";
import User from "./src/models/User.js"; // import your models
import testRoutes from "./src/routes/testRoutes.js";
import path from "path";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import sellerRoutes from "./src/routes/sellerRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import serverless from "serverless-http";

// Database sync and initialization function
const initDb = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("All models synced successfully!");
  } catch (error) {
    console.error("DB connection failed:", error);
  }
};

// Middleware setup
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/admin", adminRoutes);

// Local development logic
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  initDb().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running locally on port ${PORT}`);
    });
  });
} else {
  // Sync DB on serverless execution
  initDb();
}

// Export for Vercel Serverless Function
export default app;
export const handler = serverless(app);