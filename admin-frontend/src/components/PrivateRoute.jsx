import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsAuth(!!token);
    setLoading(false);
  }, []);

  if (loading) return <p>Chargement...</p>;

  if (!isAuth) return <Navigate to="/login" replace />;

  return children;
}
