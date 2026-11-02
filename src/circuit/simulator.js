/**
 * Netlist Solver & Circuit Simulation Engine
 */

export class CircuitSimulator {
  constructor({ boardType = 'uno', logicVoltage = null } = {}) {
    this.boardType = boardType;
    this.vccVoltage = logicVoltage !== null ? logicVoltage : (boardType === 'esp32' ? 3.3 : 5.0);
    this.components = new Map();
    this.wires = [];
    this.connections = []; // [{ from, to }]

    // Pin states: pinName -> { mode, v, pwm, duty }
    this.pins = new Map();
    this.initDefaultPins();
  }

  initDefaultPins() {
    this.pins.set('5V', { mode: 'OUTPUT', v: 5.0, pwm: 255 });
    this.pins.set('3V3', { mode: 'OUTPUT', v: 3.3, pwm: 255 });
    this.pins.set('VIN', { mode: 'OUTPUT', v: 9.0, pwm: 255 });
    this.pins.set('GND', { mode: 'OUTPUT', v: 0.0, pwm: 0 });
    this.pins.set('GND1', { mode: 'OUTPUT', v: 0.0, pwm: 0 });
    this.pins.set('GND2', { mode: 'OUTPUT', v: 0.0, pwm: 0 });

    // Digital pins D0-D13
    for (let i = 0; i <= 13; i++) {
      this.pins.set(`D${i}`, { mode: 'INPUT', v: 0.0, pwm: 0 });
    }

    // Analog pins A0-A5
    for (let i = 0; i <= 5; i++) {
      this.pins.set(`A${i}`, { mode: 'INPUT', v: 0.0, pwm: 0 });
    }

    // ESP32 GPIOs
    for (let i = 0; i <= 39; i++) {
      this.pins.set(`GPIO${i}`, { mode: 'INPUT', v: 0.0, pwm: 0 });
    }
  }

  addComponent(component) {
    this.components.set(component.id, component);
    return component;
  }

  removeComponent(componentId) {
    this.components.delete(componentId);
    this.connections = this.connections.filter(c => 
      c.from.componentId !== componentId && c.to.componentId !== componentId
    );
  }

  normalizeEndpoint(pt) {
    if (typeof pt === 'string') {
      return { type: 'pin', pin: pt };
    }
    if (pt.componentId && pt.terminalId) {
      return { type: 'terminal', componentId: pt.componentId, terminalId: pt.terminalId };
    }
    if (pt.row && pt.col) {
      return { type: 'breadboard', key: `bb-${pt.col}-${pt.row}` };
    }
    return pt;
  }

  connect(pointA, pointB) {
    const from = this.normalizeEndpoint(pointA);
    const to = this.normalizeEndpoint(pointB);
    this.connections.push({ from, to });
  }

  setPinMode(pin, mode = 'OUTPUT') {
    const p = this.pins.get(pin) || { v: 0, pwm: 0 };
    p.mode = mode;
    if (mode === 'INPUT_PULLUP') {
      p.v = this.vccVoltage;
    }
    this.pins.set(pin, p);
  }

  digitalWrite(pin, val) {
    const p = this.pins.get(pin) || { mode: 'OUTPUT' };
    const isHigh = !!val;
    p.v = isHigh ? this.vccVoltage : 0.0;
    p.pwm = isHigh ? 255 : 0;
    this.pins.set(pin, p);
  }

  analogWrite(pin, dutyCycle) {
    // dutyCycle 0 to 255
    const p = this.pins.get(pin) || { mode: 'OUTPUT' };
    const duty = Math.max(0, Math.min(255, dutyCycle));
    p.pwm = duty;
    p.v = (duty / 255) * this.vccVoltage;
    this.pins.set(pin, p);
  }

  digitalRead(pin) {
    const v = this.getPinVoltage(pin);
    return v >= (this.vccVoltage * 0.5) ? 1 : 0;
  }

  analogRead(pin) {
    const v = this.getPinVoltage(pin);
    // Maps 0-Vcc to 0-1023
    return Math.round(Math.max(0, Math.min(1023, (v / this.vccVoltage) * 1023)));
  }

  getPinVoltage(pin) {
    const p = this.pins.get(pin);
    if (!p) return 0.0;
    if (p.mode === 'OUTPUT') return p.v;

    // If input, check what net or component is driving this pin
    for (const conn of this.connections) {
      const other = conn.from.pin === pin ? conn.to : (conn.to.pin === pin ? conn.from : null);
      if (other && other.type === 'terminal') {
        const comp = this.components.get(other.componentId);
        if (comp && comp.type === 'potentiometer' && other.terminalId === 'wiper') {
          return (comp.state.value / 1023) * this.vccVoltage;
        }
        if (comp && comp.type === 'tmp36' && other.terminalId === 'vout') {
          return comp.getVoltage();
        }
      }
    }

    return p.v;
  }

  step(deltaTimeMs = 16) {
    // Evaluate connected circuits
    for (const [compId, comp] of this.components) {
      if (comp.type === 'led') {
        // Find if anode is connected to an output pin and cathode to GND
        let anodeVoltage = 0.0;
        let cathodeVoltage = 0.0;

        for (const conn of this.connections) {
          const check = (term, pinName) => {
            const endpoint = conn.from.componentId === compId && conn.from.terminalId === term ? conn.to :
                           (conn.to.componentId === compId && conn.to.terminalId === term ? conn.from : null);
            if (!endpoint) return null;
            if (endpoint.type === 'pin') return this.getPinVoltage(endpoint.pin);
            // Connected via resistor to a pin?
            if (endpoint.type === 'terminal') {
              const otherComp = this.components.get(endpoint.componentId);
              if (otherComp && otherComp.type === 'resistor') {
                const otherTerm = endpoint.terminalId === 't1' ? 't2' : 't1';
                for (const c2 of this.connections) {
                  const ep2 = c2.from.componentId === otherComp.id && c2.from.terminalId === otherTerm ? c2.to :
                            (c2.to.componentId === otherComp.id && c2.to.terminalId === otherTerm ? c2.from : null);
                  if (ep2 && ep2.type === 'pin') return this.getPinVoltage(ep2.pin);
                }
              }
            }
            return null;
          };

          const va = check('anode');
          if (va !== null) anodeVoltage = va;
          const vc = check('cathode');
          if (vc !== null) cathodeVoltage = vc;
        }

        const drop = Math.max(0, anodeVoltage - cathodeVoltage);
        comp.applyState({ level: drop / this.vccVoltage });
      }

      if (comp.type === 'dc-motor') {
        // Check drive voltage
        let drive = 0;
        for (const conn of this.connections) {
          const ep = conn.from.componentId === compId ? conn.to : (conn.to.componentId === compId ? conn.from : null);
          if (ep && ep.type === 'pin') {
            drive = this.getPinVoltage(ep.pin);
          }
        }
        comp.applyState({ speed: Math.round((drive / this.vccVoltage) * 255) });
      }
    }
  }
}
