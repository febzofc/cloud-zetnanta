import crypto from 'crypto';
import { dbService } from '../../services/db.service.js';

export class ApiKeyController {
  /**
   * GET /api/keys
   */
  static getApiKeys(req, res) {
    const keys = dbService.getApiKeys();
    return res.json({ success: true, data: keys });
  }

  /**
   * POST /api/keys
   */
  static createApiKey(req, res) {
    const { name = 'Integration Key', rate_limit_per_min = 60 } = req.body;
    const randomHex = crypto.randomBytes(16).toString('hex');
    const apiKeyString = `tg_key_${randomHex}`;
    const keyId = 'key_' + Date.now().toString(36);

    const newKey = {
      id: keyId,
      key: apiKeyString,
      name,
      user_id: req.user ? req.user.id : 'usr_admin_001',
      role: req.user ? req.user.role : 'ADMIN',
      rate_limit_per_min: parseInt(rate_limit_per_min, 10),
      total_requests: 0,
      last_used_at: null,
      created_at: new Date().toISOString()
    };

    const saved = dbService.saveApiKey(newKey);
    return res.status(201).json({ success: true, message: 'API Key generated successfully', data: saved });
  }

  /**
   * DELETE /api/keys/:id
   */
  static deleteApiKey(req, res) {
    const { id } = req.params;
    const deleted = dbService.deleteApiKey(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'API Key not found' });
    }
    return res.json({ success: true, message: 'API Key revoked successfully', data: deleted });
  }
}
