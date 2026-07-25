import { dbService } from '../../services/db.service.js';
import { TelegramService } from '../telegram/telegram.service.js';

export class SettingsController {
  /**
   * GET /api/settings
   */
  static getSettings(req, res) {
    const settings = dbService.getSettings();
    // Mask sensitive bot token for security preview
    const maskedToken = settings.telegram_token 
      ? settings.telegram_token.substring(0, 8) + '****************' 
      : '';
    return res.json({
      success: true,
      data: {
        ...settings,
        telegram_token_masked: maskedToken
      }
    });
  }

  /**
   * PUT /api/settings
   */
  static updateSettings(req, res) {
    const { telegram_token, telegram_channel_id, telegram_channel_id_private, bot_username, storage_mode, max_file_size_mb } = req.body;

    let normalizedToken = undefined;
    if (telegram_token !== undefined) {
      const trimmed = telegram_token.trim();
      // Only update token if it is non-empty and does NOT contain masked asterisks
      if (trimmed && !trimmed.includes('***')) {
        normalizedToken = TelegramService.normalizeToken(trimmed);
      } else if (trimmed === '') {
        normalizedToken = '';
      }
    }

    const updated = dbService.updateSettings({
      ...(normalizedToken !== undefined && { telegram_token: normalizedToken }),
      ...(telegram_channel_id !== undefined && { telegram_channel_id: telegram_channel_id.trim() }),
      ...(telegram_channel_id_private !== undefined && { telegram_channel_id_private: telegram_channel_id_private.trim() }),
      ...(bot_username !== undefined && { bot_username: bot_username.trim() }),
      ...(storage_mode !== undefined && { storage_mode }),
      ...(max_file_size_mb !== undefined && { max_file_size_mb: parseInt(max_file_size_mb, 10) })
    });

    return res.json({ success: true, message: 'Settings updated successfully', data: updated });
  }

  /**
   * POST /api/settings/test-bot
   */
  static async testBotConnection(req, res) {
    const { token, channel_id } = req.body;
    const settings = dbService.getSettings();

    const normalizedInputToken = token ? TelegramService.normalizeToken(token) : '';
    const targetToken = (normalizedInputToken && !normalizedInputToken.includes('***')) 
      ? normalizedInputToken 
      : settings.telegram_token;
    const targetChannel = channel_id || settings.telegram_channel_id;

    const result = await TelegramService.testConnection(targetToken, targetChannel);
    return res.json(result);
  }
}
