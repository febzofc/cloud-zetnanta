import path from 'path';

/**
 * Format raw byte size into human readable string (KB, MB, GB, TB)
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Generate unique Telegram Code (e.g. TG-918273)
 */
export function generateUniqueCode() {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `TG-${randomNum}`;
}

/**
 * Detect media_type based on file extension
 */
export function detectMediaType(filename) {
  const ext = path.extname(filename).toLowerCase().replace('.', '');
  
  const videoExts = ['mp4', 'mkv', 'avi', 'mov', 'webm', 'flv', 'wmv', 'm4v'];
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff'];
  const audioExts = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma'];
  const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'];
  const pdfExts = ['pdf'];
  const docExts = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods'];
  const textExts = ['txt', 'md', 'json', 'js', 'ts', 'css', 'html', 'py', 'java', 'c', 'cpp', 'sh', 'xml', 'yaml', 'yml', 'log'];

  if (videoExts.includes(ext)) return { type: 'video', ext };
  if (imageExts.includes(ext)) return { type: 'image', ext };
  if (audioExts.includes(ext)) return { type: 'audio', ext };
  if (pdfExts.includes(ext)) return { type: 'pdf', ext };
  if (archiveExts.includes(ext)) return { type: 'zip', ext };
  if (docExts.includes(ext)) return { type: 'docx', ext };
  if (textExts.includes(ext)) return { type: 'txt', ext };

  return { type: 'document', ext: ext || 'bin' };
}

/**
 * Get MIME Type based on file name or extension
 */
export function getMimeType(filename = '', ext = '') {
  const extension = (ext || path.extname(filename).replace('.', '')).toLowerCase();
  const mimeMap = {
    // Videos
    mp4: 'video/mp4',
    mkv: 'video/x-matroska',
    webm: 'video/webm',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',
    flv: 'video/x-flv',
    wmv: 'video/x-ms-wmv',
    m4v: 'video/mp4',
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    bmp: 'image/bmp',
    ico: 'image/x-icon',
    tiff: 'image/tiff',
    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    m4a: 'audio/mp4',
    flac: 'audio/flac',
    aac: 'audio/aac',
    // Documents & Text
    pdf: 'application/pdf',
    txt: 'text/plain; charset=utf-8',
    html: 'text/html; charset=utf-8',
    css: 'text/css',
    js: 'application/javascript',
    json: 'application/json',
    xml: 'application/xml',
    // Archives
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    tar: 'application/x-tar',
    gz: 'application/gzip',
    // Office
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  };
  return mimeMap[extension] || 'application/octet-stream';
}

/**
 * Format Date strings YYYY-MM-DD and HH:mm
 */
export function getDateTimeParts() {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
  return { dateStr, timeStr, isoStr: now.toISOString() };
}
