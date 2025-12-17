
import express from 'express';
import auth from '../middleware/auth.js';
import * as ctrl from '../controllers/supportController.js';

const router = express.Router();

// Utilisateur connecté
router.post('/', auth, ctrl.create);
router.get('/:id', auth, ctrl.get);

// Admin
router.get('/', auth, ctrl.list);
router.put('/:id', auth, ctrl.update);

export default router;

