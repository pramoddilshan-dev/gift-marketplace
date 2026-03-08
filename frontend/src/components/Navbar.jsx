import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../auth/AuthContext";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((open) => !open);

  // debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate("/products");
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <div className="nav-left">
          <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
            <div className="brand-logo">🎁</div>
            <div className="brand-text">
              <div className="brand-title">Gift Marketplace</div>
              <div className="brand-sub">Unique gifts & curated finds</div>
            </div>
          </Link>

          <div className="nav-search">
            <input 
              placeholder="Search gifts, categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <button
          type="button"
          className={`navbar-toggle ${menuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="bar" />
        </button>

        <div className={`navbar-menu ${menuOpen ? "active" : ""}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/products" className="nav-link" onClick={() => setMenuOpen(false)}>
            Products
          </Link>

          {user?.role === "customer" && (
            <>
              <Link to="/cart" className="nav-link" onClick={() => setMenuOpen(false)}>
                Cart
              </Link>
              <Link to="/account" className="nav-link" onClick={() => setMenuOpen(false)}>
                My Account
              </Link>
            </>
          )}

          {user?.role === "seller" && (
            <Link to="/seller" className="nav-link" onClick={() => setMenuOpen(false)}>
              Seller Dashboard
            </Link>
          )}

          {user?.role === "admin" && (
            <Link to="/admin" className="nav-link" onClick={() => setMenuOpen(false)}>
              Admin
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link
                to="/register"
                className="nav-link btn-primary"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="nav-user">{user.name}</span>
              <button onClick={logout} className="btn-secondary">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}