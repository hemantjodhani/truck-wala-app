import React, { useState, useEffect } from 'react';
import { SHAYRIS } from '../data/shayris';
import { Volume2 } from 'lucide-react';

export default function BackgroundView({ mode, isPlaying, onPlayHorn }) {
  const [shayriIdx, setShayriIdx] = useState(0);

  useEffect(() => {
    // Only run interval for truck driver mode
    if (mode.id !== 'truck') return;

    // Reset index on mode change
    setShayriIdx(0);

    const interval = setInterval(() => {
      setShayriIdx((prev) => (prev + 1) % SHAYRIS.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [mode.id]);

  const isTruckMode = mode.id === 'truck';

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-black">
      {/* Background Image with Vignette */}
      <div
        key={mode.id}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 transform scale-105"
        style={{ backgroundImage: `url('${mode.bgImage}')` }}
      >
        {/* Subtle motion zoom when playing */}
        <div className={`w-full h-full transition-transform duration-10000 ${isPlaying ? 'scale-105' : 'scale-100'}`} />

        {/* Interactive Horn Hotspot - Only in truck mode */}
        {isTruckMode && (
          <button
            onClick={onPlayHorn}
            className="absolute left-[20.8%] top-[48.5%] -translate-x-1/2 -translate-y-1/2 glass-pill px-3.5 py-2 rounded-full text-xs font-semibold text-amber-300 flex items-center gap-1.5 hover:bg-amber-500/25 active:scale-95 transition pointer-events-auto z-20 shadow-xl border border-white/10"
            title="Blow Truck Horn!"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>Horn OK!</span>
          </button>
        )}
      </div>

      {/* Atmospheric Overlays & Shadows */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40" />

      {/* Center Giant Hindi Billboard Title */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 pointer-events-none z-10 transition-all duration-700
        ${mode.id === 'nauaa' ? '-translate-y-[14vh] md:-translate-y-[18vh]' : ''}`}
      >
        <div className="text-center">
          {/* Main Big Retro Hindi Title */}
          <h1 className="hindi-title text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-wide drop-shadow-2xl animate-fadeIn">
            {mode.hindiTitle}
          </h1>

          {/* Subtitle / Shayri Tagline */}
          {isTruckMode ? (
            <p
              key={shayriIdx}
              className="mt-3 sm:mt-5 text-sm sm:text-base md:text-lg lg:text-xl font-medium tracking-wide text-amber-300 drop-shadow-md max-w-xl mx-auto italic animate-fadeIn"
            >
              "{SHAYRIS[shayriIdx]}"
            </p>
          ) : (
            <p className="mt-2 sm:mt-4 text-xs sm:text-sm md:text-base font-semibold tracking-widest text-amber-300/90 uppercase drop-shadow-md animate-fadeIn">
              {mode.subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
