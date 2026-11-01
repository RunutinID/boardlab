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
2. **Dua Halaman Terpisah: Arduino Uno & DOIT ESP32 DevKit V1**:
   - **Halaman Arduino Uno (`index.html` / `/`)**: Menampilkan model 3D interaktif papan Arduino Uno (ATmega328P, logika 5V, ADC 10-bit), 16 pelajaran dasar elektronika, pinout, dan simulasi sketch Arduino.
   - **Halaman ESP32 DOIT (`esp32.html` / `/esp32`)**: Menampilkan model 3D akurat **DOIT ESP32 DevKit V1 (30 Pin)** lengkap dengan modul logam ESP-WROOM-32, antena emas 2.4 GHz, chip CP2102, regulator AMS1117 3.3V, kapasitor tantalum, tombol tactile EN & BOOT, LED PWR merah, LED D2 biru, 4 lubang baut mounting, dan silkscreen pinout resmi DOIT (EN, VP, VN, D34-D13, VIN / D23-D15, 3V3).
   - Dilengkapi navigasi segmented switcher di header kedua halaman untuk berpindah antara Arduino Uno dan ESP32 DOIT secara instan.
3. **Modular Codebase (`src/`)**:
   - `src/main.js`: Bootstrapper utama aplikasi & penghubung antarmuka i18n.
   - `src/app.js`: State manager, controller pelajaran interaktif, simulasi logika pin microchip (`pinMode`, `digitalWrite`, `analogRead`), dan Serial Monitor virtual.
   - `src/esp32-curriculum.js`: Spesifikasi teknis ESP-WROOM-32, callouts, data pinout, override 16 modul, dan 2 modul baru (Touch & IoT Web Server).
   - `src/stage.js`: Panggung 3D Three.js, sistem kamera interaktif (pan/rotate/zoom), tata cahaya, emulasi flashing esptool.py, dan animasi aliran arus listrik (*current flow*).
   - `src/kit.js`: Pembangkit geometri prosedural komponen elektronik 3D (Arduino Uno R3, ATmega328P, breadboard, LED, resistor, servo SG90, sensor HC-SR04, motor stepper, OLED, buzzer, dsb.).
   - `src/thumbs.js`: Generator thumbnail kartu pelajaran.
   - `src/style.css`: Lembar gaya CSS utama dengan sistem desain Runutin & Board Switcher responsive.
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
├── index.html                  # Halaman 1: Belajar Arduino Uno
├── esp32.html                  # Halaman 2: Belajar DOIT ESP32 DevKit V1
├── package.json                # Dependencies, metadata & build scripts
├── pnpm-lock.yaml              # Lockfile dependensi
├── vite.config.js              # Konfigurasi Vite MPA & SPA Language Middleware
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
    ├── main.js                 # Entry point bersama untuk kedua halaman
    ├── app.js                  # Controller UI, logic & Arduino simulator
    ├── esp32-board.js          # Model prosedural DOIT ESP32 DevKit V1
    ├── esp32-curriculum.js     # Kurikulum & spesifikasi DOIT ESP32 DevKit V1
    ├── esp32-stage.js          # Pemetaan pin, komponen & skematik ESP32
    ├── stage.js                # Three.js 3D canvas stage & camera
    ├── kit.js                  # Procedural 3D electronics (Arduino Uno & komponen)
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
