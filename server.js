import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import { config } from './config/app.config.js';
import { logger } from './utils/logger.js';
import fileRoutes from './api/routes/file.routes.js';
import folderRoutes from './api/routes/folder.routes.js';
import authRoutes from './api/routes/auth.routes.js';
import apiKeyRoutes from './api/routes/apikey.routes.js';
import settingsRoutes from './api/routes/settings.routes.js';
import docsRoutes from './api/routes/docs.routes.js';
import { FileController } from './api/controllers/file.controller.js';
import { FolderController } from './api/controllers/folder.controller.js';
import { rateLimiter } from './api/middleware/rateLimiter.middleware.js';

import { authenticateTokenOrKey } from './api/middleware/auth.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || config.port || 2560;

  // Global Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(rateLimiter);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'online', service: 'Telegram Cloud Storage', timestamp: new Date().toISOString() });
  });

  // Direct Routes as explicitly required in prompt specification
  app.get('/download/:id', authenticateTokenOrKey, FileController.downloadFile);
  app.get('/raw/:id', authenticateTokenOrKey, FileController.rawFile);
  app.get('/preview/:id', authenticateTokenOrKey, FileController.previewFile);

  // API Routes
  app.use('/api', fileRoutes);
  app.use('/api', folderRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api', apiKeyRoutes);
  app.use('/api', settingsRoutes);
  app.use('/api', docsRoutes);

  // Vite middleware for development or Static Serving for production
  if (process.env.NODE_ENV !== 'production') {
    logger.info('Starting Vite development server middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    logger.info('Serving static build from /dist directory...');
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 Telegram Cloud Storage Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
