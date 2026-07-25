# ⚡ ZETNANTA CLOUD - Telegram Cloud Storage System

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green?logo=nodedotjs)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-v5.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-v4.18-000000?logo=express)](https://expressjs.com/)
[![Telegram API](https://img.shields.io/badge/Telegram_Bot_API-Enabled-26A5E4?logo=telegram)](https://core.telegram.org/bots/api)
[![License](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

> **ZETNANTA CLOUD** adalah platform penyimpanan awan (Cloud Storage Engine) berbasis Telegram Bot API berkinerja tinggi. Aplikasi ini memungkinkan pengguna menyimpan, mengelola, membagikan, dan mengalirkan (*streaming*) berkas tanpa batas ruang dengan memanfaatkan infrastruktur Cloud Telegram secara aman.

---

## ✨ Fitur Utama

- 🚀 **Unlimited Telegram Storage Engine**: Mengunggah dan menyimpan berkas hingga 2,000 MB per berkas langsung ke Channel Telegram.
- 🔀 **Pemisahan Cloud Publik & Cloud Private**:
  - **Cloud Publik**: Menyimpan berkas publik ke Channel Telegram Publik.
  - **Cloud Private**: Menyimpan berkas privat/owner ke Channel Telegram Private khusus.
- ⚡ **Stream & Direct Download Engine**: Mendukung HTTP Range Requests untuk pemutaran ulang video/audio langsung (*seeking/streaming*) tanpa menunda pengunduhan seluruh file.
- 🔐 **Manajemen Kunci API (API Key)**: Keamanan autentikasi ganda via JWT Token dan API Key (`X-API-KEY`) untuk integrasi aplikasi pihak ketiga.
- ✂️ **TinyURL Auto Shortener**: Integrasi langsung dengan pemendek URL untuk kemudahan berbagi link unduhan.
- 📁 **Manajemen Folder & Berkas**: Atur struktur repositori dengan mudah melalui antarmuka Retro Pixel UI yang responsif dan interaktif.
- 📊 **Dashboard Analytics & Realtime Monitoring**: Melacak total berkas, penggunaan ruang, statistik pengunduhan, dan jumlah tayangan.

---

## 🛠️ Arsitektur & Teknologi (Tech Stack)

- **Frontend**: HTML5, Vanilla JavaScript (ES6 Modules), Tailwind CSS (Saweria Retro Pixel Theme design system).
- **Backend Framework**: Express.js (Node.js REST API).
- **Development Tooling**: Vite (Dev Server & SPA Builder), `tsx` (TypeScript & ESNext runner).
- **Database Engine**: Lightweight File-based JSON Storage (`JsonDbService`).
- **Cloud Engine**: Telegram Bot API (`sendDocument`, `getFile`, `deleteMessage`).

---

## 🚀 Panduan Instalasi & Penggunaan

### 1. Prasyarat
- **Node.js**: versi `18.x` atau lebih baru.
- **Bot Telegram**: Token Bot dari [@BotFather](https://t.me/BotFather).
- **Channel Telegram**: 
  - Channel Publik (Bot dijadikan Admin)
  - Channel Private/Owner (Bot dijadikan Admin)

### 2. Kloning Repository
```bash
git clone https://github.com/febzofc/cloud-zetnanta.git
cd cloud-zetnanta
```

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Konfigurasi Environment (`.env`)
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi konfigurasi pada file `.env`:
```env
PORT=2556
JWT_SECRET=rahasia_super_kunci_jwt_zetnanta_2026
MAX_FILE_SIZE_MB=2000
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHANNEL_ID=-1001234567890
```

### 5. Menjalankan Server Development
```bash
npm run dev
```
Akses aplikasi melalui browser di `http://localhost:2556` atau `http://localhost:3000`.

### 6. Build untuk Produksi
```bash
npm run build
npm start
```

---

## 📡 Integrasi & Dokumentasi API

Seluruh endpoint REST API dapat diakses dengan menyertakan Kunci API pada header `X-API-KEY` atau Token JWT pada header `Authorization: Bearer <token>`.

### 1. Unggah Berkas (Upload API)
Mengunggah satu atau beberapa berkas ke Telegram Cloud Storage.

- **Endpoint**: `POST /api/upload`
- **Headers**: `Multipart Form-Data`, `X-API-KEY: <your_api_key>` (Opsional)
- **Body Form-Data**:
  - `files`: File binary (dapat berupa multiple files)
  - `folder`: Nama folder tujuan (default: `Root`)
  - `status`: `public` atau `private` (default: `public`)

**Respons Sukses (`201 Created`)**:
```json
{
  "success": true,
  "message": "1 file(s) uploaded successfully!",
  "data": {
    "id": "lx8k9a0b",
    "unique_code": "k9a0b123",
    "telegram_file_id": "BQACAgUAAxkDA...",
    "telegram_message_id": "142",
    "target_channel_id": "-1001234567890",
    "file_name": "document.pdf",
    "media_type": "pdf",
    "extension": "pdf",
    "size": "2.4 MB",
    "size_bytes": 2516582,
    "folder": "Root",
    "status": "public",
    "download_url": "/download/k9a0b123",
    "raw_url": "/raw/k9a0b123",
    "preview_url": "/preview/k9a0b123"
  }
}
```

---

### 2. Stream / Preview Media Raw
Mengalirkan data file (*inline stream*) untuk pemutar video, audio, gambar, atau dokumen PDF.

- **Endpoint**: `GET /raw/:id`
- **Parameter `:id`**: ID File atau Kode Unik Berkas
- **Headers**: Supports HTTP Range (`bytes=start-end`)

---

### 3. Direct Download Berkas
Mengunduh berkas langsung dari Cloud Telegram.

- **Endpoint**: `GET /download/:id`
- **Parameter `:id`**: ID File atau Kode Unik Berkas

---

### 4. Detail Metadata Berkas
Mendapatkan informasi detail dan status statistik berkas.

- **Endpoint**: `GET /api/file/:id`
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "lx8k9a0b",
    "unique_code": "k9a0b123",
    "file_name": "document.pdf",
    "size": "2.4 MB",
    "status": "public",
    "download_count": "15",
    "view_count": "42"
  }
}
```

---

### 5. Hapus Berkas (Delete API)
Menghapus berkas dari database lokal dan pesan berkas di Telegram Channel.

- **Endpoint**: `DELETE /api/delete/:id`
- **Headers**: `Authorization: Bearer <admin_token>`

---

### 6. Cek Kesehatan Server (Health Check)
- **Endpoint**: `GET /api/health`
- **Response**:
```json
{
  "status": "online",
  "service": "Telegram Cloud Storage",
  "timestamp": "2026-07-25T12:00:00.000Z"
}
```

---

## 🔒 Keamanan & Lisensi

- **Lisensi**: MIT License
- **Penggunaan Kunci API**: Simpan Kunci API Anda dengan aman dan jangan dipublikasikan ke repositori terbuka.

---

## 👨‍💻 Owner & Developer

- **Project Name**: ZETNANTA CLOUD
- **Copyright Owner & Lead Developer**: **FEBRIANSYAH**
- **GitHub Repository**: [https://github.com/febzofc/cloud-zetnanta](https://github.com/febzofc/cloud-zetnanta)
- **Telegram Bot Integration Engine**: ZETNANTA Cloud Core

---
*Dikembangkan dengan ❤️ oleh **FEBRIANSYAH**.*
