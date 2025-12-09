import User from "../models/User.js";

// Modifier le profil
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      req.body,
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated",
      user: updatedUser
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Modifier le mot de passe
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword)
      return res.status(400).json({ error: "Ancien et nouveau mot de passe requis" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch)
      return res.status(400).json({ error: "Ancien mot de passe incorrect" });

    // Protection : ne pas sauvegarder un password vide
    if (newPassword && newPassword.trim() !== "") {
      user.password = newPassword;
      await user.save();
    }

    res.json({ message: "Mot de passe modifié avec succès" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Modifier l’avatar
export const updateAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file)
      return res.status(400).json({ error: "Aucune image téléchargée" });

    const imagePath = `/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: imagePath },
      { new: true }
    ).select("-password");

    res.json({
      message: "Avatar mis à jour",
      user: updatedUser
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
