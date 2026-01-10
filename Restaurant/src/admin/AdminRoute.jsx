import { Navigate } from "react-router-dom";
import { isAdminLoggedIn } from "./auth";

export default function AdminRoute({ children }) {
  if (!isAdminLoggedIn()) return <Navigate to="/admin/login" replace />;
  return children;
}