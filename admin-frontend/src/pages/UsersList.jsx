import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <Link to="/users/create" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add User
        </Link>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Firstname</th>
            <th className="p-3 text-left">Lastname</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} className="border-b">
              <td className="p-3">{u.firstname}</td>
              <td className="p-3">{u.lastname}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3 capitalize">{u.role}</td>
              <td className="p-3 space-x-2">
                <Link to={`/users/${u._id}`} className="text-blue-600">View</Link>
                <Link to={`/users/edit/${u._id}`} className="text-green-600">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
