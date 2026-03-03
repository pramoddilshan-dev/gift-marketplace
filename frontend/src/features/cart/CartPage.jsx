import { useEffect, useState, useContext } from "react";
import { getCart, updateCartItem, removeCartItem } from "../../api/cart.api";
import { AuthContext } from "../../auth/AuthContext";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getCart();
        setCartItems(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      await updateCartItem({ product_id: productId, quantity });

      setCartItems((prev) =>
        prev.map((item) =>
          item.product_id === productId
            ? { ...item, quantity }
            : item
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update quantity");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeCartItem(productId);

      setCartItems((prev) =>
        prev.filter((item) => item.product_id !== productId)
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove item");
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.product?.price || 0);
    return sum + price * item.quantity;
  }, 0);

  if (loading) return <p>Loading cart...</p>;
  if (!cartItems.length) return <p>Your cart is empty</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
      <h2>Your Cart</h2>

      {cartItems.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            gap: "1rem",
            border: "1px solid #ccc",
            padding: "1rem",
            marginBottom: "1rem",
            borderRadius: "8px",
            alignItems: "center",
          }}
        >
          {item.product?.image_url ? (
            <img
              src={`http://localhost:5000/uploads/products/${item.product.image_url}`}
              alt={item.product?.name}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
          ) : (
            <div
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "6px",
                color: "#999",
                fontSize: "12px",
              }}
            >
              No Image
            </div>
          )}

          <div style={{ flex: 1 }}>
            <h4>{item.product?.name}</h4>
            <p>Seller: {item.product?.User?.name}</p>
            <p>Price: Rs {item.product?.price}</p>

            <div>
              <label>
                Qty:
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(
                      item.product_id,
                      Number(e.target.value)
                    )
                  }
                  style={{ width: "60px", marginLeft: "0.5rem" }}
                />
              </label>

              <button
                onClick={() => handleRemove(item.product_id)}
                style={{ marginLeft: "1rem" }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      <h3>Total: Rs {totalPrice.toFixed(2)}</h3>

      <button
        style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}
        onClick={() =>
          alert("Checkout functionality not yet implemented")
        }
      >
        Proceed to Checkout
      </button>
    </div>
  );
}