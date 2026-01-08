import mongoose from "mongoose";

function generateAccountNumber() {
  let number = "";
  for (let i = 0; i < 16; i++) {
    number += Math.floor(Math.random() * 10);
  }
  return number;
}

const AccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["courant", "epargne", "business"],
      default: "courant",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    accountNumber: {
      type: String,
      unique: true,
      minlength: 16,
      maxlength: 16,
    },

    currency: {
      type: String,
      default: "FCFA",
    },

    balance: {
      type: Number,
      default: 0,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 🔁 Génération automatique du numéro
AccountSchema.pre("validate", async function (next) {
  if (!this.accountNumber) {
    let number;
    let exists = true;

    while (exists) {
      number = generateAccountNumber();
      exists = await mongoose.models.Account.findOne({
        accountNumber: number,
      });
    }

    this.accountNumber = number;
  }
  next();
});

export default mongoose.model("Account", AccountSchema);
