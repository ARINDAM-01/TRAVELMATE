import React, { useRef, useState, useEffect } from 'react';

export default function InnerVideoBackground({
  videoSrc = '/videos/inner-bg.mp4',
}) {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => setVideoLoaded(true))
        .catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().then(() => setVideoLoaded(true)).catch(() => {});
          }
        });
    }
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0 transform-gpu"
      style={{ transform: 'translate3d(0, 0, 0)', contain: 'paint' }}
    >
      {/* Background Video */}
      {!hasError && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          onCanPlay={() => setVideoLoaded(true)}
          onError={() => setHasError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 transform-gpu ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ willChange: 'opacity' }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Balanced Overlay Tint for Optimal Readability of Page Elements */}
      <div className="absolute inset-0 bg-[#07090E]/70 backdrop-blur-[1px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#07090E]/85 via-transparent to-[#07090E]/90 pointer-events-none" />
    </div>
  );
}
