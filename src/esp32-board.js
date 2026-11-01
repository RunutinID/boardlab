import {
  R as Group,
  en as Mesh,
  gt as BoxGeometry,
  mn as PlaneGeometry,
  an as MeshStandardMaterial,
  bt as CanvasTexture,
  dr as SRGBColorSpace,
  jr as Vector3,
} from "./kit.js";

const WIDTH = 28.33;
const LENGTH = 51.45;
const PITCH = 2.54;
const FIRST_PIN_Z = 17.78;

export const ESP32_LEFT_PINS = [
  "VIN", "GND1", "GPIO13", "GPIO12", "GPIO14", "GPIO27", "GPIO26", "GPIO25",
  "GPIO33", "GPIO32", "GPIO35", "GPIO34", "GPIO39", "GPIO36", "EN",
];
export const ESP32_RIGHT_PINS = [
  "3V3", "GND2", "GPIO15", "GPIO2", "GPIO4", "GPIO16", "GPIO17", "GPIO5",
  "GPIO18", "GPIO19", "GPIO21", "GPIO3", "GPIO1", "GPIO22", "GPIO23",
];

export function esp32PinPosition(name) {
  let index = ESP32_LEFT_PINS.indexOf(name);
  if (index >= 0) return [-11.35, 8.7, FIRST_PIN_Z - index * PITCH];
  index = ESP32_RIGHT_PINS.indexOf(name);
  if (index >= 0) return [11.35, 8.7, FIRST_PIN_Z - index * PITCH];
  if (name === "GND") return esp32PinPosition("GND1");
  if (name === "SDA") return esp32PinPosition("GPIO21");
  if (name === "SCL") return esp32PinPosition("GPIO22");
  throw new Error(`Unknown ESP32 pin ${name}`);
}

function material(color, roughness = 0.55, metalness = 0) {
  return new MeshStandardMaterial({ color, roughness, metalness });
}

function box(group, size, at, mat, part) {
  const mesh = new Mesh(new BoxGeometry(...size), mat);
  mesh.position.set(...at);
  mesh.castShadow = true;
  if (part) mesh.userData.part = part;
  group.add(mesh);
  return mesh;
}

