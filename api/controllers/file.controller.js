import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { dbService } from '../../services/db.service.js';
import { TelegramService } from '../telegram/telegram.service.js';
import { PreviewService } from '../../preview/preview.service.js';
import { ThumbnailService } from '../../thumbnail/thumbnail.service.js';
import { formatBytes, generateUniqueCode, detectMediaType, getDateTimeParts, getMimeType } from '../../utils/helper.js';
import { logger } from '../../utils/logger.js';

function isAccessAllowed(file, req) {
  if (!file) return false;
  if (file.status !== 'private') return true;
  if (req.user && req.user.id !== 'guest') return true;
  return false;
}

export class FileController {
  /**
   * Helper to stream or send a file cleanly with HTTP Range support for media player seeking
   */
  static sendFileStream(req, res, filePath, fileName, extension, isAttachment = false) {
    const resolvedPath = path.resolve(filePath);
    if (!fs.existsSync(resolvedPath)) {
      return res.status(404).send('File missing on storage server');
    }

    const mimeType = getMimeType(fileName, extension);
    const stat = fs.statSync(resolvedPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    res.setHeader('Content-Type', mimeType);
    if (isAttachment) {
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    } else {
      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(fileName)}"`);
    }

    // Support Range Requests for Video / Audio Seeking
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        res.status(416).setHeader('Content-Range', `bytes */${fileSize}`);
        return res.end();
      }

