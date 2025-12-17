import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("adminToken"); // récupère le token admin
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
