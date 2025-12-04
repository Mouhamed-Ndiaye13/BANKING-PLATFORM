
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },         
  prenom: { type: String, required: true },      
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateDeNaissance: { type: Date, required: true }, 
  resetToken: String,
  resetTokenExpire: Date,
}, { timestamps: true }); 

export default mongoose.model("User", UserSchema);


