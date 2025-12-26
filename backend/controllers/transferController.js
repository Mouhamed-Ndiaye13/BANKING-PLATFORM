
import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

// ===================== TRANSFERT INTERNE =====================
// export const internalTransfer = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const userId = req.user.id;
//     const { sourceAccount, destinationAccount, amount, description } = req.body;
//     const amt = Number(amount);

//     if (!sourceAccount || !destinationAccount || amt <= 0) {
//       return res.status(400).json({ message: "Champs invalides" });
//     }
//     if (sourceAccount === destinationAccount) {
//       return res.status(400).json({ message: "Les deux comptes doivent être différents" });
//     }

//     const source = await Account.findById(sourceAccount).session(session);
//     const dest = await Account.findById(destinationAccount).session(session);

//     if (!source || !dest) return res.status(404).json({ message: "Compte introuvable" });
//     if (source.userId.toString() !== userId)
//       return res.status(403).json({ message: "Vous n'êtes pas propriétaire du compte source" });
//     if (source.balance < amt) return res.status(400).json({ message: "Solde insuffisant" });

//     // Mise à jour des soldes
//     source.balance -= amt;
//     dest.balance += amt;
//     await source.save({ session });
//     await dest.save({ session });

//     // Création des transactions avec ordered: true
//     const transactions = await Transaction.create(
//       [
//         {
//           user: userId,
//           sourceAccount: source._id,
//           destinationAccount: dest._id,
//           type: "internal_transfer",
//           direction: "expense",
//           amount: amt,
//           category: "Transfert interne",
//           label: description || "Transfert interne (débit)"
//         },
//         {
//           user: dest.userId,
//           sourceAccount: source._id,
//           destinationAccount: dest._id,
//           type: "internal_transfer",
//           direction: "income",
//           amount: amt,
//           category: "Transfert interne",
//           label: description || "Transfert interne (crédit)"
//         }
//       ],
//       { session, ordered: true } 
//     );

//     await session.commitTransaction();
//     session.endSession();

