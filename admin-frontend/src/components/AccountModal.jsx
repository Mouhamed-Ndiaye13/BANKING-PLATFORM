import { useState } from "react";
import api from "../services/api";

export default function AccountModal({ account, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");

  const submit = async () => {
    const endpoint = account.withdraw
      ? `/admin/accounts/${account._id}/withdraw`
      : `/admin/accounts/${account._id}/deposit`;

    await api.post(endpoint, { amount: Number(amount) });
    onSuccess();
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-box">
        <h3>{account.withdraw ? "Retrait" : "Dépôt"} – {account.accountNumber}</h3>

        <input
          type="number"
          placeholder="Montant"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={submit}>Confirmer</button>
          <button className="danger" onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
}
