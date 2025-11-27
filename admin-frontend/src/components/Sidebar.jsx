import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  ArrowsRightLeftIcon,
  CreditCardIcon,
  LifebuoyIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/", icon: <HomeIcon className="w-5 h-5" /> },
    { name: "Users", path: "/users", icon: <UserGroupIcon className="w-5 h-5" /> },
    { name: "Transactions", path: "/transactions", icon: <ArrowsRightLeftIcon className="w-5 h-5" /> },
    { name: "Payments", path: "/payments", icon: <CreditCardIcon className="w-5 h-5" /> },
    { name: "Support", path: "/support", icon: <LifebuoyIcon className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white shadow-sm border-r border-gray-100
          p-6 z-50 transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-64"}
          lg:translate-x-0
        `}
      >
        {/* Close button mobile */}
        <button
          className="absolute top-4 right-4 lg:hidden"
          onClick={onClose}
        >
          <XMarkIcon className="w-6 h-6 text-gray-600" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 mt-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
            B
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">BankApp</h1>
            <p className="text-xs text-gray-500 -mt-1">Gestion bancaire</p>
          </div>
        </div>

        <ul className="space-y-2">
          {links.map((link) => {
            const active = location.pathname === link.path;

            return (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${
                      active
                        ? "text-white bg-gradient-to-r from-purple-500 to-blue-500 shadow"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  {link.icon}
                  <span className="font-medium">{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
