import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Users", path: "/users" },
    { name: "Transactions", path: "/transactions" },
    { name: "Payments", path: "/payments" },
    { name: "Support", path: "/support" },
  ];

  return (
    <div className="w-64 bg-white shadow-md h-screen p-5 fixed">
      <h1 className="text-xl font-bold mb-6">Bank Admin</h1>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`block py-2 px-4 rounded hover:bg-blue-500 hover:text-white ${
                location.pathname === link.path ? "bg-blue-500 text-white" : ""
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
