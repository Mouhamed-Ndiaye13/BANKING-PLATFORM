import express from 'express';
import { list, markAsRead, create } from '../controllers/notificationControllers.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, list);
router.post('/', auth, create);
router.put('/:id/read', auth, markAsRead);

export default router;
