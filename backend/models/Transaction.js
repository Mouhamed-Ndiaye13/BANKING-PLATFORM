// models/Transaction.js
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  sourceAccount: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  destinationAccount: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },

  type: {
    type: String,
    enum: ["depot", "retrait", "internal_transfer", "external_transfer"],
    required: true
  },

  direction: {                 
    type: String,
    enum: ["income", "expense"],
    required: true
  },

  amount: { type: Number, required: true },

  category: { type: String},

  beneficiaryIban: { type: String },

  cardId: { type: mongoose.Schema.Types.ObjectId, ref: "Card" },
  merchant: String,

  label: String,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);


export default Transaction;
