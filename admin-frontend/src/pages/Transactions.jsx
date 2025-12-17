// src/pages/Transactions.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { api } from "../services/api";
import { getToken } from "../services/auth";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await api("/transactions", "GET", getToken());
      setTransactions(data);
    } catch (err) {
      console.error("Erreur fetching transactions:", err);
      setError("Impossible de récupérer les transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Voulez-vous vraiment annuler cette transaction ?")) return;
    try {
      await api(`/transactions/${id}/cancel`, "PATCH", getToken());
      alert("Transaction annulée !");
      fetchTransactions();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'annulation");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <div className="p-4">
          <h1 className="text-2xl mb-4" style={{ color: "#432703" }}>
            Transactions
          </h1>

          {loading && <p>Chargement...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && transactions.length === 0 && <p>Aucune transaction trouvée</p>}

          {!loading && transactions.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-[#a28870] text-white">
                  <tr>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Montant</th>
                    <th className="p-2 border">Utilisateur</th>
                    <th className="p-2 border">Email</th>
                    <th className="p-2 border">Compte source</th>
                    <th className="p-2 border">Compte destination</th>
                    <th className="p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((trx) => (
                    <tr key={trx._id} className="text-center border-b">
                      <td className="p-2">{new Date(trx.date).toLocaleString()}</td>
                      <td className="p-2 capitalize">{trx.type.replace("_", " ")}</td>
                      <td className="p-2">{trx.amount.toLocaleString()} FCFA</td>
                      <td className="p-2">{trx.user?.name} {trx.user?.prenom}</td>
                      <td className="p-2">{trx.user?.email}</td>
                      <td className="p-2">{trx.sourceAccount?.accountNumber || "-"}</td>
                      <td className="p-2">{trx.destinationAccount?.accountNumber || "-"}</td>
                      <td className="p-2">
                        {trx.status === "cancelled" ? (
                          <span className="text-red-600 font-bold">Annulée</span>
                        ) : (
                          <button
                            className="bg-[#432703] text-white px-2 py-1 rounded hover:bg-[#a28870]"
                            onClick={() => handleCancel(trx._id)}
                          >
                            Annuler
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
