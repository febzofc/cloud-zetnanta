import { state, fetchApi, showToast } from './utils/api.js';
import { renderNavigation } from './components/Navigation.js';
import { renderHomeView } from './views/HomeView.js';
import { initPixelScrollWorld } from './components/PixelScrollWorld.js';
import { renderAboutView } from './views/AboutView.js';
import { renderPublicFileView } from './views/PublicFileView.js';
import { renderAdminLoginView } from './views/AdminLoginView.js';
import { renderDashboardView } from './views/DashboardView.js';
import { renderUploadView } from './views/UploadView.js';
import { renderFileManagerView, renderFilesList } from './views/FileManagerView.js';
import { renderFolderManagerView } from './views/FolderManagerView.js';
import { renderApiDocsView } from './views/ApiDocsView.js';
import { renderSettingsView } from './views/SettingsView.js';

let uploadQueueFiles = [];

async function initApp() {
  await loadInitialData();
  await handleHashRoute();
  renderApp();

  window.addEventListener('hashchange', async () => {
    await handleHashRoute();
    renderApp();
  });
}

async function handleHashRoute() {
  const hash = window.location.hash.replace(/^#/, '').trim();

  if (hash.startsWith('file/') || hash.startsWith('preview/') || hash.startsWith('download/')) {
    const code = hash.replace(/^(file|preview|download)\//, '').split('?')[0];
    if (code) {
      const res = await fetchApi(`/api/file/${code}`);
      if (res && res.success) {
        state.publicFileDetails = res.data;
      } else {
        state.publicFileDetails = null;
      }
      state.activeTab = 'public-file';
      return;
    }
  }

  if (hash === 'admin' || hash === 'admin/login') {
    if (state.authToken) {
      state.activeTab = 'dashboard';
    } else {
      state.activeTab = 'admin-login';
    }
    return;
  }

  if (hash === 'about') {
    state.activeTab = 'about';
    return;
  }

  if (['dashboard', 'upload', 'file-manager', 'folder-manager', 'api-docs', 'settings'].includes(hash)) {
    if (state.authToken) {
      state.activeTab = hash;
    } else {
      state.activeTab = 'admin-login';
    }
    return;
  }

  // Default to home
  if (!state.activeTab || state.activeTab === 'public-file') {
    state.activeTab = 'home';
  }
}

async function loadInitialData() {
  // 1. Load Files & Metrics
  const filesRes = await fetchApi('/api/files');
  if (filesRes && filesRes.success) {
    state.files = filesRes.data || [];
    state.stats.totalFiles = filesRes.total_files || state.files.length;
    state.stats.totalStorage = filesRes.total_storage_formatted || '0 B';
    state.stats.categories = filesRes.categories || { video: 0, image: 0, audio: 0, pdf: 0, zip: 0, document: 0 };
  }

  // 2. Load Folders
  const foldersRes = await fetchApi('/api/folders');
  if (foldersRes && foldersRes.success) {
    state.folders = foldersRes.data || [];
  }

  // 3. Load Settings
  const settingsRes = await fetchApi('/api/settings');
  if (settingsRes && settingsRes.success) {
    state.settings = settingsRes.data || {};
  }

  // 4. Load API Keys
  if (state.authToken) {
    const keysRes = await fetchApi('/api/keys');
    if (keysRes && keysRes.success) {
      state.apiKeys = keysRes.data || [];
    }
  }
}

function renderApp() {
  const root = document.getElementById('app');
  if (!root) return;

  root.innerHTML = `
    <div class="min-h-screen flex flex-col pb-16 md:pb-8 bg-[#0f0e17] text-[#fffffe] selection:bg-[#ff8e3c] selection:text-black w-full overflow-x-hidden">
      ${renderNavigation()}
      <main class="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 box-border">
        <div id="view-container" class="w-full max-w-full">
          ${renderActiveView()}
        </div>
      </main>
      <footer class="w-full max-w-6xl mx-auto px-4 pt-6 pb-6 border-t border-[#1f1f2e] text-center mt-auto">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-silk text-gray-400">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-[#2cb67d] animate-pulse"></span>
            <span class="font-pixel text-[10px] text-[#2cb67d] tracking-wide">ZETNANTA CLOUD</span>
          </div>
          <div class="font-pixel text-[10px] text-gray-400 tracking-wider">
            PROJECT & DEVELOPER: <span class="text-[#ff8e3c] font-pixel font-bold">FEBRIANSYAH</span>
          </div>
        </div>
      </footer>
    </div>
  `;

  bindViewEvents();
}

function renderActiveView() {
  switch (state.activeTab) {
    case 'home':
      return renderHomeView();
    case 'about':
      return renderAboutView();
    case 'public-file':
      return renderPublicFileView();
    case 'admin-login':
      return renderAdminLoginView();
    case 'dashboard':
      return renderDashboardView();
    case 'upload':
      return renderUploadView();
    case 'file-manager':
      return renderFileManagerView();
    case 'folder-manager':
      return renderFolderManagerView();
    case 'api-docs':
      return renderApiDocsView();
    case 'settings':
      return renderSettingsView();
    default:
      return renderHomeView();
  }
}

let homeUploadQueueFiles = [];

function bindViewEvents() {
  if (state.activeTab === 'upload') {
    setupDropzoneEvents();
  } else if (state.activeTab === 'home') {
    setupHomeDropzoneEvents();
    initPixelScrollWorld();
  }
}

function setupHomeDropzoneEvents() {
  const dropzone = document.getElementById('home-dropzone');
  const fileInput = document.getElementById('home-file-input');

  if (!dropzone) return;

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, e => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => {
      dropzone.classList.add('border-[#ff8e3c]', 'bg-[#16161e]');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => {
      dropzone.classList.remove('border-[#ff8e3c]', 'bg-[#16161e]');
    }, false);
  });

  dropzone.addEventListener('drop', e => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleHomeSelectedFiles(files);
  });

  if (fileInput) {
    fileInput.addEventListener('change', e => {
      handleHomeSelectedFiles(e.target.files);
    });
  }
}

