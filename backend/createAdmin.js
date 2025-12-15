import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const createAdmin = async () => {
  const admin = new Admin({
    email: "mouhandiayeuh13@gmail.com",
    password: "Fessel2025" // mot de passe initial
  });
  await admin.save();
  console.log("Admin créé !");
  mongoose.disconnect();
};

createAdmin();
