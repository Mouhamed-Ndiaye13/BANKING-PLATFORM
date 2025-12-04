const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Créer un utilisateur (POST /api/users)
const createUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Modifier profil (PUT /api/users/update-profile)
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true }).select("-password");
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Modifier mot de passe (PUT /api/users/update-password)
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Ancien mot de passe incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ajouter / modifier photo (POST /api/users/upload-photo)
const updateAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) return res.status(400).json({ message: "Aucune image téléchargée" });

    const imagePath = `/uploads/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(userId, { avatar: imagePath }, { new: true }).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Exporter toutes les fonctions pour userRoutes
module.exports = {
  createUser,
  updateProfile,
  updatePassword,
  updateAvatar
};
