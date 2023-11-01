import { useAuth } from "../context/AuthContext";
import { useLocation, Navigate } from "react-router-dom";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();
  console.log(!auth.user.email);

  if (!auth.user.email) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}