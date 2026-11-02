import assert from 'node:assert/strict';
import {
  VirtualCircuitBoard,
  ResistorComponent,
  LEDComponent,
  BuzzerComponent,
  breadboardCoord,
  WIRE_COLORS
} from '../src/circuit/index.js';

console.log('Testing VirtualCircuitBoard Facade...');

const vcb = new VirtualCircuitBoard({ boardType: 'uno' });

// 1. Board Info
assert.equal(vcb.boardType, 'uno');

// 2. Add Component with breadboard snapping
const led = new LEDComponent({ id: 'my-led', color: 'blue' });
vcb.add(led, { row: 'c', col: 14 });

assert.ok(vcb.hasComponent('my-led'));
assert.ok(led.position.x !== 0, 'Component position should be placed on breadboard column 14');

// 3. Add Jumper Wires
const w1 = vcb.wire('D13', { componentId: 'my-led', terminalId: 'anode' }, {
  color: WIRE_COLORS.orange
});
const w2 = vcb.wire({ componentId: 'my-led', terminalId: 'cathode' }, 'GND', {
  color: WIRE_COLORS.navy
});

assert.equal(vcb.getWires().length, 2);
assert.equal(w1.color, WIRE_COLORS.orange);

// 4. Run Simulation
vcb.setPinMode('D13', 'OUTPUT');
vcb.digitalWrite('D13', 1);
vcb.step(16);

assert.ok(led.state.brightness > 0.8, 'LED should light up when powered via VirtualCircuitBoard');

// 5. JSON Serialization & Deserialization
const savedData = vcb.exportCircuitJSON();
assert.ok(savedData.components.length === 1);
assert.ok(savedData.wires.length === 2);

const vcb2 = new VirtualCircuitBoard({ boardType: 'uno' });
vcb2.importCircuitJSON(savedData);
assert.ok(vcb2.hasComponent('my-led'));
assert.equal(vcb2.getWires().length, 2);

console.log('All VirtualCircuitBoard Facade Tests Passed!');
