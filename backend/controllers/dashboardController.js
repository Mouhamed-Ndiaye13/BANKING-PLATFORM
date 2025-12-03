
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

exports.getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user.id;

        const accounts = await Account.find({ user: userId });
        const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

        const recentTransactions = await Transaction.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalBalance,
            accountsCount: accounts.length,
            recentTransactions
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
