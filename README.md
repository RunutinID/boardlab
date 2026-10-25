# Learn Arduino — Modern Vite Application ⚡

Replikasi dan rekonstruksi penuh dari [Learn Arduino (learn-arduino-red.vercel.app)](https://learn-arduino-red.vercel.app/) menjadi satu aplikasi web modern, solid, dan terstruktur rapi menggunakan **Vite** dan arsitektur SPA i18n modern.

---

## 🌟 Fitur & Peningkatan Arsitektur

1. **Clean SPA & Modern i18n Best Practice**:
   - Arsitektur **Single Page Application (SPA)** yang bersih tanpa duplikasi folder HTML manual (`/de/index.html`, `/id/index.html`, dsb. telah disatukan).
   - Seluruh translasi dimodularisasi di dalam `src/i18n/`:
     - `src/i18n/index.js`: Mesin i18n terpusat dengan lazy-loading via `import.meta.glob('./locales/*.js')`, deteksi bahasa otomatis dari URL, `localStorage`, atau preferensi browser, serta update atribut HTML `lang` & `dir` (RTL untuk Bahasa Ibrani).
     - `src/i18n/locales/`: 12 modul kamus bahasa lengkap (Bahasa Indonesia `id.js`, `es.js`, `de.js`, `fr.js`, `ja.js`, `zh.js`, dsb.).
   - Vite middleware plugin otomatis menangani routing bahasa (`/id/`, `/es/`, dll.) dengan fallback SPA yang mulus di development maupun preview.
2. **Modular Codebase (`src/`)**:
   - `src/main.js`: Bootstrapper utama aplikasi & penghubung antarmuka i18n.
   - `src/app.js`: State manager, controller pelajaran interaktif, simulasi logika pin microchip (`pinMode`, `digitalWrite`, `analogRead`), dan Serial Monitor virtual.
   - `src/stage.js`: Panggung 3D Three.js, sistem kamera interaktif (pan/rotate/zoom), tata cahaya, dan animasi aliran arus listrik (*current flow*).
   - `src/kit.js`: Pembangkit geometri prosedural komponen elektronik 3D (Arduino Uno R3, ATmega328P, breadboard, LED, resistor, servo SG90, sensor HC-SR04, motor stepper, OLED, buzzer, dsb.).
   - `src/thumbs.js`: Generator thumbnail kartu pelajaran.
   - `src/style.css`: Lembar gaya CSS utama.
3. **Public Assets (`public/`)**:
   - Seluruh favicon, icon PWA, manifest, dan 24 berkas web font WOFF2 (Barlow, JetBrains Mono, Noto Sans) tersimpan rapi di folder `public/`.
4. **Standalone Server Fallback (`server.js`)**:
   - Server HTTP Node.js bawaan tanpa dependensi untuk menjalankan aplikasi langsung tanpa perlu build tools.
5. **Git Ignored (`.gitignore`)**:
   - Konfigurasi `.gitignore` komprehensif untuk memblokir `node_modules/`, `dist/`, logs, file env lokal, dan artefak OS/editor.

---

## 📁 Struktur Direktori Solid

```
D:\Projects\Arduino Learn\
├── .gitignore                  # Git ignore rules untuk Vite & Node
├── index.html                  # Template HTML tunggal (Single Page App)
├── package.json                # Dependencies, metadata & build scripts
├── pnpm-lock.yaml              # Lockfile dependensi
├── vite.config.js              # Konfigurasi Vite & SPA Language Middleware
├── server.js                   # Node.js static server bawaan (Zero dependency)
├── README.md                   # Dokumentasi proyek
├── public/                     # Aset statis murni (disajikan langsung di root)
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── og-image.png
│   ├── site.webmanifest
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── icon-maskable-512.png
│   └── assets/                 # Web fonts WOFF2 (Barlow, JetBrains Mono, Noto Sans)
└── src/                        # Kode sumber aplikasi
    ├── main.js                 # Entry point aplikasi
    ├── app.js                  # Controller UI, logic & Arduino simulator
    ├── stage.js                # Three.js 3D canvas stage & camera
    ├── kit.js                  # Procedural 3D electronics & Uno board
    ├── thumbs.js               # Lesson card thumbnails generator
    ├── style.css               # Main CSS stylesheet
    └── i18n/                   # Arsitektur lokalisasi (i18n)
        ├── index.js            # i18n engine, URL router & DOM translator
        └── locales/            # 12 kamus terjemahan bahasa
            ├── de.js
            ├── es.js
            ├── fr.js
            ├── he.js
            ├── hi.js
            ├── id.js           # Bahasa Indonesia
            ├── it.js
            ├── ja.js
            ├── ko.js
            ├── pt.js
            ├── tr.js
            └── zh.js
```

---

## 🚀 Perintah yang Tersedia (NPM / PNPM Scripts)

### 1. Menjalankan Mode Development (Hot Reloading / HMR)
```bash
pnpm dev
# atau: npm run dev
```
Buka browser di:
- 🌐 **English (Default)**: [http://localhost:5173/](http://localhost:5173/)
- 🇮🇩 **Bahasa Indonesia**: [http://localhost:5173/id/](http://localhost:5173/id/)

### 2. Membangun Bundle Produksi
```bash
pnpm build
# atau: npm run build
```
Menghasilkan output teroptimasi & minified di folder `dist/` dalam waktu ~0.5 detik.

### 3. Menguji Hasil Build Produksi (Preview)
```bash
pnpm preview
# atau: npm run preview
```

### 4. Memformat Seluruh Kode Sumber dengan Prettier
```bash
pnpm format
# atau: npm run format
```

### 5. Menjalankan Menggunakan Server Bawaan (Tanpa Vite)
```bash
node server.js
# atau: npm start
```
