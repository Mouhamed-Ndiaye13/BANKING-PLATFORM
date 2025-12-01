const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["revenue", "depense", "interne_transfer", "externe_transfer"],
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },

    description: {
        type: String,
        default: ""
    },

    sourceAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: function () {
            return this.type === "interne_transfer" || this.type === "externe_transfer" || this.type === "depense";
        }
    },

    destinationAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: function () {
            return this.type === "interne_transfer" || this.type === "revenue";
        }
    }
});

module.exports = mongoose.model("Transaction", transactionSchema);
