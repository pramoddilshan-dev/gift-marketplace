import Product from "../models/Product.js";

export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { seller_id: req.user.id, is_active: true },
      order: [["createdAt", "DESC"]]
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};