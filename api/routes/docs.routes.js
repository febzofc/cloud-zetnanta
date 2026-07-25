import { Router } from 'express';

const router = Router();

router.get('/docs', (req, res) => {
  return res.json({
    openapi: '3.0.0',
    info: {
      title: 'Telegram Cloud Storage REST API',
      version: '1.0.0',
      description: 'API Documentation for Telegram Channel/Group Cloud Storage System'
    },
    authentication: {
      types: [
        { type: 'API_KEY', header: 'X-API-KEY or API_KEY', example: 'tg_key_9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d' },
        { type: 'JWT', header: 'Authorization: Bearer <token>' }
      ]
    },
    endpoints: [
      {
        path: '/api/upload',
        method: 'POST',
        summary: 'Upload file to Telegram Cloud Storage',
        headers: { 'X-API-KEY': 'string (optional)' },
        contentType: 'multipart/form-data',
        body: { files: 'File[] or File', folder: 'string (optional)' },
        response: { success: true, message: 'string', data: 'FileMetadata' }
      },
      {
        path: '/api/file/:id',
        method: 'GET',
        summary: 'Get file metadata by ID or unique_code (e.g. TG-918273)',
        response: { success: true, data: 'FileMetadata' }
      },
      {
        path: '/download/:id',
        method: 'GET',
        summary: 'Download file directly with attachment disposition stream',
        response: 'Binary file download stream'
      },
      {
        path: '/preview/:id',
        method: 'GET',
        summary: 'Preview file in HTML viewer or return JSON metadata',
        response: 'HTML page or JSON response'
      },
      {
        path: '/api/delete/:id',
        method: 'DELETE',
        summary: 'Delete file metadata and storage',
        response: { success: true, message: 'File deleted' }
      },
      {
        path: '/api/update/:id',
        method: 'PUT',
        summary: 'Update file name, folder, or visibility status',
        body: { file_name: 'string', folder: 'string', status: 'public|private' },
        response: { success: true, data: 'UpdatedFile' }
      },
      {
        path: '/api/search',
        method: 'GET',
        summary: 'Search files by query, category, or folder',
        queryParams: { q: 'string', media_type: 'video|image|audio|pdf|zip|document', folder: 'string' },
        response: { success: true, total: 'number', data: 'FileMetadata[]' }
      },
      {
        path: '/api/files',
        method: 'GET',
        summary: 'Get all files with total storage metrics and category stats',
        response: { success: true, total_files: 'number', total_storage_formatted: 'string', categories: 'Object', data: 'FileMetadata[]' }
      },
      {
        path: '/api/folder',
        method: 'POST',
        summary: 'Create a new folder category',
        body: { name: 'string', color: 'string', description: 'string' }
      },
      {
        path: '/api/folder',
        method: 'DELETE',
        summary: 'Delete folder by name or ID'
      }
    ]
  });
});

export default router;
