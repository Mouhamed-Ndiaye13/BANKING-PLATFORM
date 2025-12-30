import mongoose from "mongoose";

const beneficiaireSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    nom: { type: String, required: true },
    type: { type: String, enum: ["external_transfer", "service_payment"], required: true },
    service: { type: String, enum: ["mobile", "internet", "eau", "electricite"] },
    reference: String,
    iban: String, 
  },
  { timestamps: true }
);

export default mongoose.model("Beneficiaire", beneficiaireSchema);
