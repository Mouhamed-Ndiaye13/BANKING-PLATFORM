import React from "react";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";

export default function Header({ onMenuClick }) {
  return (
    <header className="bg-white h-16 flex items-center justify-between px-6 border-b border-gray-100 shadow-sm">

      {/* Burger mobile */}
      <button
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Bars3Icon className="w-7 h-7 text-gray-700" />
      </button>

      <h2 className="text-xl font-semibold text-gray-700 hidden lg:block">
        Admin Dashboard
      </h2>

      <div className="flex items-center gap-5 ml-auto">

        {/* Notifications */}
        <button className="relative">
          <BellIcon className="w-6 h-6 text-gray-600 hover:text-gray-800 transition" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            2
          </span>
        </button>

        {/* Profile */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
          JD
        </div>

        {/* Déconnexion */}
        <button
          className="text-sm bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition hidden lg:block"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}
