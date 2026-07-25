import { state } from '../utils/api.js';

export function renderDashboardView() {
  const { totalFiles, totalStorage, categories, apiRequests } = state.stats;
  const recentFiles = state.files.slice(0, 5);
  const hasTgToken = Boolean(state.settings && state.settings.telegram_token);

  return `
    <div class="space-y-6 max-w-5xl mx-auto py-2">
      <!-- Admin Header Badge Card -->
      <div class="pixel-card-purple p-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-2 px-2.5 py-0.5 bg-black text-[#fffffe] text-[10px] font-pixel border border-black">
            <span class="w-2 h-2 bg-[#2cb67d] animate-pulse"></span>
            STATUS: ${hasTgToken ? 'TELEGRAM ONLINE' : 'READY ENGINE'}
          </div>
          <h2 class="font-pixel text-lg sm:text-xl text-white">DASHBOARD ADMINISTRATOR</h2>
          <p class="font-silk text-xs text-gray-200">
            Selamat datang, <strong class="text-[#ff8e3c]">${state.user?.username || 'febri'}</strong>! Kelola seluruh berkas cloud dari panel kontrol ini.
          </p>
        </div>

        <button onclick="window.navigateToTab('upload')" class="pixel-btn py-2.5 px-4 text-xs font-silk shrink-0 flex items-center gap-2">
          <span>+ Upload Berkas Baru</span>
        </button>
      </div>

      <!-- Stats Grid Pixel Art -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="pixel-card p-4 space-y-2">
          <p class="font-pixel text-[10px] text-gray-400 uppercase">Total Files</p>
          <h3 class="font-pixel text-xl sm:text-2xl text-[#ff8e3c]">${totalFiles}</h3>
        </div>

        <div class="pixel-card p-4 space-y-2">
          <p class="font-pixel text-[10px] text-gray-400 uppercase">Storage Used</p>
          <div class="flex items-baseline gap-2">
            <h3 class="font-pixel text-xl sm:text-2xl text-[#2cb67d]">${totalStorage}</h3>
          </div>
        </div>

        <div class="pixel-card p-4 space-y-2">
          <p class="font-pixel text-[10px] text-gray-400 uppercase">API Requests</p>
          <h3 class="font-pixel text-xl sm:text-2xl text-[#7f5af0]">${apiRequests}</h3>
        </div>

        <div class="pixel-card p-4 space-y-2">
          <p class="font-pixel text-[10px] text-gray-400 uppercase">Kecepatan</p>
          <h3 class="font-pixel text-xl sm:text-2xl text-[#fffffe]">14.2 <span class="text-xs font-silk text-gray-400">MB/s</span></h3>
        </div>
      </div>

      <!-- Main Section: Recent Uploads & Media Breakdown -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Recent Files Column -->
        <div class="lg:col-span-7 pixel-card p-6 flex flex-col space-y-4">
          <div class="flex items-center justify-between pb-3 border-b-2 border-black">
            <h3 class="font-pixel text-xs text-[#ff8e3c]">UPLOAD TERBARU</h3>
            <button onclick="window.navigateToTab('file-manager')" class="font-silk text-xs text-[#2cb67d] hover:underline">Semua File &rarr;</button>
          </div>

          <div class="space-y-3">
            ${recentFiles.length === 0 ? `
              <div class="text-center py-10 font-silk text-xs text-gray-500">Belum ada file diupload</div>
            ` : recentFiles.map(file => `
              <div class="flex items-center justify-between p-3 bg-[#0f0e17] border-2 border-black shadow-[2px_2px_0px_#000] hover:border-[#ff8e3c] transition">
                <div class="min-w-0 flex items-center gap-3">
                  <span class="text-lg">${getMediaEmoji(file.media_type)}</span>
                  <div class="min-w-0">
                    <p class="font-silk text-xs font-bold text-[#fffffe] truncate">${file.file_name}</p>
                    <p class="font-mono text-[10px] text-gray-400">${file.size} • ${file.folder || 'Utama'}</p>
                  </div>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <button onclick="window.copyPublicShareLink('${file.unique_code}')" class="pixel-btn px-2.5 py-1 text-[10px] font-silk">
                    Salin Link
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Quick Actions & Media Distribution -->
        <div class="lg:col-span-5 space-y-6">
          <div class="pixel-card p-6 space-y-4">
            <h3 class="font-pixel text-xs text-[#7f5af0]">DISTRIBUSI MEDIA</h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-[#0f0e17] border-2 border-black">
                <p class="font-silk text-[11px] text-gray-400">Video</p>
                <p class="font-pixel text-base text-[#ff8e3c] mt-1">${categories.video || 0}</p>
              </div>
              <div class="p-3 bg-[#0f0e17] border-2 border-black">
                <p class="font-silk text-[11px] text-gray-400">Gambar</p>
                <p class="font-pixel text-base text-[#2cb67d] mt-1">${categories.image || 0}</p>
              </div>
              <div class="p-3 bg-[#0f0e17] border-2 border-black">
                <p class="font-silk text-[11px] text-gray-400">Audio</p>
                <p class="font-pixel text-base text-[#7f5af0] mt-1">${categories.audio || 0}</p>
              </div>
              <div class="p-3 bg-[#0f0e17] border-2 border-black">
                <p class="font-silk text-[11px] text-gray-400">Dokumen/Zip</p>
                <p class="font-pixel text-base text-white mt-1">${(categories.document || 0) + (categories.pdf || 0) + (categories.zip || 0)}</p>
              </div>
            </div>
          </div>

          <div class="pixel-card-yellow p-6 text-center space-y-3">
            <div class="text-3xl">📤</div>
            <h4 class="font-pixel text-xs text-black">UPLOAD BERKAS</h4>
            <p class="font-silk text-xs text-black font-semibold">
              Mendukung semua format hingga 2GB langsung ke Telegram Cloud.
            </p>
            <button onclick="window.navigateToTab('upload')" class="pixel-btn-primary px-6 py-2.5 text-xs font-silk">
              Buka Form Upload
            </button>
          </div>
        </div>
      </div>
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
