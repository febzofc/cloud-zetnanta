import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller.js';
import { authenticateTokenOrKey } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/settings', authenticateTokenOrKey, SettingsController.getSettings);
router.put('/settings', authenticateTokenOrKey, SettingsController.updateSettings);
router.post('/settings/test-bot', authenticateTokenOrKey, SettingsController.testBotConnection);

export default router;
