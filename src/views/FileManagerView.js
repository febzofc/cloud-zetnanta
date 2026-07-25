import { state } from '../utils/api.js';

export function renderFileManagerView() {
  const files = state.files || [];
  const folders = state.folders || [];

  return `
    <div class="space-y-6 max-w-5xl mx-auto py-2">
      <!-- Title & Search Header in Saweria Pixel Card Style -->
      <div class="pixel-card p-5 space-y-4 bg-zinc-900">
        <div class="flex items-center justify-between border-b-2 border-zinc-800 pb-3">
          <h2 class="font-pixel text-sm text-amber-400 uppercase flex items-center gap-2">
            <span>📂</span> MANAJEMEN BERKAS (ADMIN)
          </h2>
          <span class="pixel-badge px-2.5 py-1 bg-amber-400 text-black font-pixel text-[10px]">
            ${files.length} BERKAS
          </span>
        </div>

        <!-- Search Input -->
        <div class="space-y-1.5">
          <input 
            type="text" 
            id="search-file-input"
            oninput="window.filterFilesList()"
            placeholder="🔍 Cari nama file, kode unik, atau folder..."
            class="pixel-input w-full px-4 py-2.5 text-xs font-mono text-white placeholder-zinc-500 bg-zinc-950"
          />
        </div>

        <!-- Category & Folder Filters -->
        <div class="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div class="flex flex-wrap items-center gap-1.5" id="category-filter-buttons">
            <button onclick="window.setCategoryFilter('all')" class="cat-btn pixel-btn text-[10px] py-1 px-3" data-cat="all">SEMUA</button>
            <button onclick="window.setCategoryFilter('video')" class="cat-btn pixel-btn-dark text-[10px] py-1 px-3" data-cat="video">VIDEO</button>
            <button onclick="window.setCategoryFilter('image')" class="cat-btn pixel-btn-dark text-[10px] py-1 px-3" data-cat="image">GAMBAR</button>
            <button onclick="window.setCategoryFilter('audio')" class="cat-btn pixel-btn-dark text-[10px] py-1 px-3" data-cat="audio">AUDIO</button>
            <button onclick="window.setCategoryFilter('pdf')" class="cat-btn pixel-btn-dark text-[10px] py-1 px-3" data-cat="pdf">PDF</button>
            <button onclick="window.setCategoryFilter('zip')" class="cat-btn pixel-btn-dark text-[10px] py-1 px-3" data-cat="zip">ZIP</button>
          </div>

          <div class="flex items-center gap-2">
            <select id="folder-filter-select" onchange="window.filterFilesList()" class="pixel-input px-3 py-1.5 text-xs font-mono text-white bg-zinc-950">
              <option value="all">Semua Folder</option>
              <option value="Root">Root</option>
              ${folders.map(f => `<option value="${f.name}">${f.name}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>

      <!-- Files Container -->
      <div id="file-list-container" class="space-y-3">
        ${renderFilesList(files)}
      </div>
    </div>
  `;
}

export function renderFilesList(filesToRender) {
  if (filesToRender.length === 0) {
    return `
      <div class="pixel-card p-10 text-center text-zinc-500 font-silk text-xs bg-zinc-950">
        Pencarian tidak menemukan berkas yang cocok.
      </div>
    `;
  }

  return filesToRender.map(file => {
    const isPrivate = file.status === 'private';
    const statusBadge = isPrivate
      ? `<span class="pixel-badge px-2 py-0.5 bg-amber-500 text-black font-pixel text-[9px] uppercase">🔒 PRIVAT</span>`
      : `<span class="pixel-badge px-2 py-0.5 bg-emerald-400 text-black font-pixel text-[9px] uppercase">🌐 PUBLIK</span>`;

    return `
    <div class="pixel-card p-4 bg-zinc-950 space-y-3 hover:border-amber-400 transition-colors" data-file-id="${file.id}" data-file-code="${file.unique_code}">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <!-- File Metadata Info -->
        <div class="space-y-1.5 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="pixel-badge px-2 py-0.5 text-[9px] font-pixel uppercase ${
              file.media_type === 'video' ? 'bg-rose-500 text-white' :
              file.media_type === 'image' ? 'bg-emerald-400 text-black' :
              file.media_type === 'audio' ? 'bg-purple-500 text-white' : 'bg-amber-400 text-black'
            }">
              ${file.extension ? file.extension.toUpperCase() : file.media_type}
            </span>
            ${statusBadge}
            <a href="#file/${file.unique_code}" onclick="event.preventDefault(); window.navigateToRoute('file/${file.unique_code}')" class="font-bold text-sm text-white hover:text-amber-400 truncate max-w-xs md:max-w-md">
              ${file.file_name}
            </a>
          </div>

          <div class="flex flex-wrap items-center gap-2 text-xs text-zinc-400 font-mono">
            <span class="text-amber-400 font-bold">${file.size}</span>
            <span>•</span>
            <span>📅 ${file.upload_date}</span>
            <span>•</span>
            <span class="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300">📁 ${file.folder}</span>
            <span>•</span>
            <span class="text-amber-400">Kode: ${file.unique_code}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800">
          <button 
            onclick="window.toggleFileStatus('${file.id}', '${file.status}')" 
            class="${isPrivate ? 'pixel-btn-primary' : 'pixel-btn'} text-[10px] py-1.5 px-3"
            title="Ubah Akses Publik / Privat"
          >
            ${isPrivate ? 'JADIKAN PUBLIK' : 'JADIKAN PRIVAT'}
          </button>
          
          <button 
            onclick="window.navigateToRoute('file/${file.unique_code}')" 
            class="pixel-btn text-[10px] py-1.5 px-3"
          >
            LIHAT
          </button>

          <a 
            href="/download/${file.unique_code}" 
            target="_blank" 
            class="pixel-btn-green text-[10px] py-1.5 px-3"
          >
            UNDUH
          </a>

          <button 
            onclick="window.copyPublicLink('${file.unique_code}')" 
            class="pixel-btn-primary text-[10px] py-1.5 px-2.5" 
            title="Salin Tautan"
          >
            📋
          </button>

          <button 
            onclick="window.deleteFilePrompt('${file.id}')" 
            class="pixel-btn-danger text-[10px] py-1.5 px-3"
          >
            HAPUS
          </button>
        </div>
      </div>
    </div>
  `;
  }).join('');
}
