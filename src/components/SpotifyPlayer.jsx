import React, { useState } from 'react';

export default function SpotifyPlayer({ playlistId, isVisible }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!playlistId) return null;

  const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`;

  return (
    <div
      className={`fixed z-30 transition-all duration-500 ease-in-out ${
        isExpanded
          ? 'bottom-28 right-4 w-80 h-[420px] sm:w-96 sm:h-[480px]'
          : 'bottom-28 right-4 w-72 h-20'
      }`}
    >
      {/* Container */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/80 backdrop-blur-xl">
        
        {/* Spotify Embed iFrame */}
        <iframe
          src={embedUrl}
          width="100%"
          height={isExpanded ? '100%' : '80'}
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="w-full rounded-2xl"
          style={{ minHeight: isExpanded ? '100%' : '80px' }}
          title="Spotify Barber Shop Playlist"
        />

        {/* Expand/Collapse Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-2 right-2 z-50 w-6 h-6 rounded-full bg-black/70 border border-white/20 text-white/80 hover:bg-white/20 transition flex items-center justify-center text-xs font-bold shadow"
          title={isExpanded ? 'Collapse' : 'Expand playlist'}
        >
          {isExpanded ? '↓' : '↑'}
        </button>
      </div>
    </div>
  );
}
