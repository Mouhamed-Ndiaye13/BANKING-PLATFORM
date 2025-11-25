const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  type: { type: String, enum: ['dépense', 'revenu'], required: true },
  amount: { type: Number, required: true },
  title: { type: String },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
