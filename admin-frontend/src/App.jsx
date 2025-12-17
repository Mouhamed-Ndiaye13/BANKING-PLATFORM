import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Transactions from "./pages/Transactions";
import Payments from "./pages/Payments";
import UserDetails from "./pages/UserDetails";
import Support from "./pages/Support";
import Accounts from "./pages/Accounts";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login"; // page de connexion

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login public */}
        <Route path="/login" element={<Login />} />

        {/* Toutes les autres pages protégées */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div>
                <Header />
                <div className="flex">
                  <Sidebar />
                  <div className="flex-1 p-4">
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/users/:id" element={<UserDetails />} />
                      <Route path="/accounts" element={<Accounts />} />
                      <Route path="/transactions" element={<Transactions />} />
                      <Route path="/payments" element={<Payments />} />
                      <Route path="/users" element={<Users />} />
                      <Route path="/support" element={<Support />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
