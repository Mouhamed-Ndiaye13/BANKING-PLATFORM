import React from "react";

export default function Header() {
  return (
    <header className="bg-white shadow-md h-16 flex items-center justify-between px-5 ml-64">
      <h2 className="text-lg font-semibold">Admin Dashboard</h2>
      <button
        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
      >
        Déconnexion
      </button>
    </header>
  );
}
