import { useAuth } from "../context/AuthContext";
import { useLocation, Navigate } from "react-router-dom";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();
  
  if (!auth.user.email) {
    auth
      .checkToken()
      .then(res => {
        if (!res) {
          return <Navigate to="/login" state={{ from: location }} replace />;
        }
      });
  }

  return children;
}