import Transaction from "../models/Transaction.js";
import Account from "../models/Account.js";

// ---------- GET toutes les transactions ----------
export const getTransactions = async (req, res) => {
  try {
    // 🔐 Sécurité
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const userId = req.user.id;
    const { type, startDate, endDate } = req.query;

    let filters = { user: userId };

    if (type) filters.type = type;

    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filters)
      .populate("user", "name prenom email")
      .populate("sourceAccount", "accountNumber")
      .populate("destinationAccount", "accountNumber")
      .sort({ createdAt: -1 });

    // 📊 STATISTIQUES (compatibles avec le frontend)
    const revenueThisMonth = transactions
      .filter(t => t.type === "depot" || t.type === "external_transfer")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenseThisMonth = transactions
      .filter(t => t.type === "retrait" || t.type === "internal_transfer")
      .reduce((sum, t) => sum + t.amount, 0);

    res.status(200).json({
      transactions,
      revenueThisMonth,
      expenseThisMonth,
      totalTransactionsThisMonth: transactions.length,
    });

  } catch (error) {
    console.error("❌ getTransactions error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ---------- GET transaction par ID ----------
export const getTransactionById = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const transaction = await Transaction.findById(req.params.id)
      .populate("user", "name prenom email")
      .populate("sourceAccount", "accountNumber")
      .populate("destinationAccount", "accountNumber");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction introuvable" });
    }

    // 🔐 Empêcher l'accès aux transactions d'un autre utilisateur
    if (transaction.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    res.status(200).json(transaction);

  } catch (error) {
    console.error("❌ getTransactionById error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ---------- Annuler une transaction ----------
export const cancelTransaction = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const transaction = await Transaction.findById(req.params.id)
      .populate("sourceAccount")
      .populate("destinationAccount");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction introuvable" });
    }

    // 🔐 Sécurité utilisateur
    if (transaction.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    if (transaction.cancelled) {
      return res.status(400).json({ message: "Transaction déjà annulée" });
    }

    // 💰 Logique d'annulation sécurisée
    if (transaction.type === "depot") {
      transaction.sourceAccount.balance -= transaction.amount;
    }

    if (transaction.type === "retrait") {
      transaction.sourceAccount.balance += transaction.amount;
    }

    if (
      transaction.type === "internal_transfer" ||
      transaction.type === "external_transfer"
    ) {
      if (transaction.destinationAccount) {
        transaction.destinationAccount.balance -= transaction.amount;
        await transaction.destinationAccount.save();
      }

      if (transaction.sourceAccount) {
        transaction.sourceAccount.balance += transaction.amount;
      }
    }

    if (transaction.sourceAccount) {
      await transaction.sourceAccount.save();
    }

    transaction.cancelled = true;
    await transaction.save();

    res.status(200).json({ message: "Transaction annulée avec succès" });

  } catch (error) {
    console.error("❌ cancelTransaction error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
