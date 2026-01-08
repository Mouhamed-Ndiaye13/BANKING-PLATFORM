import User from "../models/User.js";
import Account from "../models/Account.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";            
import { sendEmail } from "../utils/sendEmail.js"; // SendGrid
import { generateToken } from "../utils/generateToken.js";

// ------------------- REGISTER -------------------
// ------------------- REGISTER -------------------
export const register = async (req, res) => {
  console.time("register");
  try {
    const { prenom, name, email, password, telephone, dateDeNaissance } = req.body;

    if (!prenom || !name || !email || !password || !telephone || !dateDeNaissance) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // ✅ Téléphone simple (on enlève juste les espaces)
    const cleanPhone = telephone.replace(/\s+/g, "");

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailToken = crypto.randomBytes(32).toString("hex");
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      prenom,
      name,
      email,
      password: hashedPassword,
      telephone: cleanPhone,
      dateDeNaissance,
      role: "user",
      emailToken,
      emailTokenExpires: Date.now() + 1000 * 60 * 60, // 1h
      email2FACode: await bcrypt.hash(otpCode, 10),
      email2FAExpires: Date.now() + 1000 * 60 * 15, // 15 min
      isVerified: false,
      twoFactorEnabled: true,
    });

    // Création automatique des comptes
    await Account.insertMany([
      { userId: user._id, type: "courant", name: "Compte courant", balance: 0 },
      { userId: user._id, type: "epargne", name: "Compte épargne", balance: 0 },
      { userId: user._id, type: "business", name: "Compte business", balance: 0 },
    ]);

    const verifyURL = `${process.env.FRONTEND_URLS.split(",")[1]}/verify-email/${emailToken}`;

    await sendEmail({
      to: email,
      subject: "Confirmation de votre compte",
      html: `
        <h3>Bienvenue ${name} !</h3>
        <p>Votre code de validation : <b>${otpCode}</b></p>
        <p>Ou cliquez sur le lien ci-dessous :</p>
        <a href="${verifyURL}">${verifyURL}</a>
        <p>Le code expire dans 15 minutes.</p>
      `,
    });

    console.timeEnd("register");
    return res.status(201).json({
      message: "Compte créé avec succès. Vérifiez votre email.",
      userId: user._id,
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    console.timeEnd("register");
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// ------------------- CONFIRM EMAIL -------------------
export const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      emailToken: token,
      emailTokenExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ message: "Lien invalide ou expiré" });

    user.isVerified = true;
    user.emailToken = null;
    user.emailTokenExpires = null;
    await user.save();

    res.json({ message: "Compte activé avec succès" });
  } catch (err) {
    console.error("CONFIRM EMAIL ERROR:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ------------------- LOGIN -------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email et mot de passe requis" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Identifiants invalides" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Identifiants invalides" });

    const token = generateToken(user._id);
    return res.json({ token, userId: user._id });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// ------------------- VERIFY EMAIL 2FA -------------------
export const verifyEmail2FA = async (req, res) => {
  try {
    const { userId, code } = req.body;
    if (!userId || !code) return res.status(400).json({ message: "Code et userId requis" });

    const user = await User.findById(userId);
    if (!user || !user.email2FACode) return res.status(400).json({ message: "Code invalide" });

    if (user.email2FAExpires < Date.now()) {
      user.email2FACode = null;
      user.email2FAExpires = null;
      await user.save();
      return res.status(401).json({ message: "Code expiré" });
    }

    const isValid = await bcrypt.compare(code, user.email2FACode);
    if (!isValid) return res.status(401).json({ message: "Code incorrect" });

    user.email2FACode = null;
    user.email2FAExpires = null;
    await user.save();

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
  } catch (err) {
    console.error("VERIFY 2FA ERROR:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ------------------- TOGGLE 2FA -------------------
export const toggleTwoFA = async (req, res) => {
  try {
    const userId = req.user.id; // défini via authMiddleware
    const { twoFA } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    user.twoFactorEnabled = twoFA;
    await user.save();

    res.json({ twoFA: user.twoFactorEnabled });
  } catch (err) {
    console.error("TOGGLE 2FA ERROR:", err);
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

    const token = crypto.randomBytes(20).toString("hex");
    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 3600000; // 1h
    await user.save();

    const resetURL = `${process.env.FRONTEND_URLS.split(",")[1]}/reset-password/${token}`;

    await sendEmail({
      to: email,
      subject: "Réinitialisation du mot de passe",
      html: `
        <p>Vous avez demandé une réinitialisation de mot de passe.</p>
        <p>Cliquez ici : <a href="${resetURL}">${resetURL}</a></p>
        <p>Ce lien expire dans 1 heure.</p>
      `,
    });

    res.json({ message: "Email de réinitialisation envoyé !" });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
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
    if (!user) return res.status(400).json({ message: "Lien invalide ou expiré" });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpire = null;
    await user.save();

    const jwtToken = generateToken(user._id);

    res.json({
      message: "Mot de passe réinitialisé avec succès !",
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
