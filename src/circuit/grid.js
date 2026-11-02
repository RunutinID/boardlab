/**
 * Grid & Coordinate Mapping Engine for Breadboards and Microcontrollers
 * Pitch: 2.54mm (0.1 inch standard DIP spacing)
 */

export class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = Number(x);
    this.y = Number(y);
    this.z = Number(z);
  }

  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  copy(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  distanceTo(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  toArray() {
    return [this.x, this.y, this.z];
  }
}

export const BREADBOARD_PITCH = 2.54;
export const BREADBOARD_ORIGIN = new Vector3(64, -4, -50);

export const BREADBOARD_ROWS = {
  a: 13.97,
  b: 11.43,
  c: 8.89,
  d: 6.35,
  e: 3.81,
  f: -3.81,
  g: -6.35,
  h: -8.89,
  i: -11.43,
  j: -13.97,
};

export const BREADBOARD_COLS = 23; // standard half-size column width in 3D scene
export const BREADBOARD_HEIGHT = 8.5;

/**
 * Maps a breadboard column index (e.g. 1-30) and row letter ('a'-'j') to world coordinates
 * @param {number} col - Column index (1-30)
 * @param {string} row - Row letter ('a' through 'j')
 * @param {number} [totalCols=23] - Total columns on board (default 23 or 30)
 * @returns {Vector3} World coordinate Vector3
 */
export function breadboardCoord(col, row, totalCols = BREADBOARD_COLS) {
  const rowZ = BREADBOARD_ROWS[row.toLowerCase()];
  if (rowZ === undefined) {
    throw new Error(`Invalid breadboard row: "${row}". Expected 'a' through 'j'.`);
  }
  const relX = (col - (totalCols + 1) / 2) * BREADBOARD_PITCH;
  const relY = BREADBOARD_HEIGHT;
  const relZ = rowZ;

  return new Vector3(
    relX + BREADBOARD_ORIGIN.x,
    relY + BREADBOARD_ORIGIN.y,
    relZ + BREADBOARD_ORIGIN.z
  );
}

// Arduino Uno Pin Definitions
const UNO_BOARD_WIDTH = 68.58;
const UNO_BOARD_HEIGHT = 53.34;

const UNO_DIGITAL_HEADER_X = {
  SCL: 18.8,
  SDA: 21.34,
  AREF: 23.88,
  GND: 26.42,
  D13: 28.96,
  D12: 31.5,
  D11: 34.04,
  D10: 36.58,
  D9: 39.12,
  D8: 41.66,
  D7: 45.72,
  D6: 48.26,
  D5: 50.8,
  D4: 53.34,
  D3: 55.88,
  D2: 58.42,
  D1: 60.96,
  D0: 63.5,
};

const UNO_POWER_HEADER_X = {
  IOREF: 30.48,
  RESET: 33.02,
  '3V3': 35.56,
  '5V': 38.1,
  GND1: 40.64,
  GND2: 43.18,
  VIN: 45.72,
};

export const UNO_PINS = [
  ...Object.keys(UNO_DIGITAL_HEADER_X),
  ...Object.keys(UNO_POWER_HEADER_X),
  'A0', 'A1', 'A2', 'A3', 'A4', 'A5'
];

/**
 * Returns world coordinate for an Arduino Uno pin
 * @param {string} pin - Name of the pin (e.g. 'D13', '5V', 'GND', 'A0')
 * @returns {Vector3}
 */
export function getUnoPinCoord(pin) {
  let x, y;
  const p = pin.toUpperCase();
  if (p in UNO_DIGITAL_HEADER_X) {
    x = UNO_DIGITAL_HEADER_X[p];
    y = 50.8;
  } else if (p in UNO_POWER_HEADER_X) {
    x = UNO_POWER_HEADER_X[p];
    y = 2.54;
  } else if (/^A[0-5]$/.test(p)) {
    const idx = Number(p[1]);
    x = 50.8 + idx * BREADBOARD_PITCH;
    y = 2.54;
  } else if (p === 'GND') {
    return getUnoPinCoord('GND1');
  } else {
    throw new Error(`Unknown Arduino Uno pin: "${pin}"`);
  }

  return new Vector3(x - UNO_BOARD_WIDTH / 2, 8.5, UNO_BOARD_HEIGHT / 2 - y);
}

// ESP32 Pin Definitions
export const ESP32_LEFT_PINS = [
  'VIN', 'GND1', 'GPIO13', 'GPIO12', 'GPIO14', 'GPIO27', 'GPIO26', 'GPIO25',
  'GPIO33', 'GPIO32', 'GPIO35', 'GPIO34', 'GPIO39', 'GPIO36', 'EN'
];

export const ESP32_RIGHT_PINS = [
  '3V3', 'GND2', 'GPIO15', 'GPIO2', 'GPIO4', 'GPIO16', 'GPIO17', 'GPIO5',
  'GPIO18', 'GPIO19', 'GPIO21', 'GPIO3', 'GPIO1', 'GPIO22', 'GPIO23'
];

export const ESP32_PINS = [
  ...ESP32_LEFT_PINS,
  ...ESP32_RIGHT_PINS,
  'GND', 'SDA', 'SCL'
];

const ESP32_FIRST_PIN_Z = 17.78;

/**
 * Returns world coordinate for an ESP32 DevKit pin
 * @param {string} pin - Name of the pin (e.g. 'GPIO2', '3V3', 'VIN')
 * @returns {Vector3}
 */
export function getESP32PinCoord(pin) {
  const p = pin.toUpperCase();
  let index = ESP32_LEFT_PINS.indexOf(p);
  if (index >= 0) {
    return new Vector3(-11.35, 8.7, ESP32_FIRST_PIN_Z - index * BREADBOARD_PITCH);
  }
  index = ESP32_RIGHT_PINS.indexOf(p);
  if (index >= 0) {
    return new Vector3(11.35, 8.7, ESP32_FIRST_PIN_Z - index * BREADBOARD_PITCH);
  }
  if (p === 'GND') return getESP32PinCoord('GND1');
  if (p === 'SDA') return getESP32PinCoord('GPIO21');
  if (p === 'SCL') return getESP32PinCoord('GPIO22');

  throw new Error(`Unknown ESP32 pin: "${pin}"`);
}

/**
 * Resolves coordinate for any supported microcontroller board
 * @param {'uno' | 'esp32'} boardType 
 * @param {string} pinName 
 * @returns {Vector3}
 */
export function getBoardPinCoord(boardType, pinName) {
  if (boardType === 'esp32') {
    return getESP32PinCoord(pinName);
  }
  return getUnoPinCoord(pinName);
}
