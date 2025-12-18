import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { api } from "../services/api";
import { getToken } from "../services/auth";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = getToken();
      setUsers(await api("/users", "GET", token));
      setAccounts(await api("/accounts", "GET", token));
      setTransactions(await api("/transactions", "GET", token));
    } catch (err) {
      console.error(err.message);
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="app">
      

      <div className="content">
        <Header title="Dashboard Admin" />

        <div className="page">
          {/* STATS */}
          <div className="stats-grid">
            <StatCard title="Utilisateurs" value={users.length} />
            <StatCard title="Comptes" value={accounts.length} />
            <StatCard title="Transactions" value={transactions.length} />
            <StatCard title="Solde total" value={`${totalBalance.toLocaleString()} FCFA`} />
          </div>

          {/* TABLE */}
          <div className="table-card" style={{ marginTop: 25 }}>
            <h3 style={{ marginBottom: 15 }}>Transactions récentes</h3>
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

/* COMPONENT */
function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <p className="stat-title">{title}</p>
      <h2 className="stat-value">{value}</h2>
    </div>
  );
}
