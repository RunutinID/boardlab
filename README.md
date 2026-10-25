# Learn Arduino — Interactive 3D Lessons (Clone & Reverse-Engineered)

A complete offline-ready clone and reverse-engineered reconstruction of [Learn Arduino (learn-arduino-red.vercel.app)](https://learn-arduino-red.vercel.app/), originally created by Dilum Sanjaya.

---

## 🚀 Cara Menjalankan Aplikasi (How to Run)

Karena aplikasi ini menggunakan **ES Modules** (`<script type="module">`) dan WebGL (Three.js), browser memblokir pembukaan langsung via `file:///` karena kebijakan CORS. Anda **wajib menjalankannya melalui local web server**.

Ada beberapa cara mudah untuk menjalankannya:

### Cara 1: Menggunakan Node.js Built-in Server (Paling Direkomendasikan)
Sudah disediakan file `server.js` bawaan tanpa perlu install library tambahan:

```bash
# Jalankan langsung dengan node
node server.js

# Atau via npm
npm start
```
Buka browser di:
- **English**: [http://localhost:5173/](http://localhost:5173/)
- **Bahasa Indonesia**: [http://localhost:5173/id/](http://localhost:5173/id/)

*(Jika port 5173 sedang terpakai, script akan otomatis berpindah ke port berikutnya seperti 5174)*

---

### Cara 2: Menggunakan Python
Jika Anda memiliki Python:

```bash
# Python 3
python -m http.server 5173
```
Buka [http://localhost:5173/](http://localhost:5173/)

---

### Cara 3: Menggunakan VS Code "Live Server"
1. Buka folder ini di **Visual Studio Code**.
2. Klik kanan pada `index.html`.
3. Pilih **"Open with Live Server"**.

---

### Cara 4: Menggunakan `npx serve`
```bash
npx serve -l 5173 .
```

---

## 🛠️ Ringkasan Arsitektur & Reverse Engineering (REA Analysis)

### 1. Tech Stack
- **Framework & Bundler**: Vite + Vanilla Modern JavaScript (ES Modules).
- **3D Graphics Engine**: **Three.js** (WebGLRenderer, OrbitControls / custom Pan & Rotate camera rig, custom Shader / Standard materials).
- **Procedural 3D Geometry**: Seluruh komponen Arduino (Board Uno R3, ATmega328P DIP-28, pin headers, breadboard, LED 5mm, resistor, push button, potentiometer, HC-SR04 ultrasonic sensor, servo motor SG90, stepper motor 28BYJ-48, OLED 0.96", piezo buzzer, LDR, TMP36 sensor suhu, traffic light module) dibangun **100% secara prosedural** menggunakan kode Three.js (tanpa file eksternal `.glb` / `.gltf` yang berat!).
- **Circuit & Current Flow Simulation**: Animasi aliran elektron/arus dinamis (`<div class="signals">` & SVG bezier overlays) yang terhubung ke pin Arduino dan komponen breadboard.
- **Microcontroller Simulation**: Virtual Arduino C++ sketch runner dengan parser internal yang mengeksekusi instruksi seperti `pinMode()`, `digitalWrite()`, `analogRead()`, `tone()`, dan mencetak output ke Serial Monitor interaktif.
- **Multi-language (i18n)**: 13 Bahasa lengkap (English, Bahasa Indonesia, Español, Deutsch, Français, Italiano, Português, Türkçe, 日本語, 한국어, 简体中文, हिन्दी, עברית).

---

## 📁 Struktur Direktori

```
D:\Projects\Arduino Learn\
├── index.html               # Halaman utama (English / default)
├── server.js                # Local HTTP static server (Zero dependency)
├── package.json             # Manifest script (npm start)
├── README.md                # Dokumentasi proyek & panduan
├── site.webmanifest         # PWA Manifest
├── favicon.svg & icons      # Brand favicon & PWA app icons
├── assets/                  # Core JS bundles, CSS, & Web Fonts
│   ├── index-GGrOCNGj.js    # Entry module loader & i18n resolver
│   ├── main-Bvl_zo-E.js     # UI state manager & interaction loop
│   ├── stage-QLKhHYHN.js    # Three.js 3D canvas stage & camera
│   ├── kit-DXbMhk_I.js      # Procedural 3D Arduino components & electronics
│   ├── thumbs-DPauGRHu.js   # Lesson card preview thumbnails
│   ├── index-CqDNWwLj.css   # Main CSS styling
│   ├── *.woff2              # Web fonts (Barlow, JetBrains Mono, Noto Sans)
│   └── *-*.js               # Locale translation bundles (12 bahasa)
└── [de, es, fr, id, ...]    # Sub-folder statis tiap bahasa
```
