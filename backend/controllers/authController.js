import User from "../models/User.js";
import Account from "../models/Account.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";            
import { sendEmail } from "../utils/sendEmail.js"; // SendGrid
import { generateToken } from "../utils/generateToken.js";

// ------------------- REGISTER -------------------
// ---------------- REGISTER ----------------
export const register = async (req, res) => {
  try {
    const {
      prenom,
      name,
      telephone,
      password,
      dateDeNaissance,
    } = req.body;

    // 1️⃣ Vérification champs obligatoires
    if (!prenom || !name || !telephone || !password || !dateDeNaissance) {
      return res.status(400).json({ message: "Champs obligatoires manquants" });
    }

    // 2️⃣ Normalisation téléphone (Sénégal)
    const phoneNumber = parsePhoneNumberFromString(telephone, "SN");

    if (!phoneNumber || !phoneNumber.isValid()) {
      return res.status(400).json({ message: "Téléphone invalide" });
    }

    const phoneFormatted = phoneNumber.number; // +221763243938

    // 3️⃣ Vérifier si utilisateur existe
    const userExist = await User.findOne({ telephone: phoneFormatted });
    if (userExist) {
      return res.status(409).json({ message: "Numéro déjà utilisé" });
    }

    // 4️⃣ Hash mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Création utilisateur
    const user = await User.create({
      prenom,
      name,
      telephone: phoneFormatted,
      password: hashedPassword,
      dateDeNaissance: new Date(req.body.dateDeNaissance) // force le format
    });

    // 6️⃣ Création compte bancaire
    await Account.create({
      user: user._id,
      balance: 0,
      currency: "XOF",
    });

    // 7️⃣ Réponse OK
    res.status(201).json({
      message: "Inscription réussie",
      token: generateToken(user._id),
      user: {
        id: user._id,
        prenom: user.prenom,
        name: user.name,
        telephone: user.telephone,
      },
    });

  } catch (error) {
    console.error("REGISTER ERROR :", error);
    res.status(500).json({ message: "Erreur serveur" });
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
