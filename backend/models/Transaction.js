
// models/Transaction.js
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sourceAccount: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },        // Compte source
  destinationAccount: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },   // Compte destination
  type: {
    type: String,
    enum: ["depot", "retrait", "internal_transfer", "external_transfer"],
    required: true
  },
  amount: { type: Number, required: true },
  category: { type: String },
   cardId: { type: mongoose.Schema.Types.ObjectId, ref: "Card", required: true },
  merchant: { type: String },
  date: { type: Date, default: Date.now },
  label: { type: String }
}, { timestamps: true });

//  Export par défaut pour ESM
const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
