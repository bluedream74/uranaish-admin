import { useAuth } from "../context/AuthContext";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
// import { useEffect } from "react";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!auth.user.email) {
    auth
      .checkToken()
      .then(res => {
        if(res) {
          return children;
        } else {
          navigate('/login', { state: { from: location } });
          return <Navigate to="/login" state={{ from: location }} />;
        }
      });
  } else {
    return children;
  }
}