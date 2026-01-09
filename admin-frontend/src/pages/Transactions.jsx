import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { api } from "../services/api";
import { getToken } from "../services/auth";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

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

  const totalPages = Math.ceil(transactions.length / perPage);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-[#0f1320] text-[#f3e8d7]">
        <p className="text-xl font-semibold">Chargement...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-red-600 font-semibold bg-[#0f1320] min-h-screen text-[#f3e8d7]">
        {error}
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#0f1320] text-[#f3e8d7]">
      <div className="flex-1 flex flex-col">
        <div className="p-6 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold mb-6 text-[#bfa98a]">Transactions</h1>

          {transactions.length === 0 ? (
            <p className="text-gray-400">Aucune transaction trouvée</p>
          ) : (
            <>
              <div className="overflow-x-auto bg-[#3b322a] rounded-xl shadow-lg">
                <table className="min-w-full table-auto text-center">
                  <thead className="bg-[#bfa98a]/80 text-[#141829]">
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
                      <tr
                        key={trx._id}
                        className="border-b border-gray-700 hover:bg-[#5a4a3b] transition"
                      >
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
                              className="bg-[#432703] text-white px-3 py-1 rounded-lg hover:bg-[#a28870] transition"
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
              <div className="mt-4 flex justify-center gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1 rounded-lg font-semibold ${
                      i + 1 === currentPage
                        ? "bg-[#bfa98a] text-[#141829]"
                        : "bg-[#3b322a] border border-[#bfa98a]"
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
    </div>
  );
}
