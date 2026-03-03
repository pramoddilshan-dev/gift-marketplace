import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";

import Home from "../pages/Home";
import Products from "../pages/Products";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import CartPage from "../features/cart/CartPage";

import AdminDashboard from "../features/admin/AdminDashboard";
import SellerDashboard from "../features/seller/SellerDashboard";

import MainLayout from "../layouts/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Products /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      {
        path: "cart",
        element: (
          <ProtectedRoute roles={["customer"]}>
            <CartPage />
          </ProtectedRoute>
        )
      },

      {
        path: "admin",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        )
      },

      {
        path: "seller",
        element: (
          <ProtectedRoute roles={["seller"]}>
            <SellerDashboard />
          </ProtectedRoute>
        )
      }
    ]
  }
]);