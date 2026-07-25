import jwt from 'jsonwebtoken';
import { config } from '../../config/app.config.js';
import { dbService } from '../../services/db.service.js';

/**
 * Authentication Middleware
 * Supports:
 * 1. Bearer JWT Token in Authorization header
 * 2. API_KEY in `X-API-KEY` or `API_KEY` header or `api_key` query param
 */
export function authenticateTokenOrKey(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.headers['api_key'] || req.query.api_key;
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.split(' ')[1]) || req.query.token;

  // 1. Check API Key
  if (apiKey) {
    const keyRecord = dbService.getApiKey(apiKey);
    if (keyRecord) {
      dbService.incrementApiKeyRequests(apiKey);
      req.user = { id: keyRecord.user_id, role: keyRecord.role || 'API_CLIENT', apiKey: apiKey };
      return next();
    } else {
      return res.status(401).json({ success: false, message: 'Invalid or revoked API Key' });
    }
  }

  // 2. Check JWT Token
  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired JWT token' });
    }
  }

  // Allow anonymous access if configured, but mark user as guest
  req.user = { id: 'guest', role: 'GUEST' };
  next();
}

/**
 * Require Strict Admin or Registered User
 */
export function requireAuth(req, res, next) {
  if (!req.user || req.user.id === 'guest') {
    return res.status(401).json({ success: false, message: 'Authentication required. Please log in or provide API key.' });
  }
  next();
}

/**
 * Require Admin Role
 */
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Admin privilege required.' });
  }
  next();
}
