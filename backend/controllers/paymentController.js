import bcrypt from "bcryptjs";
import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";
import Card from "../models/Card.js";
import { createNotification } from "./notificationController.js";

/* =====================================================
   UTILITAIRE : récupérer le compte courant par défaut
===================================================== */
const getDefaultCurrentAccount = async (userId) => {
  // 1️⃣ Compte courant marqué par défaut
  let account = await Account.findOne({
    userId,
    type: "courant",
    isDefault: true
  });

  // 2️⃣ Fallback : premier compte courant
  if (!account) {
    account = await Account.findOne({
      userId,
      type: "courant"
    }).sort({ createdAt: 1 });
  }

  return account;
};

/* =====================================================
   PAIEMENT PAR CARTE (débite le compte courant)
===================================================== */
export const payCard = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cardId, amount, pin, merchant } = req.body;

    if (!cardId || !amount || !pin)
      return res.status(400).json({ message: "Données manquantes" });

    if (amount <= 0)
      return res.status(400).json({ message: "Montant invalide" });

    const card = await Card.findById(cardId);
    if (!card)
      return res.status(404).json({ message: "Carte introuvable" });

    if (card.userId.toString() !== userId)
      return res.status(403).json({ message: "Accès interdit" });

    const isValidPin = await bcrypt.compare(pin, card.pinHash);
    if (!isValidPin)
      return res.status(400).json({ message: "PIN incorrect" });

    // ✅ Compte courant par défaut
    const account = await getDefaultCurrentAccount(userId);
    if (!account)
      return res.status(404).json({ message: "Compte courant introuvable" });

    if (account.balance < amount)
      return res.status(400).json({ message: "Solde insuffisant" });

    //  Débit
    account.balance -= amount;
    await account.save();

    // Transaction
    await Transaction.create({
      user: userId,
      sourceAccount: account._id,
      type: "card_payment",
      direction: "expense",
      amount,
      merchant,
      cardId,
      category: "card",
      label: `Paiement carte chez ${merchant}`
    });

    //  Notification
  await createNotification(
  req.user.id,
  "paiement",
  "Paiement effectué avec succès"
);



    res.json({
      message: "Paiement carte réussi",
      balance: account.balance
    });

  } catch (err) {
    console.error("PAY CARD ERROR:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* =====================================================
   PAIEMENT SERVICE (factures, abonnements, etc.)
===================================================== */
export const makePayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, service } = req.body;

    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Montant invalide" });

    if (!service)
      return res.status(400).json({ message: "Service requis" });

    const account = await getDefaultCurrentAccount(userId);
    if (!account)
      return res.status(404).json({ message: "Compte courant introuvable" });

    if (account.balance < amount)
      return res.status(400).json({ message: "Solde insuffisant" });

    //  Débit
    account.balance -= amount;
    await account.save();

    // Transaction
    await Transaction.create({
      user: userId,
      sourceAccount: account._id,
      type: "payment",
      direction: "expense",
      amount,
      category: service,
      label: `Paiement ${service}`
    });

    res.json({
      message: "Paiement effectué avec succès",
      balance: account.balance
    });
    

  } catch (err) {
    console.error("MAKE PAYMENT ERROR:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* =====================================================
   HISTORIQUE DES PAIEMENTS (carte + services)
===================================================== */
export const getPayments = async (req, res) => {
  try {
    const userId = req.user.id;

    // Pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const account = await getDefaultCurrentAccount(userId);
    if (!account) {
      return res.status(404).json({ message: "Compte courant introuvable" });
    }

    const filter = {
      user: userId,
      sourceAccount: account._id,
      type: { $in: ["payment", "card_payment"] },
    };

    // Total pour pagination
    const totalPayments = await Transaction.countDocuments(filter);

    // Paiements paginés
    const payments = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      payments,
      currentPage: page,
      totalPages: Math.ceil(totalPayments / limit),
      totalPayments,
    });

  } catch (err) {
    console.error("GET PAYMENTS ERROR:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
















