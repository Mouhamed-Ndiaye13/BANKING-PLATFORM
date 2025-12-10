import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true
  },
  brand: {
    type: String,
    default: "Mastercard"
  },
  cardToken: {
    type: String,
    required: true,
    unique: true
  },
  dernierCard: {
    type: String,
    required: true
  },
  expiration: {
    type: String, 
    required: true
  },
  status: {
    type: String,
    enum: ["inactive", "active", "blocked"],
    default: "inactive"
  },
  pinSet: {
    type: Boolean,
    default: false
  },
   pinHash:
    { type: String },
  limitQuoti: {
    type: Number,
    default: 500000 
  },
 }, { timestamps: true });

export default mongoose.model("Card", CardSchema);
