import React, { useEffect, useState } from 'react';
import { api } from "../services/api";

export default function Payements({ userId }) {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  // Charger les comptes de l'utilisateur
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await getAccounts(userId); // adapter selon ton API
        setAccounts(res.data);
        if (res.data.length > 0) setSelectedAccount(res.data[0]._id);
      } catch (err) {
        console.error(err);
        setMessage("❌ Impossible de récupérer les comptes");
      }
    };
    fetchAccounts();
  }, [userId]);

  const handlePay = async () => {
    if (!selectedAccount || !amount) {
      setMessage("❌ Veuillez choisir un compte et un montant");
      return;
    }

    try {
      const res = await makePayment({
        userId,
        accountId: selectedAccount,
        amount: Number(amount),
        description: "Paiement mini front",
      });
      setMessage(`✅ Paiement réussi ! Nouveau solde : ${res.data.newBalance} €`);
      setAmount("");
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "❌ Erreur lors du paiement"
      );
    }
  };

  return (
    <div className="ml-64 mt-20 p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Effectuer un paiement</h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Compte :</label>
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {accounts.map((acc) => (
            <option key={acc._id} value={acc._id}>
              {acc.type} - Solde : {acc.balance} €
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
        className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700"
      >
        Payer
      </button>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}
