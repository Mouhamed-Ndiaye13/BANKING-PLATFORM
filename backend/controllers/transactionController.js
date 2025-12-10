// controllers/transactionController.js
import Transaction from "../models/Transaction.js";
import Account from "../models/Account.js";

// ---------- GET toutes les transactions avec filtres ----------
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, startDate, endDate } = req.query;

    // Filtrage dynamique
    let filters = { user: userId };
    if (type) filters.type = type;
    if (startDate) filters.date = { ...filters.date, $gte: new Date(startDate) };
    if (endDate) filters.date = { ...filters.date, $lte: new Date(endDate) };

    const transactions = await Transaction.find(filters)
      .populate("sourceAccount")
      .populate("destinationAccount")
      .sort({ createdAt: -1 });

    // Début et fin du mois
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const transactionsThisMonth = transactions.filter(
      t => t.date >= startOfMonth && t.date <= endOfMonth
    );

    const revenueThisMonth = transactionsThisMonth
      .filter(t => t.type === "depot" || t.type === "external_transfer")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenseThisMonth = transactionsThisMonth
      .filter(t => t.type === "retrait" || t.type === "internal_transfer")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalTransactionsThisMonth = transactionsThisMonth.length;

    res.json({
      revenueThisMonth,
      expenseThisMonth,
      totalTransactionsThisMonth,
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- GET transaction par ID ----------
export const getTransactionById = async (req, res) => {
  try {
    const userId = req.user.id;

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: userId
    })
      .populate("sourceAccount")
      .populate("destinationAccount");

    if (!transaction) return res.status(404).json({ message: "Transaction introuvable" });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};