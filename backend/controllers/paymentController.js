import Card from "../models/Card.js"
import Account from "../models/Account.js"
import Transaction from "../models/Transaction.js"
import bcrypt from "bcrypt"

export const payCard = async (req, res) => {
  try {
    const userId = req.user.id
    const { cardId, amount, pin, merchant } = req.body

    if(!cardId || !amount || !pin) {
      return res.status(400).json({ message: "Données manquantes" })
    }

    // 1. Trouver la carte
    const card = await Card.findById(cardId)
    if(!card) return res.status(404).json({ message: "Carte introuvable" })

    // 2. Vérifier le propriétaire
    if(card.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Accès interdit" })
    }

    // 3. Vérifier statut
    if(card.status !== "active") {
      return res.status(400).json({ message: "Carte non active" })
    }

    // 4. Vérifier expiration
    const now = new Date()
    const [mm, yy] = card.expiration.split("/")
    const exp = new Date(`20${yy}-${mm}-01`)
    if(now > exp) {
      return res.status(400).json({ message: "Carte expirée" })
    }

    // 5. Vérifier PIN
    const isValidPin = await bcrypt.compare(pin, card.pinHash)
    if(!isValidPin) {
      return res.status(400).json({ message: "PIN incorrect" })
    }

    // 6. Limite journalière
    const today = new Date()
    today.setHours(0,0,0,0)

    const todaySpent = await Transaction.aggregate([
      { $match: { cardId: card._id, createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ])

    let spent = todaySpent[0]?.total || 0
    if(spent + amount > card.limitQuoti) {
      return res.status(400).json({ message: "Limite journalière atteinte" })
    }

    // 7. Vérifier le solde
    const account = await Account.findById(card.accountId)
    if(account.balance < amount) {
      return res.status(400).json({ message: "Solde insuffisant" })
    }

    // 8. Débiter le compte
    account.balance -= amount
    await account.save()

    // 9. Enregistrer transaction
    await Transaction.create({
      userId,
      cardId,
      accountId: card.accountId,
      amount,
      merchant,
      type: "card-payment"
    })

    return res.status(200).json({
      message: "Paiement effectué",
      amount,
      merchant
    })

  } catch(err) {
    console.error("Erreur paiement carte", err)
    res.status(500).json({ message: "Erreur serveur" })
  }
}


// Faire un paiement
export const makePayment = async (req, res) => {
  try {
    const { accountId, amount, service } = req.body;

    const account = await Account.findById(accountId);
    if (!account) return res.status(404).json({ error: "Compte introuvable" });

    if (account.balance < amount)
      return res.status(400).json({ error: "Solde insuffisant" });

    account.balance -= amount;

    // Historique
    if (!account.history) account.history = [];
    account.history.push({
      type: "payment",
      amount,
      service,
      date: new Date()
    });

    await account.save();

    res.json({
      message: "Paiement effectué avec succès",
      accountBalance: account.balance,
      history: account.history
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer l'historique des paiements
export const getPayments = async (req, res) => {
  try {
    const { accountId } = req.params;

    const account = await Account.findById(accountId);
    if (!account) return res.status(404).json({ error: "Compte introuvable" });

    const payments = account.history.filter(h => h.type === "payment");

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
