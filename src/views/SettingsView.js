import { state } from '../utils/api.js';

export function renderSettingsView() {
  const settings = state.settings || {};
  const user = state.user;
  const apiKeys = state.apiKeys || [];

  return `
    <div class="space-y-6 max-w-4xl w-full mx-auto py-2 px-1 sm:px-0 box-border">
      <!-- Title -->
      <div class="pixel-card-purple p-4 sm:p-6 space-y-1">
        <h2 class="font-pixel text-base sm:text-lg text-white">PENGATURAN SISTEM & KUNCI API</h2>
        <p class="font-silk text-xs text-purple-200">Konfigurasi Bot Telegram, Kunci API, dan Profil Administrator ZETNANTA CLOUD.</p>
      </div>

      <!-- 1. Telegram Bot Configuration -->
      <div class="pixel-card p-4 sm:p-6 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-black">
          <h3 class="font-pixel text-xs text-[#ff8e3c] flex items-center gap-2">
            <span>🤖</span> TELEGRAM BOT & CHANNEL
          </h3>
          <span class="pixel-badge px-2.5 py-0.5 ${settings.telegram_token ? 'bg-[#2cb67d] text-black' : 'bg-[#ff8e3c] text-black'} font-pixel text-[10px]">
            ${settings.telegram_token ? 'TERHUBUNG (ONLINE)' : 'STANDBY'}
          </span>
        </div>

        <!-- Info Notice -->
        <div class="p-3 bg-[#ff8e3c]/10 border-2 border-[#ff8e3c] text-xs font-silk text-[#ff8e3c] flex items-start sm:items-center gap-2">
          <span class="shrink-0">⚙️</span>
          <span>Konfigurasikan Token Bot Telegram & ID Channel di bawah ini untuk menghubungkan engine penyimpanan Telegram Cloud Storage secara langsung.</span>
        </div>

        <div class="space-y-4 w-full">
          <div class="w-full">
            <label class="block font-pixel text-[10px] text-[#ff8e3c] uppercase mb-1">Telegram Bot Token</label>
            <input 
              type="password" 
              id="tg-bot-token" 
              value="${settings.telegram_token || ''}"
              placeholder="cth: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
              class="pixel-input w-full px-3.5 py-2.5 text-xs font-mono box-border"
            />
            <p class="font-silk text-[10px] text-gray-400 mt-1">Dapatkan token bot resmi dari @BotFather di Telegram.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div class="w-full min-w-0">
              <label class="block font-pixel text-[10px] text-[#2cb67d] uppercase mb-1">🌐 ID Channel Cloud Publik</label>
              <input 
                type="text" 
                id="tg-channel-id-public" 
                value="${settings.telegram_channel_id || ''}"
                placeholder="cth: @channel_publik atau -1001234567890"
                class="pixel-input w-full px-3.5 py-2.5 text-xs font-mono box-border"
              />
              <p class="font-silk text-[10px] text-gray-400 mt-1">Channel penampung berkas unggahan publik pengguna.</p>
            </div>

            <div class="w-full min-w-0">
              <label class="block font-pixel text-[10px] text-[#7f5af0] uppercase mb-1">🔒 ID Channel Cloud Private (Owner)</label>
              <input 
                type="text" 
                id="tg-channel-id-private" 
                value="${settings.telegram_channel_id_private || '-5568856013'}"
                placeholder="cth: -5568856013 atau @channel_private"
                class="pixel-input w-full px-3.5 py-2.5 text-xs font-mono box-border"
              />
              <p class="font-silk text-[10px] text-gray-400 mt-1">Channel khusus penampung berkas privat / rahasia owner.</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 w-full">
          <button onclick="window.testTelegramBotConnection()" class="pixel-btn-primary px-3.5 sm:px-4 py-2.5 text-xs font-silk flex items-center justify-center gap-1.5 w-full sm:w-auto">
            <span>⚡ Uji Koneksi Bot</span>
          </button>

          <button onclick="window.saveTelegramSettings()" class="pixel-btn-green px-4 sm:px-5 py-2.5 text-xs font-silk w-full sm:w-auto text-center">
            Simpan Pengaturan
          </button>
        </div>

        <div id="bot-test-result" class="hidden p-3 border-2 border-black font-mono text-xs shadow-[2px_2px_0px_#000] break-words w-full box-border"></div>
      </div>

      <!-- 2. API Key Management System -->
      <div class="pixel-card p-4 sm:p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-black">
          <div>
            <h3 class="font-pixel text-xs text-[#7f5af0]">MANAJEMEN KUNCI API (API KEY)</h3>
            <p class="font-silk text-[11px] text-gray-400">Buat kunci API rahasia untuk akses pihak ketiga</p>
          </div>

          <button onclick="window.createNewApiKeyPrompt()" class="pixel-btn-primary px-3.5 py-2 text-xs font-silk shrink-0 w-full sm:w-auto text-center">
            + Buat Key Baru
          </button>
        </div>

        <div class="space-y-2.5 w-full">
          ${apiKeys.length === 0 ? `
            <div class="text-center py-6 text-gray-500 font-silk text-xs">Belum ada Kunci API dibuat</div>
          ` : apiKeys.map(k => `
            <div class="p-3 bg-[#0f0e17] border-2 border-black shadow-[2px_2px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs overflow-hidden w-full box-border">
              <div class="min-w-0 flex-1">
                <div class="font-bold text-[#ff8e3c] font-silk truncate">${k.name || 'API Key'}</div>
                <div class="text-[#fffffe] text-[11px] mt-0.5 break-all font-mono">${k.key}</div>
                <div class="text-[10px] text-gray-400 mt-0.5">Requests: ${k.total_requests || 0} • Limit: ${k.rate_limit_per_min || 60}/min</div>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <button onclick="navigator.clipboard.writeText('${k.key}'); window.showToast('Kunci API disalin!')" class="pixel-btn text-[10px] py-1.5 px-3">
                  Salin
                </button>
                <button onclick="window.deleteApiKeyPrompt('${k.id}')" class="pixel-btn-danger text-[10px] py-1.5 px-3">
                  Hapus
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 3. Authentication & Profile Info -->
      <div class="pixel-card p-4 sm:p-6 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-black">
          <h3 class="font-pixel text-xs text-[#2cb67d]">PROFIL ADMINISTRATOR</h3>
          <span class="font-mono text-xs text-gray-400">${user ? user.username : 'Belum Login'}</span>
        </div>

        <div class="bg-[#0f0e17] p-4 border-2 border-black space-y-2 text-xs font-silk">
          <div class="flex justify-between text-gray-300">
            <span>Status Akun:</span> <strong class="text-[#ff8e3c] font-pixel text-xs">${user ? user.username : 'febri'}</strong>
          </div>
          <div class="flex justify-between text-gray-300">
            <span>Hak Akses:</span> <span class="pixel-badge px-2 py-0.5 bg-[#7f5af0] text-white text-[10px] font-pixel">ADMINISTRATOR</span>
          </div>
          <button onclick="window.logoutAdmin()" class="mt-3 w-full py-2.5 pixel-btn-danger font-silk text-xs">
            Keluar Sesi Administrator
          </button>
        </div>
      </div>
    </div>
  `;
}

