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
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="glass-pill px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider font-semibold text-white/90 shadow-md">
          {timeStr || '10:39 PM'}
        </div>

        {/* Live Online Badge */}
        <div className="glass-pill px-3 py-1.5 rounded-full text-xs font-medium text-white/80 flex items-center gap-1.5 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-emerald-400">{onlineCount}</span> online
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

      {/* Top Right: App Actions */}
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

        {/* Horn Sound Trigger */}
        {currentMode.hasHorn && (
          <button
            onClick={onPlayHorn}
            className="glass-pill px-3 py-1.5 rounded-full text-xs font-semibold text-amber-300 flex items-center gap-1.5 hover:bg-amber-500/20 active:scale-95 transition"
            title="Blow Truck Horn!"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>Horn OK!</span>
          </button>
        )}

        {/* Playlists Button */}
        <button
          onClick={onOpenPlaylists}
          className="glass-pill px-3 py-1.5 rounded-full text-xs font-medium text-white/90 flex items-center gap-1.5"
        >
          <ListMusic className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Playlists</span>
        </button>

        {/* Songs Button */}
        <button
          onClick={onOpenSongs}
          className="glass-pill px-3 py-1.5 rounded-full text-xs font-medium text-white/90 flex items-center gap-1.5"
        >
          <Music className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">Songs</span>
        </button>

        {/* Install Button */}
        <button 
          onClick={() => alert('Add to Home Screen to Install Horn OK App!')}
          className="glass-pill px-3 py-1.5 rounded-full text-xs font-medium text-white/90 hidden lg:flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5 text-sky-400" />
          <span>Install</span>
        </button>
      </div>
    </header>
  );
}
