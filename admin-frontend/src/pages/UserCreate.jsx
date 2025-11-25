import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function UserCreate() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "user"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      nav("/users");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Create User</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded space-y-4">

        <input className="border p-2 w-full" placeholder="Firstname"
          value={form.firstname}
          onChange={(e) => setForm({ ...form, firstname: e.target.value })}
        />

        <input className="border p-2 w-full" placeholder="Lastname"
          value={form.lastname}
          onChange={(e) => setForm({ ...form, lastname: e.target.value })}
        />

        <input className="border p-2 w-full" placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input className="border p-2 w-full" placeholder="Password" type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select className="border p-2 w-full"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Create
        </button>

      </form>
    </div>
  );
}
