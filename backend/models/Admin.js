import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
}, { timestamps: true });

// Hash password avant sauvegarde
AdminSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Comparer mot de passe
AdminSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password, this.password);
}

export default mongoose.model("Admin", AdminSchema);
