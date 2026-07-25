/**
 * API Service Wrapper for Vanilla JS
 */

export const state = {
  activeTab: 'home', // 'home' | 'about' | 'public-file' | 'admin-login' | 'dashboard' | 'upload' | 'file-manager' | 'folder-manager' | 'settings' | 'api-docs'
  authToken: localStorage.getItem('tg_jwt_token') || '',
  user: JSON.parse(localStorage.getItem('tg_user') || 'null'),
  apiKey: localStorage.getItem('tg_api_key') || 'tg_key_9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d',
  files: [],
  folders: [],
  selectedPublicFileCode: null,
  publicFileDetails: null,
  uploadSuccessModal: null,
  loginError: '',
  stats: {
    totalFiles: 0,
    totalStorage: '0 B',
    categories: { video: 0, image: 0, audio: 0, pdf: 0, zip: 0, document: 0 },
    apiRequests: 1420
  },
  settings: {
    telegram_token: '',
    telegram_channel_id: '',
    bot_username: '@tg_cloud_storage_bot',
    storage_mode: 'auto',
    site_name: 'ZETNANTA CLOUD'
  }
};

export async function fetchApi(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (state.authToken) {
    headers['Authorization'] = `Bearer ${state.authToken}`;
  }
  if (state.apiKey) {
    headers['X-API-KEY'] = state.apiKey;
  }

  // If uploading FormData, delete Content-Type so browser sets boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const res = await fetch(endpoint, {
      ...options,
      headers
    });

    const contentType = res.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { success: res.ok, message: text || `HTTP Status ${res.status}` };
      }
    }

    return data;
  } catch (err) {
    console.warn('API fetch notification:', err.message);
    return {
      success: false,
      message: err.message === 'Failed to fetch'
        ? 'Koneksi API server sedang memproses...'
        : (err.message || 'Gangguan jaringan')
    };
  }
}

export function showToast(message, type = 'info') {
  const existing = document.getElementById('toast-container');
  if (existing) existing.remove();

  const container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none';

  const toast = document.createElement('div');
  const bg = type === 'error' ? 'bg-[#e53170] text-[#fffffe] border-2 border-black' :
             type === 'success' ? 'bg-[#2cb67d] text-[#fffffe] border-2 border-black' :
             'bg-[#ff8e3c] text-[#0f0e17] border-2 border-black';

  toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 shadow-[4px_4px_0px_#000] text-xs font-bold font-mono tracking-wide ${bg}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" class="hover:opacity-75 font-pixel text-xs ml-2">&times;</button>
  `;

  container.appendChild(toast);
  document.body.appendChild(container);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'transition-opacity');
    setTimeout(() => container.remove(), 300);
  }, 4000);
}
