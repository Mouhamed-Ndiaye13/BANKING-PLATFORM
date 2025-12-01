const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
//Liste de toutes les transactions + filtres
exports.getTransactions = async (req, res) => {
    try {
        const { type, minAmount, maxAmount, startDate, endDate } = req.query;

        let filters = {};

        if (type) filters.type = type;
        if (minAmount) filters.amount = { ...filters.amount, $gte: minAmount };
        if (maxAmount) filters.amount = { ...filters.amount, $lte: maxAmount };
        if (startDate) filters.date = { ...filters.date, $gte: new Date(startDate) };
        if (endDate) filters.date = { ...filters.date, $lte: new Date(endDate) };

        const transactions = await Transaction.find(filters)
            .populate("sourceAccount")
            .populate("destinationAccount")
            .sort({ date: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//Détails d'une transaction
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

//Statistiques revenus/dépenses Pour l'affichage du dashboard.
exports.getStats = async (req, res) => {
    try {
        const revenue = await Transaction.aggregate([
            { $match: { type: "revenue" }},
            { $group: { _id: null, total: { $sum: "$amount" }}}
        ]);

        const depense = await Transaction.aggregate([
            { $match: { type: "depense" }},
            { $group: { _id: null, total: { $sum: "$amount" }}}
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



//Transfert interne
exports.internalTransfer = async (req, res) => {
    try {
        const { sourceAccount, destinationAccount, amount } = req.body;

        if (sourceAccount === destinationAccount) {
            return res.status(400).json({ message: "Les deux comptes doivent être différents" });
        }

        const source = await Account.findById(sourceAccount);
        const dest = await Account.findById(destinationAccount);

        if (!source || !dest) {
            return res.status(404).json({ message: "Compte introuvable" });
        }

        if (source.balance < amount) {
            return res.status(400).json({ message: "Solde insuffisant" });
        }

        // Update solde
        source.balance -= amount;
        dest.balance += amount;

        await source.save();
        await dest.save();

        // Create transaction
        const transaction = new Transaction({
            type: "interne_transfer",
            amount,
            sourceAccount,
            destinationAccount,
            description: "Transfert interne"
        });

        await transaction.save();

        res.json({ message: "Transfert interne réussi", transaction });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
//Transfert externe
exports.externalTransfer = async (req, res) => {
    try {
        const { sourceAccount, beneficiaryIban, amount } = req.body;

        const source = await Account.findById(sourceAccount);

        if (!source) {
            return res.status(404).json({ message: "Compte introuvable" });
        }

        if (source.balance < amount) {
            return res.status(400).json({ message: "Solde insuffisant" });
        }

        // Débit du compte source
        source.balance -= amount;
        await source.save();

        // Création transaction externe
        const transaction = new Transaction({
            type: "externe_transfer",
            amount,
            sourceAccount,
            description: `Virement externe vers ${beneficiaryIban}`
        });

        await transaction.save();

        res.json({ message: "Virement externe effectué", transaction });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
