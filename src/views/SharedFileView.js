import { state, fetchApi, showToast } from '../utils/api.js';

export async function renderSharedFileView(code) {
  const container = document.createElement('div');
  container.className = 'py-6 max-w-4xl mx-auto space-y-6';

  container.innerHTML = `
    <div class="pixel-card p-8 text-center space-y-4">
      <div class="text-3xl font-pixel animate-spin">⏳</div>
      <p class="font-pixel text-xs text-amber-400">MEMUAT RINCIAN FILE ${code}...</p>
    </div>
  `;

  // Fetch file metadata from API
  const res = await fetchApi(`/api/file/${code}`);

  if (!res || !res.success || !res.data) {
    container.innerHTML = `
      <div class="pixel-card p-8 text-center space-y-4 bg-rose-950/30 border-rose-500">
        <div class="text-4xl font-pixel">❌</div>
        <h2 class="font-pixel text-sm text-rose-400 uppercase">FILE TIDAK DITEMUKAN ATAU DIBATASI</h2>
        <p class="text-xs text-zinc-300 font-sans">
          File dengan kode <code class="font-mono bg-black px-2 py-0.5 text-amber-400 border border-zinc-700">${code}</code> tidak dapat ditemukan atau disetel sebagai file privat oleh administrator.
        </p>
        <div class="pt-4">
          <button onclick="window.navigateToRoute('home')" class="pixel-btn text-xs font-pixel py-2 px-4">
            🏠 KEMBALI KE BERANDA
          </button>
        </div>
      </div>
    `;
    return container.innerHTML;
  }

  const file = res.data;
  const rawUrl = `/raw/${file.unique_code}`;
  const downloadUrl = `/download/${file.unique_code}`;

  container.innerHTML = `
    <!-- Top Back Bar -->
    <div class="flex items-center justify-between">
      <button onclick="window.navigateToRoute('home')" class="pixel-btn-dark text-xs font-pixel py-1.5 px-3 flex items-center gap-2">
        <span>⬅️ BERANDA</span>
      </button>
      <span class="pixel-badge px-2.5 py-1 bg-amber-400 text-black font-pixel text-[10px]">
        KODE: ${file.unique_code}
      </span>
    </div>

    <!-- Main File Card -->
    <div class="pixel-card p-6 md:p-8 space-y-6">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-zinc-800 pb-6">
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="pixel-badge px-2.5 py-0.5 text-[10px] font-pixel uppercase ${
              file.media_type === 'video' ? 'bg-rose-500 text-white' :
              file.media_type === 'image' ? 'bg-emerald-400 text-black' :
              file.media_type === 'audio' ? 'bg-purple-500 text-white' : 'bg-amber-400 text-black'
            }">
              ${file.extension ? file.extension.toUpperCase() : file.media_type}
            </span>
            <span class="font-mono text-xs text-amber-400 font-bold">${file.size}</span>
          </div>

          <h1 class="font-pixel text-lg md:text-xl text-white uppercase tracking-tight break-all">
            ${file.file_name}
          </h1>

          <div class="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 pt-1">
            <span>📅 Diunggah: ${file.upload_date || 'N/A'}</span>
            <span>👁️ Dilihat: ${file.view_count || 0}x</span>
            <span>⬇️ Diunduh: ${file.download_count || 0}x</span>
          </div>
        </div>

        <!-- Direct Actions -->
        <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <a 
            href="${downloadUrl}" 
            target="_blank" 
            class="pixel-btn-green text-xs font-pixel py-3 px-6 text-center flex items-center justify-center gap-2"
          >
            <span>⬇️ UNDUH FILE</span>
          </a>
          <button 
            onclick="window.copyPublicLink('${file.unique_code}')"
            class="pixel-btn text-xs font-pixel py-3 px-4 flex items-center justify-center gap-2"
          >
            <span>📋 SALIN LINK</span>
          </button>
        </div>
      </div>

      <!-- Media Preview Section -->
      <div class="space-y-3">
        <h3 class="font-pixel text-xs text-amber-400 uppercase flex items-center gap-2">
          <span>🖥️</span> PREVIEW MEDIA
        </h3>

        <div class="pixel-card p-4 bg-zinc-950 border-2 border-black flex items-center justify-center min-h-[240px]">
          ${
            file.media_type === 'video' ? `
              <video controls class="w-full max-h-[480px] rounded border border-zinc-800 bg-black">
                <source src="${rawUrl}" type="video/mp4">
                Browser Anda tidak mendukung pemutar video HTML5.
              </video>
            ` : file.media_type === 'image' ? `
              <img src="${rawUrl}" alt="${file.file_name}" class="max-h-[500px] object-contain rounded border border-zinc-800" />
            ` : file.media_type === 'audio' ? `
              <div class="w-full space-y-4 text-center py-6">
                <div class="text-5xl font-pixel animate-pulse">🎵</div>
                <audio controls class="w-full">
                  <source src="${rawUrl}">
                  Browser Anda tidak mendukung pemutar audio HTML5.
                </audio>
              </div>
            ` : `
              <div class="text-center space-y-3 py-8">
                <div class="text-5xl font-pixel">📄</div>
                <p class="font-silk text-xs text-zinc-400">
                  Pratinjau langsung tidak tersedia untuk format ${file.extension ? file.extension.toUpperCase() : 'file'} ini.
                </p>
                <a href="${downloadUrl}" class="pixel-btn-primary inline-flex text-xs font-pixel py-2 px-4">
                  ⬇️ KLIK UNTUK MENGUNDUH
                </a>
              </div>
            `
          }
        </div>
      </div>
    </div>
  `;

  return container.innerHTML;
}
