import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "./models/User.js";

const app = express();
app.use(cors());
app.use(express.json());

// -----------------------------------------
// MONGODB CONNECTION
// -----------------------------------------
mongoose
  .connect("mongodb+srv://mouhamedNdiaye:Fessel_2025@banking-platform.srkvxx7.mongodb.net/")
   .then(() => console.log("MongoDB Atlas connecté ✔"))
  .catch((err) => console.log("Erreur MongoDB ❌", err));


// -----------------------------------------
// REGISTER
// -----------------------------------------
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email déjà utilisé" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashed,
    });

    res.json({
      message: "Inscription réussie",
      user: { id: newUser._id, name, email },
    });

  } catch (err) {
  console.log("🔥 ERREUR REGISTER :", err);
  res.status(500).json({ message: err.message });
}

});


// -----------------------------------------
// LOGIN
// -----------------------------------------
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email incorrect" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: user._id },
      "SECRET123",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Connexion réussie",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
  console.log("🔥 ERREUR REGISTER :", err);
  res.status(500).json({ message: err.message });
}

});


// -----------------------------------------
// GET USERS (admin)
// -----------------------------------------
app.get("/users", async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});


// -----------------------------------------
// START SERVER
// -----------------------------------------
app.listen(5000, () => console.log("Backend running on port 5000 ✔"));
