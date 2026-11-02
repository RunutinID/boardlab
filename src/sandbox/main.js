import { VirtualCircuitBoard, WIRE_COLORS, breadboardCoord } from '../circuit/index.js';
import { createComponentFromType } from './palette.js';
import { WireToolState, formatEndpointLabel } from './interaction.js';
import { formatVoltageReading, formatPinStateBadge } from './inspector.js';

let boardStage = null;
let vcb = new VirtualCircuitBoard({ boardType: 'uno' });
let isSimRunning = false;
let isWireMode = false;
let selectedPaletteType = null;
let simLoopId = null;

const wireTool = new WireToolState();

// UI Elements
const canvas = document.getElementById('stage-canvas');
const canvasContainer = document.getElementById('canvas-container');
const boardSelect = document.getElementById('board-select');
const btnWireMode = document.getElementById('btn-wire-mode');
const btnRunSim = document.getElementById('btn-run-sim');
const btnClear = document.getElementById('btn-clear');
const paletteItems = document.querySelectorAll('.palette-item');
const inspSimStatus = document.getElementById('insp-sim-status');
const inspCompCount = document.getElementById('insp-comp-count');
const inspWireCount = document.getElementById('insp-wire-count');
const inspVcc = document.getElementById('insp-vcc');
const instructions = document.getElementById('instructions');
const probeD13 = document.getElementById('probe-d13');
const ctrlPot = document.getElementById('ctrl-pot');
const potValText = document.getElementById('pot-val-text');
const ctrlDist = document.getElementById('ctrl-dist');
const distValText = document.getElementById('dist-val-text');

async function initStage() {
  const { BoardStage } = await import('../stage.js');
  boardStage = new BoardStage(canvas, canvasContainer, {
    onHover: (part, point) => {
      // Hover feedback
    }
  });

  // Start with clean board
  await boardStage.setLesson('board');
  updateInspector();
}

function updateInspector() {
  inspCompCount.textContent = vcb.getComponents().length;
  inspWireCount.textContent = vcb.getWires().length;
  inspVcc.textContent = vcb.boardType === 'esp32' ? '3.3 V' : '5.0 V';
  inspSimStatus.textContent = isSimRunning ? 'BERJALAN' : 'BERHENTI';
  inspSimStatus.style.color = isSimRunning ? '#4ade80' : '#f87171';

  // Live probe on D13
  const d13Voltage = vcb.simulator.getPinVoltage('D13');
  const d13State = formatPinStateBadge(vcb.simulator.pins.get('D13'));
  probeD13.textContent = `${formatVoltageReading(d13Voltage)} (${d13State.level ? 'HIGH' : 'LOW'})`;
  probeD13.style.color = d13State.color;
}

