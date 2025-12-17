// controllers/transactionController.js
import Transaction from "../models/Transaction.js";
import Account from "../models/Account.js";

// ---------- GET toutes les transactions ----------
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, startDate, endDate } = req.query;

    let filters = { user: userId };
    if (type) filters.type = type;
    if (startDate) filters.date = { ...filters.date, $gte: new Date(startDate) };
    if (endDate) filters.date = { ...filters.date, $lte: new Date(endDate) };

    const transactions = await Transaction.find(filters)
      .populate("user", "name prenom email")
      .populate("sourceAccount", "accountNumber")          // <-- spécifier les champs
      .populate("destinationAccount", "accountNumber")     // <-- spécifier les champs
      .sort({ createdAt: -1 });

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- GET transaction par ID ----------
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate("user", "name prenom email")
      .populate("sourceAccount", "accountNumber")
      .populate("destinationAccount", "accountNumber");

    if (!transaction)
      return res.status(404).json({ message: "Transaction introuvable" });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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