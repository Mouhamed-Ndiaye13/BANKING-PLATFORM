import Card from "../models/Card.js";
import Account from "../models/Account.js";
import { generateCardToken, getExpiration } from "../utils/card.js";

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
      LimitQuoti: 500000
    });

    return res.status(201).json({
      message: "Carte Mastercard créée",
      card: {
        id: card._id,
        brand: card.brand,
        dernierCard: card.dernierCard,
        expiration: card.expiration,
        status: card.status,
        LimitQuoti: card.LimitQuoti
      }
    });

  } catch (err) {
    console.error("Erreur création carte", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
