import { useAdaptivePerformance } from '../contexts/AdaptivePerformanceContext';
import { useDeviceCapability } from '../hooks/useDeviceCapability';

/**
 * Optional debug component to display device performance tier
 * Add to App if you need to verify device detection is working correctly
 */
export function PerformanceDebug() {
  const { tier, config } = useAdaptivePerformance();
  const device = useDeviceCapability();

  const isDevMode = import.meta.env.DEV;
  if (!isDevMode) return null; // Only show in development

  return (
    <div className="fixed bottom-4 right-4 z-[9999] text-[8px] font-mono">
      <div className="bg-slate-950/95 border border-cyan-500/40 rounded p-2 max-w-[200px] text-cyan-400 space-y-0.5">
        <div>Tier: <span className="text-yellow-400">{tier}</span></div>
        <div>RAM: {device.ram}GB | Cores: {device.cores}</div>
        <div>Network: <span className={device.isSlowNetwork ? 'text-red-400' : 'text-green-400'}>{device.connectionType}</span></div>
        <hr className="border-cyan-500/20 my-1" />
        <div>Animations: {config.enableAnimations ? '✓' : '✗'}</div>
        <div>Glitch: {config.enableGlitch ? '✓' : '✗'}</div>
        <div>Video: {config.enableVideoBackground ? '✓' : '✗'}</div>
        <div>Scanline: {config.enableScanlines ? '✓' : '✗'}</div>
      </div>
    </div>
  );
}
