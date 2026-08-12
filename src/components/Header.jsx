import React, { useState, useEffect } from 'react';
import { Truck, HardHat, Scissors, Music, ListMusic, Volume2, Download } from 'lucide-react';

export default function Header({ 
  modes, 
  currentMode, 
  onSelectMode, 
  onOpenSongs, 
  onOpenPlaylists, 
  onPlayHorn 
}) {
  const [timeStr, setTimeStr] = useState('');
  const [onlineCount, setOnlineCount] = useState(949);

  // Live Digital Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fluctuate online count subtly for realistic live feel
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(920, Math.min(990, prev + delta));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getModeIcon = (modeId) => {
    switch (modeId) {
      case 'truck':
        return <Truck className="w-4 h-4 text-amber-400" />;
      case 'mistri':
        return <HardHat className="w-4 h-4 text-orange-400" />;
      case 'nauaa':
        return <Scissors className="w-4 h-4 text-red-400" />;
      default:
        return <Music className="w-4 h-4" />;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-between pointer-events-none select-none">
      {/* Top Left: Digital Clock & Online Badge */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="glass-pill px-2.5 py-1.5 rounded-full text-xs font-mono tracking-wider font-semibold text-white/90 shadow-md hidden sm:block">
          {timeStr || '10:39 PM'}
        </div>

        {/* Live Online Badge */}
        <div className="glass-pill px-2.5 py-1.5 rounded-full text-xs font-medium text-white/80 flex items-center gap-1 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-emerald-400">{onlineCount}</span>
          <span className="hidden min-[380px]:inline text-white/60">online</span>
        </div>
      </div>

      {/* Center: Mode Tabs */}
      <div className="hidden md:flex items-center gap-1.5 p-1 glass-pill rounded-full pointer-events-auto shadow-xl">
        {modes.map((m) => {
          const isActive = m.id === currentMode.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMode(m)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg scale-105'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {getModeIcon(m.id)}
              <span>{m.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Top Right: Retro Radio Badge */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Mobile Mode Selector */}
        <div className="md:hidden flex items-center glass-pill rounded-full p-1">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => onSelectMode(m)}
              className={`p-1.5 rounded-full transition-all ${
                m.id === currentMode.id ? 'bg-red-600 text-white' : 'text-white/60'
              }`}
              title={m.label}
            >
              {getModeIcon(m.id)}
            </button>
          ))}
        </div>

        {/* Retro Broadcast Indicator Slogan */}
        <div className="glass-pill px-3 py-1.5 rounded-full text-xs font-bold text-amber-300 flex items-center gap-1.5 shadow-md border border-white/5 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
          <span className="tracking-wider uppercase font-mono hidden sm:inline">FM 90.7 · RETRO BUMPER RADIO 📻</span>
          <span className="tracking-wider uppercase font-mono sm:hidden">90.7 FM 📻</span>
        </div>
      </div>
    </header>
  );
}
