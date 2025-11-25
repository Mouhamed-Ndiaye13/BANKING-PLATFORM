const User = require("../models/User");

// GET /users/me
const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET /users
const list = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET /users/:id
const get = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// PUT /users/:id
const update = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// DELETE /users/:id
const remove = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  me,
  list,
  get,
  update,
  remove
};
