import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

import User from "./models/User.js";

// Import des routes de ton collègue
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import transferRoutes from "./routes/transferRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// -----------------------------------------
// Routes principales du projet
// -----------------------------------------
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/dashboard", dashboardRoutes);



// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connecté avec succès "))
.catch((err) => console.error("Erreur MongoDB :", err));


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
    console.log(" ERREUR REGISTER :", err);
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
    console.log(" ERREUR LOGIN :", err);
    res.status(500).json({ message: err.message });
  }
});


// -----------------------------------------
// FORGOT PASSWORD (ENVOI EMAIL)
// -----------------------------------------
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email requis" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    // Génération token
    const token = crypto.randomBytes(20).toString("hex");
    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 3600000;
    await user.save();

    // CONFIG MAIL
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mouhandiayeuh13@gmail.com",
        pass: "xbyd sjdg xvtf itfa"
      }
    });

    const resetURL = `http://localhost:5173/reset-password/${token}`;

    await transporter.sendMail({
      from: "BANQUE PLATFORM <mouhandiayeuh13@gmail.com>",
      to: email,
      subject: "Réinitialisation du mot de passe",
      html: `
        <p>Bonjour,</p>
        <p>Cliquez ici pour réinitialiser votre mot de passe :</p>
        <a href="${resetURL}">${resetURL}</a>
        <p>Ce lien expire dans 1 heure.</p>
      `
    });

    res.json({ message: "Email envoyé !" });

  } catch (err) {
    console.log(" ERREUR FORGOT PASSWORD :", err);
    res.status(500).json({ message: err.message });
  }
});


// -----------------------------------------
// RESET PASSWORD
// -----------------------------------------
app.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token et nouveau mot de passe requis" });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Lien invalide ou expiré" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpire = null;

    await user.save();

    res.json({ message: "Mot de passe réinitialisé avec succès !" });

  } catch (err) {
    console.log(" ERREUR RESET PASSWORD :", err);
    res.status(500).json({ message: err.message });
  }
});


// -----------------------------------------
// GET USERS
// -----------------------------------------
app.get("/users", async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});


// -----------------------------------------
// START SERVER
// -----------------------------------------
app.listen(5000, () => console.log("Backend running on port 5000 ✔"));
