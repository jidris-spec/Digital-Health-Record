import { Navigate, Outlet, useLocation } from "react-router-dom";
import { auth } from "./auth";

export default function ProtectedRoute() {
  const location = useLocation();

  // If user is logged in, show the requested page
  // Otherwise, redirect to login ("/")
  if (auth.isAuthed()) {
    return <Outlet />;
  } else {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
}
