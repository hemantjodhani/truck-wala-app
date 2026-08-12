import React from 'react';
import { X, ListMusic, Truck, HardHat, Scissors, ArrowRight } from 'lucide-react';

export default function PlaylistsModal({
  isOpen,
  onClose,
  modes,
  currentMode,
  onSelectMode
}) {
  if (!isOpen) return null;

  const getModeIcon = (modeId) => {
    switch (modeId) {
      case 'truck':
        return <Truck className="w-6 h-6 text-amber-400" />;
      case 'mistri':
        return <HardHat className="w-6 h-6 text-orange-400" />;
      case 'nauaa':
        return <Scissors className="w-6 h-6 text-red-400" />;
      default:
        return <ListMusic className="w-6 h-6" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-player w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-white/20 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ListMusic className="w-6 h-6 text-amber-400" />
              <span>Desi Culture Modes & Playlists</span>
            </h2>
            <p className="text-xs text-white/60">Choose your vibe and soundtrack</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5 overflow-y-auto">
          {modes.map((mode) => {
            const isActive = mode.id === currentMode.id;
            return (
              <div
                key={mode.id}
                onClick={() => {
                  onSelectMode(mode);
                  onClose();
                }}
                className={`relative rounded-2xl overflow-hidden border cursor-pointer group transition-all duration-300 ${
                  isActive
                    ? 'border-amber-400 ring-2 ring-amber-400/50 scale-[1.02]'
                    : 'border-white/15 hover:border-white/40 hover:scale-[1.01]'
                }`}
              >
                {/* Background image preview */}
                <div
                  className="h-32 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${mode.bgImage}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl glass-pill">
                      {getModeIcon(mode.id)}
                    </div>
                    {isActive && (
                      <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        Active
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="hindi-title text-xl text-white drop-shadow-md">
                      {mode.hindiTitle}
                    </h3>
                    <p className="text-[11px] text-amber-200/90 font-medium">
                      {mode.playlist.length} Songs Playlist
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="text-center pt-3 border-t border-white/10 text-xs text-white/50">
          Tip: Click any mode above to instantly switch background art, titles, and playlists!
        </div>

      </div>
    </div>
  );
}
