import { state } from '../utils/api.js';

export function renderAboutView() {
  return `
    <div class="space-y-8 max-w-4xl mx-auto py-4">
      <!-- Header Title -->
      <div class="pixel-card-purple p-6 text-center space-y-2">
        <h2 class="font-pixel text-lg sm:text-2xl text-white">TENTANG ZETNANTA CLOUD</h2>
        <p class="font-silk text-xs sm:text-sm text-gray-200">
          Sistem Cloud Storage Berbasis Telegram Channel dengan Antarmuka Retro Pixel Art Modern.
        </p>
      </div>

      <!-- Main Info Content -->
      <div class="space-y-6">
        <div class="pixel-card p-6 space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-[#ff8e3c] border-2 border-black flex items-center justify-center font-pixel text-black text-xs font-bold">
              ℹ️
            </div>
            <h3 class="font-pixel text-sm text-[#ff8e3c]">Apa itu ZETNANTA CLOUD?</h3>
          </div>
          <p class="font-silk text-xs sm:text-sm text-gray-300 leading-relaxed">
            <strong>ZETNANTA CLOUD</strong> adalah platform web penyimpan & berbagi berkas digital yang memanfaatkan infrastruktur Telegram Bot API & Channel sebagai cloud storage tanpa batas. Seluruh file diproses secara otomatis, terenskripsi, dan memiliki link berbagi berkecepatan tinggi.
          </p>
        </div>

        <div class="pixel-card p-6 space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-[#2cb67d] border-2 border-black flex items-center justify-center font-pixel text-black text-xs font-bold">
              🛠️
            </div>
            <h3 class="font-pixel text-sm text-[#2cb67d]">Cara Kerja Sistem</h3>
          </div>
          <ul class="font-silk text-xs sm:text-sm text-gray-300 space-y-3 pl-2">
            <li class="flex items-start gap-2">
              <span class="text-[#ff8e3c] font-pixel">01.</span>
              <span><strong>Upload Terpusat:</strong> Administrator mengupload file melalui Portal Administrator terproteksi.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-[#ff8e3c] font-pixel">02.</span>
              <span><strong>Penyimpanan Telegram:</strong> Berkas dikirim langsung ke Telegram Channel private dan metadata dicatat secara otomatis.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-[#ff8e3c] font-pixel">03.</span>
              <span><strong>Akses Publik:</strong> Pengguna umum yang menerima tautan berbagi dapat langsung melihat pratinjau & mengunduh tanpa harus login.</span>
            </li>
          </ul>
        </div>

        <div class="pixel-card p-6 space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-[#7f5af0] border-2 border-black flex items-center justify-center font-pixel text-white text-xs font-bold">
              🔒
            </div>
            <h3 class="font-pixel text-sm text-[#7f5af0]">Keamanan & Otentikasi</h3>
          </div>
          <p class="font-silk text-xs sm:text-sm text-gray-300 leading-relaxed">
            Portal Administrator dilindungi oleh sistem otentikasi JWT (JSON Web Token) dengan hashing password bertingkat. Terdapat pemisahan channel antara Cloud Publik dan Private Cloud khusus owner.
          </p>
        </div>

        <!-- Owner Copyright Card -->
        <div class="pixel-card-yellow p-6 text-center space-y-2 border-4 border-black shadow-[4px_4px_0px_#000]">
          <span class="pixel-badge px-3 py-1 bg-black text-[#ff8e3c] font-pixel text-[10px]">PENGEMBANG & PEMBUAT WEB</span>
          <h3 class="font-pixel text-base text-black uppercase">FEBRIANSYAH sang owner</h3>
          <p class="font-silk text-xs text-black font-semibold">
            &copy; ${new Date().getFullYear()} ZETNANTA CLOUD. Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>
      </div>

      <!-- Action Button -->
      <div class="text-center pt-2">
        <button onclick="window.navigateToTab('home')" class="pixel-btn px-6 py-3 text-xs font-silk">
          &larr; Kembali ke Beranda
        </button>
      </div>
    </div>
  `;
}