function handleHomeSelectedFiles(filesList) {
  if (!filesList || filesList.length === 0) return;
  const newFiles = Array.from(filesList);
  homeUploadQueueFiles.push(...newFiles);
  updateHomeUploadQueueUI();
}

function updateHomeUploadQueueUI() {
  const queueContainer = document.getElementById('home-queue-container');
  const queueCount = document.getElementById('home-queue-count');
  const queueList = document.getElementById('home-queue-list');

  if (!queueContainer || !queueCount || !queueList) return;

  if (homeUploadQueueFiles.length === 0) {
    queueContainer.classList.add('hidden');
    return;
  }

  queueContainer.classList.remove('hidden');
  queueCount.innerText = homeUploadQueueFiles.length;

  queueList.innerHTML = homeUploadQueueFiles.map((file, idx) => `
    <div class="flex items-center justify-between p-2.5 bg-[#0f0e17] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_#000]">
      <div class="flex items-center gap-2 truncate">
        <span class="text-[#2cb67d] font-pixel">#${idx + 1}</span>
        <span class="text-[#fffffe] truncate max-w-xs">${file.name}</span>
      </div>
      <div class="flex items-center gap-3 shrink-0 text-gray-400">
        <span>${(file.size / (1024 * 1024)).toFixed(1)} MB</span>
        <button onclick="window.removeHomeQueueItem(${idx})" class="font-pixel text-rose-400 hover:text-rose-300 font-bold">&times;</button>
      </div>
    </div>
  `).join('');
}

window.clearHomeUploadQueue = function() {
  homeUploadQueueFiles = [];
  updateHomeUploadQueueUI();
};

window.removeHomeQueueItem = function(idx) {
  homeUploadQueueFiles.splice(idx, 1);
  updateHomeUploadQueueUI();
};

