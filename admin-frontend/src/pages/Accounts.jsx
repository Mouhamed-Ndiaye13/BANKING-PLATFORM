import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { api } from "../services/api";
import { getToken } from "../services/auth";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState(0);

  // Fetch all accounts
  const fetchAccounts = async () => {
    try {
      const data = await api("GET", "/admin/accounts", getToken());
      setAccounts(data);
    } catch (err) {
      console.error("Erreur comptes:", err.message || err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Dépôt ou retrait
  const handleTransaction = async (type) => {
    if (!selectedAccount || amount <= 0) return alert("Sélectionnez un compte et un montant valide");
    try {
      const endpoint = `/admin/accounts/${selectedAccount}/${type}`;
      await api("POST", endpoint, getToken(), { amount });
      alert(`${type === "deposit" ? "Dépôt" : "Retrait"} effectué !`);
      setAmount(0);
      fetchAccounts();
    } catch (err) {
      alert(err.message || "Erreur transaction");
    }
  };

  // Filtrer les comptes
  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
      acc.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#f5f2ee]">
      <div className="flex-1">
        <Header />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-[#432703]">Gestion des comptes</h1>

          {/* Recherche */}
          <input
            type="text"
            placeholder="Recherche email ou type..."
            className="border p-2 rounded mb-4 w-full md:w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Dépôt / Retrait */}
          <div className="mb-6 flex flex-col md:flex-row gap-2 items-center">
            <select
              className="border p-2 rounded flex-1"
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
              className="border p-2 rounded w-32"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />

            <button
              className="bg-[#432703] text-white px-4 py-2 rounded hover:bg-[#a28870]"
              onClick={() => handleTransaction("deposit")}
            >
              Déposer
            </button>

            <button
              className="bg-[#a28870] text-white px-4 py-2 rounded hover:bg-[#432703]"
              onClick={() => handleTransaction("withdraw")}
            >
              Retirer
            </button>
          </div>

          {/* Tableau des comptes */}
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full text-left">
              <thead className="bg-[#432703] text-white">
                <tr>
                  <th className="p-3">Email</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Numéro</th>
                  <th className="p-3">Solde</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center p-4 text-gray-500">
                      Aucun compte trouvé
                    </td>
                  </tr>
                )}
                {filteredAccounts.map((acc) => (
                  <tr key={acc._id} className="border-b hover:bg-[#f0e6da]">
                    <td className="p-3">{acc.userId?.email}</td>
                    <td className="p-3 capitalize">{acc.type}</td>
                    <td className="p-3">{acc.accountNumber}</td>
                    <td className="p-3 font-semibold">{acc.balance} {acc.currency}</td>
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
