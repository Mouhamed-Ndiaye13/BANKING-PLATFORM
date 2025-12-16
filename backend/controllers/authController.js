import User from "../models/User.js";
import Account from "../models/Account.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";            
import nodemailer from "nodemailer";

// ------------------- REGISTER -------------------
export const register = async (req, res) => {
  try {
    const { name, prenom, email, password, telephone, dateDeNaissance } = req.body;

    if (!name || !prenom || !email || !password || !telephone || !dateDeNaissance) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email déjà utilisé" });

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur avec mot de passe hashé
    const newUser = await User.create({
      name,
      prenom,
      email,
      password: hashedPassword,  // 
      telephone,
      dateDeNaissance
    });

    // Création automatique du compte courant
    const newAccount = await Account.create({
      userId: newUser._id,
      type: "courant",
      name: "Compte principal"
    });

    res.status(201).json({
      message: "Inscription réussie",
      user: {
        id: newUser._id,
        name: newUser.name,
        prenom: newUser.prenom,
        email: newUser.email,
        telephone: newUser.telephone,
        dateDeNaissance: newUser.dateDeNaissance
      },
      account: {
        id: newAccount._id,
        type: newAccount.type,
        name: newAccount.name,
        balance: newAccount.balance,
        accountNumber: newAccount.accountNumber
      }
    });

  } catch (err) {
    console.error("ERREUR REGISTER:", err);

    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    res.status(500).json({ message: err.message });
  }
};

// ------------------- LOGIN -------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email incorrect" });

    // Compare le mot de passe hashé
    const match = await user.comparePassword(password);
    if (!match)
      return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        email: user.email,
        prenom: user.prenom,
        name: user.name
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ------------------- FORGOT PASSWORD -------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email requis" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // Générer token sécurisé
    const token = crypto.randomBytes(20).toString("hex");

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 3600000; // 1h
    await user.save();

    const resetURL = `http://localhost:5173/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Réinitialisation du mot de passe",
      html: `
        <p>Vous avez demandé une réinitialisation de mot de passe.</p>
        <p>Cliquez ici : <a href="${resetURL}">${resetURL}</a></p>
        <p>Ce lien expire dans 1 heure.</p>
      `
    });

    res.json({ message: "Email envoyé !" });

  } catch (err) {
    console.log("ERREUR : MOT DE PASSE OUBLIÉ :", err);
    res.status(500).json({ message: err.message });
  }
};

// ------------------- RESET PASSWORD -------------------
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ message: "Lien invalide ou expiré" });

    // Nouveau mot de passe hashé
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpire = null;
    await user.save();

    res.json({ message: "Mot de passe réinitialisé !" });

  } catch (err) {
    console.log("ERREUR RÉINITIALISATION DU MOT DE PASSE :", err);
    res.status(500).json({ message: err.message });
  }
};

// ------------------- GENERATE TOKEN (optionnel) -------------------
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};