      const chunkSize = (end - start) + 1;
      const fileStream = fs.createReadStream(resolvedPath, { start, end });
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': mimeType,
      });

      fileStream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': mimeType,
        'Accept-Ranges': 'bytes',
      });
      fs.createReadStream(resolvedPath).pipe(res);
    }
  }

  /**
   * POST /api/upload
   * Handles File & Folder Uploads
   */
  static async uploadFile(req, res) {
    try {
      const filesToProcess = [];
      if (req.files && Array.isArray(req.files)) {
        filesToProcess.push(...req.files);
      } else if (req.file) {
        filesToProcess.push(req.file);
      }

      if (filesToProcess.length === 0) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const targetFolder = req.body.folder || 'Root';
      const fileStatus = req.body.status || 'public';
      const uploadedResults = [];

      // Determine target Telegram Channel ID:
      // Private status -> Private Owner Channel ID
      // Public status -> Public Telegram Channel ID
      const settings = dbService.getSettings();
      let targetChannelId = null;
      if (fileStatus === 'private') {
        targetChannelId = settings.telegram_channel_id_private || process.env.TELEGRAM_OWNER_CHANNEL_ID || '-5568856013';
      } else {
        targetChannelId = settings.telegram_channel_id || process.env.TELEGRAM_CHANNEL_ID;
      }

      for (const file of filesToProcess) {
        const originalName = file.originalname || 'unnamed_file';
        const sizeBytes = file.size;
        const sizeFormatted = formatBytes(sizeBytes);
        const { type: mediaType, ext } = detectMediaType(originalName);
        const uniqueCode = generateUniqueCode();
        const fileId = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
        const { dateStr, timeStr, isoStr } = getDateTimeParts();

        // Send to Telegram or Simulation Mode using determined channel ID
        const tgResult = await TelegramService.uploadFileToTelegram(file.path, originalName, mediaType, targetChannelId);

        // Delete temporary upload file from local storage to prevent filling server disk space
        if (file.path && fs.existsSync(file.path)) {
          try {
            fs.unlinkSync(file.path);
            logger.info(`Cleaned local temp storage after upload: ${file.path}`);
          } catch (e) {
            logger.warn(`Could not delete temp upload file ${file.path}: ${e.message}`);
          }
        }

        const newFileRecord = {
          id: fileId,
          unique_code: uniqueCode,
          telegram_file_id: tgResult.telegram_file_id,
          telegram_message_id: tgResult.telegram_message_id,
          target_channel_id: targetChannelId,
          file_name: originalName,
          original_name: originalName,
          media_type: mediaType,
          extension: ext,
          size: sizeFormatted,
          size_bytes: sizeBytes,
          folder: targetFolder,
          thumbnail: ThumbnailService.getThumbnailType(mediaType, ext),
          preview_url: `/preview/${uniqueCode}`,
          download_url: `/download/${uniqueCode}`,
          raw_url: `/raw/${uniqueCode}`,
          status: fileStatus,
          upload_date: dateStr,
          upload_time: timeStr,
          download_count: '0',
          view_count: '0',
          local_path: null,
          created_at: isoStr,
          updated_at: isoStr
        };

        const saved = dbService.saveFile(newFileRecord);
        uploadedResults.push(saved);
      }

      return res.status(201).json({
        success: true,
        message: `${uploadedResults.length} file(s) uploaded successfully!`,
        data: uploadedResults.length === 1 ? uploadedResults[0] : uploadedResults
      });
    } catch (err) {
      logger.error('Upload controller error:', err);
      return res.status(500).json({ success: false, message: 'Server error during upload: ' + err.message });
    }
  }

  /**
   * GET /api/file/:id
   */
  static getFileMetadata(req, res) {
    const { id } = req.params;
    const file = dbService.getFileByIdOrCode(id);
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    if (!isAccessAllowed(file, req)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Private file' });
    }
    return res.json({ success: true, data: file });
  }

  /**
   * GET /download/:id
   */
  static async downloadFile(req, res) {
    try {
      const { id } = req.params;
      const file = dbService.getFileByIdOrCode(id);
      if (!file) {
        return res.status(404).send('File not found');
      }

      if (!isAccessAllowed(file, req)) {
        return res.status(403).send('Forbidden: This file is marked as Private. Valid token or API key required.');
      }

      // Increment download counter
      dbService.incrementFileStats(file.id, 'download');

      // Check if file exists locally (fallback)
      if (file.local_path && fs.existsSync(file.local_path)) {
        return FileController.sendFileStream(req, res, file.local_path, file.file_name, file.extension, true);
      }

      // Else stream directly from Telegram API
      const streamInfo = await TelegramService.getDownloadStream(file);
      if (streamInfo) {
        if (streamInfo.localPath && fs.existsSync(streamInfo.localPath)) {
          return FileController.sendFileStream(req, res, streamInfo.localPath, file.file_name, file.extension, true);
        } else if (streamInfo.isRemote && streamInfo.stream) {
          const mimeType = getMimeType(file.file_name, file.extension);
          res.setHeader('Content-Type', mimeType);
          res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.file_name)}"`);
          if (streamInfo.contentLength) {
            res.setHeader('Content-Length', streamInfo.contentLength);
          }
          if (typeof streamInfo.stream.pipe === 'function') {
            return streamInfo.stream.pipe(res);
          } else {
            return Readable.fromWeb(streamInfo.stream).pipe(res);
          }
        }
      }

      // Fallback for simulated/non-streamable files: Send text meta manifest
      const fallbackContent = `================================================
TELEGRAM CLOUD STORAGE FILE DOWNLOAD
================================================
Nama Berkas: ${file.file_name}
ID Berkas  : ${file.unique_code}
Ukuran     : ${file.size}
Tipe Media : ${file.media_type}
Status     : ${file.status}
Tanggal    : ${file.upload_date} ${file.upload_time}
================================================
Catatan: Berkas telah tersimpan secara aman di Cloud Telegram.
`;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.file_name)}.txt"`);
      return res.send(fallbackContent);
    } catch (err) {
      logger.error('Download error:', err);
      return res.status(500).send('Error downloading file: ' + err.message);
    }
  }

  /**
   * GET /raw/:id
   * Stream raw media content inline (for preview player, video, image, audio, pdf)
   */
  static async rawFile(req, res) {
    try {
      const { id } = req.params;
      const file = dbService.getFileByIdOrCode(id);
      if (!file) {
        return res.status(404).send('File not found');
      }

      if (!isAccessAllowed(file, req)) {
        return res.status(403).send('Forbidden: This file is marked as Private. Valid token or API key required.');
      }

      // Check if file exists locally
      if (file.local_path && fs.existsSync(file.local_path)) {
        return FileController.sendFileStream(req, res, file.local_path, file.file_name, file.extension, false);
      }

      // Else stream directly from Telegram API
      const streamInfo = await TelegramService.getDownloadStream(file);
      if (streamInfo) {
        if (streamInfo.localPath && fs.existsSync(streamInfo.localPath)) {
          return FileController.sendFileStream(req, res, streamInfo.localPath, file.file_name, file.extension, false);
        } else if (streamInfo.isRemote && streamInfo.stream) {
          const mimeType = getMimeType(file.file_name, file.extension);
          res.setHeader('Content-Type', mimeType);
          res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.file_name)}"`);
          if (streamInfo.contentLength) {
            res.setHeader('Content-Length', streamInfo.contentLength);
          }
          if (typeof streamInfo.stream.pipe === 'function') {
            return streamInfo.stream.pipe(res);
          } else {
            return Readable.fromWeb(streamInfo.stream).pipe(res);
          }
        }
      }

      // Fallback: If simulation mode or missing stream, generate a clean SVG media placeholder
      const mediaIcon = file.media_type === 'image' ? '🖼️' : file.media_type === 'video' ? '🎬' : file.media_type === 'audio' ? '🎵' : '📄';
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
        <rect width="600" height="400" fill="#16161e"/>
        <rect x="20" y="20" width="560" height="360" fill="none" stroke="#2cb67d" stroke-width="4" stroke-dasharray="10 5"/>
        <text x="300" y="150" font-family="monospace" font-size="24" fill="#fffffe" text-anchor="middle" font-weight="bold">${mediaIcon} ${file.file_name}</text>
        <text x="300" y="200" font-family="sans-serif" font-size="16" fill="#2cb67d" text-anchor="middle">Telegram Cloud Storage Stream (${file.size})</text>
        <text x="300" y="240" font-family="monospace" font-size="14" fill="#ff8e3c" text-anchor="middle">ID: ${file.unique_code}</text>
        <text x="300" y="280" font-family="sans-serif" font-size="12" fill="#72757e" text-anchor="middle">Status: ${file.status.toUpperCase()} • Cloud Storage Active</text>
      </svg>`;
      res.setHeader('Content-Type', 'image/svg+xml');
      return res.send(svg);
    } catch (err) {
      logger.error('Raw stream error:', err);
      return res.status(500).send('Error streaming raw file: ' + err.message);
    }
  }

  /**
   * GET /preview/:id
   */
  static async previewFile(req, res) {
    try {
      const { id } = req.params;
      const file = dbService.getFileByIdOrCode(id);
      if (!file) {
        return res.status(404).send('File not found');
      }

      const acceptsHeader = req.headers['accept'] || '';
      const isAllowed = isAccessAllowed(file, req);

      if (!isAllowed) {
        if (acceptsHeader.includes('application/json')) {
          return res.status(403).json({ success: false, message: 'Forbidden: Private file' });
        }
        const html = PreviewService.renderPrivateAccessHTML(file);
        res.setHeader('Content-Type', 'text/html');
        return res.status(403).send(html);
      }

      // Increment view count
      dbService.incrementFileStats(file.id, 'view');

      // Check if JSON request (e.g., API client) or HTML page request
      if (acceptsHeader.includes('application/json')) {
        return res.json({ success: true, data: file });
      }

      const html = PreviewService.renderPreviewHTML(file);
      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    } catch (err) {
      logger.error('Preview error:', err);
      return res.status(500).send('Error previewing file: ' + err.message);
    }
  }

  /**
   * DELETE /api/delete/:id
   */
  static async deleteFile(req, res) {
    const rawId = req.params.id || req.body.id || req.query.id;
    if (!rawId) {
      return res.status(400).json({ success: false, message: 'ID atau Kode File tidak ditemukan.' });
    }

    const file = dbService.getFileByIdOrCode(rawId);
    if (!file) {
      return res.status(404).json({ success: false, message: `Berkas tidak ditemukan dengan ID/Kode "${rawId}".` });
    }

    const isAdmin = req.user && req.user.role === 'ADMIN';
    if (!isAdmin && file.status === 'private') {
      return res.status(403).json({ success: false, message: 'Izin ditolak: Berkas ini bertipe privat dan hanya dapat dihapus oleh Admin.' });
    }

    // Attempt to delete message from Telegram channel if telegram_message_id is present
    if (file.telegram_message_id) {
      try {
        const settings = dbService.getSettings();
        const targetChannel = file.target_channel_id || (file.status === 'private' ? settings.telegram_channel_id_private : settings.telegram_channel_id);
        await TelegramService.deleteMessageFromTelegram(file.telegram_message_id, targetChannel);
      } catch (err) {
        logger.warn(`Failed telegram deletion for message ${file.telegram_message_id}: ${err.message}`);
      }
    }

    const deleted = dbService.deleteFile(file.id) || dbService.deleteFile(file.unique_code);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Gagal menghapus berkas dari penyimpanan.' });
    }

    // Delete local storage file if present
    if (deleted.local_path && fs.existsSync(deleted.local_path)) {
      try {
        fs.unlinkSync(deleted.local_path);
      } catch (e) {
        logger.warn(`Could not delete file from disk: ${deleted.local_path}`);
      }
    }

    return res.json({ success: true, message: `Berkas "${deleted.file_name}" (ID: ${deleted.unique_code}) berhasil dihapus!`, data: deleted });
  }

  /**
   * PUT /api/update/:id
   */
  static updateFile(req, res) {
    const { id } = req.params;
    const { file_name, folder, status } = req.body;
    
    const updated = dbService.updateFile(id, {
      ...(file_name && { file_name }),
      ...(folder && { folder }),
      ...(status && { status })
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    return res.json({ success: true, message: 'File updated successfully', data: updated });
  }

  /**
   * GET /api/search
   */
  static searchFiles(req, res) {
    const { q = '', media_type = '', folder = '', status = '' } = req.query;
    let files = dbService.getFiles();

    if (q) {
      const term = q.toString().toLowerCase();
      files = files.filter(f => 
        f.file_name.toLowerCase().includes(term) ||
        f.unique_code.toLowerCase().includes(term) ||
        f.folder.toLowerCase().includes(term)
      );
    }

    if (media_type && media_type !== 'all') {
      files = files.filter(f => f.media_type === media_type);
    }

    if (folder && folder !== 'all') {
      files = files.filter(f => f.folder.toLowerCase() === folder.toLowerCase());
    }

    if (status && status !== 'all') {
      files = files.filter(f => f.status === status);
    }

    return res.json({ success: true, total: files.length, data: files });
  }

  /**
   * GET /api/files
   */
  static getAllFiles(req, res) {
    const files = dbService.getFiles();
    
    // Calculate category breakdown
    const categories = {
      video: files.filter(f => f.media_type === 'video').length,
      image: files.filter(f => f.media_type === 'image').length,
      audio: files.filter(f => f.media_type === 'audio').length,
      pdf: files.filter(f => f.media_type === 'pdf').length,
      zip: files.filter(f => f.media_type === 'zip').length,
      document: files.filter(f => f.media_type === 'docx' || f.media_type === 'txt' || f.media_type === 'document').length
    };

    // Calculate total size in bytes
    const totalSizeBytes = files.reduce((acc, curr) => acc + (curr.size_bytes || 0), 0);
    const totalStorageFormatted = formatBytes(totalSizeBytes);

    return res.json({
      success: true,
      total_files: files.length,
      total_storage_bytes: totalSizeBytes,
      total_storage_formatted: totalStorageFormatted,
      categories,
      data: files
    });
  }
}
