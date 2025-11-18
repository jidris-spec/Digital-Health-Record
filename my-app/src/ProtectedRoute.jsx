// src/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "./auth";

export default function ProtectedRoute() {
  const isLoggedIn = auth.isAuthenticated();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