window.executeHomePublicUpload = async function() {
  if (homeUploadQueueFiles.length === 0) {
    showToast('Pilih setidaknya satu file untuk diunggah', 'error');
    return;
  }

  const btnStart = document.getElementById('home-btn-upload');
  const progressContainer = document.getElementById('home-progress-container');
  const progressBar = document.getElementById('home-progress-bar');
  const progressPercent = document.getElementById('home-progress-percent');
  const progressStatus = document.getElementById('home-progress-status');

  btnStart.disabled = true;
  btnStart.innerText = 'Mengirim ke Cloud Telegram Publik...';
  progressContainer.classList.remove('hidden');

  const formData = new FormData();
  homeUploadQueueFiles.forEach(f => formData.append('files', f));
  formData.append('folder', 'Root');
  formData.append('status', 'public');

  let p = 10;
  const interval = setInterval(() => {
    if (p < 90) {
      p += 15;
      progressBar.style.width = p + '%';
      progressPercent.innerText = p + '%';
    }
  }, 200);

  const res = await fetchApi('/api/upload', {
    method: 'POST',
    body: formData
  });

  clearInterval(interval);

  if (res && res.success) {
    progressBar.style.width = '100%';
    progressPercent.innerText = '100%';
    progressStatus.innerText = 'Berkas Berhasil Tersimpan di Public Cloud Telegram!';

    const firstUploaded = Array.isArray(res.data) ? res.data[0] : res.data;
    state.uploadSuccessModal = firstUploaded;

    showToast(`Unggahan berhasil! ID File Anda: ${firstUploaded.unique_code}`, 'success');
    homeUploadQueueFiles = [];

    await loadInitialData();
    renderApp();

    // Auto generate TinyURL short URL for modal
    const shareUrl = `${window.location.origin}/#file/${firstUploaded.unique_code}`;
    window.generateShortUrlModal(shareUrl);
  } else {
    btnStart.disabled = false;
    btnStart.innerText = '🚀 MULAI UNGGAH SEKARANG';
    progressStatus.innerText = 'Gagal Mengunggah';
    showToast(res ? res.message : 'Gagal mengunggah file', 'error');
  }
};

window.closePostUploadModal = function() {
  state.uploadSuccessModal = null;
  renderApp();
};

