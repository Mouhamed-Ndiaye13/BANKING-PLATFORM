import Card from "../models/Card.js";
import Account from "../models/Account.js";
import { generateCardToken, getExpiration } from "../utils/card.js";
import bcrypt from "bcrypt";

export const createCard = async (req, res) => {
  try {
    const userId = req.user.id;
    const { accountId } = req.body;

    if (!accountId) {
      return res.status(400).json({ message: "accountId requis" });
    }

    // Vérifier compte
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: "Compte introuvable" });
    }

    if (account.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    if (account.status !== "active") {
      return res.status(400).json({ message: "Compte non actif" });
    }

    // Vérifier si carte existe déjà
    const exists = await Card.findOne({ accountId });
    if (exists) {
      return res.status(400).json({ message: "Carte déjà créée pour ce compte" });
    }

    // Générer token carte
    const token = generateCardToken();

    const card = await Card.create({
      userId,
      accountId,
      cardToken: token,
      dernierCard: token.slice(-4),
      expiration: getExpiration(),
      status: "inactive",
      limitQuoti: 500000
    });
    

    return res.status(201).json({
      message: "Carte Mastercard créée",
      card: {
        id: card._id,
        brand: card.brand,
        dernierCard: card.dernierCard,
        expiration: card.expiration,
        status: card.status,
        limitQuoti: card.limitQuoti
      }
    });

  } catch (err) {
    console.error("Erreur création carte", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const activateCard = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const card = await Card.findById(id);
    if (!card) {
      return res.status(404).json({ message: "Carte introuvable" });
    }

    if (card.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    if (card.status === "active") {
      return res.status(400).json({ message: "Carte déjà active" });
    }

    if (!card.pinSet) {
      return res.status(400).json({ message: "Définissez le PIN avant d'activer" });
    }

    if (card.status === "blocked") {
      return res.status(400).json({ message: "Carte bloquée" });
    }

    card.status = "active";
    await card.save();

    return res.status(200).json({ message: "Carte activée avec succès" });

  } catch (err) {
    console.error("Erreur activation carte", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


export const setPin = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { pin } = req.body;

    if (!pin || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ message: "Le PIN doit contenir 4 chiffres" });
    }

    const card = await Card.findById(id);
    if (!card) {
      return res.status(404).json({ message: "Carte introuvable" });
    }

    if (card.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    if (card.status === "blocked") {
      return res.status(400).json({ message: "Carte bloquée" });
    }

    // Déjà défini ?
    if (card.pinSet) {
      return res.status(400).json({ message: "PIN déjà défini" });
    }

    const salt = await bcrypt.genSalt(12);
    const pinHash = await bcrypt.hash(pin, salt);

    card.pinHash = pinHash;
    card.pinSet = true;
    await card.save();

    return res.status(200).json({ message: "PIN configuré avec succès" });

  } catch (err) {
    console.error("Erreur set PIN", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
// récupérer les cartes de l’utilisateur
export const getMyCards = async (req, res) => {
  try {
    const userId = req.user.id;

    const cards = await Card.find({ userId })
      .populate("accountId", "currency balance")
      .sort({ createdAt: -1 });

    const formatted = cards.map(card => ({
      id: card._id,
      brand: card.brand,
      last4: card.dernierCard,
      expiration: card.expiration,
      status: card.status,
      limitQuoti: card.limitQuoti,
      type: card.accountId.currency === "XOF" ? "Carte Débit" : "Carte",
    }));

    res.status(200).json(formatted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


