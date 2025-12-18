// // controllers/transactionController.js
// import Transaction from "../models/Transaction.js";
// import Account from "../models/Account.js";

<<<<<<< HEAD
// // ---------- GET toutes les transactions avec filtres ----------
// export const getTransactions = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { type, startDate, endDate } = req.query;

//     // Filtrage dynamique
//     let filters = { user: userId };
//     if (type) filters.type = type;
//     if (startDate) filters.date = { ...filters.date, $gte: new Date(startDate) };
//     if (endDate) filters.date = { ...filters.date, $lte: new Date(endDate) };

//     const transactions = await Transaction.find(filters)
//       .populate("sourceAccount")
//       .populate("destinationAccount")
//       .sort({ createdAt: -1 });

//     // Début et fin du mois
//     const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
//     const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

//     const transactionsThisMonth = transactions.filter(
//       t => t.date >= startOfMonth && t.date <= endOfMonth
//     );

//     const revenueThisMonth = transactionsThisMonth
//       .filter(t => t.type === "depot" || t.type === "external_transfer")
//       .reduce((sum, t) => sum + t.amount, 0);

//     const expenseThisMonth = transactionsThisMonth
//       .filter(t => t.type === "retrait" || t.type === "internal_transfer")
//       .reduce((sum, t) => sum + t.amount, 0);

//     const totalTransactionsThisMonth = transactionsThisMonth.length;

//     res.json({
//       revenueThisMonth,
//       expenseThisMonth,
//       totalTransactionsThisMonth,
//       transactions
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ---------- GET transaction par ID ----------
// export const getTransactionById = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const transaction = await Transaction.findOne({
//       _id: req.params.id,
//       user: userId
//     })
//       .populate("sourceAccount")
//       .populate("destinationAccount");

//     if (!transaction) return res.status(404).json({ message: "Transaction introuvable" });

//     res.json(transaction);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

import Transaction from "../models/Transaction.js";

// ---------- GET toutes les transactions + dashboard ----------
=======
// ---------- GET toutes les transactions ----------
>>>>>>> 698d0077a1545ad5acad5a4cf8e0c1d204456a88
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, startDate, endDate } = req.query;

<<<<<<< HEAD
    // ---------- FILTRES ----------
    const filters = { user: userId };
=======
    let filters = { user: userId };
    if (type) filters.type = type;
    if (startDate) filters.date = { ...filters.date, $gte: new Date(startDate) };
    if (endDate) filters.date = { ...filters.date, $lte: new Date(endDate) };
>>>>>>> 698d0077a1545ad5acad5a4cf8e0c1d204456a88

    if (type) {
      filters.type = type;
    }

    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }

    // ---------- TRANSACTIONS ----------
    const transactions = await Transaction.find(filters)
<<<<<<< HEAD
      .populate("sourceAccount", "name accountNumber currency")
      .populate("destinationAccount", "name accountNumber currency")
      .sort({ createdAt: -1 });

    // ---------- MOIS EN COURS ----------
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const monthFilter = {
      user: userId,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    };

    // ---------- AGRÉGATIONS (LOGIQUE BANCAIRE CORRECTE) ----------
    const [revenueAgg] = await Transaction.aggregate([
      { $match: { ...monthFilter, direction: "credit" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const [expenseAgg] = await Transaction.aggregate([
      { $match: { ...monthFilter, direction: "debit" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const revenueThisMonth = revenueAgg?.total || 0;
    const expenseThisMonth = expenseAgg?.total || 0;

    const totalTransactionsThisMonth =
      await Transaction.countDocuments(monthFilter);

    // ---------- RESPONSE ----------
    res.status(200).json({
      revenueThisMonth,
      expenseThisMonth,
      totalTransactionsThisMonth,
      transactions
    });

=======
      .populate("user", "name prenom email")
      .populate("sourceAccount", "accountNumber")          // <-- spécifier les champs
      .populate("destinationAccount", "accountNumber")     // <-- spécifier les champs
      .sort({ createdAt: -1 });

    res.json({ transactions });
>>>>>>> 698d0077a1545ad5acad5a4cf8e0c1d204456a88
  } catch (error) {
    console.error("getTransactions error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ---------- GET transaction par ID ----------
export const getTransactionById = async (req, res) => {
  try {
<<<<<<< HEAD
    const userId = req.user.id;
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      _id: id,
      user: userId
    })
      .populate("sourceAccount", "name accountNumber currency")
      .populate("destinationAccount", "name accountNumber currency");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction introuvable" });
    }

    res.status(200).json(transaction);
=======
    const transaction = await Transaction.findById(req.params.id)
      .populate("user", "name prenom email")
      .populate("sourceAccount", "accountNumber")
      .populate("destinationAccount", "accountNumber");

    if (!transaction)
      return res.status(404).json({ message: "Transaction introuvable" });
>>>>>>> 698d0077a1545ad5acad5a4cf8e0c1d204456a88

  } catch (error) {
    console.error("getTransactionById error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

<<<<<<< HEAD
=======
// ---------- Annuler une transaction ----------
export const cancelTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate("sourceAccount")
      .populate("destinationAccount");

    if (!transaction) return res.status(404).json({ message: "Transaction introuvable" });

    // Vérifier que ce n'est pas déjà annulé
    if (transaction.cancelled) {
      return res.status(400).json({ message: "Transaction déjà annulée" });
    }

    // Remettre l'argent sur le compte source
    if (transaction.type === "depot") {
      transaction.sourceAccount.balance -= transaction.amount;
    } else if (transaction.type === "retrait") {
      transaction.sourceAccount.balance += transaction.amount;
    } else {
      // internal_transfer ou external_transfer
      if (transaction.destinationAccount) {
        transaction.destinationAccount.balance -= transaction.amount;
      }
      if (transaction.sourceAccount) {
        transaction.sourceAccount.balance += transaction.amount;
      }
      await transaction.destinationAccount.save();
    }

    await transaction.sourceAccount.save();

    // Marquer la transaction comme annulée
    transaction.cancelled = true;
    await transaction.save();

    res.status(200).json({ message: "Transaction annulée avec succès" });

  } catch (err) {
    console.error("Erreur cancelTransaction:", err);
    res.status(500).json({ message: err.message });
  }
};
>>>>>>> 698d0077a1545ad5acad5a4cf8e0c1d204456a88
