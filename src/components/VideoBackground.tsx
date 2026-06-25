import { useEffect, useRef, useState } from 'react';
import { useAdaptivePerformance } from '../contexts/AdaptivePerformanceContext';

interface VideoBackgroundProps {
  src: string;
  fallbackColor?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

export function VideoBackground({ src, fallbackColor = '#000000', 'aria-hidden': ariaHidden }: VideoBackgroundProps) {
  const { config, tier, isLowEnd } = useAdaptivePerformance();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Select video quality based on device tier and network
  const getVideoSource = () => {
    // Low-end: don't even try
    if (isLowEnd) {
      return null;
    }

    // Use the primary optimized video source directly.
    // Avoid requesting non-existent _LOW.mp4 or _MEDIUM.mp4 files which cause 404 HTML rewrites.
    return src;
  };

  const videoSource = getVideoSource();
  const shouldLoadVideo = videoSource !== null && config.enableVideoBackground;

  useEffect(() => {
    if (!shouldLoadVideo) {
      setVideoError(true);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsVideoLoaded(true);
      video.play().catch(() => {
        console.log('Video autoplay failed (likely browser policy)');
      });
    };

    const handleError = () => {
      setVideoError(true);
      console.warn('Video background failed to load, falling back to static background');
    };

    const handleLoadStart = () => {
      console.log(`[Video] Loading ${config.videoQuality} quality: ${videoSource}`);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);

    // Defer video load until after first paint to improve FCP/LCP
    const loadVideo = () => video.load();
    if (config.lazyLoadVideo === false) {
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(loadVideo, { timeout: 2000 });
      } else {
        setTimeout(loadVideo, 150);
      }
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, [shouldLoadVideo, videoSource, config.enableVideoBackground, config.lazyLoadVideo]);

  // Lazy-load video on user interaction (for mid-range devices)
  useEffect(() => {
    if (!config.lazyLoadVideo || isVideoLoaded || videoError || !shouldLoadVideo) return;

    const handleFirstInteraction = () => {
      const video = videoRef.current;
      if (video) {
        console.log('[Video] First interaction detected, loading...');
        video.load();
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [config.lazyLoadVideo, isVideoLoaded, videoError, shouldLoadVideo]);

  // Fallback: static dark background for low-end or on error
  if (!shouldLoadVideo || videoError) {
    return (
      <div
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor: fallbackColor }}
        aria-hidden={ariaHidden}
      />
    );
  }

  const preloadStrategy = config.lazyLoadVideo ? 'none' : 'metadata';

  return (
    <>
      {/* Video Background - tries primary, then fallback quality */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isVideoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          contain: 'strict',
        }}
        preload={preloadStrategy}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden={ariaHidden}
      >
        {/* Primary source: quality-specific */}
        <source src={videoSource} type="video/mp4" />
        {/* Fallback: original if quality-specific fails */}
        {videoSource !== src && <source src={src} type="video/mp4" />}
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 w-full h-full bg-black/80" />

      {/* Cyber Grid Overlay */}
      {config.enableScanlines && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(0, 255, 200, ${config.scanlineOpacity / 100}) 25%, rgba(0, 255, 200, ${config.scanlineOpacity / 100}) 26%, transparent 27%, transparent 74%, rgba(0, 255, 200, ${config.scanlineOpacity / 100}) 75%, rgba(0, 255, 200, ${config.scanlineOpacity / 100}) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(0, 255, 200, ${config.scanlineOpacity / 100}) 25%, rgba(0, 255, 200, ${config.scanlineOpacity / 100}) 26%, transparent 27%, transparent 74%, rgba(0, 255, 200, ${config.scanlineOpacity / 100}) 75%, rgba(0, 255, 200, ${config.scanlineOpacity / 100}) 76%, transparent 77%, transparent)
            `,
            backgroundSize: '50px 50px',
            opacity: 0.03,
          }}
        />
      )}

      {/* Debug info (dev mode only) */}
      {import.meta.env.DEV && false && (
        <div
          className="absolute bottom-2 right-2 text-[8px] font-mono text-cyan-400 bg-black/60 px-2 py-1 rounded pointer-events-none"
          style={{ zIndex: 9998 }}
        >
          Video: {config.videoQuality} {isVideoLoaded ? '✓' : '⟳'}
        </div>
      )}
    </>
  );
}
