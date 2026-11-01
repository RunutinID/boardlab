/**
 * Kurikulum & Spesifikasi Lengkap ESP32 DevKit V1
 * Untuk Platform Pembelajaran Interaktif 3D (Dual-Mode: Arduino Uno & ESP32)
 */

export const specsESP32 = [
  ["Mikrokontroler", "ESP-WROOM-32 (Tensilica Xtensa Dual-Core 32-bit LX6)"],
  ["Tegangan Kerja (VIO)", "3.3 V (Bukan 5V Tolerant!)"],
  ["Tegangan Input (USB/VIN)", "5 V melalui micro-USB atau pin VIN"],
  ["Pin Header / GPIO", "30 pin header; 25 GPIO diekspos (PWM, interrupt, I2C, SPI)"],
  ["Input Analog (ADC)", "15 Kanal (12-bit, nilai 0–4095, rentang 0–3.3V)"],
  ["Output Analog (DAC)", "2 Kanal DAC 8-bit sejati (GPIO 25 & 26)"],
  ["Konektivitas Nirkabel", "Wi-Fi 802.11 b/g/n & Bluetooth v4.2 BR/EDR/BLE"],
  ["Memori Flash / SRAM", "4 MB SPI Flash / 520 KB SRAM internal"],
  ["Kecepatan Clock", "Hingga 240 MHz"],
  ["Sensor Sentuh Kapasitif", "10 Pin (Touch0–Touch9, deteksi sentuhan jari)"],
  ["Ukuran Board", "51.45 × 28.33 mm"],
];

export const esp32Callouts = [
  {
    anchor: "usb",
    icon: "usb",
    tall: true,
    title: "Port USB (Power & Data)",
    body: "Daya 5V dan komunikasi serial UART<br />ke komputer melalui chip CP2102/CH340.",
    x: -498,
    y: -314,
    w: 285,
    side: "bottom",
    at: 131,
    leg: 30,
    ring: true,
  },
  {
    anchor: "mcu",
    via: "mcuWay",
    icon: "chip",
    title: "Modul ESP-WROOM-32",
    body: "Prosesor Dual-Core 32-bit 240 MHz<br />dengan Wi-Fi & Bluetooth BLE terintegrasi.",
    x: -112,
    y: -347,
    w: 278,
    side: "bottom",
    at: 84,
  },
  {
    anchor: "digital",
    icon: "pins",
    title: "Header GPIO Multifungsi",
    body: "Tegangan logika 3.3V (Maks 12 mA).<br />Mendukung PWM, I2C, SPI, dan interrupt.",
    x: 263,
    y: -301,
    w: 260,
    side: "left",
    at: 59,
    leg: 36,
    approach: "above",
  },
  {
    anchor: "jack",
    icon: "bolt",
    title: "Tombol EN & BOOT",
    body: "EN untuk restart mikroprosesor.<br />BOOT untuk masuk ke mode flashing serial.",
    x: -498,
    y: 125,
    w: 270,
    side: "top",
    at: 89,
    leg: 48,
    ring: true,
  },
  {
    anchor: "power",
    icon: "plug",
    title: "Pin Daya (3.3V, VIN, GND)",
    body: "Regulator LDO bawaan mengubah 5V USB<br />menjadi 3.3V stabil untuk seluruh rangkaian.",
    x: -198,
    y: 195,
    w: 260,
    side: "top",
    at: 75,
    leg: 32,
    ring: true,
  },
  {
    anchor: "analog",
    icon: "wave",
    wide: true,
    title: "Pin ADC 12-bit & DAC",
    body: "ADC1 (GPIO 32–39) membaca 0–4095.<br />DAC1 & DAC2 (GPIO 25 & 26) output analog.",
    x: 270,
    y: 183,
    w: 265,
    side: "left",
    at: 54,
    leg: 46,
    ring: true,
  },
];

