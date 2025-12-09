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

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch)
      return res.status(400).json({ error: "Old password incorrect" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Modifier l’avatar
export const updateAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file)
      return res.status(400).json({ error: "No image uploaded" });

    const imagePath = `/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: imagePath },
      { new: true }
    ).select("-password");

    res.json({
      message: "Avatar updated",
      user: updatedUser
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
