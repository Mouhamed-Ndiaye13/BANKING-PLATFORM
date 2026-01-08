import React, { useEffect, useState } from 'react';
import { api } from "../services/api";

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({ subject: '', message: '' });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/support'); // Assurez-vous que le token admin est inclus dans api
      setTickets(res.data);
    } catch (err) {
      console.error("Erreur fetchTickets:", err.response?.data?.message || err.message);
    }
  };

  const addTicket = async () => {
    try {
      await api.post('/support', newTicket);
      setNewTicket({ subject: '', message: '' });
      fetchTickets();
    } catch (err) {
      console.error("Erreur addTicket:", err.response?.data?.message || err.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/support/${id}`, { status }); // Met à jour le statut
      fetchTickets();
    } catch (err) {
      console.error("Erreur updateStatus:", err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="ml-64 mt-20 p-6">
      <h2 className="text-xl font-bold mb-4">Support / Tickets</h2>

      {/* Formulaire création ticket */}
      <div className="mb-6 flex space-x-2">
        <input type="text" placeholder="Sujet" className="border p-2 rounded w-1/3"
          value={newTicket.subject} onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })} />
        <input type="text" placeholder="Message" className="border p-2 rounded flex-1"
          value={newTicket.message} onChange={e => setNewTicket({ ...newTicket, message: e.target.value })} />
        <button onClick={addTicket} className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">Ajouter</button>
      </div>

      {/* Liste des tickets */}
      <div className="bg-white rounded shadow p-4">
        <ul>
          {tickets.map(t => (
            <li key={t._id} className="border-b py-2 flex justify-between items-center">
              <div>
                <span className="font-bold">{t.subject}: </span>
                <span>{t.message}</span>
                <div className="text-sm text-gray-500">
                  Utilisateur: {t.user?.name} ({t.user?.email})
                </div>
              </div>

              {/* Select pour changer le statut */}
              <select
                value={t.status}
                onChange={e => updateStatus(t._id, e.target.value)}
                className="border rounded p-1"
              >
                <option value="ouvert">Ouvert</option>
                <option value="fermé">Fermé</option>
              </select>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
