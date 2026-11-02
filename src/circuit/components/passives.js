import { CircuitComponent } from './base.js';
import { Vector3, BREADBOARD_PITCH } from '../grid.js';

const COLOR_DIGITS = [
  'black', 'brown', 'red', 'orange', 'yellow',
  'green', 'blue', 'purple', 'gray', 'white'
];

export function getResistorColorBands(ohms) {
  if (ohms <= 0) return ['black', 'black', 'black', 'gold'];
  const s = ohms.toExponential();
  const [mantissa, exp] = s.split('e');
  const d1 = Math.floor(parseFloat(mantissa));
  const d2 = Math.round((parseFloat(mantissa) - d1) * 10);
  const multiplier = parseInt(exp, 10) - 1;

  return [
    COLOR_DIGITS[d1] || 'brown',
    COLOR_DIGITS[d2] || 'black',
    COLOR_DIGITS[multiplier] || 'black',
    'gold'
  ];
}

export class ResistorComponent extends CircuitComponent {
  constructor({ id, ohms = 220, position, rotation } = {}) {
    super({ id, name: `${ohms} Ω Resistor`, type: 'resistor', position, rotation });
    this.ohms = ohms;
    this.colorBands = getResistorColorBands(ohms);
    // Span across 4 rows on breadboard (approx 4 * 2.54mm)
    this.addTerminal('t1', 'Terminal 1', new Vector3(0, 0, -2 * BREADBOARD_PITCH), 'passive');
    this.addTerminal('t2', 'Terminal 2', new Vector3(0, 0, 2 * BREADBOARD_PITCH), 'passive');
  }
}

export class PotentiometerComponent extends CircuitComponent {
  constructor({ id, ohms = 10000, position, rotation } = {}) {
    super({ id, name: `${ohms / 1000} kΩ Potentiometer`, type: 'potentiometer', position, rotation });
    this.ohms = ohms;
    this.state = { value: 0, normalized: 0.0 }; // 0 to 1023
    // 3 pins spaced by 2.54mm along X
    this.addTerminal('vcc', 'VCC (5V)', new Vector3(-BREADBOARD_PITCH, 0, 0), 'power');
    this.addTerminal('wiper', 'Signal Out (Wiper)', new Vector3(0, 0, 0), 'analog');
    this.addTerminal('gnd', 'GND', new Vector3(BREADBOARD_PITCH, 0, 0), 'gnd');
  }

  applyState(newState) {
    super.applyState(newState);
    if (typeof this.state.value === 'number') {
      this.state.normalized = Math.max(0, Math.min(1, this.state.value / 1023));
    }
  }
}

export class PushButtonComponent extends CircuitComponent {
  constructor({ id, position, rotation } = {}) {
    super({ id, name: 'Tactile Push Button', type: 'button', position, rotation });
    this.state = { pressed: false };
    // 4 legs straddling the breadboard center trough
    this.addTerminal('1a', 'Pin 1A', new Vector3(-BREADBOARD_PITCH, 0, -BREADBOARD_PITCH), 'passive');
    this.addTerminal('1b', 'Pin 1B', new Vector3(BREADBOARD_PITCH, 0, -BREADBOARD_PITCH), 'passive');
    this.addTerminal('2a', 'Pin 2A', new Vector3(-BREADBOARD_PITCH, 0, BREADBOARD_PITCH), 'passive');
    this.addTerminal('2b', 'Pin 2B', new Vector3(BREADBOARD_PITCH, 0, BREADBOARD_PITCH), 'passive');
  }
}

export class LDRComponent extends CircuitComponent {
  constructor({ id, position, rotation } = {}) {
    super({ id, name: 'Photoresistor (LDR)', type: 'ldr', position, rotation });
    this.state = { lightLevel: 500 }; // 0 to 1023
    this.addTerminal('t1', 'Terminal 1', new Vector3(0, 0, -BREADBOARD_PITCH / 2), 'passive');
    this.addTerminal('t2', 'Terminal 2', new Vector3(0, 0, BREADBOARD_PITCH / 2), 'passive');
  }
}

export class FSRComponent extends CircuitComponent {
  constructor({ id, position, rotation } = {}) {
    super({ id, name: 'Force Sensitive Resistor (FSR)', type: 'fsr', position, rotation });
    this.state = { force: 0 };
    this.addTerminal('t1', 'Terminal 1', new Vector3(0, 0, -BREADBOARD_PITCH / 2), 'passive');
    this.addTerminal('t2', 'Terminal 2', new Vector3(0, 0, BREADBOARD_PITCH / 2), 'passive');
  }
}

