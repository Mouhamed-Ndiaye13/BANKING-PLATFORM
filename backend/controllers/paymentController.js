const Payment = require('../models/Payment');

exports.list = async (req, res) => {
  const payments = await Payment.find().populate('user', 'name email');
  res.json(payments);
};

exports.get = async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate('user', 'name email');
  if (!payment) return res.status(404).json({ message: 'Paiement non trouvé' });
  res.json(payment);
};

exports.create = async (req, res) => {
  const payment = new Payment(req.body);
  await payment.save();
  res.status(201).json(payment);
};

exports.update = async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(payment);
};
