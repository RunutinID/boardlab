/**
 * Interactive Click-to-Wire & Breadboard Snapping Tool
 */

import { Vector3, breadboardCoord } from '../circuit/grid.js';

export function formatEndpointLabel(ep) {
  if (typeof ep === 'string') {
    return `Pin ${ep}`;
  }
  if (ep && ep.componentId && ep.terminalId) {
    return `${ep.componentId} (${ep.terminalId})`;
  }
  if (ep && ep.row && ep.col) {
    return `Breadboard ${ep.col}${ep.row.toUpperCase()}`;
  }
  return 'Terminal';
}

export function parsePinOrCoord(input) {
  if (typeof input === 'string') return input;
  if (input && typeof input.x === 'number') {
    return new Vector3(input.x, input.y, input.z);
  }
  return input;
}

export class WireToolState {
  constructor() {
    this.startPoint = null;
    this.selectedColor = '#3d6fc4'; // default blue
  }

  isConnecting() {
    return this.startPoint !== null;
  }

  setColor(color) {
    this.selectedColor = color;
  }

  selectPoint(point) {
    if (!this.startPoint) {
      this.startPoint = point;
      return null;
    }

    const from = this.startPoint;
    const to = point;
    this.startPoint = null;

    return {
      from,
      to,
      color: this.selectedColor
    };
  }

  cancel() {
    this.startPoint = null;
  }
}
