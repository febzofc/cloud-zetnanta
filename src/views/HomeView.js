import { state } from '../utils/api.js';
import { renderPixelScrollWorld } from '../components/PixelScrollWorld.js';

export function renderHomeView() {
  const totalFiles = state.stats.totalFiles || 0;
  const totalStorage = state.stats.totalStorage || '0 B';
  const modalData = state.uploadSuccessModal;

  return `
    <div class="space-y-8 max-w-5xl mx-auto py-4 relative">
      
      <!-- Post-Upload Success Notification Modal -->
      ${modalData ? renderPostUploadModal(modalData) : ''}

      <!-- Hero Banner Saweria Pixel Style with Integrated 3D Background -->
      <div class="pixel-card-yellow p-6 sm:p-8 relative overflow-hidden text-center sm:text-left flex flex-col justify-between gap-6 min-h-[300px] border-4 border-black shadow-[8px_8px_0px_#000]">
        
        <!-- Interactive 3D Pixel Canvas Background Layer -->
        ${renderPixelScrollWorld()}

        <!-- Top HUD Controls for 3D Background Engine -->
        <div class="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-black/80 bg-[#000000] p-2.5 border-2 border-black backdrop-blur-sm text-xs">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 bg-[#2cb67d] border border-black animate-pulse"></span>
            <span class="font-pixel text-[10px] text-[#fffffe] uppercase tracking-wide">3D PIXEL SCROLL ENGINE</span>
            <span class="hidden sm:inline-block px-1.5 py-0.5 bg-[#2cb67d] text-black text-[9px] font-mono font-bold border border-black">3D BACKGROUND</span>
          </div>

          <div class="flex items-center gap-2 text-[10px] font-silk">
            <button type="button" onclick="window.togglePixel3DRotation()" id="btn-3d-rotate" class="pixel-btn-primary px-2 py-1 flex items-center gap-1" title="Putar/Hentikan Kamera 3D">
              <span>🔄 Rotasi: ON</span>
            </button>
            <button type="button" onclick="window.changePixel3DTheme()" class="pixel-btn-green px-2 py-1 flex items-center gap-1" title="Ganti Tema Warna 3D">
              <span>🎨 Tema</span>
            </button>
            <button type="button" onclick="window.resetPixel3DCamera()" class="pixel-btn px-2 py-1 flex items-center gap-1" title="Reset Posisi Kamera">
              <span>🎯 Reset</span>
            </button>
          </div>
        </div>

        <!-- Hero Main Content Overlay -->
        <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="space-y-3 max-w-xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-black text-[#fffffe] border-2 border-black text-xs font-pixel shadow-[2px_2px_0px_#000]">
              <span class="w-2 h-2 bg-[#2cb67d] animate-pulse"></span>
              ZETNANTA CLOUD PUBLIC ENGINE
            </div>
            <h2 class="font-pixel text-xl sm:text-3xl text-[#6bff00] leading-snug drop-shadow-sm">
              SIMPAN & BAGIKAN BERKAS <span class="bg-black text-[#3cffef] px-2 py-0.5 border border-black">GRATIS</span>
            </h2>
            <p class="font-silk text-xs sm:text-sm text-black font-semibold bg-amber-400/90 border-2 border-black p-2.5 shadow-[2px_2px_0px_#000]">
              Unggah file Anda secara publik ke Cloud Telegram dengan aman. Dapatkan ID File unik untuk mengunduh atau menghapus berkas kapan saja!
            </p>
            <div class="flex flex-wrap gap-2.5 pt-1 justify-center sm:justify-start">
              <a href="#public-upload-section" class="pixel-btn-green px-4 py-2 text-xs font-silk flex items-center gap-2">
                <span>📤 Unggah File Sekarang</span>
              </a>
              <a href="#public-tools-section" class="pixel-btn-primary px-4 py-2 text-xs font-silk flex items-center gap-2">
                <span>🔍 Download / Hapus File</span>
              </a>
            </div>
          </div>

          <!-- Pixel Mascot Accent -->
          <div class="w-28 h-28 sm:w-36 sm:h-36 bg-[#7f5af0] border-4 border-black shadow-[4px_4px_0px_#000] flex flex-col items-center justify-center p-3 text-center shrink-0 animate-pixel-float relative z-10">
            <div class="w-10 h-10 bg-[#fffffe] border-2 border-black flex items-center justify-center font-pixel text-black text-lg font-bold mb-1">
              ☁️
            </div>
            <span class="font-pixel text-[8px] text-[#fffffe] uppercase tracking-wider">PUBLIC CLOUD</span>
          </div>
        </div>
      </div>

      <!-- Public Upload Form Section -->
      <div id="public-upload-section" class="pixel-card p-6 space-y-4 bg-[#16161e]">
        <div class="flex items-center justify-between border-b-2 border-black pb-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-[#2cb67d] border-2 border-black flex items-center justify-center font-pixel text-black text-sm font-bold">
              📤
            </div>
            <div>
              <h3 class="font-pixel text-sm text-[#fffffe] uppercase">UNGGAH FILE PUBLIK</h3>
              <p class="font-silk text-xs text-gray-400">Unggah berkas tanpa perlu login. ID File & Link akan diberikan setelah unggah selesai.</p>
            </div>
          </div>
          <span class="hidden sm:inline-block pixel-badge px-2.5 py-1 bg-[#ff8e3c] text-black font-pixel text-[10px]">
            PUBLIC CHANNEL
          </span>
        </div>

        <!-- Dropzone -->
        <div 
          id="home-dropzone"
          class="pixel-card p-6 text-center cursor-pointer bg-[#0f0e17] border-2 border-[#2cb67d] hover:bg-[#16161e] transition group space-y-3"
        >
          <input type="file" id="home-file-input" multiple class="hidden" />

          <div class="w-14 h-14 mx-auto bg-[#2cb67d] text-black border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center font-pixel text-xl group-hover:scale-105 transition">
            📂
          </div>

          <div class="space-y-1">
            <h4 class="font-pixel text-xs text-[#fffffe] uppercase">SERET & LEPAS FILE ATAU KLIK UNTUK MEMILIH</h4>
            <p class="text-[11px] text-gray-400 font-silk max-w-md mx-auto">
              Mendukung semua format berkas (Gambar, Video, ZIP, Document, PDF, Audio) hingga 2,000 MB per berkas.
            </p>
          </div>

          <button type="button" onclick="document.getElementById('home-file-input').click()" class="pixel-btn-green text-xs font-pixel py-2 px-4 inline-flex items-center gap-2">
            <span>📁 PILIH BERKAS DARI PERANGKAT</span>
          </button>
        </div>

        <!-- Selected Queue Container -->
        <div id="home-queue-container" class="hidden space-y-3 border-t-2 border-black pt-3">
          <div class="flex items-center justify-between text-xs font-pixel text-[#ff8e3c]">
            <span>BERKAS DIPILIH (<span id="home-queue-count">0</span>)</span>
            <button type="button" onclick="window.clearHomeUploadQueue()" class="text-rose-400 hover:underline">Bersihkan</button>
          </div>

          <div id="home-queue-list" class="space-y-2 max-h-40 overflow-y-auto pr-1"></div>

          <!-- Progress Bar -->
          <div id="home-progress-container" class="hidden space-y-2 pt-2">
            <div class="flex items-center justify-between text-xs font-mono">
              <span id="home-progress-status" class="text-[#2cb67d] font-bold">Mengirim ke Telegram Cloud...</span>
              <span id="home-progress-percent" class="text-[#fffffe] font-pixel">0%</span>
            </div>
            <div class="w-full bg-[#0f0e17] h-4 border-2 border-black p-0.5 shadow-[2px_2px_0px_#000]">
              <div id="home-progress-bar" class="bg-[#2cb67d] h-full w-0 transition-all duration-300"></div>
            </div>
          </div>

          <button id="home-btn-upload" onclick="window.executeHomePublicUpload()" class="pixel-btn-green w-full text-xs font-pixel py-3 uppercase flex items-center justify-center gap-2">
            <span>🚀 MULAI UNGGAH SEKARANG</span>
          </button>
        </div>
      </div>

      <!-- Tools Grid: Download & Delete via ID or Link -->
      <div id="public-tools-section" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Tool 1: Download File via ID/Link -->
        <div class="pixel-card p-6 space-y-4 bg-[#16161e]">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-[#ff8e3c] border-2 border-black flex items-center justify-center font-pixel text-black text-xs font-bold shrink-0">
              📥
            </div>
            <div>
              <h3 class="font-pixel text-xs text-[#fffffe] uppercase">UNDUH BERKAS</h3>
              <p class="font-silk text-[11px] text-gray-400">Masukkan ID File atau Link Tautan untuk mengunduh.</p>
            </div>
          </div>

          <form onsubmit="window.handleQuickAccessFile(event)" class="space-y-3">
            <input 
              type="text" 
              id="quick-file-input" 
              placeholder="Contoh ID: f_k9a2b atau Tempel Link..." 
              class="pixel-input w-full px-3.5 py-2.5 text-xs font-mono"
              required
            />
            <button type="submit" class="pixel-btn-green w-full py-2.5 text-xs font-pixel flex items-center justify-center gap-2">
              <span>🔍 CARI & UNDUH BERKAS</span>
            </button>
          </form>
        </div>

        <!-- Tool 2: Delete File via ID/Link -->
        <div class="pixel-card p-6 space-y-4 bg-[#16161e]">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-[#e53170] border-2 border-black flex items-center justify-center font-pixel text-white text-xs font-bold shrink-0">
              🗑️
            </div>
            <div>
              <h3 class="font-pixel text-xs text-[#fffffe] uppercase">HAPUS BERKAS PUBLIK</h3>
              <p class="font-silk text-[11px] text-gray-400">Masukkan ID File yang Anda miliki untuk menghapus berkas.</p>
            </div>
          </div>

          <form onsubmit="window.handlePublicDeleteFile(event)" class="space-y-3">
            <input 
              type="text" 
              id="delete-file-input" 
              placeholder="Masukkan ID File (misal: f_k9a2b)..." 
              class="pixel-input w-full px-3.5 py-2.5 text-xs font-mono border-rose-500 focus:border-rose-400"
              required
            />
            <button type="submit" class="pixel-btn-danger w-full py-2.5 text-xs font-pixel flex items-center justify-center gap-2">
              <span>🗑️ HAPUS BERKAS SEKARANG</span>
            </button>
          </form>
        </div>

      </div>

      <!-- Feature Highlights -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div class="pixel-card p-5 space-y-2.5 hover:border-[#ff8e3c] transition">
          <div class="w-9 h-9 bg-[#2cb67d] border-2 border-black flex items-center justify-center font-pixel text-black text-xs">
            ⚡
          </div>
          <h4 class="font-pixel text-xs text-[#fffffe]">Kecepatan Maksimal</h4>
          <p class="font-silk text-xs text-gray-400 leading-relaxed">
            Streaming & unduhan langsung dari jaringan Telegram berkecepatan tinggi tanpa batasan kuota.
          </p>
        </div>

        <div class="pixel-card p-5 space-y-2.5 hover:border-[#ff8e3c] transition">
          <div class="w-9 h-9 bg-[#7f5af0] border-2 border-black flex items-center justify-center font-pixel text-white text-xs">
            🆔
          </div>
          <h4 class="font-pixel text-xs text-[#fffffe]">Sistem ID Unik</h4>
          <p class="font-silk text-xs text-gray-400 leading-relaxed">
            Setiap unggahan menghasilkan ID File unik. Catat ID Anda untuk keperluan pengunduhan dan penghapusan di kemudian hari.
          </p>
        </div>

        <div class="pixel-card p-5 space-y-2.5 hover:border-[#ff8e3c] transition">
          <div class="w-9 h-9 bg-[#ff8e3c] border-2 border-black flex items-center justify-center font-pixel text-black text-xs">
            🔐
          </div>
          <h4 class="font-pixel text-xs text-[#fffffe]">Private Cloud Admin</h4>
          <p class="font-silk text-xs text-gray-400 leading-relaxed">
            Portal khusus Administrator untuk mengelola repositori privat dan folder tingkat lanjut.
          </p>
        </div>

      </div>

      <!-- Status Footer -->
      <div class="pixel-card bg-[#0f0e17] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-dashed">
        <div class="flex items-center gap-3">
          <span class="w-3 h-3 bg-[#2cb67d] border border-black animate-pulse"></span>
          <span class="font-silk text-xs text-[#fffffe]">Status Sistem: <strong>ONLINE</strong></span>
        </div>
        <div class="flex items-center gap-4 text-xs font-mono text-gray-400">
          <span>Total File: <strong class="text-[#ff8e3c]">${totalFiles}</strong></span>
          <span>•</span>
          <span>Kapasitas: <strong class="text-[#2cb67d]">${totalStorage}</strong></span>
        </div>
      </div>

    </div>
  `;
}

