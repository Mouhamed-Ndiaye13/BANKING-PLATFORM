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
      const data = await api("/accounts", "GET", getToken());
      setAccounts(data);
    } catch (err) {
      console.error("Erreur comptes:", err.message);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Dépôt ou retrait
  const handleTransaction = async (type) => {
    if (!selectedAccount || amount <= 0) return alert("Sélectionnez un compte et un montant valide");
    try {
      const endpoint = `/accounts/${selectedAccount}/${type}`;
      await api(endpoint, "POST", getToken(), { amount });
      alert(`${type === "deposit" ? "Dépôt" : "Retrait"} effectué !`);
      setAmount(0);
      fetchAccounts();
    } catch (err) {
      alert(err.message);
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
      <div className="flex-1 p-4">
        <Header />
        <h1 className="text-2xl font-bold mb-4 text-[#432703]">Gestion des comptes</h1>
        <input
            type="text"
            placeholder="Recherche email ou type..."
            className="border p-2 rounded flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        <div className="mb-4 flex flex-col md:flex-row gap-2 items-center">
          

          <select
            className="border p-2 rounded"
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

        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full">
            <thead className="bg-[#432703] text-white">
              <tr>
                <th className="p-2">Email</th>
                <th className="p-2">Type</th>
                <th className="p-2">Numéro</th>
                <th className="p-2">Solde</th>
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
    </div>
  );
}
