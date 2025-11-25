import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({ subject: '', message: '' });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/support');
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTicket = async () => {
    try {
      await api.post('/support', newTicket);
      setNewTicket({ subject: '', message: '' });
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTicket = async (id) => {
    try {
      await api.delete(`/support/${id}`);
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="ml-64 mt-20 p-6">
      <h2 className="text-xl font-bold mb-4">Support / Tickets</h2>

      <div className="mb-6 flex space-x-2">
        <input type="text" placeholder="Sujet" className="border p-2 rounded w-1/3"
          value={newTicket.subject} onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })} />
        <input type="text" placeholder="Message" className="border p-2 rounded flex-1"
          value={newTicket.message} onChange={e => setNewTicket({ ...newTicket, message: e.target.value })} />
        <button onClick={addTicket} className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">Ajouter</button>
      </div>

      <div className="bg-white rounded shadow p-4">
        <ul>
          {tickets.map(t => (
            <li key={t._id} className="border-b py-2 flex justify-between items-center">
              <span className="font-bold">{t.subject}: </span>
              <span>{t.message}</span>
              <button onClick={() => deleteTicket(t._id)} className="text-red-500 hover:underline">Supprimer</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