function label(group, text, width, height, at, options = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = Math.max(64, Math.round((512 * height) / width));
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = options.color ?? "#e8ece7";
  ctx.font = `${options.weight ?? 600} ${options.fontSize ?? 54}px Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  const mesh = new Mesh(
    new PlaneGeometry(width, height),
    new MeshStandardMaterial({ map: texture, transparent: true, roughness: 0.9, depthWrite: false }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.rotation.z = options.rotation ?? 0;
  mesh.position.set(...at);
  group.add(mesh);
  return mesh;
}

function led(group, at, color, name, description) {
  const mat = material(color, 0.28);
  mat.emissive.set(color);
  mat.emissiveIntensity = 0.35;
  mat.userData.baseEmissive = mat.emissive.clone();
  box(group, [1.5, 0.65, 0.85], at, mat, { name, desc: description });
  return mat;
}

export function buildESP32Board() {
  const root = new Group();
  const pcb = material("#173f35", 0.72);
  const edge = material("#0d2823", 0.8);
  const black = material("#15191c", 0.65);
  const plastic = material("#202326", 0.8);
  const silver = material("#b8c0c2", 0.28, 0.82);
  const gold = material("#c8a64a", 0.32, 0.72);
  const copper = material("#b67a35", 0.4, 0.55);
  const shield = material("#aeb8b9", 0.36, 0.78);

  box(root, [WIDTH, 1.6, LENGTH], [0, 0, 0], pcb, {
    name: "DOIT ESP32 DevKit V1",
    desc: "Papan 30 pin, 51.45 × 28.33 mm. Logika GPIO 3.3 V.",
    lift: false,
  });
  box(root, [WIDTH - 0.5, 0.15, LENGTH - 0.5], [0, -0.86, 0], edge);

  for (const x of [-11.35, 11.35]) {
    for (const z of [-22.6, 22.6]) {
      box(root, [3.1, 0.12, 3.1], [x, 0.87, z], gold);
      box(root, [1.9, 0.16, 1.9], [x, 0.95, z], black);
    }
  }

  const addHeader = (names, x) => {
    names.forEach((name, index) => {
      const z = FIRST_PIN_Z - index * PITCH;
      box(root, [2.15, 2.1, 2.15], [x, 1.8, z], plastic);
      box(root, [0.62, 7.8, 0.62], [x, 5.3, z], gold, {
        name: `${name} header`,
        desc: `Pin ${name}. GPIO ESP32 hanya menerima logika 3.3 V.`,
      });
      box(root, [1.25, 0.08, 1.25], [x, 0.86, z], copper);
    });
  };
  addHeader(ESP32_LEFT_PINS, -11.35);
  addHeader(ESP32_RIGHT_PINS, 11.35);

  const usb = new Group();
  usb.userData.part = { name: "Micro-USB", desc: "Daya 5 V dan data serial melalui CP2102." };
  box(usb, [8.2, 3.4, 5.8], [0, 2.2, 23.6], silver);
  box(usb, [6.1, 1.9, 0.35], [0, 2.15, 26.55], black);
  box(usb, [4.6, 0.35, 0.45], [0, 2.15, 26.75], silver);
  root.add(usb);

  const module = new Group();
  module.userData.part = {
    name: "ESP-WROOM-32",
    desc: "Modul dual-core hingga 240 MHz dengan Wi-Fi dan Bluetooth.",
  };
  box(module, [17.2, 1.4, 23.2], [0, 2, -9.8], black);
  box(module, [18, 2.3, 16.2], [0, 3.45, -6.5], shield);
  box(module, [17.7, 0.16, 0.35], [0, 4.65, -14.45], silver);
  root.add(module);
  label(root, "ESP-WROOM-32", 13.8, 2.1, [0, 4.64, -5.4], { color: "#263033", fontSize: 45 });
  label(root, "ESP32", 8, 2, [0, 4.64, -8.3], { color: "#263033", fontSize: 60 });

  const antenna = new Group();
  antenna.userData.part = { name: "Antena PCB 2.4 GHz", desc: "Antena Wi-Fi/Bluetooth. Jangan tutup area ini dengan logam." };
  for (let row = 0; row < 5; row++) {
    const z = -16.5 - row * 1.45;
    box(antenna, [13.8 - (row % 2) * 3, 0.12, 0.42], [0, 1.02, z], gold);
    box(antenna, [0.42, 0.12, 1.5], [row % 2 ? 4.6 : -4.6, 1.02, z - 0.65], gold);
  }
  root.add(antenna);

  const uart = new Group();
  uart.userData.part = { name: "CP2102 USB-UART", desc: "Menghubungkan micro-USB ke serial ESP32 untuk upload dan Serial Monitor." };
  box(uart, [5, 0.85, 5], [4.3, 1.35, 12.8], black);
  for (let i = -2; i <= 2; i++) {
    box(uart, [0.35, 0.18, 5.8], [4.3 + i * 0.85, 1.2, 12.8], silver);
  }
  root.add(uart);
  label(root, "CP2102", 5, 1, [4.3, 1.82, 12.8], { fontSize: 50 });

  const regulator = new Group();
  regulator.userData.part = { name: "Regulator 3.3 V", desc: "Mengubah daya 5 V USB/VIN menjadi suplai 3.3 V." };
  box(regulator, [4.6, 1.1, 3.4], [-4.8, 1.45, 14.4], black);
  box(regulator, [3.5, 0.18, 1.8], [-4.8, 1.2, 17], silver);
  root.add(regulator);

  for (const [x, z] of [[-5.5, 8], [-2.7, 10.2], [6.8, 7], [7, 17.2], [-6.8, 18.2], [2.2, 18.8]]) {
    box(root, [2.2, 0.8, 1.2], [x, 1.25, z], material("#b28a55", 0.65));
    box(root, [0.45, 0.86, 1.25], [x - 1.25, 1.25, z], silver);
    box(root, [0.45, 0.86, 1.25], [x + 1.25, 1.25, z], silver);
  }

  for (const [name, x] of [["EN", -6.8], ["BOOT", 6.8]]) {
    const button = new Group();
    button.userData.part = {
      name: `Tombol ${name}`,
      desc: name === "EN" ? "Reset dan menjalankan ulang ESP32." : "Tahan saat reset untuk mode upload firmware.",
    };
    box(button, [4.2, 1.1, 3.3], [x, 1.45, 21.3], silver);
    box(button, [2.5, 1.2, 2.1], [x, 2.45, 21.3], black);
    root.add(button);
    label(root, name, 3.8, 0.9, [x, 0.93, 18.7], { fontSize: 55 });
  }

  const leds = {
    L: led(root, [7.4, 1.35, 4], "#3d7be0", "LED GPIO2 (biru)", "LED pengguna yang dikendalikan GPIO2."),
    PWR: led(root, [-7.4, 1.35, 4], "#d64a3a", "LED daya", "Menyala saat papan mendapat daya."),
    TX: led(root, [7.4, 1.35, 6], "#e0ad3a", "LED TX", "Aktivitas pengiriman serial."),
    RX: led(root, [-7.4, 1.35, 6], "#e0ad3a", "LED RX", "Aktivitas penerimaan serial."),
  };
  leds.PWR.emissiveIntensity = 0.8;

  label(root, "DOIT", 8.5, 2.2, [0, 0.94, 7.3], { fontSize: 78, weight: 700 });
  label(root, "ESP32 DEVKITV1", 12.5, 1.25, [0, 0.94, 9.5], { fontSize: 49 });
  label(root, "30 PINS · 3.3V", 10.5, 1, [0, 0.94, 19], { fontSize: 46 });

  const anchors = {};
  const anchor = (name, position) => {
    const object = new Group();
    object.position.set(...position);
    root.add(object);
    anchors[name] = object;
  };
  anchor("usb", [0, 5.2, 24]);
  anchor("mcu", [0, 5.5, -6]);
  anchor("mcuWay", [0, 5.5, -12]);
  anchor("digital", [11.35, 9.4, -1]);
  anchor("jack", [-6.8, 4, 21.3]);
  anchor("power", [-11.35, 9.4, 16.5]);
  anchor("analog", [-11.35, 9.4, -8]);
  anchor("ledL", [7.4, 3, 4]);

  root.traverse((object) => {
    if (object.isMesh) object.receiveShadow = false;
  });
  return { root, anchors, leds };
}

export function esp32PinVector(name) {
  return new Vector3(...esp32PinPosition(name));
}
