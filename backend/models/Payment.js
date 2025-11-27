const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  senderAccount: { type: String, required: true },
  receiverAccount: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "success" },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", PaymentSchema);
