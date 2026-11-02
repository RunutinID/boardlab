import assert from 'node:assert/strict';
import { CircuitSimulator } from '../src/circuit/simulator.js';
import {
  LEDComponent,
  ResistorComponent,
  PushButtonComponent,
  PotentiometerComponent
} from '../src/circuit/components/index.js';

console.log('Testing Circuit Simulation Engine & Netlist Solver...');

const sim = new CircuitSimulator({ boardType: 'uno' });

// 1. Initial State
assert.equal(sim.getPinVoltage('5V'), 5.0, '5V power rail must be 5.0V');
assert.equal(sim.getPinVoltage('GND'), 0.0, 'GND must be 0.0V');

// 2. Setup LED Circuit: Pin D13 -> Resistor -> LED -> GND
const r220 = new ResistorComponent({ id: 'r220', ohms: 220 });
const led = new LEDComponent({ id: 'led1', color: 'red' });

sim.addComponent(r220);
sim.addComponent(led);

// Connect D13 to Resistor terminal 1
sim.connect('D13', { componentId: 'r220', terminalId: 't1' });
// Connect Resistor terminal 2 to LED Anode
sim.connect({ componentId: 'r220', terminalId: 't2' }, { componentId: 'led1', terminalId: 'anode' });
// Connect LED Cathode to GND
sim.connect({ componentId: 'led1', terminalId: 'cathode' }, 'GND');

sim.setPinMode('D13', 'OUTPUT');

// Turn D13 LOW
sim.digitalWrite('D13', 0);
sim.step(16); // 16ms tick
assert.equal(led.state.brightness, 0.0, 'LED should be OFF when D13 is LOW');

// Turn D13 HIGH
sim.digitalWrite('D13', 1);
sim.step(16);
assert.ok(led.state.brightness > 0.8, 'LED should be ON when D13 is HIGH');

// PWM test
sim.analogWrite('D13', 128); // 50% PWM
sim.step(16);
assert.ok(Math.abs(led.state.brightness - 0.5) < 0.1, 'LED brightness should match PWM duty cycle');

// 3. Potentiometer to Analog Input A0
const pot = new PotentiometerComponent({ id: 'pot1' });
sim.addComponent(pot);
sim.connect('5V', { componentId: 'pot1', terminalId: 'vcc' });
sim.connect({ componentId: 'pot1', terminalId: 'wiper' }, 'A0');
sim.connect({ componentId: 'pot1', terminalId: 'gnd' }, 'GND');

pot.applyState({ value: 512 }); // Midpoint
sim.step(16);
const a0Val = sim.analogRead('A0');
assert.ok(Math.abs(a0Val - 512) < 5, 'A0 reading should match potentiometer voltage');

// 4. Button to Digital Input D2
const btn = new PushButtonComponent({ id: 'btn1' });
sim.addComponent(btn);
sim.setPinMode('D2', 'INPUT_PULLUP');
assert.equal(sim.digitalRead('D2'), 1, 'INPUT_PULLUP without press should read HIGH (1)');

console.log('All Simulation Tests Passed!');

