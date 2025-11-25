import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Accounts(){
  const [accounts, setAccounts] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('current');
  const fetch = async ()=> { const r = await api.get('/accounts'); setAccounts(r.data); };
  useEffect(()=>{ fetch(); },[]);
  const create = async (e) => {
    e.preventDefault();
    await api.post('/accounts', { name, type });
    setName(''); fetch();
  };
  const remove = async (id) => { if(!confirm('Delete?')) return; await api.delete(`/accounts/${id}`); fetch(); };
  return (
    <div>
      <h2>Comptes</h2>
      <div className="card">
        <form onSubmit={create}>
          <div className="form-row">
            <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Nom compte" />
            <select className="input" value={type} onChange={e=>setType(e.target.value)}>
              <option value="current">Courant</option>
              <option value="savings">Epargne</option>
              <option value="business">Business</option>
            </select>
            <button className="btn primary">Créer</button>
          </div>
        </form>
        <table className="table"><thead><tr><th>Nom</th><th>Type</th><th>Balance</th><th>Actions</th></tr></thead>
          <tbody>{accounts.map(a=> <tr key={a._id}><td>{a.name}</td><td>{a.type}</td><td>{a.balance}</td><td><button className="btn" onClick={()=>remove(a._id)}>Suppr</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
