
const User = require('../models/User');

exports.list = async (req, res) => {
  const users = await User.find().select('-password'); // Ne pas envoyer le mot de passe
  res.json(users);
};

exports.get = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
  res.json(user);
};

exports.update = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
  res.json(updatedUser);
};

exports.remove = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Utilisateur supprimé' });
};

exports.create = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
