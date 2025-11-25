const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const ctrl = require('../controllers/accountController');

router.get('/', auth, ctrl.list);
router.get('/:id', auth, ctrl.get);
router.post('/', auth, isAdmin, ctrl.create);
router.put('/:id', auth, isAdmin, ctrl.update);
router.delete('/:id', auth, isAdmin, ctrl.remove);

module.exports = router;
