const Support = require('../models/Support');

exports.list = async (req, res) => {
  const tickets = await Support.find().populate('user', 'name email');
  res.json(tickets);
};

exports.get = async (req, res) => {
  const ticket = await Support.findById(req.params.id).populate('user', 'name email');
  if (!ticket) return res.status(404).json({ message: 'Ticket non trouvé' });
  res.json(ticket);
};

exports.create = async (req, res) => {
  const ticket = new Support(req.body);
  await ticket.save();
  res.status(201).json(ticket);
};

exports.update = async (req, res) => {
  const ticket = await Support.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(ticket);
};
