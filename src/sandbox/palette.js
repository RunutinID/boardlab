import {
  ResistorComponent,
  PotentiometerComponent,
  PushButtonComponent,
  LDRComponent,
  LEDComponent,
  RGBLEDComponent,
  BuzzerComponent,
  OLEDDisplayComponent,
  UltrasonicHCSR04Component,
  TMP36Component,
  ServoSG90Component,
  DCMotorComponent
} from '../circuit/index.js';

export function createComponentFromType(type) {
  switch (type) {
    case 'resistor-220':
      return new ResistorComponent({ ohms: 220 });
    case 'resistor-10k':
      return new ResistorComponent({ ohms: 10000 });
    case 'potentiometer':
      return new PotentiometerComponent({ ohms: 10000 });
    case 'button':
      return new PushButtonComponent();
    case 'ldr':
      return new LDRComponent();
    case 'led-red':
      return new LEDComponent({ color: 'red' });
    case 'led-green':
      return new LEDComponent({ color: 'green' });
    case 'led-blue':
      return new LEDComponent({ color: 'blue' });
    case 'rgb-led':
      return new RGBLEDComponent();
    case 'buzzer':
      return new BuzzerComponent();
    case 'oled':
      return new OLEDDisplayComponent();
    case 'ultrasonic':
      return new UltrasonicHCSR04Component();
    case 'tmp36':
      return new TMP36Component();
    case 'servo':
      return new ServoSG90Component();
    case 'dc-motor':
      return new DCMotorComponent();
    default:
      return null;
  }
}

