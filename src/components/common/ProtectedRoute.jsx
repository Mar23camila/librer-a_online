import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Spinner from "./Spinner";

// Ruta protegida: exige sesión iniciada y, opcionalmente, un rol específico.
// Uso: <ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>
export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner full label="Verificando sesión…" />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role === "admin" && !isAdmin) {
    return <Navigate to="/tienda" replace />;
  }

  if (role === "cliente" && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
