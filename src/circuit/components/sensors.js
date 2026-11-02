import { CircuitComponent } from './base.js';
import { Vector3, BREADBOARD_PITCH } from '../grid.js';

export class UltrasonicHCSR04Component extends CircuitComponent {
  constructor({ id, position, rotation } = {}) {
    super({ id, name: 'HC-SR04 Ultrasonic Distance Sensor', type: 'ultrasonic', position, rotation });
    this.state = { distanceCm: 20.0 }; // simulated obstacle distance
    // 4 pins spaced by 2.54mm: VCC, Trig, Echo, GND
    this.addTerminal('vcc', 'VCC (5V)', new Vector3(-1.5 * BREADBOARD_PITCH, 0, 0), 'power');
    this.addTerminal('trig', 'Trigger', new Vector3(-0.5 * BREADBOARD_PITCH, 0, 0), 'io');
    this.addTerminal('echo', 'Echo', new Vector3(0.5 * BREADBOARD_PITCH, 0, 0), 'io');
    this.addTerminal('gnd', 'GND', new Vector3(1.5 * BREADBOARD_PITCH, 0, 0), 'gnd');
  }
}

export class TMP36Component extends CircuitComponent {
  constructor({ id, position, rotation } = {}) {
    super({ id, name: 'TMP36 Linear Temperature Sensor', type: 'tmp36', position, rotation });
    this.state = { temperatureC: 25.0 }; // -40°C to 125°C
    // 3 pins: VCC, VOUT, GND
    this.addTerminal('vcc', 'VCC (2.7-5.5V)', new Vector3(-BREADBOARD_PITCH, 0, 0), 'power');
    this.addTerminal('vout', 'Analog VOUT', new Vector3(0, 0, 0), 'analog');
    this.addTerminal('gnd', 'GND', new Vector3(BREADBOARD_PITCH, 0, 0), 'gnd');
  }

  getVoltage() {
    // Vout = (Temp_C * 0.01) + 0.5V
    return (this.state.temperatureC * 0.01) + 0.5;
  }
}

export class SoilMoistureComponent extends CircuitComponent {
  constructor({ id, position, rotation } = {}) {
    super({ id, name: 'Capacitive Soil Moisture Sensor', type: 'soil-moisture', position, rotation });
    this.state = { moisturePercent: 45.0 };
    this.addTerminal('gnd', 'GND', new Vector3(-BREADBOARD_PITCH, 0, 0), 'gnd');
    this.addTerminal('vcc', 'VCC (3.3-5V)', new Vector3(0, 0, 0), 'power');
    this.addTerminal('aout', 'Analog Out', new Vector3(BREADBOARD_PITCH, 0, 0), 'analog');
  }
}
