


// const Transaction = require("../models/Transaction");

// exports.getTransactions = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const { type, minAmount, maxAmount, startDate, endDate } = req.query;

//         let filters = { user: userId };

//         if (type) filters.type = type;
//         if (minAmount) filters.amount = { ...filters.amount, $gte: Number(minAmount) };
//         if (maxAmount) filters.amount = { ...filters.amount, $lte: Number(maxAmount) };
//         if (startDate) filters.createdAt = { ...filters.createdAt, $gte: new Date(startDate) };
//         if (endDate) filters.createdAt = { ...filters.createdAt, $lte: new Date(endDate) };

//         const transactions = await Transaction.find(filters)
//             .populate("sourceAccount")
//             .populate("destinationAccount")
//             .sort({ createdAt: -1 });

//         res.json(transactions);

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// exports.getTransactionById = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         const transaction = await Transaction.findOne({
//             _id: req.params.id,
//             user: userId
//         })
//             .populate("sourceAccount")
//             .populate("destinationAccount");

//         if (!transaction) {
//             return res.status(404).json({ message: "Transaction introuvable" });
//         }

//         res.json(transaction);

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };





//Revenu du mois, Dépense du mois, Nombre transactions du mois, Liste complète des transactions filtrables
const Transaction = require("../models/Transaction");
const Account = require("../models/Account");

exports.getTransactions = async (req, res) => {
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

    // Début et fin du mois pour cartes
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const transactionsThisMonth = transactions.filter(t =>
      t.date >= startOfMonth && t.date <= endOfMonth
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

exports.getTransactionById = async (req, res) => {
  try {
    const userId = req.user.id;

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: userId
    }).populate("sourceAccount").populate("destinationAccount");

    if (!transaction) return res.status(404).json({ message: "Transaction introuvable" });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