window.generateShortUrlModal = async function(longUrl) {
  const input = document.getElementById('modal-short-url-input');
  const btnText = document.getElementById('btn-short-url-text');
  const status = document.getElementById('short-url-status');

  if (input && input.value && input.value.startsWith('http')) {
    navigator.clipboard.writeText(input.value);
    showToast('Short URL disalin ke clipboard!', 'success');
    return;
  }

  if (status) status.innerText = '⏳ Memproses...';
  if (btnText) btnText.innerText = '⏳ Memproses...';

  try {
    let shortUrl = '';
    // 1. Call server API endpoint proxy first
    const res = await fetch(`/api/shorten?url=${encodeURIComponent(longUrl)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.shortUrl) {
        shortUrl = data.shortUrl;
      }
    }

    // 2. Direct TinyURL fallback call
    if (!shortUrl) {
      const directRes = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
      if (directRes.ok) {
        shortUrl = (await directRes.text()).trim();
      }
    }

    if (shortUrl) {
      if (input) input.value = shortUrl;
      if (state.uploadSuccessModal) {
        state.uploadSuccessModal.short_url = shortUrl;
      }
      if (status) status.innerText = '✓ Siap';
      if (btnText) btnText.innerText = '📋 Salin Short URL';
      showToast('Short URL (TinyURL) berhasil dibuat!', 'success');
    } else {
      throw new Error('Gagal mendapatkan Short URL');
    }
  } catch (err) {
    console.error('Short URL Error:', err);
    if (status) status.innerText = '⚠️ Gagal';
    if (btnText) btnText.innerText = '⚡ Perpendek URL';
    showToast('Gagal membuat short URL: ' + err.message, 'error');
  }
};

window.copyTextToClipboard = function(text, label) {
  navigator.clipboard.writeText(text);
  showToast(`${label} berhasil disalin!`, 'success');
};

window.handlePublicDeleteFile = async function(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('delete-file-input');
  if (!input || !input.value.trim()) return;

  let val = input.value.trim();
  // Strip query strings and hash
  val = val.split('?')[0].split('#')[0];
  if (val.includes('/preview/')) val = val.split('/preview/').pop();
  else if (val.includes('/file/')) val = val.split('/file/').pop();
  else if (val.includes('/download/')) val = val.split('/download/').pop();
  else if (val.includes('/raw/')) val = val.split('/raw/').pop();
  else if (val.includes('/')) val = val.split('/').pop();
  
  val = val.trim();

  if (!confirm(`Apakah Anda yakin ingin menghapus berkas dengan ID/Kode "${val}"?`)) {
    return;
  }

  showToast(`Memproses penghapusan berkas ID: ${val}...`, 'info');
  const res = await fetchApi(`/api/delete/${encodeURIComponent(val)}`, { method: 'DELETE' });

  if (res && res.success) {
    showToast(res.message || `Berkas ${val} berhasil dihapus!`, 'success');
    input.value = '';
    await loadInitialData();
    if (state.activeTab === 'public-file') {
      state.activeTab = 'home';
      window.location.hash = '';
    }
    renderApp();
  } else {
    showToast(res ? res.message : 'Gagal menghapus berkas.', 'error');
  }
};

function setupDropzoneEvents() {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const folderInput = document.getElementById('folder-input');

  if (!dropzone) return;

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, e => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => {
      dropzone.classList.add('border-[#ff8e3c]', 'bg-[#16161e]');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => {
      dropzone.classList.remove('border-[#ff8e3c]', 'bg-[#16161e]');
    }, false);
  });

  dropzone.addEventListener('drop', e => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleSelectedFiles(files);
  });

  if (fileInput) {
    fileInput.addEventListener('change', e => {
      handleSelectedFiles(e.target.files);
    });
  }

  if (folderInput) {
    folderInput.addEventListener('change', e => {
      handleSelectedFiles(e.target.files);
    });
  }
}

function handleSelectedFiles(filesList) {
  if (!filesList || filesList.length === 0) return;
  const newFiles = Array.from(filesList);
  uploadQueueFiles.push(...newFiles);
  updateUploadQueueUI();
}

function updateUploadQueueUI() {
  const queueContainer = document.getElementById('queue-container');
  const queueCount = document.getElementById('queue-count');
  const queueList = document.getElementById('queue-list');

  if (!queueContainer || !queueCount || !queueList) return;

  if (uploadQueueFiles.length === 0) {
    queueContainer.classList.add('hidden');
    return;
  }

  queueContainer.classList.remove('hidden');
  queueCount.innerText = uploadQueueFiles.length;

  queueList.innerHTML = uploadQueueFiles.map((file, idx) => `
    <div class="flex items-center justify-between p-2.5 bg-[#0f0e17] border-2 border-black font-mono text-xs shadow-[2px_2px_0px_#000]">
      <div class="flex items-center gap-2 truncate">
        <span class="text-[#ff8e3c] font-pixel">#${idx + 1}</span>
        <span class="text-[#fffffe] truncate max-w-xs">${file.name}</span>
      </div>
      <div class="flex items-center gap-3 shrink-0 text-gray-400">
        <span>${(file.size / (1024 * 1024)).toFixed(1)} MB</span>
        <button onclick="window.removeQueueItem(${idx})" class="font-pixel text-rose-400 hover:text-rose-300 font-bold">&times;</button>
      </div>
    </div>
  `).join('');
}

// Global Window Actions
window.navigateToTab = function(tabId) {
  state.activeTab = tabId;
  window.location.hash = tabId === 'home' ? '' : tabId;
  renderApp();
};

window.navigateToRoute = function(route) {
  window.location.hash = route;
};

window.handleQuickAccessFile = async function(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('quick-file-input');
  if (!input || !input.value.trim()) return;

  let val = input.value.trim();
  if (val.includes('/preview/')) {
    val = val.split('/preview/').pop().split('?')[0].split('#')[0];
  } else if (val.includes('#file/')) {
    val = val.split('#file/').pop();
  }

  showToast(`Mencari berkas: ${val}...`, 'info');
  const res = await fetchApi(`/api/file/${val}`);
  if (res && res.success && res.data) {
    state.publicFileDetails = res.data;
    state.activeTab = 'public-file';
    window.location.hash = `file/${val}`;
    renderApp();
  } else {
    showToast(res ? res.message : 'File tidak ditemukan', 'error');
  }
};

window.handleAdminLoginSubmit = async function(e) {
  if (e) e.preventDefault();
  const uInput = document.getElementById('login-username');
  const pInput = document.getElementById('login-password');
  const submitBtn = document.getElementById('login-submit-btn');

  const username = uInput ? uInput.value.trim() : '';
  const password = pInput ? pInput.value : '';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerText = 'MEMPROSES LOGIN...';
  }

  const res = await fetchApi('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });

  if (res && res.success) {
    state.loginError = null;
    localStorage.setItem('tg_jwt_token', res.token);
    localStorage.setItem('tg_user', JSON.stringify(res.user));
    state.authToken = res.token;
    state.user = res.user;

    showToast('Login Administrator Berhasil!', 'success');
    await loadInitialData();
    state.activeTab = 'dashboard';
    window.location.hash = 'dashboard';
    renderApp();
  } else {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerText = 'Masuk Portal Admin';
    }
    state.loginError = res ? res.message : 'Login gagal. Periksa username/password.';
    showToast(state.loginError, 'error');
    renderApp();
  }
};

window.clearLoginError = function() {
  state.loginError = null;
  renderApp();
};

window.logoutAdmin = function() {
  localStorage.removeItem('tg_jwt_token');
  localStorage.removeItem('tg_user');
  state.authToken = '';
  state.user = null;
  showToast('Sesi Administrator Telah Berakhir', 'info');
  state.activeTab = 'home';
  window.location.hash = '';
  renderApp();
};

window.copyPublicShareLink = function(code) {
  const url = `${window.location.origin}/#file/${code}`;
  navigator.clipboard.writeText(url);
  showToast(`Link Berbagi Berkas Disalin: ${url}`, 'success');
};

window.clearUploadQueue = function() {
  uploadQueueFiles = [];
  updateUploadQueueUI();
};

window.removeQueueItem = function(idx) {
  uploadQueueFiles.splice(idx, 1);
  updateUploadQueueUI();
};

window.executeUpload = async function() {
  if (uploadQueueFiles.length === 0) {
    showToast('Pilih setidaknya satu file untuk diunggah', 'error');
    return;
  }

  const folderSelect = document.getElementById('upload-folder-select');
  const statusSelect = document.getElementById('upload-status-select');
  const btnStart = document.getElementById('btn-start-upload');
  const progressContainer = document.getElementById('progress-container');
  const progressBar = document.getElementById('progress-bar');
  const progressPercent = document.getElementById('progress-percent');
  const progressStatus = document.getElementById('progress-status');

  const selectedFolder = folderSelect ? folderSelect.value : 'Root';
  const selectedStatus = statusSelect ? statusSelect.value : 'public';

  btnStart.disabled = true;
  btnStart.innerText = 'Mengirim ke Telegram Cloud...';
  progressContainer.classList.remove('hidden');

  const formData = new FormData();
  uploadQueueFiles.forEach(f => formData.append('files', f));
  formData.append('folder', selectedFolder);
  formData.append('status', selectedStatus);

  let p = 10;
  const interval = setInterval(() => {
    if (p < 90) {
      p += 15;
      progressBar.style.width = p + '%';
      progressPercent.innerText = p + '%';
    }
  }, 200);

  const res = await fetchApi('/api/upload', {
    method: 'POST',
    body: formData
  });

  clearInterval(interval);

  if (res && res.success) {
    progressBar.style.width = '100%';
    progressPercent.innerText = '100%';
    progressStatus.innerText = 'File Berhasil Disimpan di Cloud Telegram!';

    const firstUploaded = Array.isArray(res.data) ? res.data[0] : res.data;
    state.uploadSuccessModal = firstUploaded;

    showToast(`Unggahan berhasil! ID File Anda: ${firstUploaded.unique_code}`, 'success');
    uploadQueueFiles = [];
    
    // Auto generate TinyURL short URL
    const shareUrl = `${window.location.origin}/#file/${firstUploaded.unique_code}`;
    window.generateShortUrlModal(shareUrl);
    
    setTimeout(async () => {
      await loadInitialData();
      state.activeTab = 'file-manager';
      window.location.hash = 'file-manager';
      renderApp();
    }, 1200);
  } else {
    btnStart.disabled = false;
    btnStart.innerText = '🚀 MULAI UNGGAH KE TELEGRAM CLOUD';
    progressStatus.innerText = 'Gagal Mengunggah';
    showToast(res.message || 'Gagal mengunggah file', 'error');
  }
};

window.filterFilesList = function() {
  const searchInput = document.getElementById('search-file-input');
  const folderSelect = document.getElementById('folder-filter-select');
  const container = document.getElementById('file-list-container');

  if (!container) return;

  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const selectedFolder = folderSelect ? folderSelect.value.toLowerCase() : 'all';
  const activeCatBtn = document.querySelector('.cat-btn.pixel-btn');
  const activeCat = activeCatBtn ? activeCatBtn.getAttribute('data-cat') : 'all';

  let filtered = state.files || [];

  if (query) {
    filtered = filtered.filter(f => 
      f.file_name.toLowerCase().includes(query) || 
      f.unique_code.toLowerCase().includes(query) ||
      f.folder.toLowerCase().includes(query)
    );
  }

  if (selectedFolder !== 'all') {
    filtered = filtered.filter(f => f.folder.toLowerCase() === selectedFolder);
  }

  if (activeCat !== 'all') {
    filtered = filtered.filter(f => f.media_type === activeCat);
  }

  container.innerHTML = renderFilesList(filtered);
};

window.setCategoryFilter = function(cat) {
  document.querySelectorAll('.cat-btn').forEach(btn => {
    if (btn.getAttribute('data-cat') === cat) {
      btn.className = 'cat-btn pixel-btn text-[10px] py-1 px-3';
    } else {
      btn.className = 'cat-btn pixel-btn-dark text-[10px] py-1 px-3';
    }
  });

  window.filterFilesList();
};

window.copyPublicLink = function(code, isPrivate = false) {
  const url = `${window.location.origin}/#file/${code}`;
  navigator.clipboard.writeText(url);
  if (isPrivate) {
    showToast(`Disalin URL pratinjau (${code}). Catatan: Berkas PRIVAT.`, 'info');
  } else {
    showToast(`Disalin URL publik (${code})`, 'success');
  }
};

window.toggleFileStatus = async function(id, currentStatus) {
  const newStatus = currentStatus === 'private' ? 'public' : 'private';
  const res = await fetchApi(`/api/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status: newStatus })
  });

  if (res && res.success) {
    showToast(`Status berkas diubah menjadi ${newStatus.toUpperCase()}`, 'success');
    await loadInitialData();
    renderApp();
  } else {
    showToast(res.message || 'Gagal mengubah status berkas', 'error');
  }
};

window.deleteFilePrompt = async function(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus berkas ini dari Cloud Storage Telegram?')) return;

  const res = await fetchApi(`/api/delete/${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (res && res.success) {
    showToast(res.message || 'Berkas berhasil dihapus', 'success');
    await loadInitialData();
    if (state.activeTab === 'public-file') {
      state.activeTab = 'home';
      window.location.hash = '';
    }
    renderApp();
  } else {
    showToast(res ? res.message : 'Gagal menghapus berkas', 'error');
  }
};

window.openCreateFolderModal = function() {
  const modal = document.getElementById('create-folder-modal');
  if (modal) modal.classList.remove('hidden');
};

window.closeCreateFolderModal = function() {
  const modal = document.getElementById('create-folder-modal');
  if (modal) modal.classList.add('hidden');
};

window.submitCreateFolder = async function() {
  const nameInput = document.getElementById('new-folder-name');
  const descInput = document.getElementById('new-folder-desc');
  const colorSelect = document.getElementById('new-folder-color');

  if (!nameInput || !nameInput.value.trim()) {
    showToast('Nama folder wajib diisi', 'error');
    return;
  }

  const res = await fetchApi('/api/folder', {
    method: 'POST',
    body: JSON.stringify({
      name: nameInput.value.trim(),
      description: descInput ? descInput.value.trim() : '',
      color: colorSelect ? colorSelect.value : 'amber'
    })
  });

  if (res && res.success) {
    showToast('Folder berhasil dibuat!', 'success');
    window.closeCreateFolderModal();
    await loadInitialData();
    renderApp();
  } else {
    showToast(res.message || 'Gagal membuat folder', 'error');
  }
};

window.deleteFolderPrompt = async function(folderId) {
  if (!confirm('Hapus folder ini? Berkas di dalamnya akan dipindahkan ke Root.')) return;

  const res = await fetchApi(`/api/folder/${folderId}`, { method: 'DELETE' });
  if (res && res.success) {
    showToast('Folder berhasil dihapus', 'success');
    await loadInitialData();
    renderApp();
  } else {
    showToast(res.message || 'Gagal menghapus folder', 'error');
  }
};

window.testApiEndpoint = async function(endpoint) {
  const output = document.getElementById('api-tester-response');
  if (!output) return;

  output.classList.remove('hidden');
  output.innerText = 'Mengirim request ke ' + endpoint + '...';

  const data = await fetchApi(endpoint);
  output.innerText = JSON.stringify(data, null, 2);
};

window.saveTelegramSettings = async function() {
  const tokenInput = document.getElementById('tg-bot-token');
  const channelPublicInput = document.getElementById('tg-channel-id-public') || document.getElementById('tg-channel-id');
  const channelPrivateInput = document.getElementById('tg-channel-id-private');

  const res = await fetchApi('/api/settings', {
    method: 'PUT',
    body: JSON.stringify({
      telegram_token: tokenInput ? tokenInput.value.trim() : '',
      telegram_channel_id: channelPublicInput ? channelPublicInput.value.trim() : '',
      telegram_channel_id_private: channelPrivateInput ? channelPrivateInput.value.trim() : '-5568856013'
    })
  });

  if (res && res.success) {
    showToast('Pengaturan Telegram Diperbarui!', 'success');
    await loadInitialData();
    renderApp();
  } else {
    showToast(res.message || 'Gagal memperbarui pengaturan', 'error');
  }
};

window.testTelegramBotConnection = async function() {
  const tokenInput = document.getElementById('tg-bot-token');
  const channelPublicInput = document.getElementById('tg-channel-id-public') || document.getElementById('tg-channel-id');
  const resultBox = document.getElementById('bot-test-result');

  if (!resultBox) return;

  resultBox.classList.remove('hidden');
  resultBox.className = 'p-3 bg-[#0f0e17] border-2 border-black font-mono text-xs text-gray-300';
  resultBox.innerText = 'Menguji koneksi ke Telegram Bot API...';

  const tokenVal = tokenInput ? tokenInput.value.trim() : '';
  const channelVal = channelPublicInput ? channelPublicInput.value.trim() : '';

  if (!tokenVal) {
    resultBox.className = 'p-3 bg-[#ff8e3c]/20 border-2 border-[#ff8e3c] font-mono text-xs text-[#ff8e3c]';
    resultBox.innerHTML = '⚠️ Token Bot Telegram masih kosong. Masukkan Token dari @BotFather di kolom atas untuk menguji koneksi.';
    return;
  }

  const res = await fetchApi('/api/settings/test-bot', {
    method: 'POST',
    body: JSON.stringify({
      token: tokenVal,
      channel_id: channelVal
    })
  });

  if (res && res.success) {
    resultBox.className = 'p-3 bg-[#2cb67d]/20 border-2 border-[#2cb67d] font-mono text-xs text-[#2cb67d]';
    resultBox.innerHTML = `✅ ${res.message} ${res.channel ? `(Channel: ${res.channel})` : ''}`;
  } else {
    resultBox.className = 'p-3 bg-[#e53170]/20 border-2 border-[#e53170] font-mono text-xs text-[#e53170]';
    resultBox.innerHTML = `❌ Koneksi Gagal: ${res.message}`;
  }
};

window.createNewApiKeyPrompt = async function() {
  const name = prompt('Masukkan nama label untuk Kunci API ini:', 'Aplikasi Pihak Ketiga');
  if (!name) return;

  const res = await fetchApi('/api/keys', {
    method: 'POST',
    body: JSON.stringify({ name, rate_limit_per_min: 60 })
  });

  if (res && res.success) {
    showToast('Kunci API Baru Dibuat!', 'success');
    await loadInitialData();
    renderApp();
  } else {
    showToast(res.message || 'Gagal membuat Kunci API', 'error');
  }
};

window.deleteApiKeyPrompt = async function(keyId) {
  if (!confirm('Cabut dan hapus Kunci API ini?')) return;

  const res = await fetchApi(`/api/keys/${keyId}`, { method: 'DELETE' });
  if (res && res.success) {
    showToast('Kunci API dicabut', 'success');
    await loadInitialData();
    renderApp();
  } else {
    showToast(res.message || 'Gagal mencabut Kunci API', 'error');
  }
};

document.addEventListener('DOMContentLoaded', initApp);
