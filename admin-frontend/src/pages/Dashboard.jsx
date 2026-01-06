// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-700">Chargement...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-4 text-red-600 font-semibold">
        Erreur: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-[#432703] mb-6">Admin Dashboard</h1>

      {/* ==== Statistiques Cards ==== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-gray-500 uppercase text-sm font-semibold mb-2">
            Utilisateurs
          </h3>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-green-500">
          <h3 className="text-gray-500 uppercase text-sm font-semibold mb-2">
            Comptes
          </h3>
          <p className="text-2xl font-bold">{accounts.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-yellow-500">
          <h3 className="text-gray-500 uppercase text-sm font-semibold mb-2">
            Transactions
          </h3>
          <p className="text-2xl font-bold">{transactions.length}</p>
        </div>
      </div>

      {/* ==== Utilisateurs ==== */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Utilisateurs</h2>
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full">
            <thead className="bg-[#432703] text-white">
              <tr>
                <th className="p-2">Nom</th>
                <th className="p-2">Email</th>
                <th className="p-2">Téléphone</th>
                <th className="p-2">Comptes</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-100">
                  <td className="p-2">{u.name} {u.prenom}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.phone}</td>
                  <td className="p-2">{u.accounts?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==== Comptes ==== */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Comptes</h2>
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full">
            <thead className="bg-[#a28870] text-white">
              <tr>
                <th className="p-2">Utilisateur</th>
                <th className="p-2">Type</th>
                <th className="p-2">Numéro</th>
                <th className="p-2">Solde</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => (
                <tr key={acc._id} className="border-b hover:bg-gray-100">
                  <td className="p-2">{acc.userId?.email}</td>
                  <td className="p-2">{acc.type}</td>
                  <td className="p-2">{acc.accountNumber}</td>
                  <td className="p-2">{acc.balance} {acc.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==== Transactions ==== */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Transactions</h2>
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full">
            <thead className="bg-[#432703] text-white">
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Type</th>
                <th className="p-2">Montant</th>
                <th className="p-2">Utilisateur</th>
                <th className="p-2">Compte source</th>
                <th className="p-2">Compte destination</th>
                <th className="p-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trx) => (
                <tr key={trx._id} className="border-b hover:bg-gray-100">
                  <td className="p-2">{new Date(trx.createdAt).toLocaleString()}</td>
                  <td className="p-2 capitalize">{trx.type.replace("_", " ")}</td>
                  <td className="p-2">{trx.amount.toLocaleString()} FCFA</td>
                  <td className="p-2">{trx.user?.name} {trx.user?.prenom}</td>
                  <td className="p-2">{trx.sourceAccount?.accountNumber || "-"}</td>
                  <td className="p-2">{trx.destinationAccount?.accountNumber || "-"}</td>
                  <td className={`p-2 font-bold ${trx.status === "cancelled" ? "text-red-600" : "text-green-600"}`}>
                    {trx.status}
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
