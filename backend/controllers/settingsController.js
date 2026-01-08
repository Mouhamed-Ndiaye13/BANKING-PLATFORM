import User from "../models/User.js";
import fs from "fs";
import path from "path";

/* ================= GET PROFILE ================= */
export const getProfile = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    const avatarUrl = user.avatar
      ? `${process.env.SERVER_URL}/${user.avatar.replace(/\\/g, "/")}`
      : null;

    res.json({
      prenom: user.prenom,
      name: user.name,
      email: user.email,
      telephone: user.telephone,
      avatar: avatarUrl,
    });
  } catch (err) {
    console.error("GET /me:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

/* ================= UPDATE AVATAR ================= */
export const updateAvatar = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier reçu" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    // Supprimer ancien avatar
    if (user.avatar) {
      const oldPath = path.join(process.cwd(), user.avatar);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const relativePath = `uploads/avatars/${req.file.filename}`;
    user.avatar = relativePath;
    await user.save();

    const avatarUrl = `${process.env.SERVER_URL}/${relativePath}`;

    res.json({
      message: "Avatar mis à jour",
      user: {
        _id: user._id,
        avatar: avatarUrl,
      },
    });
  } catch (err) {
    console.error("updateAvatar:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      message: "Profil mis à jour",
      user: updatedUser,
    });
  } catch (err) {
    console.error("updateProfile:", err);
    res.status(400).json({ error: err.message });
  }
};

/* ================= CHANGE PASSWORD ================= */
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Ancien mot de passe incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Mot de passe modifié avec succès" });
  } catch (err) {
    console.error("changePassword:", err);
    res.status(500).json({ error: err.message });
  }
};