//     res.json({
//       message: "Transfert interne réussi",
//       transactions
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("Erreur transfert interne :", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// export const externalTransfer = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const userId = req.user.id;
//     const { sourceAccount, beneficiaryIban, amount, description } = req.body;
//     const amt = Number(amount);

//     if (!sourceAccount || !beneficiaryIban || amt <= 0) {
//       return res.status(400).json({ message: "Champs invalides" });
//     }

//     const source = await Account.findById(sourceAccount).session(session);
//     if (!source) return res.status(404).json({ message: "Compte source introuvable" });
//     if (source.userId.toString() !== userId)
//       return res.status(403).json({ message: "Non autorisé" });
//     if (source.balance < amt) return res.status(400).json({ message: "Solde insuffisant" });

//     const dest = await Account.findOne({ accountNumber: beneficiaryIban }).session(session);
//     if (!dest) return res.status(404).json({ message: "Compte bénéficiaire introuvable" });

//     // Mise à jour des soldes
//     source.balance -= amt;
//     dest.balance += amt;
//     await source.save({ session });
//     await dest.save({ session });

//     // Création de la transaction avec ordered: true
//     const transaction = await Transaction.create(
//       [
//         {
//           user: userId,
//           sourceAccount: source._id,
//           destinationAccount: dest._id,
//           type: "external_transfer",
//           direction: "expense",
//           amount: amt,
//           category: "Transfert externe",
//          label: description || `Virement externe vers ${dest.name || "Bénéficiaire"}`
// }
        
//       ],
//       { session, ordered: true } //  important
//     );

//     await session.commitTransaction();
//     session.endSession();

//     res.json({
//       message: "Virement externe effectué avec succès",
//       transaction: transaction[0],
//       destBalance: dest.balance
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("Erreur virement externe :", error);
//     res.status(500).json({ message: error.message });
//   }
// }



import { createNotification } from "./notificationControllers.js";


export const internalTransfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const { sourceAccount, destinationAccount, amount, description } = req.body;
    const amt = Number(amount);

    if (!sourceAccount || !destinationAccount || amt <= 0) {
      return res.status(400).json({ message: "Champs invalides" });
    }

    if (sourceAccount === destinationAccount) {
      return res.status(400).json({ message: "Les deux comptes doivent être différents" });
    }

    // Compte source (appartient à l'utilisateur)
    const source = await Account.findOne({ _id: sourceAccount, userId }).session(session);
    if (!source) {
      return res.status(403).json({ message: "Compte source introuvable ou accès interdit" });
    }

    //  Compte destination (interne = même utilisateur)
    const dest = await Account.findOne({ _id: destinationAccount, userId }).session(session);
    if (!dest) {
      return res.status(404).json({ message: "Compte destination introuvable" });
    }

    if (source.balance < amt) {
      return res.status(400).json({ message: "Solde insuffisant" });
    }

    
    source.balance -= amt;
    dest.balance += amt;

    await source.save({ session });
    await dest.save({ session });

    //  TRANSACTIONS DÉBIT / CRÉDIT
    const transactions = await Transaction.create(
      [
        {
          user: userId,
          sourceAccount: source._id,
          destinationAccount: dest._id,
          type: "internal_transfer",
          direction: "expense",
          amount: amt,
          category: "Transfert interne",
          label: description || "Transfert interne (débit)"
        },
        {
          user: userId,
          sourceAccount: source._id,
          destinationAccount: dest._id,
          type: "internal_transfer",
          direction: "income",
          amount: amt,
          category: "Transfert interne",
          label: description || "Transfert interne (crédit)"
        }
      ],
      { session, ordered: true }
    );

    await session.commitTransaction();
    session.endSession();
  //Crée la notification juste après la transaction
    await createNotification(
  req.user.id,
  "transaction",
  `Vous avez transféré ${amount} vers le compte ${destinationAccount}.`
    );

    res.json({
      message: "Transfert interne réussi",
      transactions
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Erreur transfert interne :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// ===================== TRANSFERT EXTERNE =====================

export const externalTransfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const { sourceAccount, beneficiaryIban, amount, description } = req.body;
    const amt = Number(amount);

    if (!sourceAccount || !beneficiaryIban || amt <= 0) {
      return res.status(400).json({ message: "Champs invalides" });
    }

    //  Compte source (doit appartenir à l'utilisateur)
    const source = await Account.findOne({
      _id: sourceAccount,
      userId
    }).session(session);

    if (!source) {
      return res.status(403).json({
        message: "Compte source introuvable ou accès interdit"
      });
    }

    if (source.balance < amt) {
      return res.status(400).json({ message: "Solde insuffisant" });
    }

    //  Compte bénéficiaire (externe possible)
    const dest = await Account.findOne({
      accountNumber: beneficiaryIban
    }).session(session);

    if (!dest) {
      return res
        .status(404)
        .json({ message: "Compte bénéficiaire introuvable" });
    }

    //  Empêcher virement vers soi-même
    if (dest._id.toString() === source._id.toString()) {
      return res.status(400).json({
        message: "Impossible de virer vers le même compte"
      });
    }

    // Mise à jour des soldes
    source.balance -= amt;
    dest.balance += amt;

    await source.save({ session });
    await dest.save({ session });

    //  TRANSACTIONS DÉBIT / CRÉDIT
    const transactions = await Transaction.create(
      [
        {
          user: userId,
          sourceAccount: source._id,
          destinationAccount: dest._id,
          type: "external_transfer",
          direction: "expense",
          amount: amt,
          category: "Transfert externe",
          label:
            description ||
            `Virement externe vers ${dest.name || "Bénéficiaire"}`
        },
        {
          user: dest.userId, // bénéficiaire
          sourceAccount: source._id,
          destinationAccount: dest._id,
          type: "external_transfer",
          direction: "income",
          amount: amt,
          category: "Transfert externe",
          label:
            description ||
            `Virement externe reçu de ${source.name || "Expéditeur"}`
        }
      ],
      { session, ordered: true }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: "Virement externe effectué avec succès",
      transactions
    });


await createNotification(
  req.user.id,
  "virement",
   `Virement externe de ${amt} FCFA vers ${beneficiaryIban} effectué`
);



    res.json({ message: "Virement externe effectué", transaction });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Erreur virement externe :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};