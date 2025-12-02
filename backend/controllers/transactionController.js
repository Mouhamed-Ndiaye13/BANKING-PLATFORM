const Transaction = require("../models/Transaction");
const Account = require("../models/Account");

/* ----------------------------------------------------
   GET : Liste des transactions + filtres
---------------------------------------------------- */
exports.getTransactions = async (req, res) => {
    try {
        const { type, minAmount, maxAmount, startDate, endDate } = req.query;

        let filters = {};

        if (type) filters.type = type;
        if (minAmount) filters.amount = { ...filters.amount, $gte: Number(minAmount) };
        if (maxAmount) filters.amount = { ...filters.amount, $lte: Number(maxAmount) };
        if (startDate) filters.date = { ...filters.date, $gte: new Date(startDate) };
        if (endDate) filters.date = { ...filters.date, $lte: new Date(endDate) };

        const transactions = await Transaction.find(filters)
            .populate("sourceAccount")
            .populate("destinationAccount")
            .sort({ createdAt: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* ----------------------------------------------------
   GET : Une transaction par ID
---------------------------------------------------- */
exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
            .populate("sourceAccount")
            .populate("destinationAccount");

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* ----------------------------------------------------
   GET : Statistiques : revenus / dépenses
---------------------------------------------------- */
exports.getStats = async (req, res) => {
    try {
        const revenue = await Transaction.aggregate([
            { $match: { type: "revenue" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const depense = await Transaction.aggregate([
            { $match: { type: "depense" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        res.json({
            revenue: revenue[0]?.total || 0,
            depense: depense[0]?.total || 0,
            balance: (revenue[0]?.total || 0) - (depense[0]?.total || 0)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* ----------------------------------------------------
   POST : Transfert interne
---------------------------------------------------- */
exports.internalTransfer = async (req, res) => {
    try {
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

        if (source.balance < amt) {
            return res.status(400).json({ message: "Solde insuffisant" });
        }

        // Mise à jour des soldes
        source.balance -= amt;
        dest.balance += amt;

        await source.save();
        await dest.save();

        // Création transaction
        const transaction = await Transaction.create({
            type: "internal_transfer",
            amount: amt,
            sourceAccount,
            destinationAccount,
            description: "Transfert interne"
        });

        res.json({ message: "Transfert interne réussi", transaction });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* ----------------------------------------------------
   POST : Transfert externe
---------------------------------------------------- */
exports.externalTransfer = async (req, res) => {
    try {
        const { sourceAccount, beneficiaryIban, amount } = req.body;

        const amt = Number(amount);

        const source = await Account.findById(sourceAccount);

        if (!source) {
            return res.status(404).json({ message: "Compte introuvable" });
        }

        if (source.balance < amt) {
            return res.status(400).json({ message: "Solde insuffisant" });
        }

        // Débit du compte source
        source.balance -= amt;
        await source.save();

        // Création transaction externe
        const transaction = await Transaction.create({
            type: "external_transfer",
            amount: amt,
            sourceAccount,
            description: `Virement externe vers ${beneficiaryIban}`
        });

        res.json({ message: "Virement externe effectué", transaction });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
