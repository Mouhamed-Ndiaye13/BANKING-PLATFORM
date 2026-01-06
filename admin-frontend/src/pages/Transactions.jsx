import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await api("GET", "/transactions");
      setTransactions(data || []);
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
      await api("PATCH", `/transactions/${id}/cancel`);
      alert("Transaction annulée !");
      fetchTransactions();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'annulation");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <h1 className="text-2xl mb-4 text-[#432703]">Transactions</h1>

        {transactions.length === 0 && <p>Aucune transaction trouvée</p>}

        {transactions.length > 0 && (
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
  );
}
