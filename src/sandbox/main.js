import { VirtualCircuitBoard, WIRE_COLORS, breadboardCoord } from '../circuit/index.js';
import { createComponentFromType } from './palette.js';

let boardStage = null;
let vcb = new VirtualCircuitBoard({ boardType: 'uno' });
let isSimRunning = false;
let isWireMode = false;
let selectedPaletteType = null;
let wireStartPoint = null;
let simLoopId = null;

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

async function initStage() {
  const { BoardStage } = await import('../stage.js');
  boardStage = new BoardStage(canvas, canvasContainer, {
    onHover: (part, point) => {
      // Handle hover highlight if needed
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
}

function setupEventListeners() {
  // 1. Board Switcher
  boardSelect.addEventListener('change', async (e) => {
    const newBoard = e.target.value;
    vcb = new VirtualCircuitBoard({ boardType: newBoard });
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
        // Deselect
        selectedPaletteType = null;
        item.classList.remove('is-selected');
        instructions.innerHTML = '💡 <b>Cara Merakit:</b> Pilih komponen di sidebar kiri lalu klik pada baris breadboard.';
      } else {
        paletteItems.forEach(i => i.classList.remove('is-selected'));
        item.classList.add('is-selected');
        selectedPaletteType = type;
        isWireMode = false;
        btnWireMode.textContent = '🔗 Mode Kabel: OFF';
        btnWireMode.classList.remove('btn-primary');
        instructions.innerHTML = `📍 Klik di lubang breadboard untuk menempatkan <b>${item.querySelector('.palette-label').textContent}</b>.`;
      }
    });
  });

  // 3. Wire Mode Toggle
  btnWireMode.addEventListener('click', () => {
    isWireMode = !isWireMode;
    wireStartPoint = null;
    if (isWireMode) {
      selectedPaletteType = null;
      paletteItems.forEach(i => i.classList.remove('is-selected'));
      btnWireMode.textContent = '🔗 Mode Kabel: ON';
      btnWireMode.classList.add('btn-primary');
      instructions.innerHTML = '🔌 <b>Mode Kabel:</b> Klik pin pertama (asal), lalu klik pin kedua (tujuan) untuk menyambung.';
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
      startSimulationLoop();
    } else {
      btnRunSim.textContent = '▶ Jalankan Sirkuit';
      btnRunSim.style.background = '#3fae6a';
      stopSimulationLoop();
    }
    updateInspector();
  });

  // 5. Clear Board
  btnClear.addEventListener('click', async () => {
    vcb = new VirtualCircuitBoard({ boardType: boardSelect.value });
    wireStartPoint = null;
    if (boardStage) {
      await boardStage.setLesson('board');
    }
    updateInspector();
  });

  // 6. Canvas Click to Place Component
  canvas.addEventListener('click', (e) => {
    if (!selectedPaletteType) return;
    const comp = createComponentFromType(selectedPaletteType);
    if (!comp) return;

    // Default to placing at row 12 col c or random row for demonstration
    const rowLetters = ['b', 'c', 'd', 'e', 'f', 'g'];
    const randomRow = rowLetters[Math.floor(Math.random() * rowLetters.length)];
    const randomCol = Math.floor(Math.random() * 15) + 5;

    vcb.add(comp, { col: randomCol, row: randomRow });
    updateInspector();

    // Reset selection after placement
    selectedPaletteType = null;
    paletteItems.forEach(i => i.classList.remove('is-selected'));
    instructions.innerHTML = `✅ <b>${comp.name}</b> berhasil ditempatkan di Kolom ${randomCol}, Baris ${randomRow.toUpperCase()}.`;
  });
}

function startSimulationLoop() {
  let lastTime = performance.now();
  function loop(now) {
    if (!isSimRunning) return;
    const dt = now - lastTime;
    lastTime = now;

    // Step the circuit simulator
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
