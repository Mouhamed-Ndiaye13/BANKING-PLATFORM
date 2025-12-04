// controllers/dashboardController.js
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Comptes de l'utilisateur
    const accounts = await Account.find({ user: userId });
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const mainAccount = accounts.find(acc => acc.type === "checking") || null;

    // Début et fin du mois
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    // Transactions du mois
    const transactionsThisMonth = await Transaction.find({
      user: userId,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const revenueThisMonth = transactionsThisMonth
      .filter(t => t.type === "depot" || t.type === "external_transfer")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenseThisMonth = transactionsThisMonth
      .filter(t => t.type === "retrait" || t.type === "internal_transfer")
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      totalBalance,
      mainAccount,
      revenueThisMonth,
      expenseThisMonth,
      transactionsCount: transactionsThisMonth.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
