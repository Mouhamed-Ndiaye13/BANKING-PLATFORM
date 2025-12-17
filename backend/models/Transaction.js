import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    sourceAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      index: true
    },

    destinationAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      index: true
    },

    type: {
      type: String,
      enum: ["depot", "retrait", "internal_transfer", "external_transfer"],
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 1
    },

    category: String,

    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card"
    },

    merchant: String,

    label: String,

    cancelled: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "completed"
    }
  },
  { timestamps: true }
);

// 🔍 Indexes pour performance
TransactionSchema.index({ user: 1, createdAt: -1 });

// Export
const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
