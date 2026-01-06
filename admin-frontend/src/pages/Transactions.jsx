import { useEffect, useState } from "react";
import { api } from "../services/api";
import { getToken } from "../services/auth";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  // Fetch transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await api("GET", "/admin/transactions", getToken());
      setTransactions(data || []);
      setError("");
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
      await api("PATCH", `/admin/transactions/${id}/cancel`, getToken());
      alert("Transaction annulée !");
      fetchTransactions();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'annulation");
    }
  };

  // Pagination
  const totalPages = Math.ceil(transactions.length / perPage);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  if (loading) return <p className="p-4">Chargement...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="flex min-h-screen bg-[#f5f2ee]">
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-[#432703]">Transactions</h1>

        {transactions.length === 0 ? (
          <p className="text-gray-500">Aucune transaction trouvée</p>
        ) : (
          <>
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="min-w-full text-center border border-gray-300">
                <thead className="bg-[#a28870] text-white">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Montant</th>
                    <th className="p-3">Utilisateur</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Compte source</th>
                    <th className="p-3">Compte destination</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((trx) => (
                    <tr key={trx._id} className="border-b hover:bg-[#f0e6da]">
                      <td className="p-2">{new Date(trx.createdAt).toLocaleString()}</td>
                      <td className="p-2 capitalize">{trx.type.replace("_", " ")}</td>
                      <td className="p-2 font-semibold">{trx.amount.toLocaleString()} FCFA</td>
                      <td className="p-2">{trx.user?.name} {trx.user?.prenom}</td>
                      <td className="p-2">{trx.user?.email}</td>
                      <td className="p-2">{trx.sourceAccount?.accountNumber || "-"}</td>
                      <td className="p-2">{trx.destinationAccount?.accountNumber || "-"}</td>
                      <td className="p-2">
                        {trx.status === "cancelled" ? (
                          <span className="text-red-600 font-bold">Annulée</span>
                        ) : (
                          <button
                            className="bg-[#432703] text-white px-3 py-1 rounded hover:bg-[#a28870]"
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

            {/* Pagination */}
            <div className="mt-4 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded ${
                    i + 1 === currentPage
                      ? "bg-[#a28870] text-white"
                      : "bg-[#f0e6da]"
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
