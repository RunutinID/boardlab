import { Vector3 } from '../grid.js';

/**
 * Base CircuitComponent class
 */
export class CircuitComponent {
  constructor({ id, name, type = 'generic', position = new Vector3(), rotation = [0, 0, 0] }) {
    this.id = id || `${type}-${Math.random().toString(36).substring(2, 8)}`;
    this.name = name || type;
    this.type = type;
    this.position = position instanceof Vector3 ? position : new Vector3(position.x, position.y, position.z);
    this.rotation = [...rotation];
    this.terminals = [];
    this.state = {};
    this.mesh = null;
  }

  addTerminal(id, name, offset = new Vector3(), pinType = 'io') {
    this.terminals.push({
      id,
      name,
      offset: offset instanceof Vector3 ? offset : new Vector3(offset.x, offset.y, offset.z),
      pinType
    });
  }

  getTerminal(terminalId) {
    return this.terminals.find(t => t.id === terminalId) || null;
  }

  getTerminalWorldCoord(terminalId) {
    const term = this.getTerminal(terminalId);
    if (!term) return null;
    return new Vector3(
      this.position.x + term.offset.x,
      this.position.y + term.offset.y,
      this.position.z + term.offset.z
    );
  }

  applyState(newState) {
    Object.assign(this.state, newState);
  }

  build3DMesh(kitModule) {
    return null;
  }

  dispose() {
    if (this.mesh && typeof this.mesh.traverse === 'function') {
      this.mesh.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      this.mesh = null;
    }
  }
}

