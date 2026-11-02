import assert from 'node:assert/strict';
import {
  formatVoltageReading,
  formatPinStateBadge,
  getCircuitHealthSummary
} from '../src/sandbox/inspector.js';

console.log('Testing Sandbox Inspector & Probe Engine...');

// 1. Voltage Formatting
assert.equal(formatVoltageReading(5.0), '5.00 V');
assert.equal(formatVoltageReading(0.0), '0.00 V (GND)');
assert.equal(formatVoltageReading(3.3), '3.30 V');
assert.equal(formatVoltageReading(2.5), '2.50 V');

// 2. Pin State Badge
const outHigh = formatPinStateBadge({ mode: 'OUTPUT', v: 5.0 });
assert.equal(outHigh.text, 'OUTPUT: HIGH');
assert.equal(outHigh.level, true);

const inLow = formatPinStateBadge({ mode: 'INPUT', v: 0.0 });
assert.equal(inLow.text, 'INPUT: LOW');
assert.equal(inLow.level, false);

// 3. Circuit Health Summary
const healthOk = getCircuitHealthSummary({ componentCount: 3, wireCount: 4, hasPower: true, hasGnd: true });
assert.equal(healthOk.status, 'OK');
assert.ok(healthOk.message.includes('Normal'));

const healthNoPower = getCircuitHealthSummary({ componentCount: 3, wireCount: 2, hasPower: false, hasGnd: true });
assert.equal(healthNoPower.status, 'NO_POWER');

console.log('All Inspector Tests Passed!');

