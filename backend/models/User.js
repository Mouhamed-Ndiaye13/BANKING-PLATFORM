import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    prenom: { type: String, required: true },

    telephone: {
      type: String,
      unique: true,
      sparse: true, // autorise null pour Google
    },

    email: {
      type: String,
      unique: true,
      sparse: true, // Google fournit l’email
    },

    password: {
      type: String,
      default: null, // Google = pas de mot de passe
    },

    avatar: {
      type: String,
      default: null,
    },

    googleId: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },

    blocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ===================
// Hash password
// ===================
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ===================
// Compare password
// ===================
UserSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

// ===================
// Google OAuth helper
// ===================
UserSchema.statics.findOrCreateGoogleUser = async function (profile) {
  // Google fournit toujours un ID
  const googleId = profile.sub || profile.id;

  if (!googleId) {
    throw new Error("Google profile invalide");
  }

  // 1️⃣ Recherche par googleId
  let user = await this.findOne({ googleId });
  if (user) return user;

  // 2️⃣ Récupérer infos Google
  const email = profile.email || profile?.emails?.[0]?.value || null;
  const prenom = profile.given_name || profile.name?.givenName || "Google";
  const name =
    profile.family_name ||
    profile.name?.familyName ||
    "Utilisateur";

  // 3️⃣ Recherche par email (si existe)
  if (email) {
    user = await this.findOne({ email });
    if (user) {
      user.googleId = googleId;
      await user.save();
      return user;
    }
  }

  // 4️⃣ Création utilisateur Google
  return this.create({
    name,
    prenom,
    email,
    googleId,
    password: null,
    telephone: null,
    avatar: profile.picture || null,
    isEmailConfirmed: true, // Google = déjà validé
  });
};


export default mongoose.model("User", UserSchema);
