
// import Account from "../models/Account.js";
// import Transaction from "../models/Transaction.js";
// import mongoose from "mongoose";
// import { createNotification } from "./notificationControllers.js";

// // ===================== TRANSFERT INTERNE =====================
// export const internalTransfer = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const userId = req.user.id;
//     const { sourceAccount, destinationAccount, amount, description } = req.body;
//     const amt = Number(amount);

//     if (!sourceAccount || !destinationAccount || !amt || amt <= 0) {
//       return res.status(400).json({ message: "Champs invalides" });
//     }
//     if (sourceAccount === destinationAccount) {
//       return res.status(400).json({ message: "Les comptes doivent être différents" });
//     }

//     // Compte source
//     const source = await Account.findOne({ _id: sourceAccount, userId }).session(session);
//     if (!source) return res.status(403).json({ message: "Compte source introuvable" });

//     // Compte destination (même utilisateur)
//     const dest = await Account.findOne({ _id: destinationAccount, userId }).session(session);
//     if (!dest) return res.status(404).json({ message: "Compte destination introuvable" });

//     if (source.balance < amt) return res.status(400).json({ message: "Solde insuffisant" });

//     // Mise à jour des soldes
//     source.balance -= amt;
//     dest.balance += amt;

//     await source.save({ session });
//     await dest.save({ session });

//     // Transactions
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
//           user: userId,
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

    
//   await createNotification(
//   userId,
//   "virement",
//   `Transfert interne de ${amt} FCFA effectué avec succès`
// );
//     res.json({ message: "Transfert interne réussi", transactions });

//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("Erreur transfert interne :", error);
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// };

// // ===================== TRANSFERT EXTERNE =====================
// export const externalTransfer = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const userId = req.user.id;
//     const { sourceAccount, beneficiaryIban, amount, description } = req.body;
//     const amt = Number(amount);

//     if (!sourceAccount || !beneficiaryIban || !amt || amt <= 0) {
//       return res.status(400).json({ message: "Champs invalides" });
//     }

//     // Compte source
//     const source = await Account.findOne({ _id: sourceAccount, userId }).session(session);
//     if (!source) return res.status(403).json({ message: "Compte source introuvable" });

//     if (source.balance < amt) return res.status(400).json({ message: "Solde insuffisant" });

//     // Compte bénéficiaire externe
//     const dest = await Account.findOne({ accountNumber: beneficiaryIban }).session(session);
//     if (!dest) return res.status(404).json({ message: "Compte bénéficiaire introuvable" });

//     if (dest._id.toString() === source._id.toString()) {
//       return res.status(400).json({ message: "Impossible de virer vers le même compte" });
//     }

//     // Mise à jour des soldes
//     source.balance -= amt;
//     dest.balance += amt;

//     await source.save({ session });
//     await dest.save({ session });

//     // Transactions
//     const transactions = await Transaction.create(
//       [
//         {
//           user: userId,
//           sourceAccount: source._id,
//           destinationAccount: dest._id,
//           type: "external_transfer",
//           direction: "expense",
//           amount: amt,
//           category: "Transfert externe",
//           label: description || `Virement externe vers ${beneficiaryIban}`
//         },
//         {
//           user: dest.userId, // bénéficiaire
//           sourceAccount: source._id,
//           destinationAccount: dest._id,
//           type: "external_transfer",
//           direction: "income",
//           amount: amt,
//           category: "Transfert externe",
//           label: description || `Virement externe reçu de ${source.name || "Expéditeur"}`
//         }
//       ],
//       { session, ordered: true }
//     );

//     await session.commitTransaction();
//     session.endSession();

//     // Notification expéditeur
//       await createNotification(
//   userId,
//   "virement",
//   `Virement externe de ${amt} FCFA vers ${beneficiaryIban} effectué`
//  );

//     res.json({ message: "Virement externe effectué avec succès", transactions });

//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("Erreur virement externe :", error);
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// };
import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";
import { createNotification } from "./notificationControllers.js";

/* =====================================================
   TRANSFERT INTERNE
===================================================== */
export const internalTransfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const { sourceAccount, destinationAccount, amount, description } = req.body;
    const amt = Number(amount);

    if (!sourceAccount || !destinationAccount || !amt || amt <= 0) {
      return res.status(400).json({ message: "Champs invalides" });
    }

    if (sourceAccount === destinationAccount) {
      return res.status(400).json({ message: "Les comptes doivent être différents" });
    }

    const source = await Account.findOne({ _id: sourceAccount, userId }).session(session);
    if (!source) return res.status(403).json({ message: "Compte source introuvable" });

    const dest = await Account.findOne({ _id: destinationAccount, userId }).session(session);
    if (!dest) return res.status(404).json({ message: "Compte destination introuvable" });

    if (source.balance < amt) {
      return res.status(400).json({ message: "Solde insuffisant" });
    }

    // Débit / Crédit
    source.balance -= amt;
    dest.balance += amt;

    await source.save({ session });
    await dest.save({ session });

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

    // 🔔 Notification (non bloquante)
    try {
      await createNotification(
        userId,
        "virement",
        `Transfert interne de ${amt} FCFA effectué avec succès`
      );
    } catch (e) {
      console.error("Notification interne non critique :", e);
    }

    res.json({ message: "Transfert interne réussi", transactions });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Erreur transfert interne :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* =====================================================
   TRANSFERT EXTERNE
===================================================== */
export const externalTransfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const { sourceAccount, beneficiaryIban, amount, description } = req.body;
    const amt = Number(amount);

    if (!sourceAccount || !beneficiaryIban || !amt || amt <= 0) {
      return res.status(400).json({ message: "Champs invalides" });
    }

    const source = await Account.findOne({ _id: sourceAccount, userId }).session(session);
    if (!source) return res.status(403).json({ message: "Compte source introuvable" });

    if (source.balance < amt) {
      return res.status(400).json({ message: "Solde insuffisant" });
    }

    const dest = await Account.findOne({ accountNumber: beneficiaryIban }).session(session);
    if (!dest) return res.status(404).json({ message: "Compte bénéficiaire introuvable" });

    if (dest._id.toString() === source._id.toString()) {
      return res.status(400).json({ message: "Impossible de virer vers le même compte" });
    }

    // Débit / Crédit
    source.balance -= amt;
    dest.balance += amt;

    await source.save({ session });
    await dest.save({ session });

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
          label: description || `Virement externe vers ${beneficiaryIban}`
        },
        {
          user: dest.userId,
          sourceAccount: source._id,
          destinationAccount: dest._id,
          type: "external_transfer",
          direction: "income",
          amount: amt,
          category: "Transfert externe",
          label: description || "Virement externe reçu"
        }
      ],
      { session, ordered: true }
    );

    await session.commitTransaction();
    session.endSession();

    // 🔔 Notifications (expéditeur + bénéficiaire)
    try {
      await createNotification(
        userId,
        "virement",
        `Virement externe de ${amt} FCFA vers ${beneficiaryIban} effectué`
      );

      await createNotification(
        dest.userId,
        "virement",
        `Vous avez reçu ${amt} FCFA`
      );
    } catch (e) {
      console.error("Notification externe non critique :", e);
    }

    res.json({ message: "Virement externe effectué avec succès", transactions });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Erreur virement externe :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
