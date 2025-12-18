// // controllers/transferController.js
// import Account from "../models/Account.js";
// import Transaction from "../models/Transaction.js";
// import { createNotification } from "./notificationControllers.js";


// // Transfert interne entre comptes de l'utilisateur
// export const internalTransfer = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { sourceAccount, destinationAccount, amount } = req.body;

//     if (sourceAccount === destinationAccount) {
//       return res.status(400).json({ message: "Les deux comptes doivent être différents" });
//     }

//     const amt = Number(amount);

//     const source = await Account.findById(sourceAccount);
//     const dest = await Account.findById(destinationAccount);

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

    
//     const transaction = await Transaction.create({
//   user: userId,
//   sourceAccount,
//   destinationAccount,
//   type: "income",
//   direction: "debit",
//   amount: amt,
//   category: "Transfert interne",
//   description: "Transfert interne"
// });

// res.json({ message: "Transfert interne réussi", transaction });



//     await createNotification(
//       userId,
//       "TRANSFER",
//       `Transfert interne de ${amt} FCFA effectué avec succès`
//     );

//     res.json({ message: "Transfert interne réussi", transaction });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Transfert externe (vers un IBAN externe)
// export const externalTransfer = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { sourceAccount, beneficiaryIban, amount } = req.body;

//     const amt = Number(amount);

//     const source = await Account.findById(sourceAccount);

//     if (!source) {
//       return res.status(404).json({ message: "Compte introuvable" });
//     }

//     if (source.userId.toString() !== userId) {
//       return res.status(403).json({ message: "Non autorisé" });
//     }

//     if (source.balance < amt) {
//       return res.status(400).json({ message: "Solde insuffisant" });
//     }

//     source.balance -= amt;
//     await source.save();

//     const transaction = await Transaction.create({
//   user: userId,
//   sourceAccount,
//   type: "",
//   direction: "debit",        
//   amount: amt,
//   category: "transfer Externe",
//   beneficiaryIban,
//  description: `Virement externe vers ${beneficiaryIban}`
// });

//     await createNotification(
//      userId,
//     "TRANSFER",
//     `Virement externe de ${amt} FCFA vers ${beneficiaryIban} effectué`
//    );


//     res.json({ message: "Virement externe effectué", transaction });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }

  
// };
import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";
// import { createNotification } from "./notificationControllers.js";

// ===================== TRANSFERT INTERNE =====================
export const internalTransfer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sourceAccount, destinationAccount, amount } = req.body;
    const amt = Number(amount);

    if (sourceAccount === destinationAccount) {
      return res.status(400).json({ message: "Les deux comptes doivent être différents" });
    }

    const source = await Account.findById(sourceAccount);
    const dest = await Account.findById(destinationAccount);

    if (!source || !dest) {
      return res.status(404).json({ message: "Compte introuvable" });
    }

    if (source.userId.toString() !== userId) {
      return res.status(403).json({ message: "Vous n'êtes pas propriétaire du compte source" });
    }

    if (source.balance < amt) {
      return res.status(400).json({ message: "Solde insuffisant" });
    }

    // Mise à jour des soldes
    source.balance -= amt;
    dest.balance += amt;
    await source.save();
    await dest.save();

    // ================= TRANSACTIONS =================
    const debitTransaction = await Transaction.create({
      user: userId,
      sourceAccount,
      destinationAccount,
      type: "internal_transfer",
      direction: "expense",
      amount: amt,
      category: "Transfert interne",
      label: "Transfert interne (débit)"
    });

    // const creditTransaction = await Transaction.create({
    //   user: userId,
    //   sourceAccount,
    //   destinationAccount,
    //   type: "internal_transfer",
    //   direction: "income",
    //   amount: amt,
    //   category: "Transfert interne",
    //   label: "Transfert interne (crédit)"
    // });

    // ================= NOTIFICATION =================
    // await createNotification(
    //   userId,
    //   "TRANSFER",
    //   `Transfert interne de ${amt} FCFA effectué avec succès`
    // );

    res.json({
      message: "Transfert interne réussi",
      transactions: [debitTransaction]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ===================== TRANSFERT EXTERNE =====================
// export const externalTransfer = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { sourceAccount, beneficiaryIban, amount } = req.body;
//     const amt = Number(amount);

//     const source = await Account.findById(sourceAccount);
//     if (!source) return res.status(404).json({ message: "Compte introuvable" });

//     if (source.userId.toString() !== userId) {
//       return res.status(403).json({ message: "Non autorisé" });
//     }

//     if (source.balance < amt) {
//       return res.status(400).json({ message: "Solde insuffisant" });
//     }

//     source.balance -= amt;
//     await source.save();

//     const transaction = await Transaction.create({
//       user: userId,
//       sourceAccount,
//       type: "external_transfer",
//       direction: "expense",
//       amount: amt,
//       category: "Transfert externe",
//       beneficiaryIban,
//       label: `Virement externe vers ${beneficiaryIban}`
//     });

//     // await createNotification(
//     //   userId,
//     //   "TRANSFER",
//     //   `Virement externe de ${amt} FCFA vers ${beneficiaryIban} effectué`
//     // );

//     res.json({ message: "Virement externe effectué", transaction });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };
export const externalTransfer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sourceAccount, destinationAccount, amount } = req.body;
    const amt = Number(amount);

    if (!sourceAccount || !destinationAccount || !amt) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    if (sourceAccount === destinationAccount) {
      return res.status(400).json({ message: "Les deux comptes doivent être différents" });
    }

    // 1️⃣ Vérifier compte source
    const source = await Account.findById(sourceAccount);
    if (!source) return res.status(404).json({ message: "Compte source introuvable" });
    if (source.userId.toString() !== userId) return res.status(403).json({ message: "Non autorisé" });
    if (source.balance < amt) return res.status(400).json({ message: "Solde insuffisant" });

    // 2️⃣ Vérifier compte destinataire
    const dest = await Account.findById(destinationAccount);
    if (!dest) return res.status(404).json({ message: "Compte bénéficiaire introuvable" });

    // 3️⃣ Mise à jour des soldes
    source.balance -= amt;
    dest.balance += amt;
    await source.save();
    await dest.save();

    // 4️⃣ Créer la transaction
    const transaction = await Transaction.create({
      user: userId,
      sourceAccount,
      destinationAccount,
      type: "external_transfer",
      direction: "expense",
      amount: amt,
      category: "Transfert externe",
      label: `Virement externe vers ${dest.name || "Bénéficiaire"}`
    });

    res.json({
      message: "Virement externe effectué avec succès",
      transaction,
      destBalance: dest.balance
    });

  } catch (error) {
    console.error("Erreur virement externe :", error);
    res.status(500).json({ message: error.message });
  }
};