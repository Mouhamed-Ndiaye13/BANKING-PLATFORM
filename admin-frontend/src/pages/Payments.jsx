import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { api } from "../services/api";
import { getToken } from "../services/auth";

export default function Payments() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
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
    if (!selectedAccount || !amount || Number(amount) <= 0 || !reference.trim()) {
      setMessage("❌ Veuillez remplir tous les champs correctement");
      return;
    }

    try {
      const res = await api(
        `/admin/accounts/${selectedAccount}/deposit`,
        "POST",
        getToken(),
        { amount: Number(amount), reference }
      );
      setMessage(`✅ Paiement effectué ! Nouveau solde : ${res.balance} FCFA`);
      setAmount("");
      setReference("");
      fetchAccounts();
      fetchPayments();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Erreur lors du paiement");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-[#0f1320] text-[#f3e8d7]">
        <p className="text-xl font-semibold">Chargement...</p>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#0f1320] text-[#f3e8d7]">
      <div className="flex-1 flex flex-col">
        <div className="p-6 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold mb-6 text-[#bfa98a]">Paiements</h1>

          {/* Formulaire Paiement */}
          <div className="max-w-md bg-[#3b322a] p-6 rounded-xl shadow-lg mb-6">
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Compte :</label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full p-2 border rounded bg-[#f3e8d7]/10 text-[#f3e8d7]"
              >
                {accounts.map((acc) => (
                  <option key={acc._id} value={acc._id}>
                    {acc.userId?.email} - {acc.type} - Solde : {acc.balance} {acc.currency}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 flex flex-col md:flex-row gap-2">
              <div className="flex-1">
                <label className="block mb-2 font-semibold">Montant :</label>
                <input
                  type="number"
                  placeholder="Montant"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 border rounded bg-[#f3e8d7]/10 text-[#f3e8d7]"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-2 font-semibold">Référence :</label>
                <input
                  type="text"
                  placeholder="Référence"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full p-2 border rounded bg-[#f3e8d7]/10 text-[#f3e8d7]"
                />
              </div>
            </div>

            <button
              onClick={handlePay}
              className="bg-[#432703] text-white w-full p-2 rounded-lg hover:bg-[#a28870] transition"
            >
              Payer
            </button>

            {message && <p className="mt-4 text-sm">{message}</p>}
          </div>

          {/* Liste des Paiements */}
          <div className="overflow-x-auto bg-[#3b322a] rounded-xl shadow-lg">
            <table className="min-w-full text-center">
              <thead className="bg-[#bfa98a] text-[#141829]">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Utilisateur</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Compte</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Montant</th>
                  <th className="p-3">Référence</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center p-4 text-gray-400">
                      Aucun paiement trouvé
                    </td>
                  </tr>
                )}
                {payments.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-gray-700 hover:bg-[#5a4a3b] transition"
                  >
                    <td className="p-2">{new Date(p.date).toLocaleString()}</td>
                    <td className="p-2">{p.user?.name} {p.user?.prenom}</td>
                    <td className="p-2">{p.user?.email}</td>
                    <td className="p-2">{p.sourceAccount?.accountNumber || "-"}</td>
                    <td className="p-2 capitalize">{p.type.replace("_", " ")}</td>
                    <td className="p-2">{p.amount.toLocaleString()} FCFA</td>
                    <td className="p-2">{p.reference || "-"}</td>
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
    </div>
  );
}
