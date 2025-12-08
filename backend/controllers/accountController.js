

import Account from "../models/Account.js";
import User from "../models/User.js";

// ---------- GET tous les comptes du user ----------
export const getAccounts = async (req, res) => {
  try {
    // req.user.id doit être défini via middleware auth
    const accounts = await Account.find({ userId: req.user.id });
    res.status(200).json(accounts);
  } catch (err) {
    console.error("ERREUR GET ACCOUNTS:", err);
    res.status(500).json({ message: err.message });
  }
};

// ---------- GET compte par ID ----------
export const getAccountById = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: "Compte introuvable." });

    if (account.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Accès refusé." });

    res.status(200).json(account);
  } catch (err) {
    console.error("ERREUR GET ACCOUNT BY ID:", err);
    res.status(500).json({ message: err.message });
  }
};

// ---------- CREATE nouveau compte ----------
export const createAccount = async (req, res) => {
  try {
    const { type, name, balance } = req.body;

    if (!type || !name)
      return res.status(400).json({ message: "Type et nom requis." });

    const allowed = ["courant", "epargne", "business"];
    if (!allowed.includes(type))
      return res.status(400).json({ message: "Type de compte invalide." });

    // ❌ IMPORTANT : Empêcher uniquement la CREATION MANUELLE du compte courant
    if (type === "courant") {
      return res
        .status(403)
        .json({ message: "Le compte courant est créé automatiquement lors de l'inscription." });
    }

    // Vérifier qu’il existe déjà un compte courant avant d’en créer un autre
    const hasMain = await Account.findOne({
      userId: req.user.id,
      type: "courant"
    });

    if (!hasMain) {
      return res
        .status(400)
        .json({ message: "Compte principal manquant : contactez le support." });
    }

    // Limite : 1 compte épargne
    if (type === "epargne") {
      const hasSaving = await Account.findOne({
        userId: req.user.id,
        type: "epargne"
      });
      if (hasSaving) {
        return res
          .status(400)
          .json({ message: "Vous avez déjà un compte épargne." });
      }
    }

    // Compte business réservé admin/dev
    if (type === "business") {
      if (req.user.role !== "admin" && req.user.role !== "dev") {
        return res.status(403).json({
          message: "Le compte business est réservé à l’administration."
        });
      }
    }

    const account = await Account.create({
      userId: req.user.id,
      type,
      name,
      balance: balance || 0
    });

    res.status(201).json({
      message: `Compte ${type} créé.`,
      account
    });

  } catch (err) {
    console.error("ERREUR CREATE ACCOUNT:", err);

    if (err.code === 11000 && err.keyPattern?.accountNumber) {
      return res.status(500).json({
        message: "Conflit de numéro de compte. Réessayez."
      });
    }

    res.status(500).json({ message: err.message });
  }
};



// ---------- UPDATE compte ----------
export const updateAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: "Compte introuvable." });

    if (account.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Accès refusé." });

    // Mettre à jour seulement les champs fournis
    Object.assign(account, req.body);
    await account.save();

    res.status(200).json({ message: "Compte mis à jour.", account });
  } catch (err) {
    console.error("ERREUR UPDATE ACCOUNT:", err);
    res.status(500).json({ message: err.message });
  }
};

// ---------- DELETE compte ----------
export const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: "Compte introuvable." });

    if (account.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Accès refusé." });

    await account.deleteOne();
    res.status(200).json({ message: "Compte supprimé avec succès." });
  } catch (err) {
    console.error("ERREUR DELETE ACCOUNT:", err);
    res.status(500).json({ message: err.message });
  }
};
