import assert from 'node:assert/strict';
import {
  createWireDescriptor,
  calculateWireCurvePoints,
  resolveWireSignal,
  WIRE_COLORS
} from '../src/circuit/wire.js';
import { Vector3 } from '../src/circuit/grid.js';

console.log('Testing Parametric Jumper Wire Engine...');

// 1. Color Palette check
assert.ok(WIRE_COLORS.red && WIRE_COLORS.navy && WIRE_COLORS.blue, 'Standard jumper wire colors must exist');

// 2. Wire Descriptor Creation
const pA = new Vector3(0, 0, 0);
const pB = new Vector3(50, 0, 20);

const wire = createWireDescriptor({
  id: 'wire-d13',
  from: pA,
  to: pB,
  color: WIRE_COLORS.orange,
  arch: 15,
  signal: { a: 'D13', net: 'SIG' }
});

assert.equal(wire.id, 'wire-d13');
assert.equal(wire.color, WIRE_COLORS.orange);
assert.ok(wire.key.includes('wire-d13'));

// 3. Curve & Spline Calculation
const points = calculateWireCurvePoints(wire);
assert.equal(points.length, 4, 'Cubic curve must have 4 control points (start, cp1, cp2, end)');

const [start, cp1, cp2, end] = points;
// Endpoints should account for terminal pin height
assert.ok(start.y > 0, 'Start pin terminal should have elevation');
assert.ok(end.y > 0, 'End pin terminal should have elevation');
// Peak height should be higher than start/end by roughly wire.arch
assert.ok(cp1.y > start.y + 10, 'Peak curve height should arch upwards');
assert.equal(cp1.y, cp2.y, 'Mid control points should match peak arch height');

// 4. Signal Resolution
// Inactive pin
const signalOff = resolveWireSignal(wire, { D13: { v: 0, mode: 'out' } });
assert.equal(signalOff.level, false);
assert.equal(signalOff.flow, 0);

// Active pin
const signalOn = resolveWireSignal(wire, { D13: { v: 1, mode: 'out' } });
assert.equal(signalOn.level, true);
assert.ok(signalOn.flow > 0);

console.log('All Wire Tests Passed!');
