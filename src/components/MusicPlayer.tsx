import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { SONGS } from '../constants';

export default function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentSong = SONGS[currentSongIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log('Playback blocked', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => {
    setCurrentSongIndex((prev) => (prev + 1) % SONGS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentSongIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(e => console.log('Playback blocked', e));
    }
  }, [currentSongIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = x / rect.width;
      audioRef.current.currentTime = pct * audioRef.current.duration;
    }
  };

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 shadow-2xl w-full max-w-sm">
      <audio
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipForward}
      />

      <div className="flex flex-col items-center gap-6">
        <div className="relative w-48 h-48 group">
          <div className="absolute -inset-2 bg-gradient-to-tr from-fuchsia-500 to-cyan-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSong.id}
              initial={{ scale: 0.9, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.1, opacity: 0, rotate: 5 }}
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className="w-full h-full object-cover rounded-xl shadow-lg relative z-10"
            />
          </AnimatePresence>
          {isPlaying && (
            <div className="absolute -bottom-2 -right-2 bg-cyan-500 p-2 rounded-full shadow-lg z-20">
              <Music size={16} className="text-black animate-pulse" />
            </div>
          )}
        </div>

        <div className="text-center">
          <motion.h3 
            key={`${currentSong.id}-title`}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-lg font-bold text-white tracking-tight"
          >
            {currentSong.title}
          </motion.h3>
          <motion.p 
            key={`${currentSong.id}-artist`}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xs text-zinc-400 font-mono uppercase tracking-widest mt-1"
          >
            {currentSong.artist}
          </motion.p>
        </div>

        <div className="w-full">
          <div 
            className="h-1 bg-zinc-800 rounded-full cursor-pointer relative group"
            onClick={handleProgressClick}
          >
            <motion.div 
              className="absolute h-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full"
              style={{ width: `${progress}%` }}
              layoutId="progress-bar"
            />
            <div className="absolute -top-2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-glow" style={{ left: `calc(${progress}% - 6px)` }} />
          </div>
          <div className="flex justify-between mt-2 font-mono text-[10px] text-zinc-500">
            <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
            <span>{audioRef.current ? formatTime(audioRef.current.duration) : '0:00'}</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <button onClick={skipBackward} className="text-zinc-400 hover:text-white transition-colors">
            <SkipBack size={24} />
          </button>
          <button 
            onClick={togglePlay}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-transform shadow-xl shadow-white/10"
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} className="translate-x-0.5" fill="currentColor" />}
          </button>
          <button onClick={skipForward} className="text-zinc-400 hover:text-white transition-colors">
            <SkipForward size={24} />
          </button>
        </div>

        <div className="flex items-center gap-3 w-full px-4 text-zinc-500">
          <Volume2 size={16} />
          <div className="flex-1 h-0.5 bg-zinc-800 rounded-full relative">
            <div className="absolute inset-y-0 left-0 bg-zinc-500 rounded-full" style={{ width: '70%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
