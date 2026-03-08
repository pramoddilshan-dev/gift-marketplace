import { useEffect, useState } from "react";
import { getProductById } from "../api/products.api";
import { addToCart } from "../api/cart.api";

export default function QuickViewModal({ productId, open, onClose, onAdded }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!open || !productId) return;
    setLoading(true);
    setError("");
    getProductById(productId)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.error(err);
        setError("Unable to load product details.");
      })
      .finally(() => setLoading(false));
  }, [open, productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addToCart({ product_id: product.id, quantity: 1 });
      onAdded?.();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add to cart.");
    } finally {
      setAdding(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {loading ? (
          <div className="modal-loading">Loading product...</div>
        ) : error ? (
          <div className="modal-error">{error}</div>
        ) : product ? (
          <div className="modal-content">
            <div className="modal-image">
              {product.image_url ? (
                <img src={`http://localhost:5000/uploads/products/${product.image_url}`} alt={product.name} />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
            </div>
            <div className="modal-details">
              <h2>{product.name}</h2>
              <p className="text-secondary">by {product.User?.name || "Seller"}</p>
              <p className="modal-price">Rs {parseFloat(product.price).toLocaleString()}</p>
              <p className="modal-desc">{product.description || "No description available."}</p>
              <div className="modal-actions">
                <button
                  className="btn-primary"
                  onClick={handleAddToCart}
                  disabled={adding}
                >
                  {adding ? "Adding..." : "Add to Cart"}
                </button>
                <button className="btn-secondary" onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
