import { logout } from "../services/auth";

export default function Header({ onMenuClick }) {
  return (
    <header className="relative bg-[#0f1320] shadow-md p-4 flex justify-between items-center">
      {/* Bulles décoratives
      <div className="absolute -top-16 -right-16 w-60 h-60 bg-[#d6c7b4]  opacity-30"></div>
      <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-[#bfa98a]  opacity-30"></div> */}

      {/* Titre gauche */}
      <h2 className="font-bold text-[#f3e8d7] text-xl">Admin Panel</h2>

      {/* Bouton Déconnexion */}
      <button
        className="text-sm bg-[#d6c7b4] text-[#141829] px-4 py-2 rounded-lg hover:bg-[#bfa98a] transition"
        onClick={() => {
          logout(); // ta fonction logout
        }}
      >
        Déconnexion
      </button>
    </header>
  );
}
