/**
 * Parametric 3D Jumper Wire & Signal Flow Engine
 */

import { Vector3, getBoardPinCoord } from './grid.js';

export const WIRE_COLORS = {
  red: '#d64a3a',
  navy: '#2f3547',
  orange: '#f0a53a',
  yellow: '#f0b53a',
  green: '#3fae6a',
  blue: '#3d6fc4',
  coral: '#ee7f62',
  purple: '#8a63c9',
  brown: '#7a5034',
  white: '#e6e8eb',
  black: '#1f242d',
};

const TERMINAL_PIN_HEIGHT = 8.5;

function resolvePoint(pt, boardType = 'uno') {
  if (typeof pt === 'string') {
    return getBoardPinCoord(boardType, pt);
  }
  if (pt instanceof Vector3) {
    return pt.clone();
  }
  if (pt && typeof pt.x === 'number') {
    return new Vector3(pt.x, pt.y, pt.z);
  }
  throw new Error(`Invalid point for wire: ${JSON.stringify(pt)}`);
}

/**
 * Creates a normalized jumper wire descriptor
 * @param {Object} options 
 * @returns {Object} Wire descriptor
 */
export function createWireDescriptor({
  id,
  from,
  to,
  color = WIRE_COLORS.blue,
  arch = 14,
  lean = 0.18,
  leanB = lean,
  endA = true,
  endB = true,
  boardType = 'uno',
  signal = {},
  flat = false
}) {
  const ptA = resolvePoint(from, boardType);
  const ptB = resolvePoint(to, boardType);

  const key = [
    id,
    ptA.x.toFixed(2), ptA.y.toFixed(2), ptA.z.toFixed(2),
    ptB.x.toFixed(2), ptB.y.toFixed(2), ptB.z.toFixed(2),
    color
  ].join('|');

  const normalizedSignal = {
    a: typeof from === 'string' ? from : null,
    b: typeof to === 'string' ? to : null,
    net: signal.net ?? (typeof from === 'string' && from.startsWith('GND') ? 'GND' : 'SIG'),
    dir: signal.dir ?? 1,
    follow: signal.follow ?? (typeof from === 'string' ? from : null),
    ...signal
  };

  return {
    id,
    key,
    wire: true,
    from: ptA,
    to: ptB,
    sourceA: from,
    sourceB: to,
    color,
    arch,
    lean,
    leanB,
    endA,
    endB,
    flat,
    signal: normalizedSignal,
  };
}

/**
 * Calculates cubic bezier curve control points for realistic wire arch
 * @param {Object} wire - Wire descriptor
 * @returns {[Vector3, Vector3, Vector3, Vector3]} [start, cp1, cp2, end]
 */
export function calculateWireCurvePoints(wire) {
  const d = wire.from.clone();
  const f = wire.to.clone();

  if (wire.endA) d.y += TERMINAL_PIN_HEIGHT;
  if (wire.endB) f.y += TERMINAL_PIN_HEIGHT;

  const peakY = Math.max(d.y, f.y) + wire.arch;

  // Midpoint 1: lerp from d to f by lean, with peak elevation
  const m = new Vector3(
    d.x + (f.x - d.x) * wire.lean,
    peakY,
    d.z + (f.z - d.z) * wire.lean
  );

  // Midpoint 2: lerp from f to d by leanB, with peak elevation
  const h = new Vector3(
    f.x + (d.x - f.x) * wire.leanB,
    peakY,
    f.z + (d.z - f.z) * wire.leanB
  );

  return [d, m, h, f];
}

/**
 * Resolves current signal state along the wire
 * @param {Object} wire 
 * @param {Object} pinStates - Map of pin states { D13: { v: 1, mode: 'out' } }
 * @returns {Object} { kind, text, flow, dir, level }
 */
export function resolveWireSignal(wire, pinStates = {}) {
  const sig = wire.signal || {};
  const pinName = sig.a || sig.follow;

  if (sig.net === 'GND' || (pinName && pinName.startsWith('GND'))) {
    return { kind: 'gnd', text: 'GND', flow: 0, dir: sig.dir ?? -1, level: false };
  }

  if (pinName === '5V') {
    return { kind: 'power', text: '5 V', flow: 1.0, dir: sig.dir ?? 1, level: true };
  }

  if (pinName === '3V3') {
    return { kind: 'power', text: '3.3 V', flow: 1.0, dir: sig.dir ?? 1, level: true };
  }

  const pin = pinStates[pinName];
  if (!pin) {
    return { kind: 'sig', text: pinName || 'NC', flow: 0, dir: sig.dir ?? 1, level: false };
  }

  const value = pin.v ?? 0;
  const flow = typeof value === 'number' ? (value > 1 ? value / 255 : value) : (value ? 1 : 0);
  const isHigh = flow > 0.05;

  return {
    kind: 'sig',
    text: pin.text ?? (isHigh ? 'HIGH' : 'LOW'),
    flow: flow,
    dir: sig.dir ?? 1,
    level: isHigh
  };
}

