import { CircuitComponent } from './base.js';
import { Vector3, BREADBOARD_PITCH } from '../grid.js';

export class OLEDDisplayComponent extends CircuitComponent {
  constructor({ id, position, rotation } = {}) {
    super({ id, name: '0.96" I2C OLED Display (SSD1306)', type: 'oled', position, rotation });
    this.width = 128;
    this.height = 64;
    this.state = { lines: ['Smart Plant', 'Soil: 45%', 'Status: OK'] };
    // 4 pins: GND, VCC, SCL, SDA
    this.addTerminal('gnd', 'GND', new Vector3(-1.5 * BREADBOARD_PITCH, 0, 0), 'gnd');
    this.addTerminal('vcc', 'VCC (3.3V/5V)', new Vector3(-0.5 * BREADBOARD_PITCH, 0, 0), 'power');
    this.addTerminal('scl', 'SCL (I2C Clock)', new Vector3(0.5 * BREADBOARD_PITCH, 0, 0), 'io');
    this.addTerminal('sda', 'SDA (I2C Data)', new Vector3(1.5 * BREADBOARD_PITCH, 0, 0), 'io');
  }
}
