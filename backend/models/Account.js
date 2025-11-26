const mongoose = require("mongoose");

// Création du schéma d'un compte
const AccountSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, // Référence à un utilisateur (optionnel)
    ref: "User",
    required: false
  },
  type: { 
    type: String,
    enum: ["courant", "épargne", "business"], // Seules ces valeurs sont acceptées
    required: true
  },
  balance: { 
    type: Number,
    default: 0 // Solde initial par défaut = 0
  }
}, { timestamps: true }); // Ajoute createdAt et updatedAt automatiquement

module.exports = mongoose.model("Account", AccountSchema);
