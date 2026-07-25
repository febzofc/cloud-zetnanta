import { dbService } from '../../services/db.service.js';

export class FolderController {
  /**
   * GET /api/folders
   */
  static getFolders(req, res) {
    const folders = dbService.getFolders();
    const files = dbService.getFiles();

    // Recalculate file count per folder
    const foldersWithCounts = folders.map(f => {
      const count = files.filter(file => file.folder.toLowerCase() === f.name.toLowerCase()).length;
      return { ...f, file_count: count };
    });

    return res.json({ success: true, data: foldersWithCounts });
  }

  /**
   * POST /api/folder
   */
  static createFolder(req, res) {
    const { name, color = 'indigo', description = '' } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Folder name is required' });
    }

    const cleanName = name.trim();
    const folderId = 'fld_' + Date.now().toString(36);
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_');

    const newFolder = {
      id: folderId,
      name: cleanName,
      slug,
      color,
      description,
      file_count: 0,
      created_at: new Date().toISOString()
    };

    const saved = dbService.saveFolder(newFolder);
    return res.status(201).json({ success: true, message: 'Folder created successfully', data: saved });
  }

  /**
   * DELETE /api/folder or DELETE /api/folder/:id
   */
  static deleteFolder(req, res) {
    const folderId = req.params.id || req.body.id || req.body.name;
    if (!folderId) {
      return res.status(400).json({ success: false, message: 'Folder ID or Name required' });
    }

    const deleted = dbService.deleteFolder(folderId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    return res.json({ success: true, message: `Folder ${deleted.name} deleted successfully`, data: deleted });
  }
}
