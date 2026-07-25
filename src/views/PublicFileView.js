import { state, fetchApi, showToast } from '../utils/api.js';

export function renderPublicFileView() {
  const file = state.publicFileDetails;

  if (!file) {
    return `
      <div class="max-w-2xl mx-auto py-12 text-center space-y-6">
        <div class="pixel-card-yellow p-8 space-y-4">
          <div class="text-4xl animate-pixel-float">❓</div>
          <h2 class="font-pixel text-base text-black">BERKAS TIDAK DITEMUKAN</h2>
          <p class="font-silk text-xs text-black font-semibold">
            Kode berkas tidak valid atau file telah dihapus oleh administrator.
          </p>
          <button onclick="window.navigateToTab('home')" class="pixel-btn-primary px-6 py-2.5 text-xs font-silk">
            &larr; Kembali ke Beranda
          </button>
        </div>
      </div>
    `;
  }

  const downloadUrl = `/download/${file.unique_code || file.id}`;
  const rawUrl = `/raw/${file.unique_code || file.id}`;

  return `
    <div class="max-w-3xl mx-auto py-6 space-y-6">
      <!-- Top Breadcrumb Navigation -->
      <div class="flex items-center justify-between">
        <button onclick="window.navigateToTab('home')" class="pixel-btn px-3.5 py-1.5 text-xs font-silk flex items-center gap-1.5">
          <span>&larr; Beranda</span>
        </button>
        <span class="font-pixel text-[10px] text-[#2cb67d] bg-[#16161e] px-3 py-1 border-2 border-black">
          CODE: ${file.unique_code || file.id}
        </span>
      </div>

      <!-- File Preview Card Pixel Art -->
      <div class="pixel-card p-6 sm:p-8 space-y-6">
        
        <!-- Header Info -->
        <div class="flex items-start gap-4 pb-4 border-b-2 border-black">
          <div class="w-14 h-14 bg-[#ff8e3c] border-2 border-black flex items-center justify-center font-pixel text-black text-2xl shrink-0 shadow-[2px_2px_0px_#000]">
            ${getMediaEmoji(file.media_type)}
          </div>
          <div class="min-w-0 flex-1">
            <h2 class="font-pixel text-sm sm:text-base text-[#fffffe] break-all leading-relaxed">
              ${file.file_name}
            </h2>
            <div class="flex flex-wrap items-center gap-3 mt-2 font-silk text-xs text-gray-400">
              <span class="px-2 py-0.5 bg-[#2cb67d] text-black font-bold border border-black">${file.size || '0 B'}</span>
              <span>Kategori: <strong class="text-[#ff8e3c] uppercase">${file.media_type || 'FILE'}</strong></span>
              <span>Diupload: <strong>${new Date(file.created_at || Date.now()).toLocaleDateString('id-ID')}</strong></span>
            </div>
          </div>
        </div>

        <!-- Interactive Preview Box -->
        <div class="pixel-card bg-[#0f0e17] p-4 space-y-3">
          <h3 class="font-pixel text-xs text-[#2cb67d] flex items-center gap-2">
            <span>📺</span> Pratinjau Berkas
          </h3>
          <div class="flex items-center justify-center min-h-[200px] max-h-[400px] overflow-hidden bg-black/50 border-2 border-black relative">
            ${renderFilePreviewPlayer(file, rawUrl)}
          </div>
        </div>

        <!-- Actions & Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a href="${downloadUrl}" download="${file.file_name}" class="pixel-btn-green py-3 px-3 text-center font-silk text-xs flex items-center justify-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            <span>Unduh Berkas</span>
          </a>

          <button onclick="window.copyPublicShareLink('${file.unique_code}')" class="pixel-btn-primary py-3 px-3 text-center font-silk text-xs flex items-center justify-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            <span>Salin Link</span>
          </button>

          <button onclick="window.deleteFilePrompt('${file.unique_code || file.id}')" class="pixel-btn-danger py-3 px-3 text-center font-silk text-xs flex items-center justify-center gap-1.5">
            <span>🗑️ Hapus Berkas</span>
          </button>
        </div>

        <!-- Meta Counters -->
        <div class="flex items-center justify-between text-xs font-mono text-gray-400 pt-2 border-t border-gray-800">
          <span>Dilihat: <strong class="text-[#2cb67d]">${file.view_count || 1}</strong> kali</span>
          <span>Diunduh: <strong class="text-[#ff8e3c]">${file.download_count || 0}</strong> kali</span>
        </div>

      </div>
    </div>
  `;
}

function renderFilePreviewPlayer(file, rawUrl) {
  const type = file.media_type || '';
  const mime = file.mime_type || '';

  if (type === 'image' || mime.startsWith('image/')) {
    return `<img src="${rawUrl}" alt="${file.file_name}" class="max-h-[380px] object-contain mx-auto" />`;
  }
  if (type === 'video' || mime.startsWith('video/')) {
    return `<video src="${rawUrl}" controls class="w-full max-h-[380px] object-contain rounded-none"></video>`;
  }
  if (type === 'audio' || mime.startsWith('audio/')) {
    return `
      <div class="w-full p-6 text-center space-y-4">
        <div class="text-4xl animate-bounce">🎵</div>
        <audio src="${rawUrl}" controls class="w-full max-w-md mx-auto"></audio>
      </div>
    `;
  }
  if (mime === 'application/pdf' || file.file_name.endsWith('.pdf')) {
    return `<iframe src="${rawUrl}" class="w-full h-[350px] border-none"></iframe>`;
  }

  return `
    <div class="text-center p-8 space-y-3">
      <div class="text-4xl">📄</div>
      <p class="font-silk text-xs text-gray-400">
        Pratinjau langsung tidak tersedia untuk tipe berkas ini. Klik tombol unduh di bawah untuk menyimpan file.
      </p>
    </div>
  `;
}

function getMediaEmoji(type) {
  switch (type) {
    case 'video': return '🎬';
    case 'image': return '🖼️';
    case 'audio': return '🎵';
    case 'zip': return '📦';
    case 'pdf': return '📕';
    default: return '📄';
  }
}
