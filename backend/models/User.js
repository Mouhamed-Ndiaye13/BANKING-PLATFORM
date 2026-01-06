// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telephone: { type: String, required: true },
    dateDeNaissance: { type: Date },
    password: { type: String }, // peut être vide pour Google OAuth

    avatar: { type: String, default: null },

    isVerified: { type: Boolean, default: false },
    emailToken: String,
    emailTokenExpires: Date,

    twoFactorEnabled: { type: Boolean, default: true },
    email2FACode: String,
    email2FAExpires: Date,
    email2FATries: { type: Number, default: 0 },

    resetToken: String,
    resetTokenExpire: Date,

    blocked: { type: Boolean, default: false },

    googleId: { type: String, default: null }, // ✅ pour Google OAuth
  },
  { timestamps: true }
);

// Middleware : hash du mot de passe avant save
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Méthode pour comparer le mot de passe
UserSchema.methods.comparePassword = async function (enteredPassword) {
  if (!enteredPassword || !this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Méthode pour créer ou récupérer un utilisateur Google
UserSchema.statics.findOrCreateGoogleUser = async function (profile) {
  const email = profile.email || profile?.emails?.[0]?.value;
  if (!email) throw new Error("Google profile sans email");

  let user = await this.findOne({ email });
  if (user) return user;

  user = await this.create({
    name: profile.name || profile?.given_name || "Utilisateur Google",
    prenom: profile.given_name || "Google",
    email,
    avatar: profile.picture || null,
    googleId: profile.sub || profile.id,
    password: null, // aucun mot de passe pour Google
    telephone: "N/A",
  });

  return user;
};

export default mongoose.model("User", UserSchema);
