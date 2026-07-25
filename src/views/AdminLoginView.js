import { state, fetchApi, showToast } from '../utils/api.js';

export function renderAdminLoginView() {
  return `
    <div class="max-w-md mx-auto py-12 px-4 space-y-6">
      
      <!-- Login Box Header -->
      <div class="pixel-card-yellow p-6 text-center space-y-2">
        <div class="w-12 h-12 bg-black text-[#ff8e3c] border-2 border-black flex items-center justify-center font-pixel text-xl mx-auto shadow-[2px_2px_0px_#000]">
          🔑
        </div>
        <h2 class="font-pixel text-base text-black">LOGIN ADMINISTRATOR</h2>
        <p class="font-silk text-xs text-black font-semibold">
          Akses Khusus Pengelolaan System & File ZETNANTA CLOUD
        </p>
      </div>

      <!-- Login Form Card -->
      <div class="pixel-card p-6 sm:p-8 space-y-6">
        ${state.loginError ? `
          <div class="p-3 bg-[#e53170] text-white border-2 border-black font-silk text-xs font-bold flex items-center justify-between shadow-[2px_2px_0px_#000]">
            <span>⚠️ ${state.loginError}</span>
            <button onclick="window.clearLoginError()" class="font-pixel text-xs">&times;</button>
          </div>
        ` : ''}

        <form onsubmit="window.handleAdminLoginSubmit(event)" class="space-y-4">
          <div class="space-y-2">
            <label class="font-pixel text-[11px] text-[#ff8e3c] block">USERNAME</label>
            <input 
              type="text" 
              id="login-username" 
              placeholder="Masukkan username admin" 
              class="pixel-input w-full px-4 py-3 text-xs font-mono"
              required 
            />
          </div>

          <div class="space-y-2">
            <label class="font-pixel text-[11px] text-[#ff8e3c] block">PASSWORD</label>
            <input 
              type="password" 
              id="login-password" 
              placeholder="Masukkan password admin" 
              class="pixel-input w-full px-4 py-3 text-xs font-mono"
              required 
            />
          </div>

          <div class="pt-2">
            <button type="submit" id="login-submit-btn" class="pixel-btn-primary w-full py-3.5 px-4 text-xs font-silk flex items-center justify-center gap-2">
              <span>Masuk Portal Admin</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        </form>
      </div>

      <!-- Return Link -->
      <div class="text-center">
        <button onclick="window.navigateToTab('home')" class="font-silk text-xs text-gray-400 hover:text-[#ff8e3c]">
          &larr; Kembali ke Beranda Publik
        </button>
      </div>

    </div>
  `;
}
