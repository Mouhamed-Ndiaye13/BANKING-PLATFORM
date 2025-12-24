import mongoose from "mongoose";

const beneficiaireSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

   

    nom: {
      type: String,
      required: true,
    },

    //  LOGIQUE UNIQUE
    type: {
      type: String,
      enum: ["external_transfer", "service_payment"],
      required: true,
    },

    //  TRANSFERT EXTERNE
    iban: String,

    //  PAIEMENT SERVICE
    service: {
      type: String,
      enum: ["mobile", "internet", "eau", "electricite"],
    },
    reference: String,
  },
  { timestamps: true }
);

export default mongoose.model("Beneficiaire", beneficiaireSchema);
