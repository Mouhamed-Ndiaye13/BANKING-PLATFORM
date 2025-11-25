const Account = require('../models/Account');

exports.list = async (req, res) => {
  const accounts = await Account.find().populate('user', 'name email');
  res.json(accounts);
};

exports.get = async (req, res) => {
  const account = await Account.findById(req.params.id).populate('user', 'name email');
  if (!account) return res.status(404).json({ message: 'Compte non trouvé' });
  res.json(account);
};

exports.create = async (req, res) => {
  const { user, type, balance } = req.body;
  const account = new Account({ user, type, balance });
  await account.save();
  res.status(201).json(account);
};

exports.update = async (req, res) => {
  const account = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(account);
};

exports.remove = async (req, res) => {
  await Account.findByIdAndDelete(req.params.id);
  res.json({ message: 'Compte supprimé' });
};
