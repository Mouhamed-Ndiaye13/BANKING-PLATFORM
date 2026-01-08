import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    prenom: {
      type: String,
      required: true,
      trim: true,
    },

    dateDeNaissance: {
      type: Date,
      required: true,
    },

    telephone: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
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
      unique: true,
      sparse: true,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    emailToken: {
      type: String,
      default: null,
    },

    emailTokenExpires: {
      type: Date,
      default: null,
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
  const googleId = profile.sub || profile.id;
  if (!googleId) throw new Error("Google profile invalide");

  let user = await this.findOne({ googleId });
  if (user) return user;

  const email = profile.email || null;
  const prenom = profile.given_name || "Google";
  const name = profile.family_name || "Utilisateur";

  if (email) {
    user = await this.findOne({ email });
    if (user) {
      user.googleId = googleId;
      user.isVerified = true;
      await user.save();
      return user;
    }
  }

  return this.create({
    name,
    prenom,
    email,
    googleId,
    password: null,
    telephone: null,
    avatar: profile.picture || null,
    isVerified: true,
  });
};

export default mongoose.model("User", UserSchema);
