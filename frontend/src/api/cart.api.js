import api from "./axios"; // your configured axios instance

// Get current user's cart
export const getCart = () => {
  return api.get("/api/cart");
};

// Add item to cart
export const addToCart = (data) => {
  return api.post("/api/cart", data);
};

// Update cart item quantity
export const updateCartItem = (data) => {
  return api.put("/api/cart", data);
  // If your backend uses different route like /api/cart/:id,
  // adjust accordingly.
};

// Remove item from cart
export const removeCartItem = (productId) => {
  return api.delete(`/api/cart/${productId}`);
};