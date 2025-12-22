

  
// // };
// import Account from "../models/Account.js";
// import Transaction from "../models/Transaction.js";
// // import { createNotification } from "./notificationControllers.js";

// // ===================== TRANSFERT INTERNE =====================
// export const internalTransfer = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { sourceAccount, beneficiaryIban, amount } = req.body;
//     const amt = Number(amount);

//     if (sourceAccount === beneficiaryIban) {
//       return res.status(400).json({ message: "Les deux comptes doivent être différents" });
//     }

//     const source = await Account.findById(sourceAccount);
//     const dest = await Account.findById(beneficiaryIban);

//     if (!source || !dest) {
//       return res.status(404).json({ message: "Compte introuvable" });
//     }

//     if (source.userId.toString() !== userId) {
//       return res.status(403).json({ message: "Vous n'êtes pas propriétaire du compte source" });
//     }

//     if (source.balance < amt) {
//       return res.status(400).json({ message: "Solde insuffisant" });
//     }

//     // Mise à jour des soldes
//     source.balance -= amt;
//     dest.balance += amt;
//     await source.save();
//     await dest.save();

//     // ================= TRANSACTIONS =================
//     const debitTransaction = await Transaction.create({
//       user: userId,
//       sourceAccount,
//       beneficiaryIban,
//       type: "internal_transfer",
//       direction: "expense",
//       amount: amt,
//       category: "Transfert interne",
//       label: "Transfert interne (débit)"
//     });

//     // ================= NOTIFICATION =================
//     // await createNotification(
//     //   userId,
//     //   "TRANSFER",
//     //   `Transfert interne de ${amt} FCFA effectué avec succès`
//     // );

//     res.json({
//       message: "Transfert interne réussi",
//       transactions: [debitTransaction]
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };
// //     // await createNotification(
// //     //   userId,
// //     //   "TRANSFER",
// //     //   `Virement externe de ${amt} FCFA vers ${beneficiaryIban} effectué`
// //     // );

// //     res.json({ message: "Virement externe effectué", transaction });

// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: error.message });
// //   }
// // };
// export const externalTransfer = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { sourceAccount, beneficiaryIban, amount } = req.body;
//     const amt = Number(amount);

//     if (!sourceAccount || !beneficiaryIban || !amt) {
//       return res.status(400).json({ message: "Champs manquants" });
//     }

//     if (sourceAccount === beneficiaryIban) {
//       return res.status(400).json({ message: "Les deux comptes doivent être différents" });
//     }

//     //  Vérifier compte source
//     const source = await Account.findById(sourceAccount);
//     if (!source) return res.status(404).json({ message: "Compte source introuvable" });
//     if (source.userId.toString() !== userId) return res.status(403).json({ message: "Non autorisé" });
//     if (source.balance < amt) return res.status(400).json({ message: "Solde insuffisant" });

//     //  Vérifier compte destinataire
//     const dest = await Account.findOne({ accountNumber: beneficiaryIban });
// if (!dest) return res.status(404).json({ message: "Compte bénéficiaire introuvable" });

//     //  Mise à jour des soldes
//     source.balance -= amt;
//     dest.balance += amt;
//     await source.save();
//     await dest.save();

//     //  Créer la transaction
//     const transaction = await Transaction.create({
//       user: userId,
//       sourceAccount,
//       beneficiaryIban,
//       type: "external_transfer",
//       direction: "expense",
//       amount: amt,
//       category: "Transfert externe",
//       label: `Virement externe vers ${dest.name || "Bénéficiaire"}`
//     });

//     res.json({
//       message: "Virement externe effectué avec succès",
//       transaction,
//       destBalance: dest.balance
//     });

//   } catch (error) {
//     console.error("Erreur virement externe :", error);
//     res.status(500).json({ message: error.message });
//   }
// };
// commenter par mouhamed ndiaye

// controllers/transfer.controller.js
import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

// ===================== TRANSFERT INTERNE =====================
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

    const source = await Account.findById(sourceAccount).session(session);
    const dest = await Account.findById(destinationAccount).session(session);

    if (!source || !dest) return res.status(404).json({ message: "Compte introuvable" });
    if (source.userId.toString() !== userId)
      return res.status(403).json({ message: "Vous n'êtes pas propriétaire du compte source" });
    if (source.balance < amt) return res.status(400).json({ message: "Solde insuffisant" });

    // Mise à jour des soldes
    source.balance -= amt;
    dest.balance += amt;
    await source.save({ session });
    await dest.save({ session });

    // Création des transactions avec ordered: true
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
          user: dest.userId,
          sourceAccount: source._id,
          destinationAccount: dest._id,
          type: "internal_transfer",
          direction: "income",
          amount: amt,
          category: "Transfert interne",
          label: description || "Transfert interne (crédit)"
        }
      ],
      { session, ordered: true } // ✅ important
    );

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: "Transfert interne réussi",
      transactions
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Erreur transfert interne :", error);
    res.status(500).json({ message: error.message });
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

    const source = await Account.findById(sourceAccount).session(session);
    if (!source) return res.status(404).json({ message: "Compte source introuvable" });
    if (source.userId.toString() !== userId)
      return res.status(403).json({ message: "Non autorisé" });
    if (source.balance < amt) return res.status(400).json({ message: "Solde insuffisant" });

    const dest = await Account.findOne({ accountNumber: beneficiaryIban }).session(session);
    if (!dest) return res.status(404).json({ message: "Compte bénéficiaire introuvable" });

    // Mise à jour des soldes
    source.balance -= amt;
    dest.balance += amt;
    await source.save({ session });
    await dest.save({ session });

    // Création de la transaction avec ordered: true
    const transaction = await Transaction.create(
      [
        {
          user: userId,
          sourceAccount: source._id,
          destinationAccount: dest._id,
          type: "external_transfer",
          direction: "expense",
          amount: amt,
          category: "Transfert externe",
          label: description || `Virement externe vers ${dest.name || "Bénéficiaire"}`
        }
      ],
      { session, ordered: true } // ✅ important
    );

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: "Virement externe effectué avec succès",
      transaction: transaction[0],
      destBalance: dest.balance
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Erreur virement externe :", error);
    res.status(500).json({ message: error.message });
  }
};