export const esp32Overrides = {
  board: {
    heading: "DOIT ESP32 DevKit V1",
    lede: "DOIT ESP32 DevKit V1 adalah papan pengembangan 32-bit dual-core hingga 240 MHz dengan 30 pin header dan 25 GPIO yang diekspos, dilengkapi Wi-Fi serta Bluetooth. Cocok untuk belajar elektronika dan Internet of Things (IoT).",
    features: [
      ["chip", "Tensilica Dual-Core 32-bit @ 240 MHz"],
      ["bulb", "Konektivitas Nirkabel Wi-Fi & Bluetooth BLE"],
      ["gear", "Mendukung FreeRTOS, MicroPython, dan Arduino IDE"],
    ],
    pinout: [
      [
        "GPIO 0–39",
        "Digital I/O & PWM",
        "Logika 3.3V. Semua pin mendukung interupsi dan PWM.",
        "#2a56a3",
      ],
      [
        "ADC1 (GPIO 32–39)",
        "Input Analog 12-bit",
        "Resolusi tinggi 0–4095 (0–3.3V). Aman digunakan bersama Wi-Fi.",
        "#1aa3a1",
      ],
      [
        "DAC1 & DAC2",
        "Output Analog Sejati",
        "GPIO 25 & 26 menghasilkan tegangan analog 8-bit tanpa PWM.",
        "#d64a3a",
      ],
      [
        "Touch0–Touch9",
        "Sensor Sentuh Kapasitif",
        "10 pin sentuh bawaan tanpa komponen tombol mekanis.",
        "#f0a53a",
      ],
      [
        "3.3V · VIN · GND",
        "Daya & Ground",
        "3.3V teregulasi, VIN untuk daya 5V dari USB/eksternal.",
        "#2f3547",
      ],
      [
        "EN · BOOT",
        "Tombol Kontrol",
        "EN untuk restart mikroprosesor, BOOT untuk mode upload flashing.",
        "#8e9094",
      ],
    ],
    example: [
      "<code>setup()</code> berjalan sekali saat ESP32 menyala atau tombol EN ditekan.",
      "<code>pinMode(2, OUTPUT)</code> mengonfigurasi GPIO 2 — terhubung ke LED biru on-board — sebagai output.",
      "<code>loop()</code> berulang terus menerus. <code>digitalWrite(2, HIGH)</code> mengalirkan tegangan 3.3 V ke LED.",
      "Tekan <b>Jalankan</b> untuk mengunggah sketch via esptool.py virtual dan saksikan LED on-board menyala.",
    ],
    specs: specsESP32,
    callouts: esp32Callouts,
    code: `// Belajar ESP32 - 1. Kenali Papannya
#define LED_PIN 2 // LED biru built-in ESP32 DevKit

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  Serial.println("ESP32 DevKit V1 aktif!");
  Serial.println("CPU Clock: 240 MHz | Dual-Core Tensilica LX6");
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  Serial.println("LED Built-in (GPIO 2) ON [3.3V]");
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  Serial.println("LED Built-in (GPIO 2) OFF [0V]");
  delay(1000);
}`,
  },

  blink: {
    heading: "Kedipkan LED (ESP32)",
    lede: "Rangkaian LED eksternal di breadboard dikendalikan oleh GPIO 2. Karena ESP32 beroperasi pada tegangan 3.3 V, resistor 220 Ω memberikan arus ~5.9 mA yang sangat terang dan aman untuk batas pin 12 mA.",
    features: [
      ["pin", "Output digital 3.3V dengan <code>digitalWrite()</code>"],
      ["resistor", "Resistor 220 Ω membatasi arus di bawah batas aman 12 mA"],
      ["clock", "Klik LED untuk mengubah warna dan durasi kedipan"],
    ],
    pinout: [
      [
        "GPIO 2",
        "Resistor → LED (+)",
        "Pin ini beralih antara 3.3 V (HIGH) dan 0 V (LOW).",
        "#f0a53a",
      ],
      [
        "GND",
        "LED (−)",
        "Kaki pendek katoda mengembalikan arus ke Ground ESP32.",
        "#2f3547",
      ],
    ],
    example: [
      "<code>const int LED_PIN = 2;</code> mengarahkan kontrol ke pin GPIO 2 ESP32.",
      "Tegangan maju LED merah ≈ 2.0 V. Arus: (3.3 - 2.0) / 220 ≈ 5.9 mA.",
      "Batas arus rekomendasi tiap pin ESP32 adalah 12 mA, sehingga rangkaian ini sangat aman.",
      "Dua fungsi <code>delay()</code> menentukan irama kedipan LED.",
    ],
    code: `// Belajar ESP32 - 2. Kedipkan LED
const int LED_PIN = 2; // GPIO 2 (Bisa juga pin eksternal GPIO 4)

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH); // Output 3.3 V
  delay({{on}});
  digitalWrite(LED_PIN, LOW);  // Output 0 V
  delay({{off}});
}`,
  },

  button: {
    heading: "Tekan Tombol (ESP32)",
    lede: "Input digital membuat ESP32 dapat membaca kondisi tombol. Tombol menghubungkan GPIO 4 ke jalur 3.3 V saat ditekan, dan resistor pull-down 10 kΩ menjaga pin tetap 0 V saat dilepas.",
    features: [
      ["pin", "Input digital 3.3V dengan <code>digitalRead()</code>"],
      [
        "resistor",
        "Resistor pull-down 10 kΩ mencegah kondisi pin melayang (floating)",
      ],
      ["bulb", "LED menyala ketika tombol mendeteksi logika HIGH"],
    ],
    pinout: [
      [
        "GPIO 4",
        "Tombol & Resistor",
        "Dibaca oleh digitalRead(). Nilai HIGH saat ditekan.",
        "#3d6fc4",
      ],
      [
        "3.3V",
        "Sisi Tombol Lain",
        "PERINGATAN: Hubungkan ke 3.3V, BUKAN ke pin 5V!",
        "#d64a3a",
      ],
      [
        "GPIO 2",
        "Resistor → LED (+)",
        "LED output indikator tombol.",
        "#f0a53a",
      ],
      [
        "GND",
        "Pull-down & Katoda LED",
        "Jalur ground bersama (0 V).",
        "#2f3547",
      ],
    ],
    example: [
      "PERHATIAN: Pin GPIO ESP32 tidak toleran 5V! Selalu hubungkan sensor/tombol ke jalur 3.3V.",
      "<code>digitalRead(BUTTON_PIN)</code> menghasilkan 1 (HIGH) saat ditekan dan 0 (LOW) saat dilepas.",
      "Tips ESP32: Kamu juga bisa menggunakan internal pull-down bawaan hardware dengan <code>pinMode(4, INPUT_PULLDOWN)</code>.",
    ],
    code: `// Belajar ESP32 - 3. Tekan Tombol
const int BUTTON_PIN = 4; // GPIO 4 (Input tombol)
const int LED_PIN = 2;    // GPIO 2 (Output LED)

void setup() {
  pinMode(BUTTON_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int pressed = digitalRead(BUTTON_PIN);
  digitalWrite(LED_PIN, pressed);
}`,
  },

  knob: {
    heading: "Putar Kenop Potensiometer (ESP32)",
    lede: "Membaca tegangan analog dari potensiometer. ADC ESP32 memiliki resolusi 12-bit (0–4095) untuk rentang 0 hingga 3.3 V, 4 kali lebih presisi dibanding ADC 10-bit Arduino Uno (0–1023).",
    features: [
      ["wave", "Pembacaan ADC 12-bit presisi tinggi (rentang 0 – 4095)"],
      ["chip", "Pin ADC1 (GPIO 34) tidak terganggu saat Wi-Fi menyala"],
      ["bulb", "Mengontrol kecerahan LED melalui modulasi pulsa PWM"],
    ],
    pinout: [
      [
        "GPIO 34",
        "Wiper Potensiometer",
        "Input ADC1 Channel 6 (hanya input analog).",
        "#1aa3a1",
      ],
      [
        "3.3V",
        "Kaki 1 Potensiometer",
        "Tegangan referensi analog 3.3 V (JANGAN gunakan 5V).",
        "#d64a3a",
      ],
      ["GND", "Kaki 3 Potensiometer", "Ground referensi 0 V.", "#2f3547"],
      [
        "GPIO 2",
        "Resistor → LED (+)",
        "Output PWM untuk mengontrol kecerahan LED.",
        "#f0a53a",
      ],
    ],
    example: [
      "<code>analogRead(34)</code> menghasilkan rentang nilai 0 hingga 4095.",
      "Tegangan terukur = (nilai_adc / 4095.0) * 3.3 V.",
      "Gunakan fungsi <code>map(val, 0, 4095, 0, 255)</code> untuk mengubah nilai 12-bit ke rentang duty cycle PWM 8-bit.",
      "ESP32 membagi pin ADC menjadi ADC1 dan ADC2. Gunakan selalu ADC1 (GPIO 32–39) untuk proyek yang memakai Wi-Fi.",
    ],
    code: `// Belajar ESP32 - 4. Putar Kenop Potensiometer
const int POT_PIN = 34; // Pin ADC1 (GPIO 34)
const int LED_PIN = 2;  // GPIO 2

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int raw = analogRead(POT_PIN); // Pembacaan 12-bit (0 - 4095)
  int brightness = map(raw, 0, 4095, 0, 255);
  analogWrite(LED_PIN, brightness);

  float voltage = (raw * 3.3) / 4095.0;
  Serial.print("Raw: ");
  Serial.print(raw);
  Serial.print(" | Volt: ");
  Serial.print(voltage);
  Serial.println(" V");
  delay(50);
}`,
  },

  rgb: {
    heading: "Campur Warna LED RGB (ESP32)",
    lede: "Mengatur warna LED RGB dengan sinyal PWM. ESP32 memiliki kontrol PWM hardware fleksibel (LEDC) yang dapat menggerakkan warna Merah, Hijau, dan Biru dengan tingkat pencampuran warna yang halus.",
    features: [
      ["bulb", "LED RGB dengan 3 kanal warna independen"],
      ["wave", "PWM LEDC fleksibel dengan frekuensi tinggi"],
      ["sliders", "Sesuaikan nilai R, G, B untuk menciptakan jutaan warna"],
    ],
    pinout: [
      [
        "GPIO 16",
        "Resistor → Kaki Merah (R)",
        "Kanal PWM LEDC untuk warna merah.",
        "#d64a3a",
      ],
      [
        "GPIO 17",
        "Resistor → Kaki Hijau (G)",
        "Kanal PWM LEDC untuk warna hijau.",
        "#3fae6a",
      ],
      [
        "GPIO 18",
        "Resistor → Kaki Biru (B)",
        "Kanal PWM LEDC untuk warna biru.",
        "#3d6fc4",
      ],
      ["GND", "Katoda Bersama", "Jalur balik ground.", "#2f3547"],
    ],
    example: [
      "Di Arduino Core v3 untuk ESP32, <code>analogWrite(pin, val)</code> otomatis menggunakan periferal LEDC.",
      "Tiga resistor 220 Ω melindungi tiap chip warna di dalam LED RGB.",
      "Nilai 255 pada merah dan hijau menghasilkan warna kuning cerah.",
    ],
    code: `// Belajar ESP32 - 5. Campur Warna LED RGB
const int PIN_R = 16;
const int PIN_G = 17;
const int PIN_B = 18;

void setup() {
  pinMode(PIN_R, OUTPUT);
  pinMode(PIN_G, OUTPUT);
  pinMode(PIN_B, OUTPUT);
}

void setColor(int r, int g, int b) {
  analogWrite(PIN_R, r);
  analogWrite(PIN_G, g);
  analogWrite(PIN_B, b);
}

void loop() {
  setColor({{r}}, {{g}}, {{b}});
  delay(100);
}`,
  },

  light: {
    heading: "Deteksi Cahaya dengan LDR (ESP32)",
    lede: "Resistor peka cahaya (LDR) disusun sebagai pembagi tegangan bersama resistor 10 kΩ menuju pin ADC1 GPIO 35. Menghasilkan pembacaan intensitas cahaya 12-bit untuk otomatisasi lampu malam.",
    features: [
      ["sun", "Hambatan LDR mengecil saat terkena cahaya terang"],
      ["wave", "Pembacaan tegangan analog 12-bit (0–4095) di pin GPIO 35"],
      ["bulb", "Lampu LED otomatis menyala saat kondisi ruangan gelap"],
    ],
    pinout: [
      [
        "GPIO 35",
        "Tengah LDR & 10kΩ",
        "Pin ADC1 (Channel 7), membaca tegangan pembagi.",
        "#1aa3a1",
      ],
      ["3.3V", "Sisi LDR Lain", "Tegangan suplai pembagi tegangan.", "#d64a3a"],
      ["GND", "Sisi Resistor 10kΩ Lain", "Ground pembagi tegangan.", "#2f3547"],
      [
        "GPIO 2",
        "Resistor → LED (+)",
        "Lampu indikator malam hari.",
        "#f0a53a",
      ],
    ],
    example: [
      "Dalam gelap, hambatan LDR mencapai ratusan kΩ sehingga tegangan turun.",
      "Saat terang benderang, nilai ADC mencapai > 3000.",
      "Ambang batas <code>lightVal < 1800</code> menandakan kondisi ruangan sudah gelap.",
    ],
    code: `// Belajar ESP32 - 6. Deteksi Cahaya
const int LDR_PIN = 35; // ADC1 Input
const int LED_PIN = 2;  // Lampu malam

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int lightVal = analogRead(LDR_PIN); // 0 - 4095
  Serial.print("Tingkat Cahaya: ");
  Serial.println(lightVal);

  if (lightVal < 1800) {
    digitalWrite(LED_PIN, HIGH); // Ruangan gelap: nyalakan lampu
  } else {
    digitalWrite(LED_PIN, LOW);
  }
  delay(100);
}`,
  },

  sensor: {
    heading: "Sensor Ultrasonik HC-SR04 (ESP32)",
    lede: "Sensor HC-SR04 membutuhkan daya 5V untuk transmitter ultrasoniknya. Kunci keselamatan elektronika: pin Echo mengeluarkan pulsa 5V sehingga WAJIB diturunkan ke 3.3V menggunakan pembagi tegangan (1 kΩ dan 2 kΩ) sebelum masuk ke GPIO 18 ESP32.",
    features: [
      ["wave", "Mengukur jarak dengan pantulan gelombang ultrasonik 40 kHz"],
      [
        "shield",
        "Pembagi tegangan 1kΩ & 2kΩ melindungi pin ESP32 dari tegangan 5V",
      ],
      ["clock", "Fungsi pulseIn() mengukur waktu tempuh gema dalam mikrodetik"],
    ],
    pinout: [
      [
        "VIN (5V)",
        "VCC HC-SR04",
        "Daya 5 V diambil langsung dari port USB ESP32.",
        "#d64a3a",
      ],
      [
        "GPIO 5",
        "Trig HC-SR04",
        "Pulsa trigger 10 µs dari ESP32 (logika 3.3V aman).",
        "#3d6fc4",
      ],
      [
        "GPIO 18",
        "Echo (lewat 1k/2k)",
        "Sinyal echo 5V yang sudah diturunkan aman ke 3.3V.",
        "#f0a53a",
      ],
      ["GND", "GND Sensor & Rangkaian", "Jalur ground bersama.", "#2f3547"],
    ],
    example: [
      "RUMUS PEMBAGI TEGANGAN: V_out = 5V * (2kΩ / (1kΩ + 2kΩ)) = 3.33 V.",
      "Tanpa pembagi tegangan, pulsa 5V dari Echo dapat merusak pin GPIO ESP32 secara permanen.",
      "Kecepatan suara di udara = 0.0343 cm/µs. Jarak = (waktu_pantul * 0.0343) / 2.",
    ],
    code: `// Belajar ESP32 - 7. Sensor Jarak HC-SR04
const int TRIG_PIN = 5;  // Output trigger ke sensor
const int ECHO_PIN = 18; // Input echo (lewat voltage divider 1k/2k)

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void loop() {
  // Pancarkan pulsa 10 mikrodetik
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // Ukur durasi sinyal pantulan
  long duration = pulseIn(ECHO_PIN, HIGH);
  float distanceCm = (duration * 0.0343) / 2;

  Serial.print("Jarak terdeteksi: ");
  Serial.print(distanceCm);
  Serial.println(" cm");
  delay(150);
}`,
  },

  sound: {
    heading: "Buat Suara dengan Buzzer (ESP32)",
    lede: "Piezo buzzer bergetar saat menerima gelombang frekuensi audio dari GPIO 19. ESP32 Arduino Core mendukung fungsi tone() bawaan untuk menghasilkan frekuensi nada musik yang jernih.",
    features: [
      ["speaker", "Buzzer piezo menghasilkan getaran frekuensi audio"],
      ["wave", "Fungsi tone() menghasilkan sinyal kotak persegi presisi"],
      ["music", "Dapat memainkan melodi musik dengan frekuensi not standar"],
    ],
    pinout: [
      [
        "GPIO 19",
        "Buzzer (+)",
        "Pin output frekuensi audio dari ESP32.",
        "#f0a53a",
      ],
      ["GND", "Buzzer (−)", "Jalur ground kembali ke ESP32.", "#2f3547"],
    ],
    example: [
      "<code>tone(pin, freq, duration)</code> menghasilkan frekuensi dalam Hertz (Hz).",
      "Nada A4 berfrekuensi 440 Hz, sedangkan A5 berfrekuensi 880 Hz.",
      "ESP32 juga memiliki 2 kanal DAC sejati di GPIO 25 & 26 jika ingin memainkan file audio WAV murni.",
    ],
    code: `// Belajar ESP32 - 8. Buat Suara Buzzer
const int BUZZER_PIN = 19; // GPIO 19

void setup() {
  // ESP32 Arduino Core v3.x mendukung tone() bawaan
}

void loop() {
  tone(BUZZER_PIN, 440, 250); // Nada A4 (440 Hz)
  delay(300);
  tone(BUZZER_PIN, 880, 250); // Nada A5 (880 Hz)
  delay(600);
}`,
  },

  piano: {
    heading: "Mini Piano 8 Tuts (ESP32)",
    lede: "Delapan tuts tombol dan buzzer piezo membentuk alat musik mini. Tombol-tombol dihubungkan ke deretan GPIO ESP32 dengan resistor pull-down menuju jalur ground.",
    features: [
      ["music", "Tangga nada 8 not: C4 (262 Hz) sampai C5 (523 Hz)"],
      ["grid", "8 tombol independen terhubung ke deretan pin GPIO ESP32"],
      ["speaker", "Buzzer piezo memainkan nada selama tombol ditekan"],
    ],
    pinout: [
      [
        "GPIO 13, 14, 27...",
        "8 Tombol Musik",
        "Input digital untuk tuts nada DO sampai DO tinggi.",
        "#3d6fc4",
      ],
      ["GPIO 19", "Buzzer (+)", "Output suara melodi.", "#f0a53a"],
      ["3.3V", "Suplai Tombol", "Tegangan logika tombol 3.3 V.", "#d64a3a"],
      ["GND", "Ground Bersama", "Kembali ke ground sistem.", "#2f3547"],
    ],
    example: [
      "Setiap tombol memicu frekuensi nada yang sesuai.",
      "Tips Canggih ESP32: Kamu bisa mengganti tuts tombol mekanis dengan sensor sentuh kapasitif Touch0–Touch7!",
    ],
    code: `// Belajar ESP32 - 9. Mini Piano 8 Tuts
const int BUZZER_PIN = 19;
const int PINS[] = {13, 14, 27, 26, 25, 33, 32, 4};
const int NOTES[] = {262, 294, 330, 349, 392, 440, 494, 523};

void setup() {
  for (int i = 0; i < 8; i++) {
    pinMode(PINS[i], INPUT);
  }
}

void loop() {
  for (int i = 0; i < 8; i++) {
    if (digitalRead(PINS[i]) == HIGH) {
      tone(BUZZER_PIN, NOTES[i], 100);
      delay(50);
      return;
    }
  }
  noTone(BUZZER_PIN);
}`,
  },

  motor: {
    heading: "Kendalikan Motor DC (ESP32)",
    lede: "ESP32 tidak dapat menyuplai arus besar motor secara langsung (batas GPIO hanya 12 mA). Transistor daya TIP120 bertindak sebagai sakelar digital yang dikontrol oleh sinyal PWM dari GPIO 18.",
    features: [
      ["gear", "Motor DC ditenagai baterai atau sumber 5V eksternal"],
      ["zap", "Transistor TIP120 mengalirkan arus beban hingga 5 Ampere"],
      [
        "shield",
        "Dioda flyback 1N4007 membuang lonjakan tegangan balik induktif",
      ],
    ],
    pinout: [
      [
        "GPIO 18",
        "Resistor → Basis TIP120",
        "Sinyal PWM mengatur kecepatan putaran motor.",
        "#f0a53a",
      ],
      [
        "Kolektor TIP120",
        "Motor (−)",
        "Mengontrol aliran arus motor ke ground.",
        "#2f3547",
      ],
      [
        "VIN / 5V",
        "Motor (+) & Dioda",
        "Daya motor DC dari catu daya eksternal.",
        "#d64a3a",
      ],
      [
        "GND",
        "Emitter TIP120 & ESP32",
        "Wajib disatukan (Common Ground).",
        "#2f3547",
      ],
    ],
    example: [
      "Wajib menyatukan Ground ESP32 dengan Ground baterai motor (Common Ground).",
      "Dioda flyback dipasang paralel terbalik pada motor untuk mencegah lonjakan tegangan induksi saat motor berhenti.",
      "Kecepatan motor diatur melalui duty cycle PWM 0–255.",
    ],
    code: `// Belajar ESP32 - 10. Kendalikan Motor DC
const int MOTOR_PIN = 18; // Basis transistor TIP120

void setup() {
  pinMode(MOTOR_PIN, OUTPUT);
}

void loop() {
  // Akselerasi kecepatan motor
  for (int spd = 0; spd <= 255; spd += 5) {
    analogWrite(MOTOR_PIN, spd);
    delay(30);
  }
  delay(1000);
  // Perlambat motor
  for (int spd = 255; spd >= 0; spd -= 5) {
    analogWrite(MOTOR_PIN, spd);
    delay(30);
  }
  delay(1000);
}`,
  },

  heat: {
    heading: "Deteksi Suhu dengan TMP36 (ESP32)",
    lede: "Sensor suhu TMP36 menghasilkan tegangan linier 10 mV per °C dengan offset 500 mV pada 0°C. Karena ESP32 menggunakan tegangan referensi 3.3 V dan ADC 12-bit (4096 langkah), rumus konversinya disesuaikan secara akurat.",
    features: [
      ["thermometer", "Sensor suhu analog presisi dari -40°C hingga +125°C"],
      ["wave", "Dibaca oleh pin ADC1 VP (GPIO 36) ESP32"],
      ["calculator", "Konversi tegangan 3.3V 12-bit ke derajat Celsius"],
    ],
    pinout: [
      ["3.3V", "Pin 1 TMP36 (VCC)", "Tegangan daya sensor 3.3 V.", "#d64a3a"],
      [
        "GPIO 36 (VP)",
        "Pin 2 TMP36 (Vout)",
        "Input analog ADC1 Channel 0.",
        "#1aa3a1",
      ],
      ["GND", "Pin 3 TMP36 (GND)", "Ground sensor.", "#2f3547"],
    ],
    example: [
      "Rumus Tegangan ESP32: voltage = (raw * 3.3) / 4095.0.",
      "Rumus Suhu TMP36: Suhu(°C) = (voltage - 0.5) * 100.0.",
      "Pada suhu 25°C, tegangan keluaran sensor adalah 0.75 V, terbaca sekitar ~930 pada ADC ESP32.",
    ],
    code: `// Belajar ESP32 - 11. Deteksi Suhu TMP36
const int TEMP_PIN = 36; // ADC1 VP (GPIO 36)

void setup() {
  Serial.begin(115200);
}

void loop() {
  int raw = analogRead(TEMP_PIN);
  float voltage = (raw * 3.3) / 4095.0;
  float tempC = (voltage - 0.5) * 100.0;

  Serial.print("Tegangan: ");
  Serial.print(voltage, 3);
  Serial.print(" V | Suhu: ");
  Serial.print(tempC, 1);
  Serial.println(" °C");
  delay(1000);
}`,
  },

  servo: {
    heading: "Gerakkan Motor Servo SG90 (ESP32)",
    lede: "Motor servo SG90 mengarahkan tuasnya dari 0° sampai 180° menggunakan pulsa durasi 1–2 milidetik. Pada ESP32, kita menggunakan library ESP32Servo karena library Servo bawaan Arduino mengandalkan timer hardware AVR.",
    features: [
      ["compass", "Sudut poros servo presisi dari 0° hingga 180°"],
      ["chip", "Menggunakan library ESP32Servo dengan timer PWM fleksibel"],
      ["zap", "Daya servo diambil dari pin VIN (5V USB) agar torsi maksimal"],
    ],
    pinout: [
      [
        "VIN (5V)",
        "Kabel Merah Servo (VCC)",
        "Daya motor servo 5 V dari USB.",
        "#d64a3a",
      ],
      [
        "GPIO 13",
        "Kabel Oranye Servo (PWM)",
        "Sinyal pulsa kendali sudut 3.3 V dari ESP32.",
        "#f0a53a",
      ],
      ["GND", "Kabel Cokelat Servo (GND)", "Ground servo bersama.", "#2f3547"],
    ],
    example: [
      "Sinyal kendali 3.3V dari GPIO 13 dapat mengontrol logic servo SG90 secara sempurna.",
      "Daya servo harus dihubungkan ke VIN (5V), bukan ke pin 3.3V, untuk mencegah penurunan tegangan pada ESP32 saat servo menarik beban.",
      "Gunakan method <code>myservo.write(sudut)</code> untuk memposisikan tuas servo.",
    ],
    code: `// Belajar ESP32 - 12. Gerakkan Servo SG90
#include <ESP32Servo.h>

Servo myServo;
const int SERVO_PIN = 13; // GPIO 13

void setup() {
  ESP32PWM::allocateTimer(0);
  myServo.setPeriodHertz(50); // Standar SG90: 50 Hz
  myServo.attach(SERVO_PIN, 500, 2400); // 500-2400 µs
}

void loop() {
  // Gerakkan dari 0 ke 180 derajat
  for (int pos = 0; pos <= 180; pos += 15) {
    myServo.write(pos);
    delay(40);
  }
  delay(500);
  // Kembali ke 0 derajat
  for (int pos = 180; pos >= 0; pos -= 15) {
    myServo.write(pos);
    delay(40);
  }
  delay(500);
}`,
  },

  stepper: {
    heading: "Motor Stepper 28BYJ-48 (ESP32)",
    lede: "Motor stepper berputar dalam langkah-langkah sudut yang sangat presisi tanpa slip. Driver ULN2003 memperkuat sinyal kendali dari 4 pin GPIO ESP32 (GPIO 19, 18, 5, 17) untuk menggerakkan lilitan fase motor.",
    features: [
      ["gear", "Motor stepper 4-fase unipolar berakurasi tinggi"],
      ["chip", "Driver Darlington ULN2003 mengalirkan arus ke lilitan"],
      ["clock", "Siklus langkah presisi untuk rotasi kontinu atau terukur"],
    ],
    pinout: [
      [
        "GPIO 19, 18, 5, 17",
        "IN1, IN2, IN3, IN4",
        "4 jalur logika sekuens langkah dari ESP32.",
        "#3d6fc4",
      ],
      [
        "VIN (5V)",
        "VCC Driver ULN2003",
        "Daya motor stepper dari jalur 5V.",
        "#d64a3a",
      ],
      ["GND", "GND Driver & ESP32", "Ground bersama sistem.", "#2f3547"],
    ],
    example: [
      "Motor 28BYJ-48 memiliki rasio roda gigi reduksi ~64:1 (2048 langkah per putaran penuh).",
      "Driver ULN2003 ditenagai 5V, tetapi input logikanya menerima 3.3V GPIO ESP32 dengan lancar.",
    ],
    code: `// Belajar ESP32 - 13. Motor Stepper 28BYJ-48
#include <Stepper.h>

const int STEPS_PER_REV = 2048; // Langkah per putaran
// Urutan pin ESP32 ke IN1, IN3, IN2, IN4
Stepper myStepper(STEPS_PER_REV, 19, 5, 18, 17);

void setup() {
  myStepper.setSpeed(10); // Kecepatan 10 RPM
}

void loop() {
  // Putar 1 putaran searah jarum jam
  myStepper.step(STEPS_PER_REV);
  delay(1000);
  // Putar 1 putaran berlawanan jarum jam
  myStepper.step(-STEPS_PER_REV);
  delay(1000);
}`,
  },

  plant: {
    heading: "Tanaman Pintar & Layar OLED (ESP32)",
    lede: "Proyek pemantau tanaman menggabungkan sensor kelembapan tanah kapasitif dan layar OLED SSD1306 0.96 inci. Layar dihubungkan via protokol I2C menggunakan pin default ESP32: GPIO 21 (SDA) dan GPIO 22 (SCL).",
    features: [
      ["screen", "Layar grafis OLED SSD1306 128x64 dengan I2C"],
      ["droplet", "Sensor tanah kapasitif tahan korosi dibaca via ADC1"],
      ["wifi", "Siap diintegrasikan dengan dashboard IoT Blynk / MQTT"],
    ],
    pinout: [
      ["GPIO 21", "OLED SDA", "Jalur data I2C standar ESP32.", "#3d6fc4"],
      ["GPIO 22", "OLED SCL", "Jalur clock I2C standar ESP32.", "#1aa3a1"],
      [
        "GPIO 32",
        "Analog Sensor Tanah",
        "Input ADC1 membaca tingkat kelembapan.",
        "#f0a53a",
      ],
      [
        "3.3V & GND",
        "VCC & Ground Sensor/OLED",
        "Daya 3.3 V yang stabil.",
        "#d64a3a",
      ],
    ],
    example: [
      "Pada ESP32, pin I2C default adalah SDA di GPIO 21 dan SCL di GPIO 22 (berbeda dari A4/A5 Arduino Uno).",
      "Layar OLED ditenagai langsung dari pin 3.3V ESP32.",
      "Hasil pembacaan analog 12-bit dikonversi menjadi persentase kelembapan 0–100%.",
    ],
    code: `// Belajar ESP32 - 14. Tanaman Pintar (I2C OLED & Soil Sensor)
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

Adafruit_SSD1306 display(128, 64, &Wire, -1);
const int SOIL_PIN = 32; // ADC1 GPIO 32

void setup() {
  Serial.begin(115200);
  // Inisialisasi I2C ESP32 (SDA=21, SCL=22)
  Wire.begin(21, 22);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  display.setTextColor(WHITE);
}

void loop() {
  int raw = analogRead(SOIL_PIN);
  int percent = map(raw, 3500, 1500, 0, 100);
  percent = constrain(percent, 0, 100);

  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 4);
  display.println("MONITOR TANAMAN IOT");
  display.setTextSize(2);
  display.setCursor(0, 28);
  display.print(percent);
  display.println(" %");
  display.display();

  delay(1000);
}`,
  },

  force: {
    heading: "Rasakan Gaya dengan Sensor Tekan FSR (ESP32)",
    lede: "Sensor gaya (Force Sensing Resistor) mengubah kekuatan tekanan jari menjadi perubahan resistansi. Disusun sebagai pembagi tegangan bersama resistor 10 kΩ menuju pin ADC1 GPIO 33 ESP32.",
    features: [
      ["hand", "Hambatan sensor turun drastis saat ditekan semakin kuat"],
      ["wave", "Pembacaan analog 12-bit (0–4095) di pin GPIO 33"],
      ["sliders", "Visualisasi intensitas tekanan secara real-time"],
    ],
    pinout: [
      [
        "GPIO 33",
        "Titik Tengah FSR & 10kΩ",
        "Pin ADC1 (Channel 5) membaca tekanan.",
        "#1aa3a1",
      ],
      [
        "3.3V",
        "Kaki 1 FSR",
        "Suplai tegangan 3.3 V (bebas lonjakan).",
        "#d64a3a",
      ],
      ["GND", "Kaki Resistor 10kΩ", "Ground rangkaian.", "#2f3547"],
      [
        "GPIO 2",
        "Resistor → LED Indikator",
        "Kecerahan LED mengikuti kekuatan tekanan.",
        "#f0a53a",
      ],
    ],
    example: [
      "Tanpa tekanan, hambatan FSR > 1 MΩ (tegangan mendekati 0 V).",
      "Saat ditekan kuat, hambatan turun hingga < 1 kΩ (tegangan mendekati 3.3 V).",
      "Resolusi 12-bit ESP32 mampu mendeteksi sentuhan sangat halus sekalipun.",
    ],
    code: `// Belajar ESP32 - 15. Sensor Gaya FSR
const int FSR_PIN = 33; // ADC1 GPIO 33
const int LED_PIN = 2;  // Indikator PWM

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int forceVal = analogRead(FSR_PIN); // 0 - 4095
  int pwmVal = map(forceVal, 0, 4095, 0, 255);
  analogWrite(LED_PIN, pwmVal);

  Serial.print("Gaya Tekan (12-bit): ");
  Serial.println(forceVal);
  delay(50);
}`,
  },

  project: {
    heading: "Sistem Radar & Lampu Cerdas (ESP32)",
    lede: "Menggabungkan sensor ultrasonik HC-SR04 dengan lampu indikator tiga warna (Hijau, Kuning, Merah) dan buzzer peringatan pada pinout ESP32.",
    features: [
      ["cpu", "Mengintegrasikan sensor jarak, 3 LED warna, dan buzzer"],
      ["shield", "Perlindungan tegangan pembagi sinyal Echo HC-SR04"],
      ["bell", "Peringatan bertingkat sesuai kedekatan objek rintangan"],
    ],
    pinout: [
      [
        "GPIO 5 & 18",
        "Trig & Echo HC-SR04",
        "Sensor jarak ultrasonik (Echo via 1k/2k divider).",
        "#3d6fc4",
      ],
      [
        "GPIO 23, 22, 21",
        "LED Hijau, Kuning, Merah",
        "Tiga lampu aba-aba jarak.",
        "#3fae6a",
      ],
      [
        "GPIO 19",
        "Piezo Buzzer",
        "Alarm audio saat objek mendekat berbahaya.",
        "#d64a3a",
      ],
      [
        "GND & VIN",
        "Daya Sistem",
        "Common ground dan 5V untuk HC-SR04.",
        "#2f3547",
      ],
    ],
    example: [
      "Jarak > 30 cm: Lampu hijau menyala, situasi aman.",
      "Jarak 15–30 cm: Lampu kuning menyala, peringatan mendekat.",
      "Jarak < 15 cm: Lampu merah berkedip dan buzzer berbunyi cepat.",
    ],
    code: `// Belajar ESP32 - 16. Radar & Lampu Peringatan
const int TRIG = 5;
const int ECHO = 18;
const int LED_G = 23;
const int LED_Y = 22;
const int LED_R = 21;
const int BUZZER = 19;

void setup() {
  Serial.begin(115200);
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  pinMode(LED_G, OUTPUT);
  pinMode(LED_Y, OUTPUT);
  pinMode(LED_R, OUTPUT);
}

void loop() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);

  long d = (pulseIn(ECHO, HIGH) * 0.0343) / 2;

  digitalWrite(LED_G, d > 30);
  digitalWrite(LED_Y, d <= 30 && d > 15);
  digitalWrite(LED_R, d <= 15);

  if (d <= 15) {
    tone(BUZZER, 1000, 80);
  } else {
    noTone(BUZZER);
  }
  delay(100);
}`,
  },
};

