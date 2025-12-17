import User from "../models/User.js";
import fs from "fs";
import path from "path";
// Récupérer le profil complet
export const getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.log("Erreur : req.user.id manquant");
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      console.log("Utilisateur introuvable pour id :", req.user.id);
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    // Construction de l'URL complète de l'avatar
    const avatarUrl = user.avatar
      ? `${process.env.SERVER_URL || "http://localhost:5000"}/${user.avatar.replace(/\\/g, "/")}`
      : null;

    // On renvoie uniquement les infos nécessaires au frontend
    res.json({
      prenom: user.prenom,
      name: user.name,
      email: user.email,
     telephone: user.telephone,
      avatar: avatarUrl,
    });
  } catch (err) {
    console.error("Erreur GET /me:", err);
    res.status(500).json({ error: "Erreur serveur lors du chargement du profil" });
  }
};

// PUT /update-avatar
export const updateAvatar = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    // Vérifie si un fichier a été uploadé
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier reçu" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    // Supprime l'ancien avatar si existant
    if (user.avatar) {
      const oldPath = path.join(process.cwd(), user.avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Stocke le nouveau chemin relatif
    const relativePath = `uploads/avatars/${req.file.filename}`;
    user.avatar = relativePath;
    await user.save();

    // Construit l'URL complète pour le frontend
    const avatarUrl = `${process.env.SERVER_URL || "http://localhost:5000"}/${relativePath.replace(/\\/g, "/")}`;

    res.json({
      message: "Avatar mis à jour avec succès",
      avatar: avatarUrl,
    });

  } catch (err) {
    console.error("Erreur updateAvatar:", err);
    res.status(500).json({ error: "Erreur serveur lors de la mise à jour de l'avatar" });
  }
};
// Modifier le profil
export const updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ error: "Utilisateur non authentifié" });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      message: "Profil mis à jour",
      user: updatedUser
    });
  } catch (err) {
    console.error("Erreur updateProfile:", err);
    res.status(400).json({ error: err.message });
  }
};

// Modifier le mot de passe
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!req.user || !req.user.id) return res.status(401).json({ error: "Utilisateur non authentifié" });

    if (!oldPassword || !newPassword)
      return res.status(400).json({ error: "Ancien et nouveau mot de passe requis" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return res.status(400).json({ error: "Ancien mot de passe incorrect" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Mot de passe modifié avec succès" });
  } catch (err) {
    console.error("Erreur changePassword:", err);
    res.status(500).json({ error: err.message });
  }
};

