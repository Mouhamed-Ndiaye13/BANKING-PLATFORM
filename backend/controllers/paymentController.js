// controllers/paymentController.js
import Account from "../models/Account.js";

// Faire un paiement
export const makePayment = async (req, res) => {
  try {
    const { accountId, amount, service } = req.body;

    const account = await Account.findById(accountId);
    if (!account) return res.status(404).json({ error: "Compte introuvable" });

    if (account.balance < amount)
      return res.status(400).json({ error: "Solde insuffisant" });

    account.balance -= amount;

    // Historique
    if (!account.history) account.history = [];
    account.history.push({
      type: "payment",
      amount,
      service,
      date: new Date()
    });

    await account.save();

    res.json({
      message: "Paiement effectué avec succès",
      accountBalance: account.balance,
      history: account.history
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer l'historique des paiements
export const getPayments = async (req, res) => {
  try {
    const { accountId } = req.params;

    const account = await Account.findById(accountId);
    if (!account) return res.status(404).json({ error: "Compte introuvable" });

    const payments = account.history.filter(h => h.type === "payment");

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
