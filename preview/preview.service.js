import fs from 'fs';

export class PreviewService {
  static renderPreviewHTML(fileRecord) {
    const rawUrl = `/raw/${fileRecord.unique_code}`;
    const downloadUrl = `/download/${fileRecord.unique_code}`;
    const mediaType = fileRecord.media_type;
    const title = fileRecord.file_name;

    let viewerContent = '';

    if (mediaType === 'video') {
      viewerContent = `
        <div class="w-full max-w-4xl bg-[#141414] rounded-2xl border border-[#1F1F1F] p-3 shadow-2xl">
          <video controls class="w-full h-auto max-h-[70vh] rounded-xl outline-none" poster="/assets/placeholder_video.png">
            <source src="${rawUrl}">
            Your browser does not support the video tag.
          </video>
        </div>
      `;
    } else if (mediaType === 'image') {
      viewerContent = `
        <div class="w-full max-w-4xl bg-[#141414] rounded-2xl border border-[#1F1F1F] p-4 shadow-2xl flex items-center justify-center">
          <img src="${rawUrl}" alt="${title}" class="max-w-full max-h-[75vh] object-contain rounded-xl shadow-lg" />
        </div>
      `;
    } else if (mediaType === 'audio') {
      viewerContent = `
        <div class="w-full max-w-xl bg-[#141414] backdrop-blur-md rounded-2xl border border-[#1F1F1F] p-8 text-center shadow-2xl">
          <div class="w-20 h-20 mx-auto mb-6 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center border border-purple-500/20 shadow-inner">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 .895-2 3-2 3 .895 3 2zm12 0c0 1.105-1.343 2-3 2s-3-.895-3-2 .895-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
          </div>
          <h2 class="text-xl font-bold text-white mb-1">${title}</h2>
          <p class="text-sm text-gray-400 mb-6">${fileRecord.size} • ${fileRecord.extension.toUpperCase()} Audio</p>
          <audio controls class="w-full outline-none focus:ring-2 focus:ring-indigo-500/50 rounded-lg">
            <source src="${rawUrl}">
            Your browser does not support audio playback.
          </audio>
        </div>
      `;
    } else if (mediaType === 'pdf') {
      viewerContent = `
        <div class="w-full max-w-5xl h-[80vh] bg-[#141414] rounded-2xl border border-[#1F1F1F] overflow-hidden shadow-2xl flex flex-col">
          <iframe src="${rawUrl}" class="w-full h-full border-none" title="${title}"></iframe>
        </div>
      `;
    } else if (mediaType === 'txt') {
      viewerContent = `
        <div class="w-full max-w-4xl h-[70vh] bg-[#141414] rounded-2xl border border-[#1F1F1F] overflow-hidden shadow-2xl flex flex-col">
          <div class="flex items-center justify-between p-4 border-b border-[#1F1F1F]">
            <span class="text-xs font-mono text-indigo-400 uppercase tracking-widest font-semibold">Plain Text / Document Stream</span>
            <span class="text-xs text-gray-400">${fileRecord.size}</span>
          </div>
          <iframe src="${rawUrl}" class="w-full h-full border-none bg-[#1a1a1a] text-white" title="${title}"></iframe>
        </div>
      `;
    } else if (mediaType === 'zip') {
      viewerContent = `
        <div class="w-full max-w-2xl bg-[#141414] rounded-2xl border border-[#1F1F1F] p-8 shadow-2xl text-center">
          <div class="w-20 h-20 mx-auto mb-6 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center border border-amber-500/20">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 012-2h10a2 2 0 012 2M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4m-4 4h4"></path></svg>
          </div>
          <h2 class="text-xl font-bold text-white mb-2">${title}</h2>
          <p class="text-sm text-gray-400 mb-6">Archive Package • ${fileRecord.size} • Beta Live Storage</p>
          <a href="${downloadUrl}" class="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-600/20">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download Archive (${fileRecord.size})
          </a>
        </div>
      `;
    } else {
      viewerContent = `
        <div class="w-full max-w-xl bg-[#141414] rounded-2xl border border-[#1F1F1F] p-8 shadow-2xl text-center">
          <div class="w-20 h-20 mx-auto mb-6 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-500/20">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
          </div>
          <h2 class="text-xl font-bold text-white mb-1">${title}</h2>
          <p class="text-sm text-gray-400 mb-6">${fileRecord.size} • ${fileRecord.extension.toUpperCase()} File</p>
          <a href="${downloadUrl}" class="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-600/20">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download File
          </a>
        </div>
      `;
    }

    return `
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview: ${escapeHTML(title)} - Telegram Storage Beta Live</title>
  <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-[#090909] text-[#F0F0F0] min-h-screen flex flex-col antialiased">
  <header class="border-b border-[#1F1F1F] bg-[#0D0D0D] px-6 py-4 sticky top-0 z-50 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <a href="/" class="flex items-center gap-2.5 text-white hover:text-indigo-400 font-bold transition">
        <div class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-600/20">TG</div>
        <span>Telegram Storage Engine</span>
      </a>
      <span class="text-gray-700">/</span>
      <span class="text-xs font-mono text-gray-400 bg-[#1A1A1A] px-2 py-1 rounded-md border border-[#262626]">${fileRecord.unique_code}</span>
      <span class="text-[10px] font-mono text-indigo-400 bg-indigo-600/10 px-2 py-0.5 rounded border border-indigo-500/20">BETA LIVE</span>
    </div>
    <div class="flex items-center gap-3">
      <a href="${downloadUrl}" download class="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-md shadow-indigo-600/20">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        Download
      </a>
      <a href="/" class="px-3.5 py-2 bg-[#1F1F1F] hover:bg-[#2A2A2A] text-gray-300 font-medium text-sm rounded-xl transition">Back to App</a>
    </div>
  </header>

  <main class="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
    <div class="w-full flex justify-center mb-6">
      ${viewerContent}
    </div>

    <div class="w-full max-w-xl bg-[#141414] border border-[#1F1F1F] rounded-2xl p-4 flex items-center justify-between text-xs text-gray-400">
      <div>
        <span class="text-gray-500">Folder:</span> <strong class="text-gray-200">${fileRecord.folder}</strong>
      </div>
      <div>
        <span class="text-gray-500">Downloads:</span> <strong class="text-indigo-400">${fileRecord.download_count}</strong>
      </div>
      <div>
        <span class="text-gray-500">Views:</span> <strong class="text-sky-400">${fileRecord.view_count}</strong>
      </div>
      <div>
        <span class="text-gray-500">Uploaded:</span> <span class="text-gray-200">${fileRecord.upload_date}</span>
      </div>
    </div>
  </main>

  <footer class="border-t border-[#1F1F1F] py-4 text-center text-xs text-gray-500 font-mono">
    Telegram Storage Engine • Production Beta Live v1.0
  </footer>
</body>
</html>
    `;
  }

