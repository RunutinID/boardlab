/**
 * Circuit Probe & Live Voltage Inspector
 */

export function formatVoltageReading(voltage) {
  const v = Number(voltage) || 0;
  if (Math.abs(v) < 0.01) {
    return '0.00 V (GND)';
  }
  return `${v.toFixed(2)} V`;
}

export function formatPinStateBadge(pinState) {
  if (!pinState) {
    return { text: 'DISCONNECTED', level: false, color: '#94a3b8' };
  }

  const mode = pinState.mode || 'INPUT';
  const v = pinState.v || 0;
  const isHigh = v > 1.5;

  return {
    text: `${mode}: ${isHigh ? 'HIGH' : 'LOW'}`,
    level: isHigh,
    color: isHigh ? '#4ade80' : '#94a3b8'
  };
}

export function getCircuitHealthSummary({ componentCount = 0, wireCount = 0, hasPower = true, hasGnd = true }) {
  if (componentCount === 0) {
    return { status: 'EMPTY', message: 'Sirkuit kosong. Silakan tambahkan komponen.' };
  }
  if (!hasPower) {
    return { status: 'NO_POWER', message: 'Peringatan: Sirkuit belum terhubung ke sumber daya (5V / 3.3V).' };
  }
  if (!hasGnd) {
    return { status: 'NO_GND', message: 'Peringatan: Sirkuit belum terhubung ke ground (GND).' };
  }
  return { status: 'OK', message: 'Status Normal. Sirkuit siap disimulasikan.' };
}
