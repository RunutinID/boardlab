import { CircuitComponent } from './base.js';
import { Vector3, BREADBOARD_PITCH } from '../grid.js';

export class LEDComponent extends CircuitComponent {
  constructor({ id, color = 'red', position, rotation } = {}) {
    super({ id, name: `${color.toUpperCase()} 5mm LED`, type: 'led', position, rotation });
    this.color = color;
    this.state = { brightness: 0.0 }; // 0.0 to 1.0
    // Long leg: Anode (+), Short leg: Cathode (-)
    this.addTerminal('anode', 'Anode (+)', new Vector3(0, 0, -BREADBOARD_PITCH / 2), 'io');
    this.addTerminal('cathode', 'Cathode (−)', new Vector3(0, 0, BREADBOARD_PITCH / 2), 'gnd');
  }

  applyState(newState) {
    super.applyState(newState);
    if ('level' in newState) {
      this.state.brightness = Math.max(0, Math.min(1, newState.level));
    }
  }
}

export class RGBLEDComponent extends CircuitComponent {
  constructor({ id, position, rotation } = {}) {
    super({ id, name: 'RGB LED (Common Cathode)', type: 'rgb-led', position, rotation });
    this.state = { r: 0, g: 0, b: 0 }; // 0 to 255
    // 4 pins: Red, Cathode (GND), Green, Blue
    this.addTerminal('red', 'Red Anode', new Vector3(-1.5 * BREADBOARD_PITCH, 0, 0), 'io');
    this.addTerminal('cathode', 'Common Cathode (GND)', new Vector3(-0.5 * BREADBOARD_PITCH, 0, 0), 'gnd');
    this.addTerminal('green', 'Green Anode', new Vector3(0.5 * BREADBOARD_PITCH, 0, 0), 'io');
    this.addTerminal('blue', 'Blue Anode', new Vector3(1.5 * BREADBOARD_PITCH, 0, 0), 'io');
  }
}

export class TrafficLightComponent extends CircuitComponent {
  constructor({ id, position, rotation } = {}) {
    super({ id, name: 'Traffic Light Module', type: 'traffic-light', position, rotation });
    this.state = { red: false, yellow: false, green: false };
    this.addTerminal('gnd', 'GND', new Vector3(-1.5 * BREADBOARD_PITCH, 0, 0), 'gnd');
    this.addTerminal('green', 'Green LED', new Vector3(-0.5 * BREADBOARD_PITCH, 0, 0), 'io');
    this.addTerminal('yellow', 'Yellow LED', new Vector3(0.5 * BREADBOARD_PITCH, 0, 0), 'io');
    this.addTerminal('red', 'Red LED', new Vector3(1.5 * BREADBOARD_PITCH, 0, 0), 'io');
  }
}

export class BuzzerComponent extends CircuitComponent {
  constructor({ id, position, rotation } = {}) {
    super({ id, name: 'Piezo Buzzer', type: 'buzzer', position, rotation });
    this.state = { frequency: 0, playing: false };
    this.addTerminal('pos', 'Positive (+)', new Vector3(0, 0, -1.5 * BREADBOARD_PITCH), 'io');
    this.addTerminal('neg', 'Negative (−)', new Vector3(0, 0, 1.5 * BREADBOARD_PITCH), 'gnd');
  }
}
