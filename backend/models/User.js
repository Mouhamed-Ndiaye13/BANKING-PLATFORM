// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    // ===================
    // Infos utilisateur
    // ===================
    name: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telephone: { type: String, required: true },
    dateDeNaissance: { type: Date },

    password: { type: String }, // null pour Google OAuth
    avatar: { type: String, default: null },

    // ===================
    // Validation email (INSCRIPTION)
    // ===================
    isEmailConfirmed: {
      type: Boolean,
      default: false,
    },

    emailValidationCode: String,
    emailValidationExpires: Date,

    // ===================
    // Sécurité
    // ===================
    blocked: { type: Boolean, default: false },

    // ===================
    // Reset password
    // ===================
    resetToken: String,
    resetTokenExpire: Date,

    // ===================
    // Google OAuth
    // ===================
    googleId: { type: String, default: null },
  },
  { timestamps: true }
);

// ===================
// Hash du mot de passe
// ===================
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ===================
// Comparaison password
// ===================
UserSchema.methods.comparePassword = async function (enteredPassword) {
  if (!enteredPassword || !this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

// ===================
// Google OAuth helper
// ===================
UserSchema.statics.findOrCreateGoogleUser = async function (profile) {
  const email = profile.email || profile?.emails?.[0]?.value;
  if (!email) throw new Error("Google profile sans email");

  let user = await this.findOne({ email });
  if (user) return user;

  return this.create({
    name: profile.name || "Utilisateur Google",
    prenom: profile.given_name || "Google",
    email,
    avatar: profile.picture || null,
    googleId: profile.sub || profile.id,
    password: null,
    telephone: "N/A",
    isEmailConfirmed: true, // Google = email déjà validé
  });
};

export default mongoose.model("User", UserSchema);
