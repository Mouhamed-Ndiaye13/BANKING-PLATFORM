import User from "../models/User.js";
import Account from "../models/Account.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";            
import nodemailer from "nodemailer";
import { generateEmailOTP } from "../utils/otp.js";
import { generateToken } from "../utils/generateToken.js";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { transporter } from "../utils/mailer.js";

// ------------------- REGISTER -------------------
export const register = async (req, res) => {
  console.time("register");

  try {
    const { prenom, name, email, password, telephone, dateDeNaissance } = req.body;

    // Vérifier que tous les champs sont fournis
    if (!prenom || !name || !email || !password || !telephone || !dateDeNaissance) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    // Vérification si l'email existe déjà
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Validation du numéro de téléphone
    const phoneNumber = parsePhoneNumberFromString(telephone);
    if (!phoneNumber || !phoneNumber.isValid()) {
      return res.status(400).json({ message: "Téléphone invalide ou incorrect." });
    }
    const formattedPhone = phoneNumber.number; // format E.164 (+221...)

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Génération du token email
    const emailToken = crypto.randomBytes(32).toString("hex");

    // Génération du code OTP pour validation par email (6 chiffres)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Création de l'utilisateur
    const user = await User.create({
      prenom,
      name,
      email,
      password: hashedPassword,
      telephone: formattedPhone,
      dateDeNaissance,
      role: "user",
      emailToken,
      emailTokenExpires: Date.now() + 1000 * 60 * 60, // 1h
      email2FACode: await bcrypt.hash(otpCode, 10),
      email2FAExpires: Date.now() + 1000 * 60 * 15, // 15 min
      isVerified: false,
      twoFactorEnabled: true,
    });

    // Création automatique des 3 comptes
    await Account.insertMany([
      { userId: user._id, type: "courant", name: "Compte courant", balance: 0 },
      { userId: user._id, type: "epargne", name: "Compte épargne", balance: 0 },
      { userId: user._id, type: "business", name: "Compte business", balance: 0 },
    ]);

    // Envoi email de confirmation avec OTP
    const verifyURL = `${process.env.FRONTEND_URLS.split(",")[1]}/verify-email/${emailToken}`;

    await sendEmail({
      to: email,
      subject: "Confirmation de votre compte",
      html: `
        <h3>Bienvenue ${name} !</h3>
        <p>Votre code de validation : <b>${otpCode}</b></p>
        <p>Ou cliquez sur le lien ci-dessous pour activer votre compte :</p>
        <a href="${verifyURL}">${verifyURL}</a>
        <p>Le code expire dans 15 minutes et le lien dans 1 heure.</p>
      `,
    });

    console.timeEnd("register");
    return res.status(201).json({
      message: "Compte créé avec succès. Vérifiez votre email pour le code de validation.",
      userId: user._id,
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    console.timeEnd("register");
    return res.status(500).json({ message: "Erreur serveur" });
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

    // Validation des champs
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    // Vérification de l'existence de l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Génération du token JWT
    const token = generateToken(user._id);

    // Réponse réussie
    return res.json({ token, userId: user._id });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Erreur serveur" });
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
      token,
      user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }
    });

  } catch (error) {
    console.error("VERIFY 2FA ERROR:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// activer/désactiver la 2FA  dans Profile
export const toggleTwoFA = async (req, res) => {
  try {
    const userId = req.user.id; // depuis authMiddleware
    const { twoFA } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    user.twoFA = twoFA;
    await user.save();

    res.json({ twoFA: user.twoFA });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
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

    const resetURL = `https://tache-21-frontt.vercel.app/reset-password/${token}`;

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

