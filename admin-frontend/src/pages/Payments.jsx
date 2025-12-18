import React, { useEffect, useState } from 'react';
import { api } from "../services/api";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({ title: '', amount: 0, status: 'pending' });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments');
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addPayment = async () => {
    try {
      await api.post('/payments', newPayment);
      setNewPayment({ title: '', amount: 0, status: 'pending' });
      fetchPayments();
    } catch (err) {
      console.error(err);
    }
  };

  const deletePayment = async (id) => {
    try {
      await api.delete(`/payments/${id}`);
      fetchPayments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="ml-64 mt-20 p-6">
      <h2 className="text-xl font-bold mb-4">Paiements</h2>

      <div className="mb-6 flex space-x-2">
        <input type="text" placeholder="Titre" className="border p-2 rounded"
          value={newPayment.title} onChange={e => setNewPayment({ ...newPayment, title: e.target.value })} />
        <input type="number" placeholder="Montant" className="border p-2 rounded"
          value={newPayment.amount} onChange={e => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) })} />
        <select className="border p-2 rounded"
          value={newPayment.status} onChange={e => setNewPayment({ ...newPayment, status: e.target.value })}>
          <option value="pending">En attente</option>
          <option value="success">Succès</option>
          <option value="failed">Échec</option>
        </select>
        <button onClick={addPayment} className="bg-green-600 text-white px-4 rounded hover:bg-green-700">Ajouter</button>
      </div>

      <div className="bg-white rounded shadow p-4">
        <ul>
          {payments.map(p => (
            <li key={p._id} className="border-b py-2 flex justify-between items-center">
              <span>{p.title} – {p.amount} € – <span className={`font-bold ${p.status==='success'?'text-green-600':p.status==='failed'?'text-red-600':'text-yellow-500'}`}>{p.status}</span></span>
              <button onClick={() => deletePayment(p._id)} className="text-red-500 hover:underline">Supprimer</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
