const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');

router.get('/', PaymentController.list);
router.get('/:id', PaymentController.get);
router.post('/pay', PaymentController.create); // <- route pour le mini front
router.put('/:id', PaymentController.update);

module.exports = router;
