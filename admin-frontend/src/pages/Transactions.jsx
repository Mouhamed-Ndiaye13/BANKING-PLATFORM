import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [newTx, setNewTx] = useState({ title: '', amount: 0 });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await api.get('/transactions');
    setTransactions(res.data);
  };

  const addTransaction = async () => {
    await api.post('/transactions', newTx);
    setNewTx({ title: '', amount: 0 });
    fetchTransactions();
  };

  const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`);
    fetchTransactions();
  };

  return (
    <div className="ml-64 mt-20 p-6">
      <h2 className="text-xl font-bold mb-4">Transactions</h2>

      <div className="mb-6 flex space-x-2">
        <input type="text" placeholder="Titre" className="border p-2 rounded"
          value={newTx.title} onChange={e => setNewTx({ ...newTx, title: e.target.value })} />
        <input type="number" placeholder="Montant" className="border p-2 rounded"
          value={newTx.amount} onChange={e => setNewTx({ ...newTx, amount: parseFloat(e.target.value) })} />
        <button onClick={addTransaction} className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">Ajouter</button>
      </div>

      <div className="bg-white rounded shadow p-4">
        <ul>
          {transactions.map(tx => (
            <li key={tx._id} className="border-b py-2 flex justify-between">
              <span>{tx.title} – {tx.amount} €</span>
              <button onClick={() => deleteTransaction(tx._id)} className="text-red-500 hover:underline">Supprimer</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
