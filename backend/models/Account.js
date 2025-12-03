
// const mongoose = require("mongoose");

// const accountSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true
//     },
//     type: {
//         type: String,
//         enum: ["courant", "epargne", "business"],
//         required: true
//     },
   
//     accountNumber: {
//         type: String,
//         unique: true,
//         required: true
//     },
//     balance: {
//         type: Number,
//         default: 0
//     },
// }, { timestamps: true });

// // Générer un numéro de compte unique automatiquement
// accountSchema.pre("save", async function(next) {
//     if (!this.accountNumber) {
//         this.accountNumber = "ACC-" + Math.floor(100000000 + Math.random() * 900000000);
//     }
//     next();
// });

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
