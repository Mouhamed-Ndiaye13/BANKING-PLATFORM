import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telephone: { type: String, required: true },
  dateDeNaissance: { type: Date, required: true },
  password: { type: String, required: true },
  
  avatar: {
    type: String,
    default: "/uploads/default.png"
  },

  resetToken: { type: String },
  resetTokenExpire: { type: Date },
}, { timestamps: true });


// Hash du mot de passe avant sauvegarde
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});


// Comparer le mot de passe
UserSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", UserSchema);