function renderPostUploadModal(file) {
  const shareUrl = `${window.location.origin}/#file/${file.unique_code}`;

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div class="pixel-card bg-[#16161e] border-4 border-[#2cb67d] max-w-xl w-full p-5 sm:p-6 space-y-4 sm:space-y-5 shadow-[8px_8px_0px_#000] relative">
        
        <!-- Modal Header -->
        <div class="flex items-start justify-between border-b-2 border-black pb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#2cb67d] border-2 border-black flex items-center justify-center font-pixel text-black text-lg shrink-0">
              🎉
            </div>
            <div>
              <h3 class="font-pixel text-xs sm:text-sm text-[#fffffe] uppercase">UNGGAHAN BERHASIL!</h3>
              <p class="font-silk text-[11px] sm:text-xs text-[#2cb67d]">Berkas Anda telah berhasil disimpan di Cloud Telegram.</p>
            </div>
          </div>
          <button onclick="window.closePostUploadModal()" class="font-pixel text-lg text-gray-400 hover:text-white px-2">&times;</button>
        </div>

        <!-- File Details Card -->
        <div class="bg-[#0f0e17] border-2 border-black p-3.5 sm:p-4 space-y-3 font-mono text-xs">
          <div class="flex items-center justify-between border-b border-gray-800 pb-2 gap-2">
            <span class="text-gray-400 shrink-0">Nama Berkas:</span>
            <span class="text-[#fffffe] font-bold truncate max-w-[200px] sm:max-w-xs">${file.file_name}</span>
          </div>

          <div class="flex items-center justify-between border-b border-gray-800 pb-2">
            <span class="text-gray-400">Ukuran Berkas:</span>
            <span class="text-[#2cb67d] font-bold">${file.size}</span>
          </div>

          <div class="flex items-center justify-between border-b border-gray-800 pb-2">
            <span class="text-gray-400">ID File (Penting):</span>
            <span class="text-[#ff8e3c] font-pixel text-xs sm:text-sm font-bold bg-black px-2 py-0.5 border border-[#ff8e3c]">${file.unique_code}</span>
          </div>

          <!-- Original Link -->
          <div class="space-y-1 pt-1">
            <span class="text-gray-400 block text-[11px]">Link Download Asli:</span>
            <div class="flex gap-2">
              <input type="text" readonly value="${shareUrl}" class="pixel-input w-full px-2.5 py-1.5 text-[11px] text-gray-300 font-mono bg-black" />
              <button onclick="window.copyTextToClipboard('${shareUrl}', 'Link Download')" class="pixel-btn px-2.5 py-1 text-[10px] shrink-0 font-silk">
                Salin
              </button>
            </div>
          </div>

          <!-- Short URL (TinyURL) -->
          <div class="space-y-1 pt-2 border-t border-gray-800">
            <div class="flex items-center justify-between">
              <span class="text-[#3cffef] font-bold block text-[11px] flex items-center gap-1">
                <span>✂️</span> Short URL (TinyURL):
              </span>
              <span id="short-url-status" class="text-[10px] text-[#2cb67d] font-mono">
                ${file.short_url ? '✓ Siap' : ''}
              </span>
            </div>
            <div class="flex gap-2">
              <input type="text" id="modal-short-url-input" readonly placeholder="Membuka TinyURL..." value="${file.short_url || ''}" class="pixel-input w-full px-2.5 py-1.5 text-[11px] text-[#3cffef] font-mono bg-black" />
              <button id="btn-generate-short-url" onclick="window.generateShortUrlModal('${shareUrl}')" class="pixel-btn-primary px-3 py-1.5 text-[10px] font-silk shrink-0 flex items-center justify-center gap-1">
                <span id="btn-short-url-text">${file.short_url ? '📋 Salin Short URL' : '⚡ Perpendek URL'}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- WARNING & REMINDER BOX -->
        <div class="p-3 bg-[#e53170]/10 border-2 border-[#e53170] space-y-1">
          <div class="flex items-center gap-2 text-[#e53170] font-pixel text-xs">
            <span>⚠️</span>
            <span>CATATAN PENTING & REMINDER</span>
          </div>
          <p class="font-silk text-[11px] sm:text-xs text-gray-200 leading-relaxed">
            Harap <strong>CATAT dan SIMPAN ID FILE</strong> (<code class="text-[#ff8e3c] font-bold bg-black px-1">${file.unique_code}</code>) atau link di atas! Anda memerlukan ID File ini jika ingin mengunduh atau menghapus berkas.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <button onclick="window.copyTextToClipboard('${file.unique_code}', 'ID File')" class="pixel-btn-primary py-2 px-2 text-[10px] sm:text-[11px] font-silk flex items-center justify-center gap-1">
            📋 Salin ID
          </button>
          <button onclick="window.copyTextToClipboard('${shareUrl}', 'Link Download')" class="pixel-btn-green py-2 px-2 text-[10px] sm:text-[11px] font-silk flex items-center justify-center gap-1">
            🔗 Link Asli
          </button>
          <button onclick="window.generateShortUrlModal('${shareUrl}')" class="pixel-btn-purple py-2 px-2 text-[10px] sm:text-[11px] font-silk flex items-center justify-center gap-1">
            ✂️ Short URL
          </button>
          <button onclick="window.closePostUploadModal(); window.location.hash='file/${file.unique_code}';" class="pixel-btn py-2 px-2 text-[10px] sm:text-[11px] font-silk flex items-center justify-center gap-1">
            📥 Lihat
          </button>
        </div>

      </div>
    </div>
  `;
}
