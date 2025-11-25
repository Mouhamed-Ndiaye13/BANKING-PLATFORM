import React, { useEffect, useState } from "react";
import { getUsers } from "../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="ml-64 mt-20 p-6">
      <h1 className="text-2xl font-bold mb-6">Utilisateurs</h1>
      <table className="min-w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 text-left">Nom</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Rôle</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b">
              <td className="py-2 px-4">{user.name}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
