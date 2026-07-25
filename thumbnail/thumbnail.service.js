/**
 * Thumbnail Generator Service
 */
export class ThumbnailService {
  static getThumbnailType(mediaType, extension) {
    switch (mediaType) {
      case 'video':
        return 'video';
      case 'image':
        return 'image';
      case 'audio':
        return 'audio';
      case 'pdf':
        return 'pdf';
      case 'zip':
        return 'zip';
      case 'docx':
        return 'docx';
      case 'txt':
        return 'txt';
      default:
        return 'document';
    }
  }

  static getCategoryBadgeColor(mediaType) {
    switch (mediaType) {
      case 'video':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'image':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'audio':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'pdf':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'zip':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'docx':
      case 'txt':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  }
}
