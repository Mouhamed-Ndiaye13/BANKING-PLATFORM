//sans authenTIFICATION
// const Account = require("../models/Account");

// // Création d’un compte bancaire
// exports.createAccount = async (req, res) => {
//   try {
//     const { user, type } = req.body;

//     // Vérification des champs obligatoires
//     if (!user || !type) {
//       return res.status(400).json({ message: "Veuillez fournir l'utilisateur et le type de compte." });
//     }

//     // Vérifier que l'ID utilisateur est valide
//     if (!mongoose.Types.ObjectId.isValid(user)) {
//       return res.status(400).json({ message: "ID utilisateur invalide." });
//     }

//     // Création du compte
//     const newAccount = new Account({
//       user,
//       type,
//       // accountNumber sera généré automatiquement par le pre("save")
//     });

//     await newAccount.save();

//     res.status(201).json({
//       message: "Compte créé avec succès !",
//       account: newAccount
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // Liste des comptes
// exports.getAllAccounts = async (req, res) => {
//     try {
//         const accounts = await Account.find().populate("user");
//         res.json(accounts);

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// //   Détails d’un compte par ID
// exports.getAccountById = async (req, res) => {
//     try {
//         const account = await Account.findById(req.params.id).populate("user");

//         if (!account) {
//             return res.status(404).json({ message: "Compte introuvable" });
//         }

//         res.json(account);

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// //  UPDATE – Modification d’un compte
// exports.updateAccount = async (req, res) => {
//     try {
//         const updatedAccount = await Account.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true }
//         );

//         if (!updatedAccount) {
//             return res.status(404).json({ message: "Compte introuvable" });
//         }

//         res.json({
//             message: "Compte mis à jour",
//             account: updatedAccount
//         });

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// //  DELETE – Suppression d’un compte
// exports.deleteAccount = async (req, res) => {
//     try {
//         const deletedAccount = await Account.findByIdAndDelete(req.params.id);

//         if (!deletedAccount) {
//             return res.status(404).json({ message: "Compte introuvable" });
//         }

//         res.json({ message: "Compte supprimé avec succès" });

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

//avec authentification

// controllers/accountController.js
const mongoose = require("mongoose");
const Account = require("../models/Account");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// ---------- Créer un compte ----------
exports.createAccount = async (req, res) => {
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

    // Empêcher plusieurs comptes du même type
    const duplicate = await Account.findOne({ user: userId, type });
    if (duplicate) {
      return res.status(400).json({
        message: `Vous possédez déjà un compte de type : ${type}.`
      });
    }

    const newAccount = new Account({ user: userId, type });
    await newAccount.save();

    // Envoi email (mock ou réel)
    if (process.env.NODE_ENV !== "test") {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
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
        `
      });
    }

    res.status(201).json({
      message: "Compte créé avec succès.",
      account: newAccount
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ---------- GET comptes du user ----------
exports.getAccounts = async (req, res) => {
  try {
    const userId = req.user.id;
    const accounts = await Account.find({ user: userId });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- GET compte par ID ----------
exports.getAccountById = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ message: "Compte introuvable." });
    }

    // Vérifier que l'utilisateur est propriétaire
    if (account.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Accès refusé." });
    }

    res.json(account);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- UPDATE compte ----------
exports.updateAccount = async (req, res) => {
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

    res.json({ message: "Compte mis à jour.", account });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- DELETE compte ----------
exports.deleteAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ message: "Compte introuvable." });
    }

    if (account.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Accès refusé." });
    }

    await account.remove();
    res.json({ message: "Compte supprimé avec succès." });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

