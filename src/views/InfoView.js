import { state } from '../utils/api.js';

export function renderInfoView() {
  return `
    <div class="space-y-8 py-4 max-w-4xl mx-auto">
      <!-- Title Header -->
      <div class="pixel-card-purple p-6 space-y-2">
        <span class="pixel-badge px-2.5 py-1 bg-black text-amber-400 font-pixel text-[10px]">
          ℹ️ INFORMASI PLATFORM
        </span>
        <h1 class="font-pixel text-xl md:text-2xl uppercase font-black tracking-tight text-white">
          TENTANG ZETNANTA CLOUD
        </h1>
        <p class="text-xs text-purple-200 font-sans leading-relaxed">
          Arsitektur penyimpanan cloud berbasis Telegram dengan performa tinggi & antarmuka Pixel Art retro.
        </p>
      </div>

      <!-- FAQ Accordion / Grid -->
      <div class="space-y-4">
        <h2 class="font-pixel text-xs text-amber-400 uppercase flex items-center gap-2">
          <span>❓</span> PERTANYAAN FREKUEN (FAQ)
        </h2>

        <div class="space-y-4">
          <!-- Item 1 -->
          <div class="pixel-card p-5 space-y-2">
            <h3 class="font-pixel text-xs text-amber-400">1. Apa itu ZETNANTA CLOUD?</h3>
            <p class="text-xs text-zinc-300 font-sans leading-relaxed">
              ZETNANTA CLOUD adalah platform penyimpanan cloud web yang memanfaatkan Telegram Bot & Telegram Channel API sebagai media penyimpanan backend tak terbatas.
            </p>
          </div>

          <!-- Item 2 -->
          <div class="pixel-card p-5 space-y-2">
            <h3 class="font-pixel text-xs text-emerald-400">2. Bagaimana Pengguna Mengakses File?</h3>
            <p class="text-xs text-zinc-300 font-sans leading-relaxed">
              Pengguna umum (publik) dapat melihat dan mengunduh file yang dibagikan melalui tautan khusus tanpa harus mendaftar atau melakukan login.
            </p>
          </div>

          <!-- Item 3 -->
          <div class="pixel-card p-5 space-y-2">
            <h3 class="font-pixel text-xs text-purple-400">3. Siapa yang Bisa Mengunggah File?</h3>
            <p class="text-xs text-zinc-300 font-sans leading-relaxed">
              Seluruh proses pengunggahan file dan pengelolaan repositori dilakukan secara terpusat oleh Administrator melalui halaman khusus dengan autentikasi terproteksi.
            </p>
          </div>

          <!-- Item 4 -->
          <div class="pixel-card p-5 space-y-2">
            <h3 class="font-pixel text-xs text-rose-400">4. Berapa Batas Ukuran File?</h3>
            <p class="text-xs text-zinc-300 font-sans leading-relaxed">
              Sistem mendukung pengunggahan file hingga 2,000 MB (2 Gigabyte) per file dengan fitur streaming video dan audio langsung.
            </p>
          </div>
        </div>
      </div>

      <!-- Platform Specs -->
      <div class="pixel-card p-6 space-y-4">
        <h3 class="font-pixel text-xs text-amber-400 uppercase">⚙️ SPESIFIKASI TEKNIS PLATFORM</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div class="p-3 bg-zinc-900 border border-zinc-800 rounded">
            <span class="text-zinc-500 block text-[10px]">BACKEND ENGINE</span>
            <span class="text-amber-400 font-bold">Node.js Express</span>
          </div>
          <div class="p-3 bg-zinc-900 border border-zinc-800 rounded">
            <span class="text-zinc-500 block text-[10px]">STORAGE ENGINE</span>
            <span class="text-purple-400 font-bold">Telegram Cloud API</span>
          </div>
          <div class="p-3 bg-zinc-900 border border-zinc-800 rounded">
            <span class="text-zinc-500 block text-[10px]">THEME STYLE</span>
            <span class="text-emerald-400 font-bold">Saweria Pixel Art</span>
          </div>
          <div class="p-3 bg-zinc-900 border border-zinc-800 rounded">
            <span class="text-zinc-500 block text-[10px]">SECURITY</span>
            <span class="text-rose-400 font-bold">JWT & Bcrypt</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
