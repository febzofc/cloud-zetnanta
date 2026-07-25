import { state } from '../utils/api.js';

export function renderNavigation() {
  const isAdmin = Boolean(state.authToken);
  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>` },
    { id: 'upload', label: 'Upload File', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>` },
    { id: 'file-manager', label: 'Manajemen File', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>` },
    { id: 'folder-manager', label: 'Folders', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>` },
    { id: 'settings', label: 'Pengaturan', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>` },
    { id: 'api-docs', label: 'API Docs', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>` }
  ];

  const publicTabs = [
    { id: 'home', label: 'Beranda', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>` },
    { id: 'about', label: 'Informasi', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>` },
    { id: 'api-docs', label: 'API Docs', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>` }
  ];

  const currentTabs = (isAdmin || ['dashboard', 'upload', 'file-manager', 'folder-manager', 'settings'].includes(state.activeTab))
    ? adminTabs
    : publicTabs;

  return `
    <!-- Saweria-Inspired Pixel Header -->
    <header class="border-b-4 border-black bg-[#16161e] sticky top-0 z-40 shadow-[0_4px_0_0_#000]">
      <div class="max-w-6xl mx-auto px-4 h-18 flex items-center justify-between">
        
        <!-- Logo Pixel Art -->
        <a href="#" onclick="event.preventDefault(); window.navigateToTab('home')" class="flex items-center gap-3 group">
          <div class="w-10 h-10 bg-[#ff8e3c] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition">
            <span class="font-pixel text-black text-xs font-bold">Z</span>
          </div>
          <div>
            <h1 class="font-pixel text-sm sm:text-base text-[#fffffe] tracking-tight flex items-center gap-2 border-0 h-[19px]">
              ZETNANTA <span class="text-[#ff8e3c]">CLOUD</span>
            </h1>
            <p class="text-[10px] text-[#2cb67d] font-silk font-bold tracking-wider">PIXEL CLOUD ENGINE v1.0</p>
          </div>
        </a>

        <!-- Navigation Links -->
        <nav class="hidden md:flex items-center gap-2 bg-[#0f0e17] p-1.5 border-2 border-black shadow-[2px_2px_0px_#000]">
          ${currentTabs.map(tab => {
            const isActive = state.activeTab === tab.id;
            return `
              <button 
                onclick="window.navigateToTab('${tab.id}')"
                class="flex items-center gap-2 px-3 py-1.5 text-xs font-bold font-silk transition ${
                  isActive 
                    ? 'bg-[#ff8e3c] text-black border-2 border-black shadow-[2px_2px_0px_#000]' 
                    : 'text-[#fffffe] hover:bg-[#2cb67d] hover:text-black border-2 border-transparent'
                }"
              >
                ${tab.icon}
                <span>${tab.label}</span>
              </button>
            `;
          }).join('')}
        </nav>

        <!-- Right Side Actions -->
        <div class="flex items-center gap-2">
          ${isAdmin ? `
            <div class="hidden sm:flex items-center gap-2 bg-[#7f5af0] text-white px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_#000] text-[10px] font-pixel">
              <span>ADMIN: ${state.user?.username || 'febri'}</span>
            </div>
            <button onclick="window.logoutAdmin()" class="pixel-btn-danger px-3 py-1.5 text-xs font-silk flex items-center gap-1">
              <span>Keluar</span>
            </button>
          ` : `
            <button onclick="window.navigateToTab('admin-login')" class="pixel-btn px-3.5 py-1.5 text-xs font-silk flex items-center justify-center gap-1.5 w-[96.2px] h-[39.175px]">
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              <span>Admin</span>
            </button>
          `}
        </div>
      </div>
    </header>

    <!-- Mobile Navigation Bar -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#16161e] border-t-4 border-black px-1 py-1.5 flex items-center justify-around overflow-x-auto overflow-y-hidden shadow-[0_-4px_0_0_#000] space-x-1">
      ${currentTabs.map(tab => {
        const isActive = state.activeTab === tab.id;
        return `
          <button 
            onclick="window.navigateToTab('${tab.id}')"
            class="flex flex-col items-center justify-center min-w-[50px] shrink-0 gap-0.5 p-1 text-[9px] font-silk font-bold transition ${
              isActive 
                ? 'text-black bg-[#ff8e3c] border-2 border-black shadow-[1px_1px_0px_#000]' 
                : 'text-[#fffffe] hover:text-[#ff8e3c]'
            }"
          >
            ${tab.icon}
            <span class="truncate max-w-[55px] text-center">${tab.label.split(' ')[0]}</span>
          </button>
        `;
      }).join('')}
    </div>
  `;
}


