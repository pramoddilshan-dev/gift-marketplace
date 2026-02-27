import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { uploadProductImage } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/:id", getProductById);

// Seller/Admin
router.post(
  "/",
  protect,
  authorizeRoles("seller", "admin"),
  uploadProductImage.single("image"),
  createProduct
);

router.put(
  "/:id",
  protect,
  authorizeRoles("seller", "admin"),
  uploadProductImage.single("image"),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("seller", "admin"),
  deleteProduct
);

export default router;
