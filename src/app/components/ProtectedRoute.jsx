import { Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

/**
 * Protege rotas privadas.
 * - Mostra spinner enquanto o AuthProvider verifica o token salvo.
 * - Salva a URL original em `state.from` para redirecionar após login.
 * - Redireciona para /login se não autenticado.
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "var(--cor-fundo)",
      }}>
        <div style={{
          width: 36,
          height: 36,
          border: "3px solid var(--cor-borda-media)",
          borderTopColor: "var(--cor-primaria)",
          borderRadius: "50%",
          animation: "spin-slow 0.8s linear infinite",
        }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Guarda a URL tentada para redirecionar após o login
    return <Navigate replace to="/login" state={{ from: location }} />;
  }

  return children;
}
