import { useEffect, useState, useContext } from "react";
import { getProducts } from "../api/products.api";
import { addToCart } from "../api/cart.api";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();

        // Ensure products is always an array
        const productList = Array.isArray(res.data?.products)
          ? res.data.products
          : [];

        setProducts(productList);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await addToCart({ product_id: productId, quantity: 1 });
      alert("Added to cart");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (!products || products.length === 0)
    return <p>No products found</p>;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
        gap: "1rem",
      }}
    >
      {products.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
          }}
        >
          {p.image_url ? (
            <img
              src={`http://localhost:5000/uploads/products/${p.image_url}`}
              alt={p.name}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "200px",
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "6px",
                color: "#999",
              }}
            >
              No Image
            </div>
          )}

          <h3>{p.name}</h3>
          <p>{p.description}</p>
          <p>
            <strong>Rs {p.price}</strong>
          </p>
          <p>
            <small>Seller: {p.User?.name}</small>
          </p>

          {user?.role === "customer" && (
            <button onClick={() => handleAddToCart(p.id)}>
              Add to Cart
            </button>
          )}
        </div>
      ))}
    </div>
  );
}