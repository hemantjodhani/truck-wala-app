import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

export default function PlayerBar({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  onPlayPause,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onToggleMute
}) {
  if (!currentTrack) return null;

  // Format seconds to M:SS
  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-[92%] max-w-xl">
      <div className="glass-player rounded-3xl p-3 sm:p-4 shadow-2xl flex flex-col gap-2 transition-all duration-300">
        
        {/* Track Info & Main Controls Bar */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Song Thumbnail & Titles */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative group flex-shrink-0">
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-cover shadow-md border border-white/20 transition-all ${
                  isPlaying ? 'ring-2 ring-amber-400/80 shadow-amber-500/20' : ''
                }`}
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                  <span className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-amber-400 h-full animate-bounce"></span>
                    <span className="w-0.5 bg-amber-400 h-2/3 animate-bounce delay-100"></span>
                    <span className="w-0.5 bg-amber-400 h-1/2 animate-bounce delay-200"></span>
                  </span>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-bold text-white truncate tracking-wide">
                {currentTrack.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-white/60 truncate font-medium">
                {currentTrack.artist}
              </p>
            </div>
          </div>

          {/* Player Buttons: Prev, Play/Pause, Next */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Prev Button */}
            <button
              onClick={onPrev}
              className="text-white/70 hover:text-white active:scale-95 transition p-1.5"
              title="Previous Track"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </button>

            {/* Main Play/Pause Circle */}
            <button
              onClick={onPlayPause}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current text-black" />
              ) : (
                <Play className="w-5 h-5 fill-current text-black ml-0.5" />
              )}
            </button>

            {/* Next Button */}
            <button
              onClick={onNext}
              className="text-white/70 hover:text-white active:scale-95 transition p-1.5"
              title="Next Track"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0 pl-2 border-l border-white/10">
            <button
              onClick={onToggleMute}
              className="text-white/70 hover:text-white transition p-1"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-white/80" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-16 h-1 accent-amber-400"
            />
          </div>

        </div>

        {/* Progress Bar & Time Stamps */}
        <div className="flex items-center gap-3 px-1 pt-1">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime || 0}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="w-full h-1 rounded-full accent-amber-400 cursor-pointer"
            style={{
              background: `linear-gradient(to right, #f59e0b ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%)`
            }}
          />

          <span className="text-[10px] sm:text-xs font-mono text-white/70 flex-shrink-0 min-w-[65px] text-right font-medium">
            {formatTime(currentTime)} / {formatTime(duration || currentTrack.durationSec)}
          </span>
        </div>

      </div>
    </div>
  );
}
