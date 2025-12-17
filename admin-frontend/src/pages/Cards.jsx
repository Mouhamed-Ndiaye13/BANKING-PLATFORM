import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Cards() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-4">
          <h1 className="text-2xl mb-4">Cards</h1>
          <p>No card data yet.</p>
        </div>
      </div>
    </div>
  );
}
