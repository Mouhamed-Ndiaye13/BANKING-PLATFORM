
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// exports.register = async (req, res) => {
//   console.log(" Requête reçue pour /register :", req.body);  // <-- AJOUT OBLIGATOIRE
//   try {
//     const { name, email, password, role } = req.body;

//     if (!name || !email || !password) return res.status(400).json({ message: 'Tous les champs sont requis' });

//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: 'Utilisateur déjà existant' });

//     const hashed = await bcrypt.hash(password, 10);

//     const user = await User.create({ name, email, password: hashed, role: role || 'user' });
//     res.status(201).json(user);
//   } catch (err) {
//       console.error(" ERREUR REGISTER :", err); // <-- AJOUT OBLIGATOIRE

//     console.error(err);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

//     const valid = await bcrypt.compare(password, user.password);
//     if (!valid) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
//     res.json({ token, user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// };
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// ------------------- REGISTER -------------------
export const register = async (req, res) => {
  try {
    const { name, prenom, email, password, dateDeNaissance } = req.body;

    if (!name || !prenom || !email || !password || !dateDeNaissance)
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email déjà utilisé" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      prenom,
      email,
      password: hashed,
      dateDeNaissance,
    });

    res.status(201).json({
      message: "Inscription réussie",
      user: {
        id: newUser._id,
        name: newUser.name,
        prenom: newUser.prenom,
        email: newUser.email,
        dateDeNaissance: newUser.dateDeNaissance
      }
    });
  } catch (err) {
    console.log("ERREUR REGISTER :", err);
    res.status(500).json({ message: err.message });
  }
};

// ------------------- LOGIN -------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email incorrect" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "SECRET123",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        name: user.name,
        prenom: user.prenom,
        email: user.email,
        dateDeNaissance: user.dateDeNaissance
      }
    });
  } catch (err) {
    console.log("ERREUR LOGIN :", err);
    res.status(500).json({ message: err.message });
  }
};

// ------------------- FORGOT PASSWORD -------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email requis" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const token = crypto.randomBytes(20).toString("hex");
    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 3600000; // 1h
    await user.save();

    const resetURL = `http://localhost:5173/reset-password/${token}`;

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Réinitialisation du mot de passe",
      html: `<p>Cliquez ici pour réinitialiser votre mot de passe : <a href="${resetURL}">${resetURL}</a></p>`
    });

    res.json({ message: "Email envoyé !" });
  } catch (err) {
    console.log("ERREUR FORGOT PASSWORD :", err);
    res.status(500).json({ message: err.message });
  }
};

// ------------------- RESET PASSWORD -------------------
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) return res.status(400).json({ message: "Token et nouveau mot de passe requis" });

    const user = await User.findOne({ resetToken: token, resetTokenExpire: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: "Lien invalide ou expiré" });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpire = null;
    await user.save();

    res.json({ message: "Mot de passe réinitialisé avec succès !" });
  } catch (err) {
    console.log("ERREUR RESET PASSWORD :", err);
    res.status(500).json({ message: err.message });
  }
};
