import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();
  const authToken = token || localStorage.getItem("userToken");

  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}