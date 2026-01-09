// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const usersData = await api("GET", "/admin/users");
      const accountsData = await api("GET", "/admin/accounts");
      const transactionsData = await api("GET", "/admin/transactions");

      setUsers(usersData);
      setAccounts(accountsData);
      setTransactions(transactionsData);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message || "Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-xl sm:text-2xl font-semibold text-[#f3e8d7]">Chargement...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-4 text-red-500 font-semibold">
        Erreur: {error}
      </div>
    );

  return (
    <div className="flex-1 p-4 sm:p-6 bg-[#0f1320] text-[#f3e8d7] overflow-auto min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-[#bfa98a]">Admin Dashboard</h1>

      {/* ==== Statistiques Cards ==== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {/* Utilisateurs */}
        <div className="bg-[#3b322a] shadow-xl rounded-xl p-4 sm:p-6 border-l-4 border-blue-500 hover:scale-105 transform transition">
          <h3 className="text-gray-400 uppercase text-xs sm:text-sm font-semibold mb-2">
            Utilisateurs
          </h3>
          <p className="text-2xl sm:text-3xl font-bold mb-4">{users.length}</p>
          <button
            onClick={() => navigate("/users")}
            className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm sm:text-base"
          >
            Voir plus
          </button>
        </div>

        {/* Comptes */}
        <div className="bg-[#3b322a] shadow-xl rounded-xl p-4 sm:p-6 border-l-4 border-green-500 hover:scale-105 transform transition">
          <h3 className="text-gray-400 uppercase text-xs sm:text-sm font-semibold mb-2">
            Comptes
          </h3>
          <p className="text-2xl sm:text-3xl font-bold mb-4">{accounts.length}</p>
          <button
            onClick={() => navigate("/accounts")}
            className="px-3 sm:px-4 py-1 sm:py-2 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm sm:text-base"
          >
            Voir plus
          </button>
        </div>

        {/* Transactions */}
        <div className="bg-[#3b322a] shadow-xl rounded-xl p-4 sm:p-6 border-l-4 border-yellow-500 hover:scale-105 transform transition">
          <h3 className="text-gray-400 uppercase text-xs sm:text-sm font-semibold mb-2">
            Transactions
          </h3>
          <p className="text-2xl sm:text-3xl font-bold mb-4">{transactions.length}</p>
          <button
            onClick={() => navigate("/transactions")}
            className="px-3 sm:px-4 py-1 sm:py-2 bg-yellow-500 text-[#141829] rounded hover:bg-yellow-600 transition text-sm sm:text-base"
          >
            Voir plus
          </button>
        </div>
      </div>

      {/* ==== Utilisateurs ==== */}
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 border-b border-[#bfa98a] pb-2">Utilisateurs récents</h2>
        <div className="overflow-x-auto bg-[#3b322a] rounded-xl shadow-lg">
          <table className="min-w-full table-auto text-sm sm:text-base">
            <thead className="bg-[#bfa98a]/80 text-[#141829]">
              <tr>
                <th className="p-2 sm:p-3 text-left">Nom</th>
                <th className="p-2 sm:p-3 text-left">Email</th>
                <th className="p-2 sm:p-3 text-left">Téléphone</th>
                <th className="p-2 sm:p-3 text-left">Comptes</th>
                <th className="p-2 sm:p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-gray-700 hover:bg-[#5a4a3b] transition">
                  <td className="p-2 sm:p-3 whitespace-nowrap">{u.name} {u.prenom}</td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">{u.email}</td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">{u.phone}</td>
                  <td className="p-2 sm:p-3">{u.accounts?.length || 0}</td>
                  <td className="p-2 sm:p-3">
                    <button
                      onClick={() => navigate(`/users/${u._id}`)}
                      className="px-2 sm:px-3 py-1 bg-[#bfa98a] text-[#141829] rounded hover:bg-[#d6c7b4] transition text-xs sm:text-sm"
                    >
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==== Comptes ==== */}
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 border-b border-[#bfa98a] pb-2">Comptes récents</h2>
        <div className="overflow-x-auto bg-[#3b322a] rounded-xl shadow-lg">
          <table className="min-w-full table-auto text-sm sm:text-base">
            <thead className="bg-[#a28870] text-[#141829]">
              <tr>
                <th className="p-2 sm:p-3 text-left">Utilisateur</th>
                <th className="p-2 sm:p-3 text-left">Type</th>
                <th className="p-2 sm:p-3 text-left">Numéro</th>
                <th className="p-2 sm:p-3 text-left">Solde</th>
                <th className="p-2 sm:p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => (
                <tr key={acc._id} className="border-b border-gray-700 hover:bg-[#5a4a3b] transition">
                  <td className="p-2 sm:p-3 whitespace-nowrap">{acc.userId?.email}</td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">{acc.type}</td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">{acc.accountNumber}</td>
                  <td className="p-2 sm:p-3">{acc.balance} {acc.currency}</td>
                  <td className="p-2 sm:p-3">
                    <button
                      onClick={() => navigate(`/accounts/${acc._id}`)}
                      className="px-2 sm:px-3 py-1 bg-[#bfa98a] text-[#141829] rounded hover:bg-[#d6c7b4] transition text-xs sm:text-sm"
                    >
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==== Transactions ==== */}
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 border-b border-[#bfa98a] pb-2">Transactions récentes</h2>
        <div className="overflow-x-auto bg-[#3b322a] rounded-xl shadow-lg">
          <table className="min-w-full table-auto text-sm sm:text-base">
            <thead className="bg-[#bfa98a]/80 text-[#141829]">
              <tr>
                <th className="p-2 sm:p-3 text-left">Date</th>
                <th className="p-2 sm:p-3 text-left">Type</th>
                <th className="p-2 sm:p-3 text-left">Montant</th>
                <th className="p-2 sm:p-3 text-left">Utilisateur</th>
                <th className="p-2 sm:p-3 text-left">Compte source</th>
                <th className="p-2 sm:p-3 text-left">Compte destination</th>
                <th className="p-2 sm:p-3 text-left">Statut</th>
                <th className="p-2 sm:p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trx) => (
                <tr key={trx._id} className="border-b border-gray-700 hover:bg-[#5a4a3b] transition">
                  <td className="p-2 sm:p-3 whitespace-nowrap">{new Date(trx.createdAt).toLocaleString()}</td>
                  <td className="p-2 sm:p-3 capitalize whitespace-nowrap">{trx.type.replace("_", " ")}</td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">{trx.amount.toLocaleString()} FCFA</td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">{trx.user?.name} {trx.user?.prenom}</td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">{trx.sourceAccount?.accountNumber || "-"}</td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">{trx.destinationAccount?.accountNumber || "-"}</td>
                  <td className={`p-2 sm:p-3 font-bold ${
                    trx.status === "cancelled" ? "text-red-500" : "text-green-500"
                  }`}>
                    {trx.status}
                  </td>
                  <td className="p-2 sm:p-3">
                    <button
                      onClick={() => navigate(`/transactions/${trx._id}`)}
                      className="px-2 sm:px-3 py-1 bg-[#bfa98a] text-[#141829] rounded hover:bg-[#d6c7b4] transition text-xs sm:text-sm"
                    >
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
