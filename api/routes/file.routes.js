import { Router } from 'express';
import { FileController } from '../controllers/file.controller.js';
import { upload } from '../middleware/multer.middleware.js';
import { authenticateTokenOrKey } from '../middleware/auth.middleware.js';

const router = Router();

// Shorten URL using TinyURL API
router.get('/shorten', async (req, res) => {
  try {
    const longUrl = req.query.url;
    if (!longUrl) {
      return res.status(400).json({ success: false, message: 'URL parameter is required' });
    }
    const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`TinyURL API error: ${response.statusText}`);
    }
    const shortUrl = await response.text();
    return res.json({ success: true, shortUrl: shortUrl.trim() });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Public Upload Route (Open to public without authentication)
router.post('/public/upload', upload.array('files', 20), (req, res) => {
  if (!req.files || req.files.length === 0) {
    upload.single('file')(req, res, (err) => {
      if (err) return res.status(400).json({ success: false, message: err.message });
      FileController.uploadFile(req, res);
    });
  } else {
    FileController.uploadFile(req, res);
  }
});

// Public Download Route (Download by file ID or file URL)
router.get('/public/download/:id?', FileController.downloadFile);
router.get('/public/download', FileController.downloadFile);

// Upload File (Supports single 'file' or multiple 'files')
router.post('/upload', authenticateTokenOrKey, upload.array('files', 20), (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    // try single upload fallback
    upload.single('file')(req, res, (err) => {
      if (err) return res.status(400).json({ success: false, message: err.message });
      FileController.uploadFile(req, res);
    });
  } else {
    FileController.uploadFile(req, res);
  }
});

// Search Files
router.get('/search', FileController.searchFiles);

// Get All Files
router.get('/files', FileController.getAllFiles);

// Get Single File Metadata
router.get('/file/:id', FileController.getFileMetadata);

// Delete File (supports /delete/:id, /delete, POST or DELETE)
router.delete('/delete/:id?', authenticateTokenOrKey, FileController.deleteFile);
router.post('/delete', authenticateTokenOrKey, FileController.deleteFile);

// Update File
router.put('/update/:id', authenticateTokenOrKey, FileController.updateFile);

export default router;
