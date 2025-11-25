const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/supportController');

router.get('/', auth, ctrl.list);
router.get('/:id', auth, ctrl.get);
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);

module.exports = router;
