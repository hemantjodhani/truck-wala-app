import React, { useState } from 'react';
import { X, Search, Play, Music } from 'lucide-react';

export default function SongsModal({ 
  isOpen, 
  onClose, 
  playlist, 
  currentTrack, 
  onSelectTrack, 
  modeTitle 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredSongs = playlist.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="glass-player w-full max-w-lg rounded-3xl p-5 shadow-2xl border border-white/20 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Music className="w-5 h-5 text-amber-400" />
              <span>{modeTitle} - Songs</span>
            </h2>
            <p className="text-xs text-white/60">Select a song to play instantly</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="my-3 relative">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search song or artist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 border border-white/15 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400 transition"
          />
        </div>

        {/* Song List */}
        <div className="overflow-y-auto space-y-2 pr-1 flex-1">
          {filteredSongs.map((song, idx) => {
            const isSelected = currentTrack?.id === song.id;
            return (
              <div
                key={song.id}
                onClick={() => {
                  onSelectTrack(song);
                  onClose();
                }}
                className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                    : 'hover:bg-white/10 border border-transparent text-white/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-white/40 w-4">{idx + 1}</span>
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate text-white">
                      {song.title}
                    </p>
                    <p className="text-[11px] text-white/60 truncate">{song.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-white/50">{song.duration}</span>
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 fill-current text-amber-400 ml-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
