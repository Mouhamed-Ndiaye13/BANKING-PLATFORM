import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { api } from "../services/api";
import { getToken } from "../services/auth";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);

  const fetchUsers = async () => {
    try {
      const res = await api("/users", "GET", getToken());
      setUsers(res);
    } catch (err) {
      console.error("Erreur fetch users :", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    try {
      await api(`/users/${id}`, "DELETE", getToken());
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBlock = async (id) => {
  try {
    await api(`/users/${id}/block`, "PATCH", getToken());

    setUsers(users.map(u =>
      u._id === id ? { ...u, blocked: !u.blocked } : u
    ));
  } catch (err) {
    alert(err.message);
  }
};


  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="flex">
      <div className="flex-1 p-4">
        <Header />
        <h1 className="text-2xl font-bold mb-4">Liste des utilisateurs</h1>

        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Rechercher..."
            className="border p-2 rounded flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="min-w-full border">
          <thead className="bg-[#a28870] text-white">
            <tr>
              <th className="p-2">Nom</th>
              <th className="p-2">Email</th>
              <th className="p-2">Téléphone</th>
              <th className="p-2">Compte courant</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(u => (
              <tr key={u._id} className="border-b hover:bg-[#f0e6da]">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.phone || "N/A"}</td>
                <td className="p-2">{u.accounts?.find(a => a.type === "courant")?.accountNumber || "N/A"}</td>
                <td className="p-2">{u.blocked ? "Bloqué" : "Actif"}</td>
                <td className="p-2 flex gap-2">
                  <button
                    className="bg-[#432703] text-white px-2 py-1 rounded"
                    onClick={() => handleBlock(u._id, u.blocked)}
                  >
                    {u.blocked ? "Débloquer" : "Bloquer"}
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(u._id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${i + 1 === currentPage ? "bg-[#a28870] text-white" : "bg-[#f0e6da]"}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
