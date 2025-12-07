
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telephone: { type: String, required: true },   
  dateDeNaissance: { type: Date, required: true }, 

  password: { type: String, required: true },

  resetToken: String,
  resetTokenExpire: Date,
});

export default mongoose.model("User", UserSchema);



