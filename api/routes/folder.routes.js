import { Router } from 'express';
import { FolderController } from '../controllers/folder.controller.js';
import { authenticateTokenOrKey } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/folders', FolderController.getFolders);
router.post('/folder', authenticateTokenOrKey, FolderController.createFolder);
router.delete('/folder/:id?', authenticateTokenOrKey, FolderController.deleteFolder);

export default router;
