// controllers/userController.js
import User from "../models/User.js";

// Lister tous les utilisateurs (sans mot de passe)
export const list = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// Récupérer un utilisateur par ID
export const get = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  res.json(user);
};

// Mettre à jour un utilisateur
export const update = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
  res.json(updatedUser);
};

// Supprimer un utilisateur
export const remove = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Utilisateur supprimé" });
};

// Créer un utilisateur
export const create = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
