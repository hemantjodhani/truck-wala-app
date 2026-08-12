import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Repeat, Shuffle,
  Music, List, X
} from 'lucide-react';

export default function LocalPlayer({ 
  songs = [], 
  modeName = '', 
  accentColor = '#e63946',
  showList: showListProp,
  onToggleList
}) {
  const audioRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showListState, setShowListState] = useState(false);

  const showList = showListProp !== undefined ? showListProp : showListState;
  const setShowList = onToggleList !== undefined ? onToggleList : setShowListState;

  const currentSong = songs[currentIdx] || null;

  // ── Restore state on modeName or songs changes ──
  useEffect(() => {
    if (!songs.length) return;
    
    // Get last saved index for this mode
    const savedIdx = localStorage.getItem('lastSongIdx_' + modeName);
    const parsedIdx = savedIdx !== null ? parseInt(savedIdx, 10) : 0;
    const targetIdx = parsedIdx >= 0 && parsedIdx < songs.length ? parsedIdx : 0;

    isInitialLoadRef.current = true;
    setCurrentIdx(targetIdx);
  }, [modeName, songs]);

  // ── Audio Events ──────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      localStorage.setItem('lastTime_' + modeName, audio.currentTime);
    };
    const onDur  = () => setDuration(audio.duration || 0);
    const onEnd  = () => {
      // Force next song index update
      handleNext();
    };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('durationchange', onDur);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('durationchange', onDur);
      audio.removeEventListener('ended', onEnd);
    };
  }, [modeName, songs, currentIdx, isShuffle, isRepeat]);

  // ── Sync Play/Pause State (User Click/Key Trigger) ──
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;

    if (isPlaying) {
      if (audio.paused) {
        audio.play().catch((err) => {
          console.log('Playback blocked:', err);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // ── Song Change, Load & Play Executor ──────────────────────────
  useEffect(() => {
    setImgError(false);
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    // Load the new track
    audio.src = currentSong.src;
    audio.load();

    // Restore saved time position on mount/initial load
    if (isInitialLoadRef.current) {
      const savedTime = localStorage.getItem('lastTime_' + modeName);
      const parsedTime = savedTime !== null ? parseFloat(savedTime) : 0;
      if (parsedTime > 0) {
        audio.currentTime = parsedTime;
        setCurrentTime(parsedTime);
      } else {
        setCurrentTime(0);
      }
      isInitialLoadRef.current = false;
    } else {
      setCurrentTime(0);
    }
    setDuration(0);

    // Explicitly auto-play the next song if player was actively playing
    if (isPlaying) {
      audio.play().catch((err) => {
        console.log('Autoplay blocked:', err);
        setIsPlaying(false);
      });
    }
  }, [currentIdx, songs]);

  // ── Volume ────────────────────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // ── Controls ──────────────────────────────────────────────────
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    setIsPlaying(!isPlaying);
  };

  const handleNext = useCallback(() => {
    if (!songs.length) return;
    let nextIdx = 0;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * songs.length);
    } else if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
      return;
    } else {
      nextIdx = (currentIdx + 1) % songs.length;
    }
    setCurrentIdx(nextIdx);
    localStorage.setItem('lastSongIdx_' + modeName, nextIdx);
    localStorage.setItem('lastTime_' + modeName, 0);
  }, [songs, isShuffle, isRepeat, currentIdx, modeName]);

  const handlePrev = () => {
    if (!songs.length) return;
    let prevIdx = 0;
    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
      localStorage.setItem('lastTime_' + modeName, 0);
    } else {
      prevIdx = (currentIdx - 1 + songs.length) % songs.length;
      setCurrentIdx(prevIdx);
      localStorage.setItem('lastSongIdx_' + modeName, prevIdx);
      localStorage.setItem('lastTime_' + modeName, 0);
    }
  };

  const handleSeek = (e) => {
    const t = parseFloat(e.target.value);
    audioRef.current.currentTime = t;
    setCurrentTime(t);
    localStorage.setItem('lastTime_' + modeName, t);
  };

  const handleSelectSong = (idx) => {
    setCurrentIdx(idx);
    localStorage.setItem('lastSongIdx_' + modeName, idx);
    localStorage.setItem('lastTime_' + modeName, 0);
    setTimeout(() => { audioRef.current?.play().catch(console.error); }, 80);
  };

  const fmt = (s) => {
    const m = Math.floor((s || 0) / 60);
    const sec = Math.floor((s || 0) % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  if (!songs.length) return null;

  return (
    <>
      <audio ref={audioRef} preload="auto" />

      {/* ── Playlist Drawer ── */}
      {showList && (
        <div className="fixed inset-0 z-40 flex items-end justify-center pointer-events-none">
          <div
            className="pointer-events-auto w-full max-w-lg mb-28 mx-3 rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: 'rgba(12,10,10,0.93)', backdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
              <span className="text-xs font-semibold tracking-widest text-white/40 uppercase">Playlist · {songs.length} songs</span>
              <button onClick={() => setShowList(false)} className="w-6 h-6 flex items-center justify-center text-white/40 hover:text-white transition">
                <X size={14} />
              </button>
            </div>
            {/* Song list */}
            <div className="max-h-72 overflow-y-auto">
              {songs.map((song, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSong(idx)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all text-left
                    ${idx === currentIdx ? 'bg-white/10' : 'hover:bg-white/6'}`}
                >
                  {/* Thumb */}
                  <div className="w-9 h-9 rounded-lg shrink-0 overflow-hidden relative bg-white/8">
                    {song.thumb && (
                      <img src={song.thumb} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                    )}
                    {idx === currentIdx && isPlaying && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="inline-flex gap-0.5 items-end h-3" style={{ color: accentColor }}>
                          <span className="eq-bar" /><span className="eq-bar" /><span className="eq-bar" />
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${idx === currentIdx ? 'text-white' : 'text-white/60'}`}>{song.title}</p>
                    <p className="text-xs text-white/30 truncate">{song.artist}</p>
                  </div>
                  {idx === currentIdx && (
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accentColor }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Mini Pill Player ── */}
      <div className="fixed bottom-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-xl rounded-full overflow-hidden relative"
          style={{
            background: 'rgba(18, 14, 14, 0.88)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.4)',
          }}
        >
          {/* Progress bar — thin strip at bottom of pill */}
          <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-150"
              style={{ width: `${progress}%`, background: accentColor }}
            />
            <input
              type="range" min={0} max={duration || 0} step={0.1} value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
            />
          </div>

          {/* Main row */}
          <div className="flex items-center gap-2 md:gap-3 px-1.5 py-1.5 pr-3 md:px-2 md:py-2 md:pr-4">

            {/* Album art — square pill left */}
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full shrink-0 overflow-hidden border border-white/10 shadow-lg">
              {currentSong?.thumb && !imgError ? (
                <img
                  src={currentSong.thumb}
                  alt={currentSong.title}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: `radial-gradient(circle at 35% 35%, ${accentColor}70, #111)` }}>
                  <Music size={14} className="text-white/60 md:hidden" />
                  <Music size={18} className="text-white/60 hidden md:block" />
                </div>
              )}
            </div>

            {/* Title + artist + time */}
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm font-bold text-white truncate leading-tight">{currentSong?.title}</p>
              <p className="text-[10px] md:text-xs text-white/40 truncate leading-tight mt-0.5">{currentSong?.artist}</p>
              <p className="text-[9px] md:text-[10px] text-white/25 mt-0.5 font-mono">{fmt(currentTime)} / {fmt(duration)}</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-0.5 md:gap-1 shrink-0">
              {/* Shuffle */}
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`hidden sm:flex w-7.5 h-7.5 md:w-8 md:h-8 rounded-full items-center justify-center transition
                  ${isShuffle ? 'text-white' : 'text-white/35 hover:text-white/70'}`}
                style={isShuffle ? { color: accentColor } : {}}
              >
                <Shuffle size={13} />
              </button>

              {/* Prev */}
              <button
                onClick={handlePrev}
                className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition"
              >
                <SkipBack size={14} className="md:hidden" />
                <SkipBack size={16} className="hidden md:block" />
              </button>

              {/* Play / Pause — big circle */}
              <button
                onClick={togglePlay}
                className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center shadow-lg transition hover:scale-105 active:scale-95 shrink-0"
                style={{ background: '#ffffff' }}
              >
                {isPlaying ? (
                  <>
                    <Pause size={14} fill="#111" stroke="none" className="md:hidden" />
                    <Pause size={18} fill="#111" stroke="none" className="hidden md:block" />
                  </>
                ) : (
                  <>
                    <Play size={14} fill="#111" stroke="none" className="translate-x-0.5 md:hidden" />
                    <Play size={18} fill="#111" stroke="none" className="translate-x-0.5 hidden md:block" />
                  </>
                )}
              </button>

              {/* Next */}
              <button
                onClick={handleNext}
                className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition"
              >
                <SkipForward size={14} className="md:hidden" />
                <SkipForward size={16} className="hidden md:block" />
              </button>

              {/* Playlist */}
              <button
                onClick={() => setShowList(!showList)}
                className={`w-7.5 h-7.5 md:w-8 md:h-8 rounded-full flex items-center justify-center transition
                  ${showList ? 'text-white' : 'text-white/35 hover:text-white/70'}`}
                style={showList ? { color: accentColor } : {}}
              >
                <List size={13} className="md:hidden" />
                <List size={14} className="hidden md:block" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
