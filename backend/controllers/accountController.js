
// //avec authentification

// const mongoose = require("mongoose");
// const Account = require("../models/Account");
// const User = require("../models/User");
// const nodemailer = require("nodemailer");

// // ---------- Créer un compte ----------
// exports.createAccount = async (req, res) => {
//   try {
//     const { type } = req.body;
//     const userId = req.user.id;

//     if (!type) {
//       return res.status(400).json({ message: "Veuillez fournir le type de compte." });
//     }

//     const existingUser = await User.findById(userId);
//     if (!existingUser) {
//       return res.status(404).json({ message: "Utilisateur introuvable." });
//     }

//     // Empêcher plusieurs comptes du même type
//     const duplicate = await Account.findOne({ user: userId, type });
//     if (duplicate) {
//       return res.status(400).json({
//         message: `Vous possédez déjà un compte de type : ${type}.`
//       });
//     }

//     const newAccount = new Account({ user: userId, type });
//     await newAccount.save();

//     // Envoi email ( réel)
//     if (process.env.NODE_ENV !== "test") {
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASS
//         }
//       });

//       await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to: existingUser.email,
//         subject: "Votre nouveau compte bancaire a été créé",
//         html: `
//           <h3>Bonjour ${existingUser.name},</h3>
//           <p>Votre compte <b>${type}</b> a été créé avec succès !</p>
//           <p><b>Numéro de compte :</b> ${newAccount.accountNumber}</p>
//           <br/>
//           <p>Merci d'utiliser banqueRewmi.</p>
//         `
//       });
//     }

//     res.status(201).json({
//       message: "Compte créé avec succès.",
//       account: newAccount
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ---------- GET comptes du user ----------
// exports.getAccounts = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const accounts = await Account.find({ user: userId });
//     res.json(accounts);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ---------- GET compte par ID ----------
// exports.getAccountById = async (req, res) => {
//   try {
//     const account = await Account.findById(req.params.id);

//     if (!account) {
//       return res.status(404).json({ message: "Compte introuvable." });
//     }

//     // Vérifier que l'utilisateur est propriétaire
//     if (account.user.toString() !== req.user.id) {
//       return res.status(403).json({ message: "Accès refusé." });
//     }

//     res.json(account);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ---------- UPDATE compte ----------
// exports.updateAccount = async (req, res) => {
//   try {
//     const account = await Account.findById(req.params.id);

//     if (!account) {
//       return res.status(404).json({ message: "Compte introuvable." });
//     }

//     if (account.user.toString() !== req.user.id) {
//       return res.status(403).json({ message: "Accès refusé." });
//     }

//     Object.assign(account, req.body);
//     await account.save();

//     res.json({ message: "Compte mis à jour.", account });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ---------- DELETE compte ----------
// exports.deleteAccount = async (req, res) => {
//   try {
//     const account = await Account.findById(req.params.id);

//     if (!account) {
//       return res.status(404).json({ message: "Compte introuvable." });
//     }

//     if (account.user.toString() !== req.user.id) {
//       return res.status(403).json({ message: "Accès refusé." });
//     }

//     await account.remove();
//     res.json({ message: "Compte supprimé avec succès." });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

import Account from "../models/Account.js";
import User from "../models/User.js";

// ---------- GET tous les comptes du user ----------
export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.id });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- GET compte par ID ----------
export const getAccountById = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: "Compte introuvable." });
    if (account.userId.toString() !== req.user.id) return res.status(403).json({ message: "Accès refusé." });
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- CREATE nouveau compte ----------
export const createAccount = async (req, res) => {
  try {
    const { type, name, balance } = req.body;
    if (!type || !name) return res.status(400).json({ message: "Type et nom requis." });

    const duplicate = await Account.findOne({ userId: req.user.id, type });
    if (duplicate) return res.status(400).json({ message: `Vous possédez déjà un compte de type ${type}.` });

    const account = await Account.create({
      userId: req.user.id,
      type,
      name,
      balance: balance || 0
    });

    res.status(201).json({ message: "Compte créé avec succès.", account });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- UPDATE compte ----------
export const updateAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: "Compte introuvable." });
    if (account.userId.toString() !== req.user.id) return res.status(403).json({ message: "Accès refusé." });

    Object.assign(account, req.body);
    await account.save();

    res.json({ message: "Compte mis à jour.", account });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
