import { Router } from 'express';
import { ApiKeyController } from '../controllers/apikey.controller.js';
import { authenticateTokenOrKey } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/keys', authenticateTokenOrKey, ApiKeyController.getApiKeys);
router.post('/keys', authenticateTokenOrKey, ApiKeyController.createApiKey);
router.delete('/keys/:id', authenticateTokenOrKey, ApiKeyController.deleteApiKey);

export default router;
