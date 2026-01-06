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
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* ROUTES PROTÉGÉES */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Header />
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 p-4">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/users/:id" element={<UserDetails />} />
                    <Route path="/accounts" element={<Accounts />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/support" element={<Support />} />
                  </Routes>
                </div>
              </div>
            </PrivateRoute>
          }
        />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
