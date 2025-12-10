import mongoose from "mongoose";
import Account from "../models/Account.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";

// ---------- Créer un compte ----------
export const createAccount = async (req, res) => {
  try {
    const { type } = req.body;
    const userId = req.user.id;

    if (!type) {
      return res.status(400).json({ message: "Veuillez fournir le type de compte." });
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    const duplicate = await Account.findOne({ user: userId, type });
    if (duplicate) {
      return res.status(400).json({
        message: `Vous possédez déjà un compte de type : ${type}.`
      });
    }

    const newAccount = new Account({ user: userId, type });
    await newAccount.save();

    if (process.env.NODE_ENV !== "test") {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: existingUser.email,
        subject: "Votre nouveau compte bancaire a été créé",
        html: `
          <h3>Bonjour ${existingUser.name},</h3>
          <p>Votre compte <b>${type}</b> a été créé avec succès !</p>
          <p><b>Numéro de compte :</b> ${newAccount.accountNumber}</p>
          <br/>
          <p>Merci d'utiliser banqueRewmi.</p>
        `,
      });
    }

    return res.status(201).json({
      message: "Compte créé avec succès.",
      account: newAccount,
    });
  } catch (error) {
    console.error("Erreur création compte:", error);
    res.status(500).json({ message: error.message });
  }
};

// ---------- GET comptes du user ----------
export const getAccounts = async (req, res) => {
  try {
    const userId = req.user.id;
    const accounts = await Account.find({ user: userId });
    return res.json(accounts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ---------- GET compte par ID ----------
export const getAccountById = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ message: "Compte introuvable." });
    }

    if (account.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Accès refusé." });
    }

    return res.json(account);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ---------- UPDATE compte ----------
export const updateAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ message: "Compte introuvable." });
    }

    if (account.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Accès refusé." });
    }

    Object.assign(account, req.body);
    await account.save();

    return res.json({ message: "Compte mis à jour.", account });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ---------- DELETE compte ----------
export const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ message: "Compte introuvable." });
    }

    if (account.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Accès refusé." });
    }

    await account.remove();
    return res.json({ message: "Compte supprimé avec succès." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
