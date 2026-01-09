import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import axios from "axios";
import { getToken } from "../services/auth";

const BASE_URL = "https://banking-backend-rtsx.onrender.com";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState(0);

  const token = getToken();

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(res.data);
    } catch (err) {
      console.error("Erreur comptes:", err.response?.data || err.message);
      alert("Erreur lors de la récupération des comptes");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleTransaction = async (type) => {
    if (!selectedAccount || amount <= 0) {
      return alert("Sélectionnez un compte et un montant valide");
    }

    try {
      const endpoint = `${BASE_URL}/admin/accounts/${selectedAccount}/${type}`;
      const res = await axios.post(endpoint, { amount }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(`${type === "deposit" ? "Dépôt" : "Retrait"} effectué ! Solde: ${res.data.balance}`);
      setAmount(0);
      fetchAccounts();
    } catch (err) {
      console.error("Erreur transaction:", err.response?.data || err.message);
      alert(err.response?.data?.message || err.message || "Erreur transaction");
    }
  };

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
      acc.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#0f1320] text-[#f3e8d7]">

      <div className="flex-1 flex flex-col">
        <div className="p-6 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold mb-6 text-[#bfa98a]">Gestion des comptes</h1>

          {/* Recherche */}
          <input
            type="text"
            placeholder="Recherche email ou type..."
            className="p-3 mb-4 w-full md:w-1/3 rounded-lg bg-[#3b322a] text-[#f3e8d7] border border-[#bfa98a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bfa98a]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Dépôt / Retrait */}
          <div className="mb-6 flex flex-col md:flex-row gap-3 items-center">
            <select
              className="flex-1 p-3 rounded-lg bg-[#3b322a] text-[#f3e8d7] border border-[#bfa98a] focus:outline-none focus:ring-2 focus:ring-[#bfa98a]"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              <option value="">-- Choisir un compte --</option>
              {accounts.map((acc) => (
                <option key={acc._id} value={acc._id}>
                  {acc.userId?.email} - {acc.type} ({acc.balance} {acc.currency})
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Montant"
              className="p-3 w-32 rounded-lg bg-[#3b322a] text-[#f3e8d7] border border-[#bfa98a] focus:outline-none focus:ring-2 focus:ring-[#bfa98a]"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />

            <button
              className="px-4 py-2 rounded-lg bg-[#432703] hover:bg-[#a28870] text-white font-semibold transition"
              onClick={() => handleTransaction("deposit")}
            >
              Déposer
            </button>

            <button
              className="px-4 py-2 rounded-lg bg-[#a28870] hover:bg-[#432703] text-white font-semibold transition"
              onClick={() => handleTransaction("withdraw")}
            >
              Retirer
            </button>
          </div>

          {/* Tableau des comptes */}
          <div className="overflow-x-auto bg-[#3b322a] rounded-xl shadow-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-[#bfa98a]/80 text-[#141829]">
                <tr>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Numéro</th>
                  <th className="p-3 text-left">Solde</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-400">
                      Aucun compte trouvé
                    </td>
                  </tr>
                )}
                {filteredAccounts.map((acc) => (
                  <tr key={acc._id} className="border-b border-gray-700 hover:bg-[#5a4a3b] transition">
                    <td className="p-3">{acc.userId?.email}</td>
                    <td className="p-3 capitalize">{acc.type}</td>
                    <td className="p-3">{acc.accountNumber}</td>
                    <td className="p-3 font-semibold">{acc.balance} {acc.currency}</td>
                    <td className="p-3 flex gap-2 flex-wrap">
                      <button
                        className="px-3 py-1 rounded-lg bg-[#432703] hover:bg-[#a28870] text-white font-medium transition"
                        onClick={() => setSelectedAccount(acc._id)}
                      >
                        Sélectionner
                      </button>
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
