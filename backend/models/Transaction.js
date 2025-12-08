



// models/Transaction.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  label: { type: String, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  amount: { type: Number, required: true },
  category: { type: String },
  date: { type: Date, default: Date.now },
  notes: { type: String },
});

export default mongoose.model("Transaction", transactionSchema);

