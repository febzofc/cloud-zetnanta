import { state } from '../utils/api.js';

export function renderApiDocsView() {
  const currentKey = state.apiKey || 'tg_key_9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d';

  return `
    <div class="space-y-6 max-w-4xl mx-auto py-2">
      <!-- Title -->
      <div class="pixel-card-purple p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 class="font-pixel text-lg text-white">DOKUMENTASI REST API</h2>
          <p class="font-silk text-xs text-purple-200">Spesifikasi REST API untuk integrasi aplikasi pihak ketiga.</p>
        </div>

        <span class="pixel-badge px-3 py-1 bg-[#2cb67d] text-black font-pixel text-[10px]">
          REST v1.0 LIVE
        </span>
      </div>

      <!-- Authentication Box -->
      <div class="pixel-card p-5 space-y-3">
        <h3 class="font-pixel text-xs text-[#ff8e3c] uppercase">HEADER OTENTIKASI API</h3>
        <p class="font-silk text-xs text-gray-300">Sertakan Kunci API pada HTTP Request Header:</p>
        <div class="bg-[#0f0e17] p-3.5 border-2 border-black font-mono text-xs flex items-center justify-between text-gray-200 shadow-[2px_2px_0px_#000]">
          <span>X-API-KEY: <strong class="text-[#2cb67d]">${currentKey}</strong></span>
          <button onclick="navigator.clipboard.writeText('${currentKey}'); window.showToast('Kunci API disalin!')" class="pixel-btn text-[10px] py-1 px-3">
            Salin Key
          </button>
        </div>
      </div>

      <!-- Endpoints List -->
      <div class="space-y-4">
        <div class="pixel-card p-5 space-y-3">
          <div class="flex items-center gap-3">
            <span class="pixel-badge px-2.5 py-1 bg-[#2cb67d] text-black font-pixel text-[10px]">POST</span>
            <code class="text-sm font-bold text-white font-mono">/api/upload</code>
          </div>
          <p class="font-silk text-xs text-gray-400">Upload satu atau banyak file langsung ke Telegram Cloud Storage.</p>

          <div class="bg-[#0f0e17] p-4 border-2 border-black font-mono text-xs text-gray-300 space-y-2 overflow-x-auto shadow-[2px_2px_0px_#000]">
            <div class="text-[#2cb67d]">// Contoh cURL</div>
            <div class="text-[#ff8e3c]">
              curl -X POST "${window.location.origin}/api/upload" \\<br/>
              &nbsp;&nbsp;-H "X-API-KEY: ${currentKey}" \\<br/>
              &nbsp;&nbsp;-F "files=@/path/to/file.mp4" \\<br/>
              &nbsp;&nbsp;-F "folder=Utama"
            </div>
          </div>
        </div>

        <div class="pixel-card p-5 space-y-3">
          <div class="flex items-center gap-3">
            <span class="pixel-badge px-2.5 py-1 bg-[#ff8e3c] text-black font-pixel text-[10px]">GET</span>
            <code class="text-sm font-bold text-white font-mono">/api/file/:id</code>
          </div>
          <p class="font-silk text-xs text-gray-400">Ambil data metadata berkas berdasarkan ID atau kode unik.</p>
        </div>

        <div class="pixel-card p-5 space-y-3">
          <div class="flex items-center gap-3">
            <span class="pixel-badge px-2.5 py-1 bg-[#ff8e3c] text-black font-pixel text-[10px]">GET</span>
            <code class="text-sm font-bold text-white font-mono">/download/:id</code>
          </div>
          <p class="font-silk text-xs text-gray-400">Tautan unduhan biner langsung berkas yang tersimpan di Telegram.</p>
        </div>
      </div>

      <!-- Interactive API Request Tester -->
      <div class="pixel-card p-6 space-y-4">
        <h3 class="font-pixel text-xs text-[#7f5af0]">⚡ LIVE INTERACTIVE API TESTER</h3>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button onclick="window.testApiEndpoint('/api/files')" class="pixel-btn text-left p-3 text-xs">
            <span class="font-pixel text-[10px] block mb-1">GET /api/files</span>
            <span class="font-silk text-[10px]">Ambil Semua Berkas</span>
          </button>

          <button onclick="window.testApiEndpoint('/api/search?q=movie')" class="pixel-btn-primary text-left p-3 text-xs">
            <span class="font-pixel text-[10px] block mb-1">GET /api/search</span>
            <span class="font-silk text-[10px]">Cari Berkas</span>
          </button>

          <button onclick="window.testApiEndpoint('/api/folders')" class="pixel-btn-green text-left p-3 text-xs">
            <span class="font-pixel text-[10px] block mb-1">GET /api/folders</span>
            <span class="font-silk text-[10px]">Daftar Folder</span>
          </button>
        </div>

        <div id="api-tester-response" class="hidden bg-[#0f0e17] p-4 border-2 border-black font-mono text-xs text-[#2cb67d] max-h-60 overflow-y-auto shadow-[2px_2px_0px_#000]"></div>
      </div>
    </div>
  `;
}
