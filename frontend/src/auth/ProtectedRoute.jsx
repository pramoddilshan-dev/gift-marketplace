import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Wait until auth state is resolved
  if (loading) {
    return <p>Checking authentication...</p>;
  }

  // Not logged in
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Role restriction
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}