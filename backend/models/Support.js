const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['ouvert', 'fermé'], default: 'ouvert' }
}, { timestamps: true });

module.exports = mongoose.model('Support', supportSchema);
