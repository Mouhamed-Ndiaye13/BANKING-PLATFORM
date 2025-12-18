import { logout } from "../services/auth";

export default function Header() {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h2 className="font-semibold text-primary">Admin Panel</h2>
      <button
        onClick={logout}
        className="bg-primary text-white px-4 py-1 rounded hover:bg-secondary"
      >
        Logout
      </button>
    </header>
  );
}
