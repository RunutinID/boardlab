import assert from 'node:assert/strict';
import {
  BREADBOARD_PITCH,
  BREADBOARD_ORIGIN,
  breadboardCoord,
  getBoardPinCoord,
  UNO_PINS,
  ESP32_PINS
} from '../src/circuit/grid.js';

console.log('Testing Grid Coordinate System...');

// 1. Verify Pitch
assert.equal(BREADBOARD_PITCH, 2.54, 'Breadboard pitch must be 2.54mm');

// 2. Breadboard Coordinate calculations
const coordA = breadboardCoord(10, 'a');
const coordB = breadboardCoord(10, 'b');
const coordNextCol = breadboardCoord(11, 'a');

assert.ok(coordA && typeof coordA.x === 'number', 'Coordinate must have numeric x, y, z');
// Difference between row 'a' and row 'b' is 2.54mm along Z
assert.ok(Math.abs(Math.abs(coordA.z - coordB.z) - 2.54) < 0.01, 'Row spacing must be 2.54mm');
// Difference between col 10 and col 11 is 2.54mm along X
assert.ok(Math.abs(Math.abs(coordNextCol.x - coordA.x) - 2.54) < 0.01, 'Col spacing must be 2.54mm');

// 3. Arduino Uno Pin mapping
assert.ok(Array.isArray(UNO_PINS) && UNO_PINS.includes('D13'), 'UNO_PINS should contain D13');
const d13Coord = getBoardPinCoord('uno', 'D13');
const gndCoord = getBoardPinCoord('uno', 'GND');
assert.ok(d13Coord && typeof d13Coord.x === 'number', 'D13 coordinate must be resolved');
assert.ok(gndCoord && typeof gndCoord.x === 'number', 'GND coordinate must be resolved');

// 4. ESP32 Pin mapping
assert.ok(Array.isArray(ESP32_PINS) && ESP32_PINS.includes('GPIO2'), 'ESP32_PINS should contain GPIO2');
const espPin = getBoardPinCoord('esp32', 'GPIO2');
assert.ok(espPin && typeof espPin.x === 'number', 'GPIO2 coordinate must be resolved');

console.log('All Grid Tests Passed!');

