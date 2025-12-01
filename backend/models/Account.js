
const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["courant", "epargne", "business"],
        required: true
    },
    accountNumber: {
        type: String,
        unique: true,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

// Générer un numéro de compte unique automatiquement
accountSchema.pre("save", async function(next) {
    if (!this.accountNumber) {
        this.accountNumber = "ACC-" + Math.floor(100000000 + Math.random() * 900000000);
    }
    next();
});

module.exports = mongoose.model("Account", accountSchema);
