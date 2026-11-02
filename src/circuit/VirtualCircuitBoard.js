/**
 * High-Level VirtualCircuitBoard Facade
 */

import { breadboardCoord, Vector3 } from './grid.js';
import { createWireDescriptor, WIRE_COLORS } from './wire.js';
import { CircuitSimulator } from './simulator.js';

export class VirtualCircuitBoard {
  constructor({ boardType = 'uno', logicVoltage = null } = {}) {
    this.boardType = boardType;
    this.simulator = new CircuitSimulator({ boardType, logicVoltage });
    this.components = new Map();
    this.wires = new Map();
  }

  add(component, placement = {}) {
    if (placement.col !== undefined && placement.row !== undefined) {
      const coord = breadboardCoord(placement.col, placement.row);
      component.position.copy(coord);
    } else if (placement.position) {
      component.position.copy(placement.position);
    }
    if (placement.rotation) {
      component.rotation = [...placement.rotation];
    }

    this.components.set(component.id, component);
    this.simulator.addComponent(component);
    return component;
  }

  remove(componentId) {
    this.components.delete(componentId);
    this.simulator.removeComponent(componentId);
  }

  hasComponent(componentId) {
    return this.components.has(componentId);
  }

  getComponent(componentId) {
    return this.components.get(componentId);
  }

  getComponents() {
    return [...this.components.values()];
  }

  wire(from, to, options = {}) {
    const wireId = options.id || `wire-${this.wires.size + 1}`;
    
    // Convert endpoints to coordinates
    let coordFrom = from;
    let coordTo = to;

    if (from && from.componentId && from.terminalId) {
      const c = this.components.get(from.componentId);
      coordFrom = c ? c.getTerminalWorldCoord(from.terminalId) : from;
    }
    if (to && to.componentId && to.terminalId) {
      const c = this.components.get(to.componentId);
      coordTo = c ? c.getTerminalWorldCoord(to.terminalId) : to;
    }

    const descriptor = createWireDescriptor({
      id: wireId,
      from: coordFrom,
      to: coordTo,
      color: options.color || WIRE_COLORS.blue,
      arch: options.arch ?? 14,
      boardType: this.boardType,
      signal: {
        a: typeof from === 'string' ? from : (options.signal?.a || null),
        b: typeof to === 'string' ? to : (options.signal?.b || null),
        ...options.signal
      }
    });

    this.wires.set(wireId, descriptor);
    this.simulator.connect(from, to);
    return descriptor;
  }

  removeWire(wireId) {
    this.wires.delete(wireId);
  }

  getWires() {
    return [...this.wires.values()];
  }

  setPinMode(pin, mode) {
    this.simulator.setPinMode(pin, mode);
  }

  digitalWrite(pin, val) {
    this.simulator.digitalWrite(pin, val);
  }

  analogWrite(pin, dutyCycle) {
    this.simulator.analogWrite(pin, dutyCycle);
  }

  digitalRead(pin) {
    return this.simulator.digitalRead(pin);
  }

  analogRead(pin) {
    return this.simulator.analogRead(pin);
  }

  step(deltaTimeMs = 16) {
    this.simulator.step(deltaTimeMs);
  }

  exportCircuitJSON() {
    return {
      version: '1.0.0',
      boardType: this.boardType,
      components: this.getComponents().map(c => ({
        id: c.id,
        type: c.type,
        name: c.name,
        ohms: c.ohms,
        color: c.color,
        position: c.position.toArray(),
        rotation: c.rotation,
        state: c.state
      })),
      wires: this.getWires().map(w => ({
        id: w.id,
        from: w.sourceA,
        to: w.sourceB,
        color: w.color,
        arch: w.arch,
        signal: w.signal
      }))
    };
  }

  importCircuitJSON(data) {
    this.components.clear();
    this.wires.clear();
    this.simulator = new CircuitSimulator({ boardType: data.boardType || this.boardType });

    for (const c of data.components || []) {
      // Create minimal component representation
      const comp = {
        id: c.id,
        name: c.name,
        type: c.type,
        ohms: c.ohms,
        color: c.color,
        position: new Vector3(...c.position),
        rotation: c.rotation || [0, 0, 0],
        terminals: [],
        state: c.state || {},
        getTerminalWorldCoord: () => new Vector3(...c.position)
      };
      this.components.set(c.id, comp);
      this.simulator.addComponent(comp);
    }

    for (const w of data.wires || []) {
      this.wire(w.from, w.to, {
        id: w.id,
        color: w.color,
        arch: w.arch,
        signal: w.signal
      });
    }
  }
}
