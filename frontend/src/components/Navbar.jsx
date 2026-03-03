import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <nav
      style={{
        background: "#222",
        color: "white",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          🎁 Gift Marketplace
        </Link>
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <Link to="/" style={{ color: "white" }}>Products</Link>

        {user?.role === "customer" && (
          <Link to="/cart" style={{ color: "white" }}>Cart</Link>
        )}

        {user?.role === "seller" && (
          <Link to="/seller" style={{ color: "white" }}>Seller Dashboard</Link>
        )}

        {user?.role === "admin" && (
          <Link to="/admin" style={{ color: "white" }}>Admin</Link>
        )}

        {!user ? (
          <>
            <Link to="/login" style={{ color: "white" }}>Login</Link>
            <Link to="/register" style={{ color: "white" }}>Register</Link>
          </>
        ) : (
          <>
            <span>{user.name}</span>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}