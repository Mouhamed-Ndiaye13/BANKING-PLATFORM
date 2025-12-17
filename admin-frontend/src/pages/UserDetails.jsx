import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { api } from "../services/api";
import { getToken } from "../services/auth";
import { useParams, useNavigate } from "react-router-dom";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const token = getToken();
      const data = await api(`/users/${id}`, "GET", token);
      setUser(data.user);
      setAccounts(data.accounts); // backend doit renvoyer { user, accounts }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    try {
      const token = getToken();
      await api(`/users/${id}`, "DELETE", token);
      alert("Utilisateur supprimé !");
      navigate("/users");
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user) return <div className="loading">Chargement...</div>;

  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        <Header title={`Utilisateur : ${user.name}`} />
        <div className="page">

          {/* INFOS USER */}
          <div className="user-card">
            <p><strong>Nom:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Téléphone:</strong> {user.phone || "Non renseigné"}</p>
            <button className="btn-delete" onClick={handleDeleteUser}>
              Supprimer utilisateur
            </button>
          </div>

          {/* COMPTES */}
          <div className="table-card" style={{ marginTop: 20 }}>
            <h3>Comptes de {user.name}</h3>
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Nom</th>
                  <th>Numéro</th>
                  <th>Solde</th>
                  <th>Devise</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map(acc => (
                  <tr key={acc._id}>
                    <td>{acc.type}</td>
                    <td>{acc.name}</td>
                    <td>{acc.accountNumber}</td>
                    <td>{acc.balance}</td>
                    <td>{acc.currency}</td>
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
