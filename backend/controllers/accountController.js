const Account = require("../models/Account");

// Création d’un compte bancaire
exports.createAccount = async (req, res) => {
  try {
    const { user, type } = req.body;

    // Vérification des champs obligatoires
    if (!user || !type) {
      return res.status(400).json({ message: "Veuillez fournir l'utilisateur et le type de compte." });
    }

    // Vérifier que l'ID utilisateur est valide
    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ message: "ID utilisateur invalide." });
    }

    // Création du compte
    const newAccount = new Account({
      user,
      type,
      // accountNumber sera généré automatiquement par le pre("save")
    });

    await newAccount.save();

    res.status(201).json({
      message: "Compte créé avec succès !",
      account: newAccount
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Liste des comptes
exports.getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.find().populate("user");
        res.json(accounts);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//   Détails d’un compte par ID
exports.getAccountById = async (req, res) => {
    try {
        const account = await Account.findById(req.params.id).populate("user");

        if (!account) {
            return res.status(404).json({ message: "Compte introuvable" });
        }

        res.json(account);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//  UPDATE – Modification d’un compte
exports.updateAccount = async (req, res) => {
    try {
        const updatedAccount = await Account.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedAccount) {
            return res.status(404).json({ message: "Compte introuvable" });
        }

        res.json({
            message: "Compte mis à jour",
            account: updatedAccount
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//  DELETE – Suppression d’un compte
exports.deleteAccount = async (req, res) => {
    try {
        const deletedAccount = await Account.findByIdAndDelete(req.params.id);

        if (!deletedAccount) {
            return res.status(404).json({ message: "Compte introuvable" });
        }

        res.json({ message: "Compte supprimé avec succès" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
