import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// -------- LOGIN ADMIN --------
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Admin introuvable" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_ADMIN_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, email: admin.email, role: admin.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// -------- GET USERS --------
// GET all users avec comptes
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().lean(); // .lean() pour un objet simple
    for (let user of users) {
      const accounts = await Account.find({ userId: user._id });
      user.accounts = accounts; // injecte les comptes dans chaque user
    }
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des users" });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User introuvable" });

    await Account.deleteMany({ userId: user._id });
    await user.deleteOne();
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// BLOCK/UNBLOCK user
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    user.blocked = !user.blocked;
    await user.save();

    res.json({
      message: user.blocked ? "Utilisateur bloqué" : "Utilisateur débloqué",
      blocked: user.blocked
    });
  } catch (err) {
    console.error("BLOCK USER ERROR:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// -------- GET ACCOUNTS --------
export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find().populate("userId", "email phone"); // Ajoute email et phone
    res.json(accounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des comptes" });
  }
};


// -------- DEPOSIT TO ACCOUNT --------
export const depositToAccount = async (req, res) => {
  const { id } = req.params; // ID du compte
  const { amount } = req.body;

  if (amount <= 0) return res.status(400).json({ message: "Montant invalide" });

  try {
    const account = await Account.findById(id);
    if (!account) return res.status(404).json({ message: "Compte introuvable" });

    account.balance += amount;
    await account.save();

    res.json({ message: `Dépôt effectué sur le compte ${account.type}`, balance: account.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors du dépôt" });
  }
};

// RETRAIT SUR COMPTE
export const withdrawFromAccount = async (req, res) => {
  const { id } = req.params; // ID du compte
  const { amount } = req.body;

  if (amount <= 0) return res.status(400).json({ message: "Montant invalide" });

  try {
    const account = await Account.findById(id);
    if (!account) return res.status(404).json({ message: "Compte introuvable" });

    if (account.balance < amount)
      return res.status(400).json({ message: "Solde insuffisant" });

    account.balance -= amount;
    await account.save();

    res.json({ message: `Retrait effectué du compte ${account.type}`, balance: account.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors du retrait" });
  }
};

// GET toutes les transactions avec infos complètes
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("user", "name prenom email phone") // infos utilisateur
      .populate("sourceAccount", "accountNumber type balance") // infos compte source
      .populate("destinationAccount", "accountNumber type balance") // infos compte destination
      .sort({ createdAt: -1 }); // trier par date décroissante

    res.status(200).json(transactions);
  } catch (err) {
    console.error("ERREUR GET TRANSACTIONS:", err);
    res.status(500).json({ message: err.message });
  }
};

// ANNULER une transaction
export const cancelTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const trx = await Transaction.findById(id)
      .populate("user", "name prenom email phone")
      .populate("sourceAccount", "accountNumber type balance")
      .populate("destinationAccount", "accountNumber type balance");

    if (!trx) return res.status(404).json({ message: "Transaction introuvable" });
    if (trx.status === "cancelled") return res.json({ message: "Déjà annulée" });

    // Retourner l'argent
    if (trx.sourceAccount && trx.destinationAccount) {
      trx.sourceAccount.balance += trx.amount;
      trx.destinationAccount.balance -= trx.amount;
      await trx.sourceAccount.save();
      await trx.destinationAccount.save();
    }

    trx.status = "cancelled";
    await trx.save();

    res.json({ message: "Transaction annulée", transaction: trx });
  } catch (err) {
    console.error("ERREUR CANCEL TRANSACTION:", err);
    res.status(500).json({ message: err.message });
  }
};