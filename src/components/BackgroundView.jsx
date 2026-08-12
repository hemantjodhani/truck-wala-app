import React from 'react';

export default function BackgroundView({ mode, isPlaying }) {
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
      </div>

      {/* Atmospheric Overlays & Shadows */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40" />

      {/* Center Giant Hindi Billboard Title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 pointer-events-none z-10">
        <div className="text-center transition-all duration-700 transform scale-100 animate-fadeIn">
          {/* Main Big Retro Hindi Title */}
          <h1 className="hindi-title text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-wide drop-shadow-2xl">
            {mode.hindiTitle}
          </h1>

          {/* Subtitle / Mode tagline */}
          <p className="mt-2 sm:mt-4 text-xs sm:text-sm md:text-base font-semibold tracking-widest text-amber-300/90 uppercase drop-shadow-md">
            {mode.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
