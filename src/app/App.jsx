import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { routes } from "@/router/routes.jsx";
import ProtectedRoute from "@/router/ProtectedRoute.jsx";
import AppLayout from "@/layout/AppLayout.jsx";
import Login from "@/pages/Login/index.jsx";

function UnauthorizedBridge() {
  const navigate = useNavigate();
  useEffect(() => {
    const onUnauthorized = () => navigate("/login", { replace: true });
    window.addEventListener("hk:unauthorized", onUnauthorized);
    return () => window.removeEventListener("hk:unauthorized", onUnauthorized);
  }, [navigate]);
  return null;
}

export default function App() {
  return (
    <>
      <UnauthorizedBridge />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {routes.map((r) =>
            r.index ? (
              <Route key="index" index element={r.element} />
            ) : (
              <Route key={r.path} path={r.path} element={r.element} />
            )
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
