import 'dotenv/config';
import path from 'path';
const ROOT_DIR = process.cwd();

export const config = {
  port: process.env.PORT || 2560,
  jwtSecret: process.env.JWT_SECRET || 'tg_cloud_storage_super_secret_jwt_key_2026',
  jwtExpire: '7d',
  rootDir: ROOT_DIR,
  databaseDir: path.join(ROOT_DIR, 'database'),
  uploadDir: path.join(ROOT_DIR, 'storage', 'uploads'),
  tempDir: path.join(ROOT_DIR, 'storage', 'temp'),
  maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB || '2000', 10),
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  telegramChannelId: process.env.TELEGRAM_CHANNEL_ID || '',
};
