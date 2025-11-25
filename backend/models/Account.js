const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['courant', 'épargne', 'business'], required: true },
  balance: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Account', accountSchema);
