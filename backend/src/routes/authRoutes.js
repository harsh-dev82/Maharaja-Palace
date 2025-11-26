import express from 'express';
import { register, login, getMe, getAllUsers } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', protect, getAllUsers); // Should add admin check here ideally

export default router;
