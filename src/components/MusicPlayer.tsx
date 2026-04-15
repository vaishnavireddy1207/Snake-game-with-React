import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music, Activity } from 'lucide-react';
import { DUMMY_TRACKS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(current);
      setDuration(dur || 0);
      setProgress((current / dur) * 100);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-[400px] hardware-surface p-0 overflow-hidden">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        onLoadedMetadata={handleTimeUpdate}
      />

      {/* Header / Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-hardware-line bg-black/20">
        <div className="flex items-center gap-2">
          <Activity size={12} className={isPlaying ? 'text-neon-green' : 'text-white/20'} />
          <span className="micro-label">Audio Engine v2.0</span>
        </div>
        <span className="micro-label text-neon-green">
          {isPlaying ? 'STREAMING' : 'STANDBY'}
        </span>
      </div>

      <div className="p-6">
        <div className="flex gap-6 mb-8">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-hardware-line shadow-inner bg-black">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentTrack.id}
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="w-full h-full object-cover opacity-80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-neon-green/10">
                <div className="flex gap-1 items-end h-6">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-neon-green"
                      animate={{ height: [4, 20, 8, 16, 4] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <h3 className="text-white font-black text-xl tracking-tighter truncate uppercase italic">
              {currentTrack.title}
            </h3>
            <p className="micro-label mt-1 truncate text-neon-green/60">
              {currentTrack.artist}
            </p>
            
            <div className="mt-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
              <span className="font-mono text-[10px] text-white/40 tracking-widest">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar (Hardware Style) */}
        <div className="relative h-6 bg-black border border-hardware-line rounded-sm mb-8 overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 flex items-center px-2 z-10 pointer-events-none">
            <div className="flex justify-between w-full">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-[1px] h-1 bg-white/10" />
              ))}
            </div>
          </div>
          <motion.div
            className="absolute top-0 left-0 h-full bg-neon-green/20 border-r border-neon-green"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
          />
        </div>

        {/* Controls (Tactile Feel) */}
        <div className="flex items-center justify-between px-2">
          <div className="flex gap-4">
            <button 
              onClick={handlePrev}
              className="w-10 h-10 flex items-center justify-center border border-hardware-line rounded-full text-white/40 hover:text-white hover:border-white transition-all active:scale-90"
            >
              <SkipBack size={18} />
            </button>
            <button 
              onClick={handleNext}
              className="w-10 h-10 flex items-center justify-center border border-hardware-line rounded-full text-white/40 hover:text-white hover:border-white transition-all active:scale-90"
            >
              <SkipForward size={18} />
            </button>
          </div>
          
          <button
            onClick={togglePlay}
            className={`w-14 h-14 flex items-center justify-center rounded-full transition-all active:scale-95 shadow-lg ${
              isPlaying 
                ? 'bg-neon-green text-black shadow-neon-green/20' 
                : 'bg-white text-black shadow-white/20'
            }`}
          >
            {isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} className="ml-1" />}
          </button>
        </div>
      </div>
      
      {/* Footer / Info Bar */}
      <div className="px-4 py-2 bg-black/40 border-t border-hardware-line flex justify-between">
        <span className="micro-label">Buffer: 100%</span>
        <span className="micro-label">44.1kHz / 24bit</span>
      </div>
    </div>
  );
}
