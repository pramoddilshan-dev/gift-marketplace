import Product from "../models/Product.js";
import User from "../models/User.js";

/**
 * @desc   Create product (Seller/Admin)
 * @route  POST /api/products
 */
export const createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    if (isNaN(price) || Number(price) <= 0) {
      return res.status(400).json({ message: "Price must be a valid number > 0" });
    }

    const product = await Product.create({
      name: name.trim(),
      description,
      price: Number(price),
      image_url: req.file ? req.file.path : null,
      seller_id: req.user.id
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error.message);
    res.status(500).json({ message: "Failed to create product" });
  }
};

/**
 * @desc   Get all active products (Public)
 * @route  GET /api/products
 */
export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { rows, count } = await Product.findAndCountAll({
      where: { is_active: true },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      include: {
        model: User,
        attributes: ["id", "name", "email"]
      }
    });

    res.json({
      total: count,
      page,
      pages: Math.ceil(count / limit),
      products: rows
    });
  } catch (error) {
    console.error("Get products error:", error.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

/**
 * @desc   Get single product
 * @route  GET /api/products/:id
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id, is_active: true },
      include: {
        model: User,
        attributes: ["id", "name", "email"]
      }
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Get product error:", error.message);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

/**
 * @desc   Update product
 * @route  PUT /api/products/:id
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product || !product.is_active) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.user.role !== "admin" && product.seller_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { name, description, price } = req.body;

    if (price !== undefined && (isNaN(price) || Number(price) <= 0)) {
      return res.status(400).json({ message: "Invalid price" });
    }

    if (name !== undefined) product.name = name.trim();
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (req.file) product.image_url = req.file.path;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Update product error:", error.message);
    res.status(500).json({ message: "Failed to update product" });
  }
};

/**
 * @desc   Soft delete product
 * @route  DELETE /api/products/:id
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.user.role !== "admin" && product.seller_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    product.is_active = false;
    await product.save();

    res.json({ message: "Product removed successfully" });
  } catch (error) {
    console.error("Delete product error:", error.message);
    res.status(500).json({ message: "Failed to delete product" });
  }
};
