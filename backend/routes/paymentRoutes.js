const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const ctrl = require('../controllers/paymentController');

router.get('/', auth, ctrl.list);
router.get('/:id', auth, ctrl.get);
router.post('/', auth, ctrl.create);
router.put('/:id', auth, isAdmin, ctrl.update);

module.exports = router;
