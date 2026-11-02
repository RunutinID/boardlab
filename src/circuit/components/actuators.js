import { CircuitComponent } from './base.js';
import { Vector3, BREADBOARD_PITCH } from '../grid.js';

export class TransistorTIP120Component extends CircuitComponent {
  constructor({ id, position, rotation } = {}) {
    super({ id, name: 'TIP120 NPN Darlington Power Transistor', type: 'transistor', position, rotation });
    this.state = { conducting: false };
    // TO-220 Pinout: Pin 1 = Base, Pin 2 = Collector, Pin 3 = Emitter
    this.addTerminal('base', 'Base', new Vector3(-BREADBOARD_PITCH, 0, 0), 'io');
    this.addTerminal('collector', 'Collector', new Vector3(0, 0, 0), 'io');
    this.addTerminal('emitter', 'Emitter', new Vector3(BREADBOARD_PITCH, 0, 0), 'gnd');
  }
}

export class DCMotorComponent extends CircuitComponent {
  constructor({ id, position, rotation } = {}) {
    super({ id, name: 'DC Motor with Fan', type: 'dc-motor', position, rotation });
    this.state = { speed: 0, rpm: 0 }; // speed: 0 to 255
    this.addTerminal('pos', 'Positive (+)', new Vector3(-2, 0, 0), 'power');
    this.addTerminal('neg', 'Negative (−)', new Vector3(2, 0, 0), 'io');
  }

  applyState(newState) {
    super.applyState(newState);
    if ('speed' in newState) {
      this.state.rpm = Math.round((this.state.speed / 255) * 6000);
    }
  }
}

export class ServoSG90Component extends CircuitComponent {
  constructor({ id, position, rotation } = {}) {
    super({ id, name: 'SG90 Micro Servo (9g)', type: 'servo', position, rotation });
    this.state = { angle: 0 }; // 0 to 180 degrees
    // 3-pin cable: Brown (GND), Red (5V), Orange (Signal)
    this.addTerminal('gnd', 'GND (Brown)', new Vector3(-BREADBOARD_PITCH, 0, 0), 'gnd');
    this.addTerminal('vcc', '5V Power (Red)', new Vector3(0, 0, 0), 'power');
    this.addTerminal('signal', 'PWM Signal (Orange)', new Vector3(BREADBOARD_PITCH, 0, 0), 'io');
  }

  applyState(newState) {
    super.applyState(newState);
    if ('angle' in newState) {
      this.state.angle = Math.max(0, Math.min(180, newState.angle));
    }
  }
}

export class Stepper28BYJComponent extends CircuitComponent {
  constructor({ id, position, rotation } = {}) {
    super({ id, name: '28BYJ-48 Stepper Motor', type: 'stepper', position, rotation });
    this.state = { steps: 0, angle: 0 };
    this.addTerminal('socket', '5-Pin JST Connector', new Vector3(0, 0, 0), 'io');
  }
}

export class ULN2003DriverComponent extends CircuitComponent {
  constructor({ id, position, rotation } = {}) {
    super({ id, name: 'ULN2003 Stepper Driver Board', type: 'uln2003', position, rotation });
    this.state = { phaseA: false, phaseB: false, phaseC: false, phaseD: false };
    this.addTerminal('in1', 'IN1', new Vector3(-1.5 * BREADBOARD_PITCH, 0, 0), 'io');
    this.addTerminal('in2', 'IN2', new Vector3(-0.5 * BREADBOARD_PITCH, 0, 0), 'io');
    this.addTerminal('in3', 'IN3', new Vector3(0.5 * BREADBOARD_PITCH, 0, 0), 'io');
    this.addTerminal('in4', 'IN4', new Vector3(1.5 * BREADBOARD_PITCH, 0, 0), 'io');
    this.addTerminal('minus', 'Power GND (−)', new Vector3(-2, 0, 4), 'gnd');
    this.addTerminal('plus', 'Power 5V (+)', new Vector3(2, 0, 4), 'power');
  }
}

