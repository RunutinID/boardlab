# Standalone 3D Circuit Library & Custom Sandbox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the 25+ electronic components, breadboard grid, parametric jumper wires, and simulation engine into a clean, reusable standalone 3D circuit library (`src/circuit/`), and use it to build a Custom Circuit Sandbox (`sandbox.html`) where users can assemble arbitrary electronic circuits in 3D.

**Architecture:** 
1. Decouple the monolithic Three.js rendering code and lesson definitions in `src/kit.js` and `src/stage.js` into modular layers: Grid & Pinout mapping (`grid.js`), Jumper Wire spline generator (`wire.js`), Component definitions (`components/`), and Netlist Simulator (`simulator.js`).
2. Provide a clean high-level OOP facade `VirtualCircuitBoard` in `src/circuit/index.js` that any Three.js project can import.
3. Build `sandbox.html` on top of `VirtualCircuitBoard` with an interactive component palette, click-to-wire routing, and live simulation controls.

**Tech Stack:** JavaScript (ES Modules), Three.js, Vite, Web Audio API, HTML5 Canvas.

**Spec:** [reverse_engineering_electronics.md](file:///C:/Users/FIRDAUS/.gemini/antigravity/brain/49f8efaa-2621-43e6-998f-816c05b46265/reverse_engineering_electronics.md)

## Global Constraints
- Target Git branch: all changes must be developed and committed on branch `experiment`. Never modify or merge into `main`.
- Must preserve existing functionality of `index.html` (Uno lessons) and `esp32.html` (ESP32 lessons).
- Vite build (`pnpm run build`) and Cloudflare deployment (`npx wrangler deploy --dry-run`) must pass without errors.
- Cross-compatible Node/Vite path resolution (avoid `import.meta.dirname` syntax that breaks older Wrangler/bundler parsers).

## Review Focus
1. **Breadboard Coordinate Accuracy:** Components placed at breadboard coordinates (e.g. `row 12, col c`) must align with pin spacing (2.54 mm pitch).
2. **Wire Terminal Snapping:** Jumper wire start and end points must accurately connect header pins and breadboard sockets without floating in air.
3. **Simulation Stability:** Running or pausing simulation on circuits with circular or unconnected nets must not crash the tick loop or audio synthesizer.
4. **Multi-Board Support:** Grid system must support both Arduino Uno R3 and ESP32 DevKit pinouts without hardcoding.
5. **Memory & Cleanup:** Re-creating or deleting parts in the sandbox must dispose Three.js geometries and materials to avoid WebGL memory leaks.

---

### Task 1: Environment & Cloudflare Build Guard on `experiment`

**Files:**
- Create: `wrangler.jsonc`
- Modify: `vite.config.js`
- Modify: `package.json`

**Interfaces:**
- Produces: Reliable Vite multi-page build (`index.html`, `esp32.html`) and zero-error Wrangler deploy command in CI.

- [ ] **Step 1: Verify current git branch is `experiment`**
  Run: `git branch --show-current`
  Expected: `experiment`

- [ ] **Step 2: Create `wrangler.jsonc` with static assets configuration**
  Path: `wrangler.jsonc`
  Ensure `assets.directory` is `./dist` and `not_found_handling` is `"single-page-application"`.

- [ ] **Step 3: Update `vite.config.js` path resolution**
  Replace `resolve(import.meta.dirname, ...)` with standard cross-compatible `fileURLToPath(new URL('...', import.meta.url))` to ensure Wrangler AST parser compatibility.

- [ ] **Step 4: Run build & dry-run deploy verification**
  Run: `pnpm run build && npx wrangler deploy --dry-run`
  Expected: Exit code 0, outputs `index.html` and `esp32.html`.

- [ ] **Step 5: Commit build guard to `experiment`**
  ```bash
  git add wrangler.jsonc vite.config.js package.json pnpm-lock.yaml
  git commit -m "fix(deploy): configure wrangler.jsonc and safe path resolution on experiment branch"
  ```

---

### Task 2: Breadboard & Pin Grid Coordinate Engine (`src/circuit/grid.js`)

**Files:**
- Create: `src/circuit/grid.js`
- Create: `tests/grid.test.js`

**Interfaces:**
- Produces:
  - `breadboardCoord(row: number, col: string): THREE.Vector3`
  - `getBoardPinCoord(boardType: 'uno' | 'esp32', pinName: string): THREE.Vector3`
  - `BREADBOARD_PITCH: 2.54`

- [ ] **Step 1: Write test for breadboard and board pin coordinate mappings**
  Create `tests/grid.test.js` checking that row 1 to 30 and col 'a' to 'j' produce expected 2.54mm pitch offsets and valid Arduino/ESP32 pin coordinates.

- [ ] **Step 2: Run test to verify it fails**
  Run: `node tests/grid.test.js`
  Expected: FAIL (cannot find module `src/circuit/grid.js`).

- [ ] **Step 3: Implement `src/circuit/grid.js`**
  Extract breadboard coordinate transforms and pin registry from `stage.js` and `esp32-stage.js`.

- [ ] **Step 4: Run test to verify it passes**
  Run: `node tests/grid.test.js`
  Expected: PASS.

- [ ] **Step 5: Commit**
  ```bash
  git add src/circuit/grid.js tests/grid.test.js
  git commit -m "feat(circuit): add modular breadboard and pin coordinate system"
  ```

---

### Task 3: Parametric Jumper Wire Generator (`src/circuit/wire.js`)

**Files:**
- Create: `src/circuit/wire.js`
- Test: `tests/wire.test.js`

**Interfaces:**
- Produces:
  - `createJumperWire(options: WireOptions): THREE.Group`
  - `WireOptions`: `{ id: string, from: Vector3 | string, to: Vector3 | string, color: string, arch?: number, lean?: number, signal?: SignalConfig }`
  - `updateWireSignal(wireGroup: THREE.Group, active: boolean, time: number): void`

- [ ] **Step 1: Write test for jumper wire geometry generation**
  Create `tests/wire.test.js` verifying wire spline creation, length, and curve vertices.

- [ ] **Step 2: Run test to verify it fails**
  Run: `node tests/wire.test.js`
  Expected: FAIL.

- [ ] **Step 3: Implement `src/circuit/wire.js`**
  Extract Catmull-Rom spline tube generation, end-cap pins, and current-flow pulse shaders from `stage.js`.

- [ ] **Step 4: Run test to verify it passes**
  Run: `node tests/wire.test.js`
  Expected: PASS.

- [ ] **Step 5: Commit**
  ```bash
  git add src/circuit/wire.js tests/wire.test.js
  git commit -m "feat(circuit): add parametric 3D jumper wire generator with signal flow"
  ```

---

### Task 4: Modular Electronic Components Catalog (`src/circuit/components/`)

**Files:**
- Create: `src/circuit/components/base.js`
- Create: `src/circuit/components/passives.js` (Resistors 220Ω, 1k, 10k, Potentiometer, LDR, FSR)
- Create: `src/circuit/components/outputs.js` (LED 5mm, RGB LED, Traffic Light, Buzzer)
- Create: `src/circuit/components/sensors.js` (HC-SR04, TMP36, Capacitive Soil)
- Create: `src/circuit/components/actuators.js` (TIP120, DC Motor, SG90 Servo, 28BYJ Stepper + ULN2003)
- Create: `src/circuit/components/displays.js` (0.96" I2C OLED SSD1306)
- Test: `tests/components.test.js`

**Interfaces:**
- Produces: Standardized Component Classes inheriting from `CircuitComponent`:
  - `component.getTerminals(): TerminalInfo[]`
  - `component.buildMesh(): THREE.Group`
  - `component.applyState(state: Object): void`
  - `component.dispose(): void`

- [ ] **Step 1: Write test verifying component instantiation and terminal metadata**
  Create `tests/components.test.js` verifying each component exports correct pins, default values, and bounding metadata.

- [ ] **Step 2: Run test to verify it fails**
  Run: `node tests/components.test.js`
  Expected: FAIL.

- [ ] **Step 3: Implement component classes in `src/circuit/components/`**
  Extract 3D procedural meshes from `src/kit.js` and wrap them in standardized clean ES modules.

- [ ] **Step 4: Run test to verify it passes**
  Run: `node tests/components.test.js`
  Expected: PASS.

- [ ] **Step 5: Commit**
  ```bash
  git add src/circuit/components/ tests/components.test.js
  git commit -m "feat(circuit): add modular 3D electronic components catalog"
  ```

---

### Task 5: Netlist & Circuit Simulation Engine (`src/circuit/simulator.js`)

**Files:**
- Create: `src/circuit/simulator.js`
- Test: `tests/simulator.test.js`

**Interfaces:**
- Produces:
  - `CircuitSimulator` class
  - `simulator.connect(terminalA, terminalB)`
  - `simulator.setPinMode(pin, mode)`
  - `simulator.digitalWrite(pin, value)`
  - `simulator.analogWrite(pin, dutyCycle)`
  - `simulator.analogRead(pin): number`
  - `simulator.step(deltaTime): SimulationState`

- [ ] **Step 1: Write unit tests for netlist node resolution and voltage propagation**
  Test LED lighting up when D13 is HIGH and resistor is in series to GND.

- [ ] **Step 2: Run test to verify it fails**
  Run: `node tests/simulator.test.js`
  Expected: FAIL.

- [ ] **Step 3: Implement `CircuitSimulator`**
  Netlist graph solver calculating nodal connections between breadboard rows, components, and controller pins.

- [ ] **Step 4: Run test to verify it passes**
  Run: `node tests/simulator.test.js`
  Expected: PASS.

- [ ] **Step 5: Commit**
  ```bash
  git add src/circuit/simulator.js tests/simulator.test.js
  git commit -m "feat(circuit): add netlist simulation engine"
  ```

---

### Task 6: VirtualCircuitBoard Standalone Library Facade (`src/circuit/index.js`)

**Files:**
- Create: `src/circuit/index.js`
- Create: `src/circuit/VirtualCircuitBoard.js`
- Test: `tests/circuit-library.test.js`

**Interfaces:**
- Produces: Main public entry point of the standalone library:
  ```javascript
  import { VirtualCircuitBoard, Resistor, LED, HCSR04, ServoSG90 } from './src/circuit';
  ```

- [ ] **Step 1: Write integration test for VirtualCircuitBoard API**
  Verify adding components, connecting wires, and stepping simulation via unified API.

- [ ] **Step 2: Run test to verify it fails**
  Run: `node tests/circuit-library.test.js`
  Expected: FAIL.

- [ ] **Step 3: Implement `VirtualCircuitBoard`**
  Encapsulate Three.js scene, camera, lights, controls, breadboard, components, and simulator loop into a single clean class.

- [ ] **Step 4: Run test to verify it passes**
  Run: `node tests/circuit-library.test.js`
  Expected: PASS.

- [ ] **Step 5: Commit**
  ```bash
  git add src/circuit/ tests/circuit-library.test.js
  git commit -m "feat(circuit): export VirtualCircuitBoard standalone 3D electronics library"
  ```

---

### Task 7: Custom Circuit Sandbox Page (`sandbox.html` & `src/sandbox/`)

**Files:**
- Create: `sandbox.html`
- Create: `src/sandbox/main.js`
- Create: `src/sandbox/palette.js`
- Modify: `vite.config.js` (add sandbox entry point)

**Interfaces:**
- Produces: Interactive web application allowing freeform circuit prototyping.

- [ ] **Step 1: Add sandbox entry point to `vite.config.js`**
  Register `sandbox: resolve(__dirname, 'sandbox.html')` in `rollupOptions.input`.

- [ ] **Step 2: Create `sandbox.html` shell with UI toolbar & 3D viewport canvas**
  Add header, board selector (Arduino Uno / ESP32), component sidebar palette, and run/pause buttons.

- [ ] **Step 3: Implement `src/sandbox/palette.js` and `src/sandbox/main.js`**
  Connect UI component selection to `VirtualCircuitBoard.addComponent()` and interactive placement.

- [ ] **Step 4: Run Vite build to verify multi-page bundling**
  Run: `pnpm run build`
  Expected: `dist/index.html`, `dist/esp32.html`, and `dist/sandbox.html` generated without errors.

- [ ] **Step 5: Commit**
  ```bash
  git add sandbox.html src/sandbox/ vite.config.js
  git commit -m "feat(sandbox): scaffold Custom Circuit Sandbox interface"
  ```

---

### Task 8: Interactive Click-to-Wire & Component Manipulation

**Files:**
- Create: `src/sandbox/interaction.js`
- Modify: `src/sandbox/main.js`

**Interfaces:**
- Produces:
  - Raycaster click detection on breadboard tie-points and header pins.
  - Interactive wire dragging (click pin A -> rubberband preview wire -> click pin B).
  - Component deletion & parameter adjustment.

- [ ] **Step 1: Implement raycast snapping on breadboard holes**
  Highlight breadboard row when hovering over it.

- [ ] **Step 2: Implement wire creation interaction**
  On click pin A, start drawing wire; on click pin B, create permanent wire in `VirtualCircuitBoard`.

- [ ] **Step 3: Test interaction in browser preview**
  Verify wire connects accurately and updates netlist.

- [ ] **Step 4: Commit**
  ```bash
  git add src/sandbox/interaction.js src/sandbox/main.js
  git commit -m "feat(sandbox): add interactive click-to-wire and component placement"
  ```

---

### Task 9: Sandbox Simulation Controls & Live Inspector

**Files:**
- Create: `src/sandbox/inspector.js`
- Modify: `src/sandbox/main.js`

**Interfaces:**
- Produces:
  - Live tooltip showing voltage/state (e.g. `5.0V`, `0.0V (GND)`, `PWM 128 (50%)`) on wires.
  - Interactive actuators (potentiometer knob rotation, push button press, obstacle distance slider).

- [ ] **Step 1: Implement real-time pin hover probe**
  Display floating badge with pin name, electrical net, and current logic level.

- [ ] **Step 2: Add interactive controls panel**
  Allow adjusting potentiometer value, distance slider for ultrasonic sensor, and pressing buttons to see real-time circuit response.

- [ ] **Step 3: Run full verification build**
  Run: `pnpm run build && npx wrangler deploy --dry-run`
  Expected: Clean build with all 3 pages (`index`, `esp32`, `sandbox`), exits 0.

- [ ] **Step 4: Commit**
  ```bash
  git add src/sandbox/inspector.js src/sandbox/main.js
  git commit -m "feat(sandbox): add real-time circuit inspection and interactive controls"
  ```

