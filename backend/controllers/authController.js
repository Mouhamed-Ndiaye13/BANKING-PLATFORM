import User from "../models/User.js";
import Account from "../models/Account.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";            
import nodemailer from "nodemailer";
import { generateEmailOTP } from "../utils/otp.js";
import { generateToken } from "../utils/generateToken.js";
import { transporter } from "../utils/mailer.js";
// ------------------- REGISTER -------------------
export const register = async (req, res) => {
  try {
    const { prenom, name, email, password, telephone, dateDeNaissance} = req.body;

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
     //  GÉNÉRATION DU TOKEN EMAIL (OBLIGATOIRE)
    const emailToken = crypto.randomBytes(32).toString("hex");
    // Création utilisateur
    const user = await User.create({
      prenom,
      name,
      email,
      telephone,
      dateDeNaissance,
      password: hashedPassword,
      role: "user",
      emailToken,
      emailTokenExpires: Date.now() + 1000 * 60 * 60, // 1h
      isEmailVerified: false,
       twoFactorEnabled: true
    });

    //  Création AUTOMATIQUE des 3 comptes
    const accounts = await Account.insertMany([
      {
        userId: user._id,
        type: "courant",
        name: "Compte courant",
        balance: 0
      },
      {
        userId: user._id,
        type: "epargne",
        name: "Compte épargne",
        balance: 0
      },
      {
        userId: user._id,
        type: "business",
        name: "Compte business",
        balance: 0
      }
    ]);

        // Envoi email de confirmation
    const verifyURL = `http://localhost:5173/verify-email/${emailToken}`;

    await transporter.sendMail({
      to: email,
      subject: "Confirmation de votre compte",
      html: `
        <h3>Bienvenue ${name}</h3>
        <p>Cliquez sur le lien ci-dessous pour activer votre compte :</p>
        <a href="${verifyURL}">${verifyURL}</a>
        <p>Ce lien expire dans 1 heure</p>
      `
    });
    res.status(201).json({
      message: "Compte créé. Vérifiez votre email."
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ---------- CREATE nouveau compte ----------
export const createAccount = async (req, res) => {
  return res.status(403).json({
    message: "Les comptes sont créés automatiquement à l’inscription."
  });
};
/* ================= CONFIRM EMAIL ================= */
export const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailToken: token,
      emailTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Lien invalide ou expiré" });
    }

    user.isEmailVerified = true;
    user.emailToken = null;
    user.emailTokenExpires = null;

    await user.save();

    res.json({ message: "Compte activé avec succès" });

  } catch (error) {
    console.error("CONFIRM EMAIL ERROR:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ------------------- LOGIN -------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Identifiants invalides" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Identifiants invalides" });

    // 2FA par email
    if (user.twoFactorEnabled) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      user.email2FACode = await bcrypt.hash(code, 10);
      user.email2FAExpires = Date.now() + 5 * 60 * 1000;
      user.email2FATries = 0;

      await user.save();

      await transporter.sendMail({
        to: user.email,
        subject: "Code de sécurité",
        html: `
          <h3>Code de connexion</h3>
          <h1>${code}</h1>
          <p>Expire dans 5 minutes</p>
        `,
      });

      return res.json({
        twoFactorRequired: true,
        userId: user._id,
      });
    }

    const token = generateToken(user._id);
    res.json({ token });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ------------------- VERIFY EMAIL 2FA -------------------
export const verifyEmail2FA = async (req, res) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code)
      return res.status(400).json({ message: "Code et userId requis" });

    const user = await User.findById(userId);
    if (!user || !user.email2FACode)
      return res.status(400).json({ message: "Code invalide" });

    // Vérifie l'expiration
    if (user.email2FAExpires < Date.now()) {
      user.email2FACode = null;
      user.email2FAExpires = null;
      await user.save();
      return res.status(401).json({ message: "Code expiré" });
    }

    // Vérifie le code
    const isValid = await bcrypt.compare(code, user.email2FACode);
    if (!isValid) {
      return res.status(401).json({ message: "Code incorrect" });
    }

    // Succès : réinitialise le code
    user.email2FACode = null;
    user.email2FAExpires = null;
    await user.save();

    // Génère le token JWT
    const token = generateToken(user._id);
    res.json({
      message: "2FA vérifié avec succès",
      token
    });

  } catch (error) {
    console.error("VERIFY 2FA ERROR:", error);
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

