import { state } from '../utils/api.js';

export function renderApiDocsView() {
  const currentKey = state.apiKey || 'tg_key_9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d';
  const origin = window.location.origin;

  return `
    <div class="space-y-6 max-w-4xl mx-auto py-2">
      <!-- Title -->
      <div class="pixel-card-purple p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 class="font-pixel text-lg text-white">DOKUMENTASI PUBLIC REST API</h2>
          <p class="font-silk text-xs text-purple-200">Panduan penggunaan API Publik untuk Upload & Download Berkas tanpa batasan otentikasi.</p>
        </div>

        <span class="pixel-badge px-3 py-1 bg-[#2cb67d] text-black font-pixel text-[10px]">
          PUBLIC API v1.0 LIVE
        </span>
      </div>

      <!-- Overview Box -->
      <div class="pixel-card p-5 space-y-3">
        <h3 class="font-pixel text-xs text-[#ff8e3c] uppercase">🌐 PUBLIC ENDPOINT URLS</h3>
        <div class="space-y-2 font-mono text-xs text-gray-300">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 bg-[#2cb67d] text-black font-bold font-pixel text-[9px]">UPLOAD</span>
            <code class="text-white">${origin}/api/public/upload</code>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 bg-[#ff8e3c] text-black font-bold font-pixel text-[9px]">DOWNLOAD</span>
            <code class="text-white">${origin}/api/public/download?id={ID}&url={URL}</code>
          </div>
        </div>
      </div>

      <!-- Endpoints List -->
      <div class="space-y-6">

        <!-- 1. PUBLIC UPLOADER API -->
        <div class="pixel-card p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="pixel-badge px-2.5 py-1 bg-[#2cb67d] text-black font-pixel text-[10px]">POST</span>
              <code class="text-base font-bold text-white font-mono">/api/public/upload</code>
            </div>
            <span class="text-[10px] font-pixel text-[#2cb67d]">TANPA AUTH (PUBLIC)</span>
          </div>

          <p class="font-silk text-xs text-gray-300">
            Mengunggah berkas publik ke Cloud Storage. Mengembalikan metadata lengkap beserta <strong>Short Link TinyURL</strong> secara otomatis.
          </p>

          <div class="bg-[#0f0e17] p-4 border-2 border-black font-mono text-xs text-gray-300 space-y-3 overflow-x-auto shadow-[2px_2px_0px_#000]">
            <div class="text-[#2cb67d]">// 1. Contoh cURL Upload</div>
            <div class="text-[#ff8e3c]">
              curl -X POST "${origin}/api/public/upload" \\<br/>
              &nbsp;&nbsp;-F "file=@/path/to/my_video.mp4"
            </div>

            <div class="text-[#7f5af0] font-bold mt-2">// 2. Format Respon JSON</div>
            <pre class="text-[#fffffe] text-[11px] font-mono leading-relaxed bg-[#16161e] p-3 border border-gray-800 rounded">
{
  "success": true,
  "message": "1 file(s) uploaded successfully!",
  "result": {
    "fileName": "my_video.mp4",
    "fileSize": "15.4 MB",
    "uploadDate": "2026-07-26 07:18",
    "rawUrl": "${origin}/raw/TG-918273",
    "shortUrl": "https://tinyurl.com/2p8x9y7z",
    "fileId": "TG-918273",
    "downloadUrl": "${origin}/download/TG-918273"
  }
}</pre>
          </div>
        </div>

        <!-- 2. PUBLIC DOWNLOADER API -->
        <div class="pixel-card p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="pixel-badge px-2.5 py-1 bg-[#ff8e3c] text-black font-pixel text-[10px]">GET</span>
              <code class="text-base font-bold text-white font-mono">/api/public/download</code>
            </div>
            <span class="text-[10px] font-pixel text-[#ff8e3c]">ID / URL / TINYURL</span>
          </div>

          <p class="font-silk text-xs text-gray-300">
            Mengunduh berkas langsung dari <strong>ID Berkas</strong> atau dari <strong>Link URL Berkas</strong> (termasuk Short Link TinyURL).
          </p>

          <div class="bg-[#0f0e17] p-4 border-2 border-black font-mono text-xs text-gray-300 space-y-3 overflow-x-auto shadow-[2px_2px_0px_#000]">
            <div class="text-[#2cb67d]">// Option A: Unduh berdasarkan ID Berkas</div>
            <div class="text-[#ff8e3c]">
              curl -O -J "${origin}/api/public/download?id=TG-918273"
            </div>

            <div class="text-[#2cb67d] mt-2">// Option B: Unduh berdasarkan URL Raw / Full Link</div>
            <div class="text-[#ff8e3c]">
              curl -O -J "${origin}/api/public/download?url=${origin}/raw/TG-918273"
            </div>

            <div class="text-[#2cb67d] mt-2">// Option C: Unduh berdasarkan Short Link TinyURL</div>
            <div class="text-[#ff8e3c]">
              curl -O -J "${origin}/api/public/download?url=https://tinyurl.com/2p8x9y7z"
            </div>

            <div class="text-[#2cb67d] mt-2">// Option D: Unduh langsung dari Path ID</div>
            <div class="text-[#ff8e3c]">
              curl -O -J "${origin}/download/TG-918273"
            </div>
          </div>
        </div>

        <!-- 3. PRIVATE API KEY HEADERS (OPTIONAL) -->
        <div class="pixel-card p-5 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-pixel text-xs text-[#7f5af0] uppercase">HEADER OTENTIKASI (OPSIONAL FOR PRIVATE FILES)</h3>
            <span class="text-[10px] font-pixel text-[#7f5af0]">X-API-KEY</span>
          </div>
          <p class="font-silk text-xs text-gray-300">Untuk mengunggah atau mengakses berkas bertipe Privat, sertakan Header API Key:</p>
          <div class="bg-[#0f0e17] p-3.5 border-2 border-black font-mono text-xs flex items-center justify-between text-gray-200 shadow-[2px_2px_0px_#000]">
            <span>X-API-KEY: <strong class="text-[#2cb67d]">${currentKey}</strong></span>
            <button onclick="navigator.clipboard.writeText('${currentKey}'); window.showToast('Kunci API disalin!')" class="pixel-btn text-[10px] py-1 px-3">
              Salin Key
            </button>
          </div>
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

          <button onclick="window.testApiEndpoint('/api/docs')" class="pixel-btn-primary text-left p-3 text-xs">
            <span class="font-pixel text-[10px] block mb-1">GET /api/docs</span>
            <span class="font-silk text-[10px]">Spesifikasi OpenAPI</span>
          </button>

          <button onclick="window.testApiEndpoint('/api/search?q=movie')" class="pixel-btn-green text-left p-3 text-xs">
            <span class="font-pixel text-[10px] block mb-1">GET /api/search</span>
            <span class="font-silk text-[10px]">Cari Berkas</span>
          </button>
        </div>

        <div id="api-tester-response" class="hidden bg-[#0f0e17] p-4 border-2 border-black font-mono text-xs text-[#2cb67d] max-h-60 overflow-y-auto shadow-[2px_2px_0px_#000]"></div>
      </div>
    </div>
  `;
}
