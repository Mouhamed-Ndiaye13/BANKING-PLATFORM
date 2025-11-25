// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, setToken } from "../services/api";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login(email, password);
      const token = res.data.token;
      localStorage.setItem("token", token);
      setToken(token);
      onLogin && onLogin();
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur connexion");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto" }}>
      <div className="card" style={{ padding: 20 }}>
        <h2>Connexion</h2>
        {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row" style={{ marginBottom: 10 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>
          <div className="form-row" style={{ marginBottom: 10 }}>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>
          <button type="submit" className="btn primary">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
