import mongoose from "mongoose";

function generateAccountNumber() {
  return "AC" + Math.floor(1000000000 + Math.random() * 9000000000);
}

const AccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["courant","epargne","business"], default:"courant", required:true },
  name: { type: String, required:true },
  accountNumber: { type: String, unique:true, required:true },
  currency: { type:String, default:"FCFA" },
  balance: { type:Number, default:0 },
 
}, { timestamps:true });

// Génération automatique du numéro de compte
AccountSchema.pre("validate", async function(next){
  if(!this.accountNumber){
    let number, exists=true;
    while(exists){
      number = generateAccountNumber();
      exists = await mongoose.models.Account.findOne({ accountNumber:number });
    }
    this.accountNumber = number;
  }
  next();
  
});

<<<<<<< HEAD
=======


//  Export du modèle en ESM
>>>>>>> 698d0077a1545ad5acad5a4cf8e0c1d204456a88
const Account = mongoose.model("Account", AccountSchema);
export default Account;
