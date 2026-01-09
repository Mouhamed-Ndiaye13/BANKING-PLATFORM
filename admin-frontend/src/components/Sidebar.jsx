import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const linkClasses = ({ isActive }) =>
    `block px-4 py-3 rounded-lg mb-2 text-[#f3e8d7] font-medium transition-colors ${
      isActive ? "bg-[#bfa98a]/80 shadow-md" : "hover:bg-[#bfa98a]/50 hover:shadow-sm"
    }`;

  return (
    <>
      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-64 bg-[#3b322a] p-6 flex flex-col
          transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:block z-50 shadow-xl
        `}
      >

        {/* Navigation */}
        <nav className="flex-1 flex flex-col">
          <NavLink to="/" className={linkClasses} end>
            Dashboard
          </NavLink>
          <NavLink to="/users" className={linkClasses}>
            Users
          </NavLink>
          <NavLink to="/accounts" className={linkClasses}>
            Accounts
          </NavLink>
          <NavLink to="/transactions" className={linkClasses}>
            Transactions
          </NavLink>
          <NavLink to="/payments" className={linkClasses}>
            Payments
          </NavLink>
          
        </nav>

        {/* Logout bouton toujours en bas */}
        <button
          className="mt-auto px-4 py-3 bg-[#d6c7b4] text-[#141829] font-semibold rounded-lg hover:bg-[#bfa98a] shadow-md transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}
