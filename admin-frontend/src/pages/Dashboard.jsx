import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { api } from "../services/api";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersData = await api("GET", "/users");
      const accountsData = await api("GET", "/accounts");
      const transactionsData = await api("GET", "/transactions");

      setUsers(usersData);
      setAccounts(accountsData);
      setTransactions(transactionsData);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message || "Erreur Dashboard");
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="app">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
          {error && <p className="text-red-600">{error}</p>}

          <div className="stats-grid">
            <StatCard title="Utilisateurs" value={users.length} />
            <StatCard title="Comptes" value={accounts.length} />
            <StatCard title="Transactions" value={transactions.length} />
            <StatCard title="Solde total" value={`${totalBalance.toLocaleString()} FCFA`} />
          </div>

          <div className="table-card mt-6">
            <h3>Transactions récentes</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Montant</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map(t => (
                  <tr key={t._id}>
                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td>{t.amount} FCFA</td>
                    <td>{t.status}</td>
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

function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <p className="stat-title">{title}</p>
      <h2 className="stat-value">{value}</h2>
    </div>
  );
}
