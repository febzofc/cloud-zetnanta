import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateTokenOrKey } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/me', authenticateTokenOrKey, AuthController.getMe);

export default router;
