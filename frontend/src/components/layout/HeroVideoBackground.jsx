import React, { useRef, useState, useEffect } from 'react';

export default function HeroVideoBackground({
  videoSrc = '/videos/hero.mp4',
  fallbackSrc = 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-42289-large.mp4',
  posterSrc = 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=2000&q=80',
}) {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Automatically guarantee immediate autoplay from the first second
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => setVideoLoaded(true))
        .catch(() => {
          // In case of any browser constraint, try muted playback
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().then(() => setVideoLoaded(true)).catch(() => {});
          }
        });
    }
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 transform-gpu"
      style={{ transform: 'translate3d(0, 0, 0)', contain: 'paint' }}
    >
      {/* Fallback Poster Image */}
      <img
        src={posterSrc}
        alt="Travel backdrop"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 transform-gpu ${
          videoLoaded && !hasError ? 'opacity-0' : 'opacity-100'
        }`}
        loading="eager"
      />

      {/* Crystal Clear, Bright Background Video (No Dimming) */}
      {!hasError && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster={posterSrc}
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          onCanPlay={() => setVideoLoaded(true)}
          onError={() => setHasError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 transform-gpu ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ willChange: 'opacity' }}
        >
          <source src={videoSrc} type="video/mp4" />
          <source src={fallbackSrc} type="video/mp4" />
        </video>
      )}

      {/* Subtle Sheer Gradient for Navbar & Bottom Blend Only (Leaves Video Clear & Bright in Center) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D13]/60 via-transparent to-[#0B0D13] pointer-events-none" />
    </div>
  );
}
