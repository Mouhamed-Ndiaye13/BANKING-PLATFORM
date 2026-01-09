import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { api } from "../services/api";
import { getToken } from "../services/auth";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const fetchUsers = async () => {
    try {
      const res = await api("GET", "/admin/users", getToken());
      setUsers(res);
    } catch (err) {
      console.error("Erreur fetch users :", err.response?.data || err.message || err);
      if (err.response?.data?.message === "Token invalide ou expiré") {
        alert("Session expirée. Veuillez vous reconnecter.");
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    try {
      await api("DELETE", `/admin/users/${id}`, getToken());
      setUsers(users.filter((u) => u._id !== id));
      alert("Utilisateur supprimé avec succès !");
    } catch (err) {
      console.error("Erreur delete user:", err.response?.data || err.message || err);
      alert(err.response?.data?.message || err.message || "Erreur lors de la suppression");
    }
  };

  const handleBlock = async (id) => {
    try {
      const res = await api("PATCH", `/admin/users/${id}/block`, getToken());
      setUsers(users.map((u) => (u._id === id ? { ...u, blocked: res.blocked } : u)));
      alert(res.message || "Opération effectuée");
    } catch (err) {
      console.error("Erreur block/unblock user:", err.response?.data || err.message || err);
      alert(err.response?.data?.message || err.message || "Erreur lors du blocage/déblocage");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.prenom.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div className="flex min-h-screen bg-[#0f1320] text-[#f3e8d7]">
      <div className="flex-1 flex flex-col">
        <div className="p-6 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold mb-6 text-[#bfa98a]">Gestion des utilisateurs</h1>

          {/* Barre de recherche */}
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Rechercher par nom, prénom ou email..."
              className="flex-1 p-3 rounded-lg bg-[#3b322a] text-[#f3e8d7] border border-[#bfa98a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bfa98a]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Tableau des utilisateurs */}
          <div className="overflow-x-auto bg-[#3b322a] rounded-xl shadow-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-[#bfa98a]/80 text-[#141829]">
                <tr>
                  <th className="p-3 text-left">Nom</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Téléphone</th>
                  <th className="p-3 text-left">Compte courant</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-400">
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                )}
                {paginatedUsers.map((u) => (
                  <tr key={u._id} className="border-b border-gray-700 hover:bg-[#5a4a3b] transition">
                    <td className="p-3">{u.name} {u.prenom}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.telephone || "N/A"}</td>
                    <td className="p-3">
                      {u.accounts?.find((a) => a.type === "courant")?.accountNumber || "N/A"}
                    </td>
                    <td className="p-3 font-semibold">
                      {u.blocked ? (
                        <span className="text-red-500">Bloqué</span>
                      ) : (
                        <span className="text-green-500">Actif</span>
                      )}
                    </td>
                    <td className="p-3 flex gap-2 flex-wrap">
                      <button
                        className={`px-3 py-1 rounded font-medium text-white ${
                          u.blocked ? "bg-green-700 hover:bg-green-800" : "bg-[#432703] hover:bg-[#a28870]"
                        } transition`}
                        onClick={() => handleBlock(u._id)}
                      >
                        {u.blocked ? "Débloquer" : "Bloquer"}
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
                        onClick={() => handleDelete(u._id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center flex-wrap gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  i + 1 === currentPage
                    ? "bg-[#bfa98a] text-[#141829]"
                    : "bg-[#3b322a] text-[#f3e8d7] hover:bg-[#5a4a3b]"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
