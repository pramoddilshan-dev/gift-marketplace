import { useEffect, useState } from "react";
import { getProducts } from "../api/products.api";
import { getCategories } from "../api/categories.api";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getProducts();
        setProducts(Array.isArray(res.data?.products) ? res.data.products : []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      }
    };
    fetch();
  }, []);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getCategories();
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setCategories([]);
      }
    };
    load();
  }, []);

  return (
    <div>
      <section className="home-hero">
        <div className="hero-content">
          <h1>Find the Perfect Gift 🎁</h1>
          <p>Discover unique treasures for every occasion, carefully curated to delight every recipient.</p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => navigate('/products')}>Start Shopping</button>
            <button className="btn-secondary" onClick={() => navigate('/products')}>Explore Catalog</button>
          </div>
        </div>
      </section>

      <section className="home-highlights container py-6">
        <h2>Why Shop with Gift Marketplace?</h2>
        <div className="highlights-grid">
          <div className="highlight-card">
            <div className="highlight-icon">✨</div>
            <h3>Curated Collections</h3>
            <p>Handpicked gifts so you can find the right present in seconds.</p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">🚚</div>
            <h3>Fast & Reliable Delivery</h3>
            <p>Get gifts delivered on time with tracking for every order.</p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">🔒</div>
            <h3>Secure Checkout</h3>
            <p>Safe payments with modern encryption and privacy-first practices.</p>
          </div>
        </div>
      </section>

      <section className="home-categories container py-6">
        <div className="section-header">
          <h2>Top Categories</h2>
          <p>Browse popular categories and find something special.</p>
        </div>
        <div className="categories-grid">
          {categories.slice(0, 6).map((c) => (
            <button
              key={c.id}
              className="category-card"
              onClick={() => navigate(`/products?category=${c.id}`)}
            >
              <div className="category-icon">🎁</div>
              <div className="category-info">
                <div className="category-name">{c.name}</div>
                <div className="category-meta">Explore {c.name.toLowerCase()}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="home-featured container py-6">
        <div className="section-header">
          <h2>Featured Products</h2>
          <p>Handpicked products that are trending right now.</p>
        </div>

        <div className="featured-grid grid grid-3">
          {products.slice(0, 6).map((p) => (
            <div key={p.id} className="card product-card">
              <div className="product-image">
                {p.image_url ? (
                  <img src={`http://localhost:5000/${p.image_url}`} alt={p.name} />
                ) : (
                  <div className="placeholder-image">No Image</div>
                )}
              </div>
              <div className="product-content">
                <h3>{p.name}</h3>
                <p className="text-secondary text-sm mb-2">Rs {parseFloat(p.price).toLocaleString()}</p>
                <button
                  className="btn-primary"
                  onClick={() => navigate(`/products`)}
                >
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}