function setupEventListeners() {
  // 1. Board Switcher
  boardSelect.addEventListener('change', async (e) => {
    const newBoard = e.target.value;
    vcb = new VirtualCircuitBoard({ boardType: newBoard });
    wireTool.cancel();
    if (boardStage) {
      await boardStage.setLesson('board');
    }
    updateInspector();
  });

  // 2. Palette Selection
  paletteItems.forEach(item => {
    item.addEventListener('click', () => {
      const type = item.getAttribute('data-type');
      if (selectedPaletteType === type) {
        selectedPaletteType = null;
        item.classList.remove('is-selected');
        instructions.innerHTML = '💡 <b>Cara Merakit:</b> Pilih komponen di sidebar kiri lalu klik pada baris breadboard.';
      } else {
        paletteItems.forEach(i => i.classList.remove('is-selected'));
        item.classList.add('is-selected');
        selectedPaletteType = type;
        isWireMode = false;
        wireTool.cancel();
        btnWireMode.textContent = '🔗 Mode Kabel: OFF';
        btnWireMode.classList.remove('btn-primary');
        instructions.innerHTML = `📍 Klik di lubang breadboard untuk menempatkan <b>${item.querySelector('.palette-label').textContent}</b>.`;
      }
    });
  });

  // 3. Wire Mode Toggle
  btnWireMode.addEventListener('click', () => {
    isWireMode = !isWireMode;
    wireTool.cancel();
    if (isWireMode) {
      selectedPaletteType = null;
      paletteItems.forEach(i => i.classList.remove('is-selected'));
      btnWireMode.textContent = '🔗 Mode Kabel: ON';
      btnWireMode.classList.add('btn-primary');
      instructions.innerHTML = '🔌 <b>Mode Kabel Aktif:</b> Klik pin pertama (misal: D13 / 5V / Breadboard), lalu klik pin kedua untuk menyambung kawat.';
    } else {
      btnWireMode.textContent = '🔗 Mode Kabel: OFF';
      btnWireMode.classList.remove('btn-primary');
      instructions.innerHTML = '💡 <b>Cara Merakit:</b> Pilih komponen di sidebar kiri lalu klik pada baris breadboard.';
    }
  });

  // 4. Run / Pause Simulation Toggle
  btnRunSim.addEventListener('click', () => {
    isSimRunning = !isSimRunning;
    if (isSimRunning) {
      btnRunSim.textContent = '⏸ Jeda Sirkuit';
      btnRunSim.style.background = '#eab308';
      // Demo blink on D13 while running
      vcb.setPinMode('D13', 'OUTPUT');
      startSimulationLoop();
    } else {
      btnRunSim.textContent = '▶ Jalankan Sirkuit';
      btnRunSim.style.background = '#3fae6a';
      vcb.digitalWrite('D13', 0);
      stopSimulationLoop();
    }
    updateInspector();
  });

  // 5. Clear Board
  btnClear.addEventListener('click', async () => {
    vcb = new VirtualCircuitBoard({ boardType: boardSelect.value });
    wireTool.cancel();
    if (boardStage) {
      await boardStage.setLesson('board');
    }
    updateInspector();
    instructions.innerHTML = '🧹 Papan sirkuit telah dibersihkan.';
  });

  // 6. Interactive Potentiometer Slider
  ctrlPot.addEventListener('input', (e) => {
    const val = Number(e.target.value);
    const voltage = ((val / 1023) * (vcb.boardType === 'esp32' ? 3.3 : 5.0)).toFixed(2);
    potValText.textContent = `${val} (${voltage}V)`;
    // Update any potentiometer components in VCB
    for (const comp of vcb.getComponents()) {
      if (comp.type === 'potentiometer') {
        comp.applyState({ value: val });
      }
    }
  });

  // 7. Interactive Distance Slider
  ctrlDist.addEventListener('input', (e) => {
    const val = Number(e.target.value);
    distValText.textContent = `${val} cm`;
    for (const comp of vcb.getComponents()) {
      if (comp.type === 'ultrasonic') {
        comp.applyState({ distanceCm: val });
      }
    }
  });

  // 8. Canvas Click Interaction (Place component or connect wire)
  canvas.addEventListener('click', (e) => {
    if (isWireMode) {
      const commonPins = ['D13', 'GND', '5V', 'A0', 'D2', 'D9'];
      const targetPin = commonPins[Math.floor(Math.random() * commonPins.length)];

      if (!wireTool.isConnecting()) {
        wireTool.selectPoint(targetPin);
        instructions.innerHTML = `🔌 Titik asal <b>${formatEndpointLabel(targetPin)}</b> dipilih. Klik titik kedua...`;
      } else {
        const result = wireTool.selectPoint(targetPin);
        if (result && result.from !== result.to) {
          vcb.wire(result.from, result.to, { color: WIRE_COLORS.orange });
          updateInspector();
          instructions.innerHTML = `✨ Kawat jumper berhasil tersambung antara <b>${formatEndpointLabel(result.from)}</b> dan <b>${formatEndpointLabel(result.to)}</b>!`;
        }
      }
      return;
    }

    if (!selectedPaletteType) return;
    const comp = createComponentFromType(selectedPaletteType);
    if (!comp) return;

    const rowLetters = ['b', 'c', 'd', 'e', 'f', 'g'];
    const randomRow = rowLetters[Math.floor(Math.random() * rowLetters.length)];
    const randomCol = Math.floor(Math.random() * 15) + 5;

    vcb.add(comp, { col: randomCol, row: randomRow });
    updateInspector();

    selectedPaletteType = null;
    paletteItems.forEach(i => i.classList.remove('is-selected'));
    instructions.innerHTML = `✅ <b>${comp.name}</b> berhasil ditempatkan di Kolom ${randomCol}, Baris ${randomRow.toUpperCase()}.`;
  });
}

function startSimulationLoop() {
  let lastTime = performance.now();
  let blinkTimer = 0;
  let d13Val = 0;

  function loop(now) {
    if (!isSimRunning) return;
    const dt = now - lastTime;
    lastTime = now;

    // Simulate blink heartbeat on D13
    blinkTimer += dt;
    if (blinkTimer > 500) {
      blinkTimer = 0;
      d13Val = 1 - d13Val;
      vcb.digitalWrite('D13', d13Val);
      updateInspector();
    }

    // Step simulator
    vcb.step(dt);

    simLoopId = requestAnimationFrame(loop);
  }
  simLoopId = requestAnimationFrame(loop);
}

function stopSimulationLoop() {
  if (simLoopId) {
    cancelAnimationFrame(simLoopId);
    simLoopId = null;
  }
}

// Bootstrap
initStage().then(() => {
  setupEventListeners();
  console.log('3D Circuit Sandbox initialized successfully.');
});
