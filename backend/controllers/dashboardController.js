// // controllers/dashboardController.js
// import Account from "../models/Account.js";
// import Transaction from "../models/Transaction.js";

// export const getDashboardSummary = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // Comptes de l'utilisateur
//     const accounts = await Account.find({ userId });
//     const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
//     const mainAccount = accounts.find(acc => acc.type === "checking") || null;

//     // Début et fin du mois
//     const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
//     const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

//     // Transactions du mois
//     const transactionsThisMonth = await Transaction.find({
//       userId,
//       date: { $gte: startOfMonth, $lte: endOfMonth }
//     });

//     const revenueThisMonth = transactionsThisMonth
//       .filter(t => t.type === "depot" || t.type === "external_transfer")
//       .reduce((sum, t) => sum + t.amount, 0);

//     const expenseThisMonth = transactionsThisMonth
//       .filter(t => t.type === "retrait" || t.type === "internal_transfer")
//       .reduce((sum, t) => sum + t.amount, 0);

//     res.json({
//       totalBalance,
//       mainAccount,
//       revenueThisMonth,
//       expenseThisMonth,
//       transactionsCount: transactionsThisMonth.length
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// // controllers/dashboardController.js
// // export const getDashboardSummary = async (req, res) => {
// //   try {
// //     const userId = req.user._id.toString();

// //     const accounts = await Account.find({ userId });
// //     const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
// //     const mainAccount = accounts.find(acc => acc.type === "courant") || null;

// //     const now = new Date();
// //     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
// //     const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 23, 59, 59);

// //     const transactions = await Transaction.find({
// //       $or: [
// //         { sender: req.user._id },
// //         { receiver: req.user._id }
// //       ],
// //       date: { $gte: startOfMonth, $lte: endOfMonth },
// //     });

// //     const dailyRevenue = {};
// //     const dailyExpense = {};

// //     transactions.forEach(t => {
// //       if (!t.date) return;

// //       const day = t.date.toISOString().split("T")[0];

// //       const senderId = t.sender ? t.sender.toString() : null;
// //       const receiverId = t.receiver ? t.receiver.toString() : null;

// //       // 💰 REVENUS (argent entrant)
// //       if (
// //         t.type === "depot" ||
// //         (receiverId && receiverId === userId)
// //       ) {
// //         dailyRevenue[day] = (dailyRevenue[day] || 0) + t.amount;
// //       }

// //       // 💸 DÉPENSES (argent sortant)
// //       if (
// //         t.type === "retrait" ||
// //         (senderId && senderId === userId)
// //       ) {
// //         dailyExpense[day] = (dailyExpense[day] || 0) + t.amount;
// //       }
// //     });

// //     const revenueThisMonth = Object.values(dailyRevenue).reduce((s, v) => s + v, 0);
// //     const expenseThisMonth = Object.values(dailyExpense).reduce((s, v) => s + v, 0);

// //     res.json({
// //       totalBalance,
// //       mainAccount,
// //       revenueThisMonth,
// //       expenseThisMonth,
// //       transactionsCount: transactions.length,
// //       dailyRevenue,
// //       dailyExpense,
// //     });
// //   } catch (error) {
// //     console.error("Dashboard summary error:", error);
// //     res.status(500).json({ message: "Erreur dashboard summary" });
// //   }
// // };

import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    /* ================== COMPTES ================== */
    const accounts = await Account.find({ userId });

    const totalBalance = accounts.reduce(
      (sum, acc) => sum + acc.balance,
      0
    );

    const mainAccount =
      accounts.find(acc => acc.type === "courant") || null;

    /* ================== DATES ================== */
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    /* ================== TRANSACTIONS ================== */
    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    })
      .sort({ date: -1 })
      .limit(10);

    /* ================== REVENUS / DÉPENSES ================== */
    const revenueThisMonth = transactions
      .filter(t => t.direction === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenseThisMonth = transactions
      .filter(t => t.direction === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    /* ================== CATÉGORIES (DONUT) ================== */
    const expenseCategories = {};
    transactions.forEach(t => {
      if (t.direction === "expense") {
        const cat = t.category || "Autres";
        expenseCategories[cat] =
          (expenseCategories[cat] || 0) + t.amount;
      }
    });

    res.json({
      totalBalance,
      mainAccount,
      revenueThisMonth,
      expenseThisMonth,
      expenseCategories,
      transactions
    });
    const income = await Transaction.aggregate([
  {
    $match: {
      user: req.user.id,
      direction: "income"
    }
  },
  {
    $group: {
      _id: null,
      total: { $sum: "$amount" }
    }
  }
]);


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
