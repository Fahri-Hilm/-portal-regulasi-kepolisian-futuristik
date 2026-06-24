/**
 * Detects device capabilities and returns performance tier
 * Used for adaptive rendering and feature toggling
 */

export type DeviceTier = 'high-end' | 'mid-range' | 'low-end';

interface DeviceInfo {
  tier: DeviceTier;
  isLowEnd: boolean;
  isMidRange: boolean;
  isHighEnd: boolean;
  ram: number; // GB
  cores: number;
  connectionType: 'wifi' | '4g' | '3g' | 'unknown';
  isSlowNetwork: boolean;
  isPointerCoarse: boolean; // touch device
}

function getDeviceTier(): DeviceTier {
  // Check RAM via Performance API (if available)
  const ram = (navigator as any).deviceMemory || 4; // default 4GB

  // Check CPU cores
  const cores = navigator.hardwareConcurrency || 4; // default 4

  // Check connection type
  const connection = (navigator as any).connection;
  const effectiveType = connection?.effectiveType || '4g'; // '4g', '3g', '2g', 'slow-4g'
  const isSlowConnection = effectiveType === '3g' || effectiveType === '2g' || effectiveType === 'slow-4g';

  // Determine tier
  if (ram < 2 || cores < 2 || isSlowConnection) {
    return 'low-end';
  } else if (ram < 4 || cores < 4) {
    return 'mid-range';
  }
  return 'high-end';
}

function getConnectionType(): 'wifi' | '4g' | '3g' | 'unknown' {
  const connection = (navigator as any).connection;
  if (!connection) return 'unknown';

  const type = connection.type || connection.effectiveType;
  if (type === 'wifi' || type === '4g') return '4g';
  if (type === '3g' || type === '2g' || type === 'slow-4g') return '3g';
  return 'unknown';
}

export function useDeviceCapability(): DeviceInfo {
  const ram = (navigator as any).deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const connectionType = getConnectionType();
  const tier = getDeviceTier();
  const isSlowNetwork = connectionType === '3g' || connectionType === 'unknown';
  const isPointerCoarse = window.matchMedia('(pointer: coarse)').matches;

  return {
    tier,
    isLowEnd: tier === 'low-end',
    isMidRange: tier === 'mid-range',
    isHighEnd: tier === 'high-end',
    ram,
    cores,
    connectionType,
    isSlowNetwork,
    isPointerCoarse,
  };
}

// Cache device info to avoid recalculation
let cachedDeviceInfo: DeviceInfo | null = null;

export function getCachedDeviceCapability(): DeviceInfo {
  if (!cachedDeviceInfo) {
    cachedDeviceInfo = useDeviceCapability();
  }
  return cachedDeviceInfo;
}
