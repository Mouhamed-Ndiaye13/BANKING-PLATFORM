// Import en ES Modules
import express from 'express';
import auth from '../middleware/auth.js';
import * as ctrl from '../controllers/supportController.js';

const router = express.Router();

// Routes Support
router.get('/', auth, ctrl.list);
router.get('/:id', auth, ctrl.get);
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);

export default router;
