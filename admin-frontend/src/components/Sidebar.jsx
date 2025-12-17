import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprimer token ou données admin stockées
    localStorage.removeItem("adminToken");
    navigate("/login"); // redirige vers login
  };

  const linkClasses = ({ isActive }) =>
    `block px-4 py-2 rounded mb-2 text-white ${
      isActive ? "bg-[#a28870]" : "hover:bg-[#a28870]/70"
    }`;

  return (
    <div className="w-64 min-h-screen bg-[#432703] text-white p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

      <nav className="flex-1">
        <NavLink to="/" className={linkClasses} end>
          Dashboard
        </NavLink>
        <NavLink to="/users" className={linkClasses}>
          Users
        </NavLink>
        <NavLink to="/transactions" className={linkClasses}>
          Transactions
        </NavLink>
        <NavLink to="/payments" className={linkClasses}>
          Payments
        </NavLink>
        <NavLink to="/support" className={linkClasses}>
          Support
        </NavLink>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto px-4 py-2 bg-[#a28870] rounded hover:bg-[#a28870]/80 text-white font-semibold"
      >
        Logout
      </button>
    </div>
  );
}