/**
 * Pelajaran Tambahan Eksklusif ESP32 (Touch Sensor & IoT Web Server)
 */
export const esp32ExtraLessons = [
  {
    id: "touch",
    title: "Sensor Sentuh",
    cardTitle: "17. Sensor<br />sentuh",
    thumb: "button",
    heading: "Sensor Sentuh Kapasitif (ESP32)",
    lede: "ESP32 memiliki 10 pin capacitive touch internal! Kamu bisa mendeteksi sentuhan jari manusia pada seutas kabel telanjang atau plat logam tanpa membutuhkan tombol mekanis eksternal.",
    features: [
      ["hand", "Mendeteksi kapasitansi tubuh manusia dengan touchRead()"],
      ["zap", "Tanpa komponen tombol tambahan — cukup seutas kabel"],
      ["bulb", "LED biru menyala saat kawat/bidang logam disentuh"],
    ],
    pinout: [
      [
        "GPIO 4 (Touch0)",
        "Kawat Sentuh",
        "Pin capacitive touch membaca penurunan muatan.",
        "#3d6fc4",
      ],
      [
        "GPIO 2",
        "Resistor → LED Indikator",
        "Menyala otomatis saat sensor disentuh.",
        "#f0a53a",
      ],
      ["GND", "Ground Sistem", "Jalur balik sirkuit.", "#2f3547"],
    ],
    example: [
      "<code>touchRead(4)</code> membaca nilai kapasitansi pin GPIO 4 (Touch0).",
      "Dalam kondisi bebas, nilai pembacaan berkisar antara 70–90.",
      "Saat jari menyentuh kabel, kapasitansi tubuh menyerap muatan dan nilai anjlok ke < 25.",
    ],
    specs: specsESP32,
    callouts: esp32Callouts,
    code: `// Belajar ESP32 - 17. Sensor Sentuh Kapasitif Bawaan
const int TOUCH_PIN = 4; // GPIO 4 (Touch0)
const int LED_PIN = 2;   // LED built-in
const int THRESHOLD = 30; // Ambang batas sentuhan

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int touchVal = touchRead(TOUCH_PIN);
  Serial.print("Nilai Kapasitansi: ");
  Serial.println(touchVal);

  if (touchVal < THRESHOLD) {
    digitalWrite(LED_PIN, HIGH); // Disentuh!
  } else {
    digitalWrite(LED_PIN, LOW);
  }
  delay(100);
}`,
    sim: "touch",
  },
  {
    id: "wifi",
    title: "IoT Web Server",
    cardTitle: "18. IoT Web<br />server",
    thumb: "board",
    heading: "IoT Web Server Lokal (ESP32)",
    lede: "Kekuatan sejati ESP32 adalah konektivitas nirkabelnya. Pada modul ini, ESP32 memancarkan jaringan Wi-Fi Access Point sendiri dan menjalankan HTTP Web Server untuk menyalakan/mematikan lampu dari browser HP atau komputer.",
    features: [
      ["wifi", "Membuat Wi-Fi Access Point mandiri (SSID: ESP32-SmartDevice)"],
      ["globe", "HTTP Web Server port 80 melayani halaman HTML interaktif"],
      ["toggle-right", "Tombol kontrol web secara nirkabel mengendalikan GPIO"],
    ],
    pinout: [
      [
        "Wi-Fi Antena",
        "Radio 2.4 GHz",
        "Memancarkan sinyal Wi-Fi Access Point.",
        "#2a56a3",
      ],
      [
        "GPIO 2",
        "LED Output",
        "Lampu yang dikontrol secara nirkabel lewat web.",
        "#f0a53a",
      ],
      [
        "5V (USB)",
        "Daya ESP32",
        "Daya stabil untuk modul radio Wi-Fi.",
        "#d64a3a",
      ],
    ],
    example: [
      "<code>WiFi.softAP(ssid, password)</code> membuat Wi-Fi mandiri tanpa perlu router internet.",
      "ESP32 akan memiliki alamat IP default <code>192.168.4.1</code>.",
      "Buka browser di HP yang terhubung ke Wi-Fi ESP32, lalu klik tombol untuk mengontrol LED secara instan!",
    ],
    specs: specsESP32,
    callouts: esp32Callouts,
    code: `// Belajar ESP32 - 18. IoT Web Server Lokal
#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "ESP32-SmartDevice";
const char* password = "password123";
WebServer server(80);

const int LED_PIN = 2;
bool ledState = false;

void handleRoot() {
  String html = "<html><head><meta name='viewport' content='width=device-width, initial-scale=1'>";
  html += "<style>body{font-family:sans-serif;text-align:center;padding:50px;background:#1e2430;color:#fff;}";
  html += ".btn{padding:16px 36px;font-size:22px;border-radius:12px;border:none;cursor:pointer;";
  html += ledState ? "background:#e8392e;color:#fff;'>MATIKAN LED" : "background:#3fae6a;color:#fff;'>NYALAKAN LED";
  html += "}</style></head><body>";
  html += "<h1>ESP32 IoT Controller</h1>";
  html += "<p>Status Lampu: <b>" + String(ledState ? "MENYALA" : "PADAM") + "</b></p>";
  html += "<a href='/toggle'><button class='btn'></button></a>";
  html += "</body></html>";
  server.send(200, "text/html", html);
}

void handleToggle() {
  ledState = !ledState;
  digitalWrite(LED_PIN, ledState ? HIGH : LOW);
  server.sendHeader("Location", "/");
  server.send(303);
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);

  // Buat WiFi Access Point sendiri
  WiFi.softAP(ssid, password);
  Serial.println("Wi-Fi AP Aktif: ESP32-SmartDevice");
  Serial.print("Kunjungi di browser: http://");
  Serial.println(WiFi.softAPIP());

  server.on("/", handleRoot);
  server.on("/toggle", handleToggle);
  server.begin();
}

void loop() {
  server.handleClient();
}`,
    sim: "wifi",
    params: [
      {
        key: "webLed",
        part: "board",
        label: "Tombol web: LED GPIO2",
        type: "toggle",
        value: false,
      },
    ],
  },
];

/**
 * Mengambil data pelajaran sesuai board yang sedang aktif ('uno' atau 'esp32')
 */
export function getLessonData(lesson, activeBoard = "uno") {
  if (!lesson) return lesson;
  if (activeBoard === "esp32") {
    const override = esp32Overrides[lesson.id];
    if (override) {
      const merged = { ...lesson, ...override };
      if (lesson.id === "light") {
        merged.params = lesson.params.map((param) =>
          param.key === "threshold"
            ? { ...param, min: 200, max: 4000, step: 40, value: 1600 }
            : param,
        );
        merged.code = merged.code.replace("lightVal < 1800", "lightVal < {{threshold}}");
      }
      if (lesson.id === "heat") {
        merged.params = lesson.params.filter((param) => !["fan", "threshold"].includes(param.key));
      }
      if (lesson.id === "force") {
        merged.params = lesson.params.filter((param) => ["ohms", "weight"].includes(param.key));
      }
      return merged;
    }
  }
  return lesson;
}
