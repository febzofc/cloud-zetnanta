import fs from 'fs';
import path from 'path';
import { config } from '../config/app.config.js';
import { logger } from '../utils/logger.js';

class JsonDbService {
  constructor() {
    this.dbDir = config.databaseDir;
    this.ensureDirectory();
  }

  ensureDirectory() {
    if (!fs.existsSync(this.dbDir)) {
      fs.mkdirSync(this.dbDir, { recursive: true });
    }
    if (!fs.existsSync(config.uploadDir)) {
      fs.mkdirSync(config.uploadDir, { recursive: true });
    }
    if (!fs.existsSync(config.tempDir)) {
      fs.mkdirSync(config.tempDir, { recursive: true });
    }
    this.cleanTempStorage();
  }

  cleanTempStorage() {
    const dir = config.tempDir;
    if (fs.existsSync(dir)) {
      try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
          }
        }
      } catch (e) {
        logger.warn(`Could not clean temp directory ${dir}: ${e.message}`);
      }
    }
  }

  _getFilePath(filename) {
    return path.join(this.dbDir, filename);
  }

  _readJson(filename, defaultValue) {
    const filePath = this._getFilePath(filename);
    try {
      if (!fs.existsSync(filePath)) {
        this._writeJson(filename, defaultValue);
        return defaultValue;
      }
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      logger.error(`Error reading ${filename}`, err);
      return defaultValue;
    }
  }

  _writeJson(filename, data) {
    const filePath = this._getFilePath(filename);
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (err) {
      logger.error(`Error writing ${filename}`, err);
      return false;
    }
  }

  // Files DB Methods
  getFiles() {
    const res = this._readJson('files.json', { files: [] });
    return res.files || [];
  }

  _cleanQueryInput(input) {
    if (!input) return '';
    let str = input.toString().trim().toLowerCase();
    // Decode URI component if encoded
    try { str = decodeURIComponent(str); } catch (e) {}
    
    // Extract code from full URLs or hash strings
    if (str.includes('#file/')) str = str.split('#file/').pop();
    else if (str.includes('#preview/')) str = str.split('#preview/').pop();
    else if (str.includes('#download/')) str = str.split('#download/').pop();
    else if (str.includes('/preview/')) str = str.split('/preview/').pop();
    else if (str.includes('/file/')) str = str.split('/file/').pop();
    else if (str.includes('/download/')) str = str.split('/download/').pop();
    else if (str.includes('/raw/')) str = str.split('/raw/').pop();
    else if (str.includes('/')) str = str.split('/').pop();

    // Strip query parameters
    str = str.split('?')[0].split('&')[0];
    return str.trim();
  }

  getFileByIdOrCode(idOrCode) {
    if (!idOrCode) return null;
    const files = this.getFiles();
    const rawClean = idOrCode.toString().trim().toLowerCase();
    const clean = this._cleanQueryInput(idOrCode);
    return files.find(f => 
      (f.id && (f.id.toString().toLowerCase() === clean || f.id.toString().toLowerCase() === rawClean)) || 
      (f.unique_code && (f.unique_code.toString().toLowerCase() === clean || f.unique_code.toString().toLowerCase() === rawClean)) ||
      (f.telegram_file_id && (f.telegram_file_id.toString().toLowerCase() === clean || f.telegram_file_id.toString().toLowerCase() === rawClean)) ||
      (f.short_url && (f.short_url.toString().toLowerCase() === clean || f.short_url.toString().toLowerCase() === rawClean))
    );
  }

  saveFile(fileMetaData) {
    const data = this._readJson('files.json', { files: [] });
    const index = data.files.findIndex(f => f.id === fileMetaData.id);
    if (index >= 0) {
      data.files[index] = { ...data.files[index], ...fileMetaData, updated_at: new Date().toISOString() };
    } else {
      data.files.unshift(fileMetaData);
    }
    this._writeJson('files.json', data);
    return fileMetaData;
  }

  updateFile(id, updateData) {
    const data = this._readJson('files.json', { files: [] });
    const index = data.files.findIndex(f => f.id === id || f.unique_code === id);
    if (index >= 0) {
      data.files[index] = {
        ...data.files[index],
        ...updateData,
        updated_at: new Date().toISOString()
      };
      this._writeJson('files.json', data);
      return data.files[index];
    }
    return null;
  }

  deleteFile(idOrCode) {
    if (!idOrCode) return null;
    const data = this._readJson('files.json', { files: [] });
    const rawClean = idOrCode.toString().trim().toLowerCase();
    const clean = this._cleanQueryInput(idOrCode);
    const index = data.files.findIndex(f => 
      (f.id && (f.id.toString().toLowerCase() === clean || f.id.toString().toLowerCase() === rawClean)) || 
      (f.unique_code && (f.unique_code.toString().toLowerCase() === clean || f.unique_code.toString().toLowerCase() === rawClean)) ||
      (f.telegram_file_id && (f.telegram_file_id.toString().toLowerCase() === clean || f.telegram_file_id.toString().toLowerCase() === rawClean)) ||
      (f.short_url && (f.short_url.toString().toLowerCase() === clean || f.short_url.toString().toLowerCase() === rawClean))
    );

    if (index !== -1) {
      const [deleted] = data.files.splice(index, 1);
      this._writeJson('files.json', data);
      return deleted;
    }
    return null;
  }

  incrementFileStats(idOrCode, type = 'download') {
    const data = this._readJson('files.json', { files: [] });
    const file = data.files.find(f => f.id === idOrCode || f.unique_code === idOrCode);
    if (file) {
      if (type === 'download') {
        file.download_count = (parseInt(file.download_count || 0, 10) + 1).toString();
      } else if (type === 'view') {
        file.view_count = (parseInt(file.view_count || 0, 10) + 1).toString();
      }
      file.updated_at = new Date().toISOString();
      this._writeJson('files.json', data);
      return file;
    }
    return null;
  }

  // Folders DB Methods
  getFolders() {
    const res = this._readJson('folders.json', { folders: [] });
    return res.folders || [];
  }

  saveFolder(folderData) {
    const data = this._readJson('folders.json', { folders: [] });
    const index = data.folders.findIndex(f => f.id === folderData.id || f.name.toLowerCase() === folderData.name.toLowerCase());
    if (index >= 0) {
      data.folders[index] = { ...data.folders[index], ...folderData };
    } else {
      data.folders.push(folderData);
    }
    this._writeJson('folders.json', data);
    return folderData;
  }

  deleteFolder(folderIdOrName) {
    const data = this._readJson('folders.json', { folders: [] });
    const folder = data.folders.find(f => f.id === folderIdOrName || f.name.toLowerCase() === folderIdOrName.toLowerCase());
    if (folder) {
      data.folders = data.folders.filter(f => f.id !== folder.id);
      this._writeJson('folders.json', data);
      return folder;
    }
    return null;
  }

  // Users DB Methods
  getUsers() {
    const res = this._readJson('users.json', { users: [] });
    let users = res.users || [];
    
    // Seed default admin febri if missing
    if (!users.some(u => u.username.toLowerCase() === 'febri')) {
      const defaultAdmin = {
        id: 'usr_admin_febri',
        username: 'febri',
        email: 'febri@zetnantacloud.com',
        // pre-hashed bcrypt for '010820'
        password_hash: '$2b$10$wTInF6675jO25J/HkEInmO35OOnm.G1E1g8iZ7a7vJdM9j0w6/mvu',
        role: 'ADMIN',
        created_at: new Date().toISOString()
      };
      users.push(defaultAdmin);
      this._writeJson('users.json', { users });
    }
    return users;
  }

  getUserByUsername(username) {
    const users = this.getUsers();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  saveUser(userData) {
    const data = this._readJson('users.json', { users: [] });
    const index = data.users.findIndex(u => u.id === userData.id);
    if (index >= 0) {
      data.users[index] = userData;
    } else {
      data.users.push(userData);
    }
    this._writeJson('users.json', data);
    return userData;
  }

  // API Keys DB Methods
  getApiKeys() {
    const res = this._readJson('api_keys.json', { keys: [] });
    return res.keys || [];
  }

  getApiKey(key) {
    if (!key) return null;
    // Default system keys fallback for seamless VPS deployment
    if (key === 'tg_key_9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d' || key === 'tg_key_live_9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d') {
      return { id: 'key_default', key, user_id: 'usr_admin_001', role: 'ADMIN', name: 'Default System Key' };
    }
    const keys = this.getApiKeys();
    return keys.find(k => k.key === key);
  }

  saveApiKey(keyData) {
    const data = this._readJson('api_keys.json', { keys: [] });
    data.keys.unshift(keyData);
    this._writeJson('api_keys.json', data);
    return keyData;
  }

  deleteApiKey(keyId) {
    const data = this._readJson('api_keys.json', { keys: [] });
    const key = data.keys.find(k => k.id === keyId || k.key === keyId);
    if (key) {
      data.keys = data.keys.filter(k => k.id !== key.id && k.key !== key.key);
      this._writeJson('api_keys.json', data);
      return key;
    }
    return null;
  }

  incrementApiKeyRequests(keyString) {
    const data = this._readJson('api_keys.json', { keys: [] });
    const keyObj = data.keys.find(k => k.key === keyString);
    if (keyObj) {
      keyObj.total_requests = (keyObj.total_requests || 0) + 1;
      keyObj.last_used_at = new Date().toISOString();
      this._writeJson('api_keys.json', data);
    }
  }

  // Settings DB Methods
  getSettings() {
    return this._readJson('settings.json', {
      telegram_token: config.telegramBotToken || '',
      telegram_channel_id: config.telegramChannelId || '',
      telegram_channel_id_private: process.env.TELEGRAM_OWNER_CHANNEL_ID || '-5568856013',
      bot_username: "@tg_cloud_storage_bot",
      storage_mode: "auto",
      max_file_size_mb: 2000,
      site_name: "ZETNANTA CLOUD"
    });
  }

  updateSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings, updated_at: new Date().toISOString() };
    this._writeJson('settings.json', updated);
    return updated;
  }
}

export const dbService = new JsonDbService();
