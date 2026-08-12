import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Repeat, Shuffle,
  Music, List, X
} from 'lucide-react';

export default function LocalPlayer({ songs = [], modeName = '', accentColor = '#e63946' }) {
  const audioRef = useRef(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showList, setShowList] = useState(false);

  const currentSong = songs[currentIdx] || null;

  // ── Audio Events ──────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onDur  = () => setDuration(audio.duration || 0);
    const onEnd  = () => handleNext();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('durationchange', onDur);
    audio.addEventListener('ended', onEnd);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('durationchange', onDur);
      audio.removeEventListener('ended', onEnd);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  // ── Song change ───────────────────────────────────────────────
  useEffect(() => {
    setImgError(false);
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    const wasPlaying = isPlaying;
    audio.src = currentSong.src;
    audio.load();
    if (wasPlaying) audio.play().catch(console.error);
    setCurrentTime(0);
    setDuration(0);
  }, [currentIdx, songs]);

  // ── Volume ────────────────────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // ── Controls ──────────────────────────────────────────────────
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    isPlaying ? audio.pause() : audio.play().catch(console.error);
  };

  const handleNext = useCallback(() => {
    if (!songs.length) return;
    if (isShuffle) setCurrentIdx(Math.floor(Math.random() * songs.length));
    else if (isRepeat) { audioRef.current.currentTime = 0; audioRef.current.play().catch(console.error); }
    else setCurrentIdx(p => (p + 1) % songs.length);
  }, [songs, isShuffle, isRepeat]);

  const handlePrev = () => {
    if (!songs.length) return;
    if (currentTime > 3) { audioRef.current.currentTime = 0; }
    else setCurrentIdx(p => (p - 1 + songs.length) % songs.length);
  };

  const handleSeek = (e) => {
    const t = parseFloat(e.target.value);
    audioRef.current.currentTime = t;
    setCurrentTime(t);
  };

  const handleSelectSong = (idx) => {
    setCurrentIdx(idx);
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
          <div className="flex items-center gap-3 px-2 py-2 pr-4">

            {/* Album art — square pill left */}
            <div className="w-12 h-12 rounded-full shrink-0 overflow-hidden border-2 border-white/10 shadow-lg">
              {currentSong?.thumb && !imgError ? (
                <img
                  src={currentSong.thumb}
                  alt={currentSong.title}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: `radial-gradient(circle at 35% 35%, ${accentColor}70, #111)` }}>
                  <Music size={18} className="text-white/60" />
                </div>
              )}
            </div>

            {/* Title + artist + time */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate leading-tight">{currentSong?.title}</p>
              <p className="text-xs text-white/40 truncate">{currentSong?.artist}</p>
              <p className="text-[10px] text-white/25 mt-0.5 font-mono">{fmt(currentTime)} / {fmt(duration)}</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Shuffle */}
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition
                  ${isShuffle ? 'text-white' : 'text-white/35 hover:text-white/70'}`}
                style={isShuffle ? { color: accentColor } : {}}
              >
                <Shuffle size={13} />
              </button>

              {/* Prev */}
              <button
                onClick={handlePrev}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition"
              >
                <SkipBack size={16} />
              </button>

              {/* Play / Pause — big circle */}
              <button
                onClick={togglePlay}
                className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition hover:scale-105 active:scale-95 shrink-0"
                style={{ background: '#ffffff' }}
              >
                {isPlaying
                  ? <Pause size={18} fill="#111" stroke="none" />
                  : <Play size={18} fill="#111" stroke="none" className="translate-x-0.5" />
                }
              </button>

              {/* Next */}
              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition"
              >
                <SkipForward size={16} />
              </button>

              {/* Playlist */}
              <button
                onClick={() => setShowList(!showList)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition
                  ${showList ? 'text-white' : 'text-white/35 hover:text-white/70'}`}
                style={showList ? { color: accentColor } : {}}
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
