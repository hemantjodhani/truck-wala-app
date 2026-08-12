import React, { useState } from 'react';
import { MODES } from './data/modes';
import { SALON_SONGS } from './data/salonSongs';
import { TRUCK_SONGS } from './data/truckSongs';
import { MISTRI_SONGS } from './data/mistriSongs';
import Header from './components/Header';
import BackgroundView from './components/BackgroundView';
import LocalPlayer from './components/LocalPlayer';
import PlaylistsModal from './components/PlaylistsModal';

// Build the song map per mode
const MODE_SONGS = {
  nauaa: SALON_SONGS,
  truck: TRUCK_SONGS,
  mistri: MISTRI_SONGS,
};

export default function App() {
  const [currentMode, setCurrentMode] = useState(() => {
    const saved = localStorage.getItem('lastModeId');
    return MODES.find((m) => m.id === saved) || MODES[0];
  });
  const [isPlaylistsModalOpen, setIsPlaylistsModalOpen] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const handleSelectMode = (newMode) => {
    if (newMode.id === currentMode.id) return;
    setCurrentMode(newMode);
    localStorage.setItem('lastModeId', newMode.id);
  };

  const handlePlayHorn = () => {
    const audio = new Audio('/assets/horn.mp3');
    audio.play().catch((err) => console.log('Horn blocked:', err));
  };

  const songs = MODE_SONGS[currentMode.id] || [];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans">
      {/* Top Navigation Header */}
      <Header
        modes={MODES}
        currentMode={currentMode}
        onSelectMode={handleSelectMode}
        onOpenSongs={() => setShowPlaylist(p => !p)}
        onOpenPlaylists={() => setIsPlaylistsModalOpen(true)}
        onPlayHorn={handlePlayHorn}
      />

      {/* Background Art & Retro Hindi Title */}
      <BackgroundView mode={currentMode} isPlaying={songs.length > 0} onPlayHorn={handlePlayHorn} />

      {/* Beautiful Local Audio Player */}
      <LocalPlayer
        songs={songs}
        modeName={currentMode.label}
        accentColor={currentMode.accentColor}
        showList={showPlaylist}
        onToggleList={setShowPlaylist}
      />

      {/* Playlists / Modes Modal */}
      <PlaylistsModal
        isOpen={isPlaylistsModalOpen}
        onClose={() => setIsPlaylistsModalOpen(false)}
        modes={MODES}
        currentMode={currentMode}
        onSelectMode={handleSelectMode}
      />
    </div>
  );
}
