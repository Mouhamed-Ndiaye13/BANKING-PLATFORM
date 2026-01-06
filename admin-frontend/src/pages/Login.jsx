// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api("post", "/admin/login", { email, password });

      if (res.token) {
        localStorage.setItem("adminToken", res.token);
        navigate("/dashboard");
      } else {
        setError("Token non reçu, vérifiez vos identifiants");
      }
    } catch (err) {
      setError(err.message || "Erreur login");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#432703]">
      <form onSubmit={handleLogin} className="bg-[#a28870] p-8 rounded shadow-md w-80">
        <h2 className="text-white text-xl mb-4">Connexion Admin</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 rounded"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 rounded"
          required
        />
        <button type="submit" className="w-full bg-[#432703] text-white py-2 rounded">
          Se connecter
        </button>
      </form>
    </div>
  );
}
