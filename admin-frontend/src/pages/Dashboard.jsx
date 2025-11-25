import React, { useEffect, useState } from "react";
import { getAccounts } from "../services/api";

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await getAccounts();
        setAccounts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAccounts();
  }, []);

  return (
    <div className="ml-64 mt-20 p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map((acc) => (
          <div key={acc._id} className="bg-white shadow rounded p-5">
            <h3 className="text-lg font-semibold">{acc.type}</h3>
            <p className="text-gray-600 mt-2">Solde : {acc.balance} €</p>
          </div>
        ))}
      </div>
    </div>
  );
}
