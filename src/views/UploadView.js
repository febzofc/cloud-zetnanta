import { state } from '../utils/api.js';

export function renderUploadView() {
  const folders = state.folders || [];
  const modalData = state.uploadSuccessModal;

  return `
    <div class="space-y-6 max-w-4xl mx-auto py-2 relative">
      ${modalData ? renderUploadSuccessModal(modalData) : ''}
      <!-- Saweria Pixel Header -->
      <div class="pixel-card-purple p-6 space-y-2">
        <span class="pixel-badge px-2.5 py-1 bg-black text-amber-400 font-pixel text-[10px]">
          📤 MODUL UNGGAH
        </span>
        <h1 class="font-pixel text-xl uppercase font-black text-white tracking-tight">
          UNGGAH BERKAS KE CLOUD TELEGRAM
        </h1>
        <p class="text-xs text-purple-200">
          Pilih atau seret berkas untuk diunggah ke repositori Telegram. Batas maksimum per berkas hingga 2,000 MB.
        </p>
      </div>

      <!-- Upload Form Card -->
      <div class="pixel-card p-6 space-y-6 bg-zinc-900">
        <!-- Target Folder & Options -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="block font-pixel text-[10px] text-amber-400 uppercase">FOLDER TUJUAN</label>
            <select id="upload-folder-select" class="pixel-input w-full px-3.5 py-2.5 text-xs font-mono text-white bg-zinc-950">
              <option value="Root">Root (Folder Utama)</option>
              ${folders.map(f => `<option value="${f.name}">${f.name}</option>`).join('')}
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="block font-pixel text-[10px] text-amber-400 uppercase">STATUS HAK AKSES</label>
            <select id="upload-status-select" class="pixel-input w-full px-3.5 py-2.5 text-xs font-mono text-white bg-zinc-950">
              <option value="public">Publik (Bisa Diakses Pengguna Lewat Link)</option>
              <option value="private">Privat (Hanya Bisa Dilihat Admin)</option>
            </select>
          </div>
        </div>

        <!-- Drag & Drop Dropzone in Saweria Style -->
        <div 
          id="dropzone"
          class="pixel-card p-8 text-center cursor-pointer bg-zinc-950 border-2 border-amber-400 hover:bg-zinc-900/80 transition group relative space-y-4"
        >
          <input type="file" id="file-input" multiple class="hidden" />
          <input type="file" id="folder-input" webkitdirectory directory multiple class="hidden" />

          <div class="w-16 h-16 mx-auto bg-amber-400 text-black border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center font-pixel text-2xl group-hover:scale-105 transition">
            ☁️
          </div>

          <div class="space-y-1">
            <h3 class="font-pixel text-xs text-white uppercase">SERET & LEPAS FILE DI SINI</h3>
            <p class="text-[11px] text-zinc-400 font-sans max-w-sm mx-auto">
              Mendukung Video (.mp4, .mkv), Gambar (.png, .jpg), Audio (.mp3), ZIP/RAR, PDF, dan Dokumen
            </p>
          </div>

          <div class="flex items-center justify-center gap-3 pt-2">
            <button type="button" onclick="document.getElementById('file-input').click()" class="pixel-btn text-xs font-pixel py-2.5 px-4">
              📂 PILIH FILE
            </button>
            <button type="button" onclick="document.getElementById('folder-input').click()" class="pixel-btn-primary text-xs font-pixel py-2.5 px-4">
              📁 PILIH FOLDER
            </button>
          </div>
        </div>

        <!-- Selected Files Queue -->
        <div id="queue-container" class="hidden space-y-4 border-t-2 border-zinc-800 pt-4">
          <div class="flex items-center justify-between text-xs font-pixel text-amber-400">
            <span>DAFTAR UNGGAHAN (<span id="queue-count">0</span> FILE)</span>
            <button type="button" onclick="window.clearUploadQueue()" class="text-rose-400 hover:underline">Bersihkan</button>
          </div>

          <div id="queue-list" class="space-y-2 max-h-48 overflow-y-auto pr-1"></div>

          <!-- Upload Progress Bar in Retro Style -->
          <div id="progress-container" class="hidden space-y-2 pt-2">
            <div class="flex items-center justify-between text-xs font-mono">
              <span id="progress-status" class="text-amber-400 font-bold">Mengirim data ke Telegram API...</span>
              <span id="progress-percent" class="text-white font-pixel">0%</span>
            </div>
            <div class="w-full bg-zinc-950 h-4 border-2 border-black p-0.5 shadow-[2px_2px_0px_#000]">
              <div id="progress-bar" class="bg-amber-400 h-full w-0 transition-all duration-300"></div>
            </div>
          </div>

          <!-- Upload Action Button -->
          <button id="btn-start-upload" onclick="window.executeUpload()" class="pixel-btn-green w-full text-xs font-pixel py-3.5 uppercase flex items-center justify-center gap-2">
            <span>🚀 MULAI UNGGAH KE TELEGRAM CLOUD</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderUploadSuccessModal(file) {
  const shareUrl = `${window.location.origin}/#file/${file.unique_code}`;

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div class="pixel-card bg-[#16161e] border-4 border-[#2cb67d] max-w-xl w-full p-5 sm:p-6 space-y-4 sm:space-y-5 shadow-[8px_8px_0px_#000] relative">
        
        <div class="flex items-start justify-between border-b-2 border-black pb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#2cb67d] border-2 border-black flex items-center justify-center font-pixel text-black text-lg shrink-0">
              🎉
            </div>
            <div>
              <h3 class="font-pixel text-xs sm:text-sm text-[#fffffe] uppercase">UNGGAHAN BERHASIL!</h3>
              <p class="font-silk text-[11px] sm:text-xs text-[#2cb67d]">Berkas Anda telah tersimpan di Cloud Telegram.</p>
            </div>
          </div>
          <button onclick="window.closePostUploadModal()" class="font-pixel text-lg text-gray-400 hover:text-white px-2">&times;</button>
        </div>

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

        <div class="p-3 bg-[#e53170]/10 border-2 border-[#e53170] space-y-1">
          <div class="flex items-center gap-2 text-[#e53170] font-pixel text-xs">
            <span>⚠️</span>
            <span>CATATAN PENTING & REMINDER</span>
          </div>
          <p class="font-silk text-[11px] sm:text-xs text-gray-200 leading-relaxed">
            Harap <strong>CATAT dan SIMPAN ID FILE</strong> (<code class="text-[#ff8e3c] font-bold bg-black px-1">${file.unique_code}</code>) atau link di atas! Anda memerlukan ID File ini jika ingin mengunduh atau menghapus berkas.
          </p>
        </div>

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
