import assert from 'node:assert/strict';
import {
  parsePinOrCoord,
  formatEndpointLabel,
  WireToolState
} from '../src/sandbox/interaction.js';
import { Vector3 } from '../src/circuit/grid.js';

console.log('Testing Sandbox Interaction & Wire Tool State...');

// 1. Endpoint Labeling
const pinLabel = formatEndpointLabel('D13');
assert.equal(pinLabel, 'Pin D13');

const gndLabel = formatEndpointLabel('GND1');
assert.equal(gndLabel, 'Pin GND1');

const compTermLabel = formatEndpointLabel({ componentId: 'r1', terminalId: 't1' });
assert.equal(compTermLabel, 'r1 (t1)');

// 2. Wire Tool State Machine
const wireTool = new WireToolState();
assert.equal(wireTool.isConnecting(), false);

// Click point 1 (origin)
wireTool.selectPoint('D13');
assert.equal(wireTool.isConnecting(), true);
assert.equal(wireTool.startPoint, 'D13');

// Click point 2 (destination)
const completedWire = wireTool.selectPoint('GND');
assert.equal(wireTool.isConnecting(), false);
assert.ok(completedWire, 'Should return completed wire endpoints');
assert.equal(completedWire.from, 'D13');
assert.equal(completedWire.to, 'GND');

// Cancel wire
wireTool.selectPoint('5V');
assert.equal(wireTool.isConnecting(), true);
wireTool.cancel();
assert.equal(wireTool.isConnecting(), false);
assert.equal(wireTool.startPoint, null);

console.log('All Interaction Tests Passed!');

