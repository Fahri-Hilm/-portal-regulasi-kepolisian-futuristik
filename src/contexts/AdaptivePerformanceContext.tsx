import React, { createContext, useContext, useMemo } from 'react';
import { getCachedDeviceCapability, DeviceTier } from '../hooks/useDeviceCapability';

interface PerformanceConfig {
  // Animation
  enableAnimations: boolean;
  enableGlitch: boolean;
  enableShimmer: boolean;
  enableFloat: boolean;
  enableScanlines: boolean;
  scanlineOpacity: number;
  animationDuration: number; // ms

  // Video
  enableVideoBackground: boolean;
  videoQuality: 'high' | 'medium' | 'low';
  lazyLoadVideo: boolean;

  // Charts
  enableChartAnimations: boolean;
  reduceChartUpdates: boolean;

  // Rendering
  enableLazyLoading: boolean;
  enableVirtualization: boolean;
  reducedMotion: boolean;

  // Network
  useWebP: boolean;
  compressImages: boolean;
}

interface AdaptivePerformanceContextType {
  tier: DeviceTier;
  config: PerformanceConfig;
  isLowEnd: boolean;
  isMidRange: boolean;
  isHighEnd: boolean;
}

const AdaptivePerformanceContext = createContext<AdaptivePerformanceContextType | null>(null);

const CONFIG_MAP: Record<DeviceTier, PerformanceConfig> = {
  'high-end': {
    enableAnimations: true,
    enableGlitch: true,
    enableShimmer: true,
    enableFloat: true,
    enableScanlines: true,
    scanlineOpacity: 70,
    animationDuration: 150,
    enableVideoBackground: true,
    videoQuality: 'high',
    lazyLoadVideo: false,
    enableChartAnimations: true,
    reduceChartUpdates: false,
    enableLazyLoading: true,
    enableVirtualization: false,
    reducedMotion: false,
    useWebP: true,
    compressImages: false,
  },
  'mid-range': {
    enableAnimations: true,
    enableGlitch: false,
    enableShimmer: true,
    enableFloat: true,
    enableScanlines: true,
    scanlineOpacity: 50,
    animationDuration: 150,
    enableVideoBackground: true,
    videoQuality: 'medium',
    lazyLoadVideo: true,
    enableChartAnimations: true,
    reduceChartUpdates: true,
    enableLazyLoading: true,
    enableVirtualization: true,
    reducedMotion: false,
    useWebP: true,
    compressImages: true,
  },
  'low-end': {
    enableAnimations: false,
    enableGlitch: false,
    enableShimmer: false,
    enableFloat: false,
    enableScanlines: true,
    scanlineOpacity: 30,
    animationDuration: 0, // no animations
    enableVideoBackground: false,
    videoQuality: 'low',
    lazyLoadVideo: true,
    enableChartAnimations: false,
    reduceChartUpdates: true,
    enableLazyLoading: true,
    enableVirtualization: true,
    reducedMotion: true,
    useWebP: false,
    compressImages: true,
  },
};

interface AdaptivePerformanceProviderProps {
  children: React.ReactNode;
}

export function AdaptivePerformanceProvider({ children }: AdaptivePerformanceProviderProps) {
  const deviceCapability = useMemo(() => getCachedDeviceCapability(), []);
  const tier = deviceCapability.tier;

  // Check system-level reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const config: PerformanceConfig = useMemo(() => {
    const baseConfig = CONFIG_MAP[tier];
    return {
      ...baseConfig,
      reducedMotion: prefersReducedMotion || baseConfig.reducedMotion,
      enableAnimations: prefersReducedMotion ? false : baseConfig.enableAnimations,
    };
  }, [tier, prefersReducedMotion]);

  const value: AdaptivePerformanceContextType = {
    tier,
    config,
    isLowEnd: tier === 'low-end',
    isMidRange: tier === 'mid-range',
    isHighEnd: tier === 'high-end',
  };

  return (
    <AdaptivePerformanceContext.Provider value={value}>
      {children}
    </AdaptivePerformanceContext.Provider>
  );
}

export function useAdaptivePerformance(): AdaptivePerformanceContextType {
  const context = useContext(AdaptivePerformanceContext);
  if (!context) {
    throw new Error('useAdaptivePerformance must be used within AdaptivePerformanceProvider');
  }
  return context;
}
