import mongoose from "mongoose";

const beneficiaireSchema = new mongoose.Schema({
  accountId: { type: String, required: true },
  nom: { type: String, required: true },
  type: { type: String, required: true },
});

export default mongoose.model("Beneficiaire", beneficiaireSchema);
