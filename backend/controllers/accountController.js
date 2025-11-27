const Account = require("../models/Account");

// CREATE
exports.createAccount = async (req, res) => {
    try {
        const account = await Account.create(req.body);
        res.status(201).json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL
exports.getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.find();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ONE
exports.getAccountById = async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);
        if (!account) return res.status(404).json({ error: "Account not found" });
        res.json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE
exports.updateAccount = async (req, res) => {
    try {
        const account = await Account.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE
exports.deleteAccount = async (req, res) => {
    try {
        await Account.findByIdAndDelete(req.params.id);
        res.json({ message: "Account deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
