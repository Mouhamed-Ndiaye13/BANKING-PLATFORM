const Transaction = require('../models/Transaction');

exports.list = async (req, res) => {
  const { type, startDate, endDate } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (startDate || endDate) filter.date = {};
  if (startDate) filter.date.$gte = new Date(startDate);
  if (endDate) filter.date.$lte = new Date(endDate);

  const transactions = await Transaction.find(filter).populate('account');
  res.json(transactions);
};

exports.get = async (req, res) => {
  const transaction = await Transaction.findById(req.params.id).populate('account');
  if (!transaction) return res.status(404).json({ message: 'Transaction non trouvée' });
  res.json(transaction);
};

exports.create = async (req, res) => {
  const transaction = new Transaction(req.body);
  await transaction.save();
  res.status(201).json(transaction);
};
