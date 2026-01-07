
import User from "../models/User.js";
import Account from "../models/Account.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { transporter } from "../utils/mailer.js";
import { generateToken } from "../utils/generateToken.js";
import { parsePhoneNumberFromString } from "libphonenumber-js";

/* ===================== REGISTER ===================== */
export const register = async (req, res) => {
  try {
    const {
      prenom,
      name,
      email,
      password,
      telephone,
      dateDeNaissance,
    } = req.body;

    // 1️⃣ Validation basique
    if (!prenom || !name || !email || !password || !telephone) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }

    // 2️⃣ Validation téléphone (libphonenumber-js)
    const phoneNumber = parsePhoneNumberFromString(telephone);
    if (!phoneNumber || !phoneNumber.isValid()) {
      return res
        .status(400)
        .json({ message: "Téléphone invalide ou incorrect." });
    }

    const formattedPhone = phoneNumber.number; // E.164

    // 3️⃣ Vérifier email existant
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(409).json({ message: "Email déjà utilisé" });
    }

    // 4️⃣ Générer token email
    const emailToken = crypto.randomBytes(32).toString("hex");

    // 5️⃣ Création utilisateur (PAS de hash ici, fait dans le model)
    const user = await User.create({
      prenom,
      name,
      email,
      telephone: formattedPhone,
      dateDeNaissance: dateDeNaissance
        ? new Date(dateDeNaissance)
        : null,
      password,
      isEmailVerified: false,
      emailToken,
      emailTokenExpires: Date.now() + 1000 * 60 * 60, // 1h
      twoFactorEnabled: false,
    });

    // 6️⃣ Création automatique des comptes
    await Account.insertMany([
      { userId: user._id, type: "courant", name: "Compte courant", balance: 0 },
      { userId: user._id, type: "epargne", name: "Compte épargne", balance: 0 },
      { userId: user._id, type: "business", name: "Compte business", balance: 0 },
    ]);

    // 7️⃣ Envoi email de confirmation
    const verifyURL = `${process.env.FRONTEND_URL}/verify-email/${emailToken}`;

    await transporter.sendMail({
      to: email,
      subject: "Confirmation de votre compte",
      html: `
        <h3>Bienvenue ${prenom}</h3>
        <p>Merci de confirmer votre compte bancaire.</p>
        <a href="${verifyURL}">${verifyURL}</a>
        <p>Ce lien expire dans 1 heure.</p>
      `,
    });

    return res.status(201).json({
      message: "Compte créé. Vérifiez votre email pour l’activer.",
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ================= CONFIRM EMAIL ================= */
export const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailToken: token,
      emailTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Lien invalide ou expiré" });
    }

    user.isEmailVerified = true;
    user.emailToken = null;
    user.emailTokenExpires = null;
    await user.save();

    return res.json({ message: "Compte activé avec succès" });
  } catch (error) {
    console.error("CONFIRM EMAIL ERROR:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ===================== LOGIN ===================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Veuillez confirmer votre email avant de vous connecter",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const token = generateToken(user._id);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        prenom: user.prenom,
        email: user.email,
      },
    });
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

