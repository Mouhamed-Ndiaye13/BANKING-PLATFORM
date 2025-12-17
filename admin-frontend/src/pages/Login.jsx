// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api"; // doit pointer sur http://localhost:5000/admin

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api("/login", "POST", "", { email, password });
      // Stockage du token dans localStorage
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminEmail", data.email);

      navigate("/"); // redirection vers Dashboard
    } catch (err) {
      setError(err.message || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#a28870]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-[#432703] text-center">
          Connexion Admin
        </h1>
        {error && (
          <div className="mb-4 text-red-600 font-semibold text-center">{error}</div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[#432703] font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#432703]"
            />
          </div>
          <div>
            <label className="block text-[#432703] font-medium mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#432703]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#432703] text-white font-bold py-2 rounded hover:bg-[#3b2100] transition-colors"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
