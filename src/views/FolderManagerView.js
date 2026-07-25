import { state } from '../utils/api.js';

export function renderFolderManagerView() {
  const folders = state.folders || [];
  const files = state.files || [];

  return `
    <div class="space-y-6 max-w-4xl mx-auto py-2">
      <!-- Saweria Pixel Header -->
      <div class="pixel-card-purple p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <span class="pixel-badge px-2.5 py-1 bg-black text-amber-400 font-pixel text-[10px]">
            📁 DIREKTORI FOLDER
          </span>
          <h1 class="font-pixel text-xl uppercase font-black text-white tracking-tight">
            MANAJEMEN FOLDER
          </h1>
          <p class="text-xs text-purple-200">
            Organisasi struktur folder repositori Telegram Cloud Storage.
          </p>
        </div>

        <button 
          onclick="window.openCreateFolderModal()" 
          class="pixel-btn text-xs font-pixel py-2.5 px-4 whitespace-nowrap"
        >
          ➕ TAMBAH FOLDER
        </button>
      </div>

      <!-- Directory Tree Overview in Saweria Pixel Card Style -->
      <div class="pixel-card p-6 space-y-4 bg-zinc-900">
        <div class="flex items-center justify-between pb-3 border-b-2 border-zinc-800">
          <span class="font-pixel text-xs text-amber-400 uppercase flex items-center gap-2">
            <span>🌳</span> STRUKTUR FOLDER
          </span>
          <span class="pixel-badge px-2.5 py-1 bg-amber-400 text-black font-pixel text-[10px]">
            ${folders.length + 1} DIREKTORI
          </span>
        </div>

        <div class="space-y-3 font-mono text-xs">
          <!-- Root Folder -->
          <div class="pixel-card p-4 bg-zinc-950 flex items-center justify-between">
            <div class="flex items-center gap-2 text-white font-bold">
              <span class="text-amber-400 font-pixel text-xs">ROOT</span>
              <span class="text-[10px] text-zinc-500 font-normal">(Folder Utama)</span>
            </div>
            <span class="pixel-badge px-2.5 py-1 bg-zinc-800 text-zinc-300 font-mono text-xs">
              ${files.filter(f => f.folder.toLowerCase() === 'root').length} File
            </span>
          </div>

          <!-- Child Folders -->
          <div class="pl-4 space-y-2 border-l-2 border-amber-400 ml-3">
            ${folders.map(f => {
              const count = files.filter(file => file.folder.toLowerCase() === f.name.toLowerCase()).length;
              return `
                <div class="pixel-card p-3.5 bg-zinc-950 flex items-center justify-between gap-3 hover:border-amber-400 transition-colors">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <span class="text-amber-400 font-bold">└─</span>
                    <strong class="text-zinc-100 font-pixel text-xs truncate">${f.name}</strong>
                    ${f.description ? `<span class="text-[10px] text-zinc-400 truncate hidden sm:inline">• ${f.description}</span>` : ''}
                  </div>

                  <div class="flex items-center gap-2 shrink-0">
                    <span class="pixel-badge px-2 py-0.5 bg-zinc-800 text-zinc-300 font-mono text-[10px]">
                      ${count} File
                    </span>
                    <button 
                      onclick="window.deleteFolderPrompt('${f.id}')" 
                      class="pixel-btn-danger text-[10px] py-1 px-2.5" 
                      title="Hapus Folder"
                    >
                      HAPUS
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Create Folder Modal in Saweria Pixel Card Style -->
    <div id="create-folder-modal" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="pixel-card p-6 max-w-md w-full space-y-4 bg-zinc-900 border-2 border-amber-400">
        <div class="flex items-center justify-between pb-3 border-b-2 border-zinc-800">
          <h3 class="font-pixel text-xs text-amber-400 uppercase">BUAT FOLDER BARU</h3>
          <button onclick="window.closeCreateFolderModal()" class="text-zinc-400 hover:text-white font-pixel text-xs">&times;</button>
        </div>

        <div class="space-y-3">
          <div class="space-y-1">
            <label class="block font-pixel text-[10px] text-amber-400 uppercase">NAMA FOLDER</label>
            <input type="text" id="new-folder-name" placeholder="cth: Film, Gambar, Arsip" class="pixel-input w-full px-3.5 py-2 text-xs font-mono text-white bg-zinc-950" />
          </div>

          <div class="space-y-1">
            <label class="block font-pixel text-[10px] text-amber-400 uppercase">DESKRIPSI (OPSIONAL)</label>
            <input type="text" id="new-folder-desc" placeholder="Catatan singkat folder" class="pixel-input w-full px-3.5 py-2 text-xs font-mono text-white bg-zinc-950" />
          </div>

          <div class="space-y-1">
            <label class="block font-pixel text-[10px] text-amber-400 uppercase">WARNA LENCANA</label>
            <select id="new-folder-color" class="pixel-input w-full px-3.5 py-2 text-xs font-mono text-white bg-zinc-950">
              <option value="amber">Kuning / Amber</option>
              <option value="purple">Ungu / Purple</option>
              <option value="emerald">Hijau / Emerald</option>
              <option value="rose">Merah / Rose</option>
            </select>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t-2 border-zinc-800">
          <button onclick="window.closeCreateFolderModal()" class="pixel-btn-dark text-xs font-pixel py-2 px-4">
            BATAL
          </button>
          <button onclick="window.submitCreateFolder()" class="pixel-btn text-xs font-pixel py-2 px-4">
            SIMPAN FOLDER
          </button>
        </div>
      </div>
    </div>
  `;
}
