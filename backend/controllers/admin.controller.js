import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// LOGIN ADMIN
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Email ou mot de passe incorrect" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ message: "Email ou mot de passe incorrect" });

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_ADMIN_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, email: admin.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET USERS avec comptes
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate({
      path: "accounts", // nom du champ virtuel ou relation
      select: "type accountNumber balance currency"
    });
    res.json(users);
  } catch (err) {
    console.error("Erreur lors de la récupération des users :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// GET ACCOUNTS avec info user
export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find()
      .populate("userId", "email phone name"); // <-- récupère email, phone, name
    res.json(accounts);
  } catch (err) {
    console.error("Erreur lors de la récupération des comptes :", err);
    res.status(500).json({ message: "Erreur lors de la récupération des comptes" });
  }
};


// GET TRANSACTIONS
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().lean();
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des transactions" });
  }
};

// CANCEL TRANSACTION
export const cancelTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const trx = await Transaction.findById(id);
    if (!trx) return res.status(404).json({ message: "Transaction introuvable" });

    if (trx.status === "cancelled") return res.json({ message: "Déjà annulée" });

    await Account.findByIdAndUpdate(trx.senderId, { $inc: { balance: trx.amount } });
    await Account.findByIdAndUpdate(trx.receiverId, { $inc: { balance: -trx.amount } });

    trx.status = "cancelled";
    await trx.save();

    res.json({ message: "Transaction annulée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'annulation" });
  }
};

// DEPOSIT TO ACCOUNT (admin choisit le compte)
export const depositToAccount = async (req, res) => {
  const { id } = req.params;
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

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // Supprimer tous ses comptes
    await Account.deleteMany({ userId: user._id });

    await user.deleteOne();
    res.json({ message: "Utilisateur et ses comptes supprimés" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
  }
};
