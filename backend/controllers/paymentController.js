const Payment = require('../models/Payment');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

exports.list = async (req, res) => {
  const payments = await Payment.find().populate('user', 'name email');
  res.json(payments);
};

exports.get = async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate('user', 'name email');
  if (!payment) return res.status(404).json({ message: 'Paiement non trouvé' });
  res.json(payment);
};

// ✅ Création d’un paiement réel
exports.create = async (req, res) => {
  try {
    const { userId, accountId, amount, description } = req.body;

    if (!userId || !accountId || !amount) {
      return res.status(400).json({ message: 'Données manquantes' });
    }

    const account = await Account.findOne({ _id: accountId, user: userId });

    if (!account) {
      return res.status(404).json({ message: 'Compte introuvable' });
    }

    if (account.balance < amount) {
      return res.status(400).json({ message: 'Solde insuffisant' });
    }

    // Débiter le compte
    account.balance -= amount;
    await account.save();

    // Créer la transaction
    const transaction = new Transaction({
      user: userId,
      account: accountId,
      type: 'payment',
      amount,
      description,
      date: new Date(),
    });
    await transaction.save();

    // Créer le paiement
    const payment = new Payment({
      user: userId,
      account: accountId,
      amount,
      description,
      transaction: transaction._id,
      date: new Date(),
    });
    await payment.save();

    res.status(201).json({ 
      message: 'Paiement réussi ✔️',
      newBalance: account.balance,
      payment,
    });

  } catch (err) {
    console.error('Erreur Paiement:', err);
    res.status(500).json({ message: 'Erreur lors du paiement' });
  }
};

exports.update = async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(payment);
};