  static renderPrivateAccessHTML(fileRecord) {
    const title = fileRecord.file_name;
    return `
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Private File Access Restricted - ${escapeHTML(title)}</title>
  <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-[#090909] text-[#F0F0F0] min-h-screen flex flex-col items-center justify-center p-6 antialiased">
  <div class="w-full max-w-md bg-[#141414] border border-amber-500/30 rounded-2xl p-8 text-center shadow-2xl space-y-6">
    <div class="w-20 h-20 mx-auto bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center border border-amber-500/20 shadow-inner">
      <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
    </div>

    <div>
      <span class="inline-block px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-mono font-bold rounded-full border border-amber-500/20 mb-3">PRIVATE FILE</span>
      <h2 class="text-xl font-bold text-white tracking-tight">${escapeHTML(title)}</h2>
      <p class="text-xs text-gray-400 mt-2">This file is marked as <strong>Private</strong>. Access is restricted to authorized users or API Key holders.</p>
    </div>

    <form method="GET" action="" class="space-y-3 pt-2">
      <input type="text" name="api_key" placeholder="Enter API Key or Token..." class="w-full bg-[#1A1A1A] border border-[#2D2D2D] focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-gray-200 focus:outline-none transition text-center font-mono">
      <button type="submit" class="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-amber-600/20">
        UNLOCK ACCESS
      </button>
    </form>

    <div class="border-t border-[#1F1F1F] pt-4">
      <a href="/" class="text-xs text-gray-400 hover:text-white underline transition">Back to Main Application</a>
    </div>
  </div>
</body>
</html>
    `;
  }
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
