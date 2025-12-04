
// module.exports = mongoose.model("Account", accountSchema);


const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Types de comptes 
    type: {
        type: String,
        enum: ["courant", "epargne", "business"],
        required: true
    },

    // Nom affiché dans le dashboard
    name: {
        type: String,
        required: true
    },

    // IBAN pour virements externes
    iban: {
        type: String,
        unique: true
    },

    currency: {
        type: String,
        default: "Fcfa"
    },

    balance: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

// Génération automatique IBAN
AccountSchema.pre("save", function(next) {
    if (!this.iban) {
        this.iban = "IBAN-" + Math.floor(1000000000000000 + Math.random() * 9000000000000000);
    }
    next();
});

module.exports = mongoose.model("Account", AccountSchema);
