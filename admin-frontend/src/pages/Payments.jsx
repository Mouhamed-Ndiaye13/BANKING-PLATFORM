import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { getToken } from "../services/auth";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Payments() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger tous les comptes admin
  const fetchAccounts = async () => {
    try {
      const data = await api("GET", "/admin/accounts", getToken());
      setAccounts(data || []);
      if (data.length > 0) setSelectedAccount(data[0]._id);
    } catch (err) {
      console.error(err);
      setMessage("❌ Impossible de récupérer les comptes");
    }
  };

  // Charger tous les paiements
  const fetchPayments = async () => {
    try {
      const data = await api("GET", "/admin/transactions", getToken());
      setPayments(data || []);
    } catch (err) {
      console.error(err);
      setMessage("❌ Impossible de récupérer les paiements");
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchPayments();
    setLoading(false);
  }, []);

  const handlePay = async () => {
    if (!selectedAccount || !amount || Number(amount) <= 0) {
      setMessage("❌ Veuillez choisir un compte et saisir un montant valide");
      return;
    }

    try {
      const res = await api(
        `/admin/accounts/${selectedAccount}/deposit`,
        "POST",
        getToken(),
        { amount: Number(amount) }
      );
      setMessage(`✅ Paiement effectué ! Nouveau solde : ${res.balance} FCFA`);
      setAmount("");
      fetchAccounts();
      fetchPayments();
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "❌ Erreur lors du paiement"
      );
    }
  };

  if (loading) return <p className="p-4">Chargement...</p>;

  return (
    <div className="flex min-h-screen bg-[#f5f2ee]">
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-[#432703]">Paiements</h1>

        {/* Formulaire Paiement */}
        <div className="max-w-md bg-white p-6 rounded shadow mb-6">
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Compte :</label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {accounts.map((acc) => (
                <option key={acc._id} value={acc._id}>
                  {acc.userId?.email} - {acc.type} - Solde : {acc.balance} FCFA
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-semibold">Montant :</label>
            <input
              type="number"
              placeholder="Montant"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            onClick={handlePay}
            className="bg-[#432703] text-white w-full p-2 rounded hover:bg-[#a28870]"
          >
            Payer
          </button>

          {message && <p className="mt-4 text-sm">{message}</p>}
        </div>

        {/* Liste des Paiements */}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full">
            <thead className="bg-[#a28870] text-white">
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Utilisateur</th>
                <th className="p-2">Email</th>
                <th className="p-2">Compte</th>
                <th className="p-2">Type</th>
                <th className="p-2">Montant</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-4 text-gray-500">
                    Aucun paiement trouvé
                  </td>
                </tr>
              )}
              {payments.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-100 text-center">
                  <td className="p-2">{new Date(p.date).toLocaleString()}</td>
                  <td className="p-2">{p.user?.name} {p.user?.prenom}</td>
                  <td className="p-2">{p.user?.email}</td>
                  <td className="p-2">{p.sourceAccount?.accountNumber || "-"}</td>
                  <td className="p-2 capitalize">{p.type.replace("_", " ")}</td>
                  <td className="p-2">{p.amount.toLocaleString()} FCFA</td>
                  <td className="p-2">
                    {p.status === "cancelled" ? (
                      <span className="text-red-600 font-bold">Annulée</span>
                    ) : (
                      <span className="text-green-600 font-bold">Validé</span>
                    )}
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
