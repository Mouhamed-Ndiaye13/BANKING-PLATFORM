import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telephone: { type: String, required: true },
    dateDeNaissance: { type: Date, required: true },
    password: { type: String, required: true },

    avatar: {
      type: String,
      default: null,
    },

    resetToken: { type: String },
    resetTokenExpire: { type: Date },
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (enteredPassword) {
  if (!enteredPassword || !this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// connexion avec google
UserSchema.statics.findOrCreateGoogleUser = async function (profile) {
  const email = profile.email || profile?.emails?.[0]?.value;
  if (!email) throw new Error("Google profile sans email");

  let user = await this.findOne({ email });
  if (user) return user;

  user = await this.create({
    name: profile.name || profile?.given_name || "Utilisateur Google",
    email,
    avatar: profile.picture || null,
    googleId: profile.sub || profile.id
  });

  return user;
};

export default mongoose.model("User", UserSchema);