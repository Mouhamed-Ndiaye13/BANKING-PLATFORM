
// models/Support.js
import mongoose from 'mongoose';

const supportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['ouvert', 'fermé'], default: 'ouvert' }
}, { timestamps: true });

// Export par défaut pour pouvoir l'importer avec `import Support from ...`
const Support = mongoose.model('Support', supportSchema);
export default Support;
