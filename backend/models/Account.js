const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // même si auth n'est pas encore prêt
        required: true
    },
    type: {
        type: String,
        enum: ["courant", "epargne", "business"],
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

module.exports = mongoose.model("Account", accountSchema);
