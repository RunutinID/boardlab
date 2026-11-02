import assert from 'node:assert/strict';
import {
  CircuitComponent,
  ResistorComponent,
  PotentiometerComponent,
  PushButtonComponent,
  LEDComponent,
  RGBLEDComponent,
  UltrasonicHCSR04Component,
  ServoSG90Component,
  DCMotorComponent,
  BuzzerComponent,
  OLEDDisplayComponent
} from '../src/circuit/components/index.js';

console.log('Testing Electronic Components Catalog...');

// 1. Base CircuitComponent
const base = new CircuitComponent({ id: 'base-1', name: 'Generic Component', type: 'generic' });
assert.equal(base.id, 'base-1');
assert.ok(Array.isArray(base.terminals), 'Terminals should be an array');

// 2. Resistor Component
const r220 = new ResistorComponent({ id: 'r1', ohms: 220 });
assert.equal(r220.ohms, 220);
assert.equal(r220.terminals.length, 2, 'Resistor has 2 terminals (t1, t2)');
assert.ok(Array.isArray(r220.colorBands), 'Resistor should calculate color bands');
assert.deepEqual(r220.colorBands, ['red', 'red', 'brown', 'gold']);

const r10k = new ResistorComponent({ id: 'r2', ohms: 10000 });
assert.deepEqual(r10k.colorBands, ['brown', 'black', 'orange', 'gold']);

// 3. LED Component
const led = new LEDComponent({ id: 'led1', color: 'red' });
assert.equal(led.terminals.length, 2, 'LED has anode and cathode');
assert.ok(led.terminals.find(t => t.id === 'anode'));
assert.ok(led.terminals.find(t => t.id === 'cathode'));
led.applyState({ level: 1.0 });
assert.equal(led.state.brightness, 1.0);

// 4. Push Button Component
const btn = new PushButtonComponent({ id: 'btn1' });
assert.equal(btn.terminals.length, 4, 'Tactile button has 4 pins (1a, 1b, 2a, 2b)');
assert.equal(btn.state.pressed, false);
btn.applyState({ pressed: true });
assert.equal(btn.state.pressed, true);

// 5. Potentiometer Component
const pot = new PotentiometerComponent({ id: 'pot1', ohms: 10000 });
assert.equal(pot.terminals.length, 3, 'Potentiometer has 3 terminals (vcc, wiper, gnd)');
pot.applyState({ value: 512 });
assert.equal(pot.state.value, 512);

// 6. Ultrasonic HC-SR04
const sonar = new UltrasonicHCSR04Component({ id: 'sonar1' });
assert.equal(sonar.terminals.length, 4, 'HC-SR04 has VCC, Trig, Echo, GND');
sonar.applyState({ distanceCm: 25.5 });
assert.equal(sonar.state.distanceCm, 25.5);

// 7. Servo SG90
const servo = new ServoSG90Component({ id: 'servo1' });
assert.equal(servo.terminals.length, 3, 'Servo has GND, 5V, Signal');
servo.applyState({ angle: 90 });
assert.equal(servo.state.angle, 90);

// 8. DC Motor & Buzzer
const motor = new DCMotorComponent({ id: 'motor1' });
assert.equal(motor.terminals.length, 2);
motor.applyState({ speed: 200 });
assert.equal(motor.state.speed, 200);

const buzzer = new BuzzerComponent({ id: 'buzzer1' });
assert.equal(buzzer.terminals.length, 2);

// 9. OLED Display
const oled = new OLEDDisplayComponent({ id: 'oled1' });
assert.equal(oled.terminals.length, 4, 'I2C OLED has GND, VCC, SCL, SDA');

console.log('All Component Tests Passed!');
