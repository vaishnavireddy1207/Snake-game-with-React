import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center p-4 md:p-12 lg:p-20 relative overflow-x-hidden">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <header className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20 relative z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-neon-green" />
            <span className="micro-label text-neon-green">System Terminal v4.0.1</span>
          </div>
          <motion.h1 
            className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-[0.85]"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Neon <br />
            <span className="text-neon-green neon-glow-green">Protocol</span>
          </motion.h1>
        </div>

        <div className="flex flex-col items-start md:items-end gap-4">
          <div className="flex gap-12">
            <div className="flex flex-col gap-1">
              <span className="micro-label">Uptime</span>
              <span className="font-mono text-sm text-white/60">99.99%</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="micro-label">Latency</span>
              <span className="font-mono text-sm text-white/60">14ms</span>
            </div>
          </div>
          <p className="max-w-xs text-xs text-white/30 font-mono leading-relaxed md:text-right">
            Integrated neural-link interface for high-fidelity audio processing and spatial navigation testing.
          </p>
        </div>
      </header>

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 items-start relative z-10">
        {/* Primary Interaction Zone */}
        <motion.section 
          className="flex flex-col gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-4 mb-2">
            <span className="micro-label">Module 01</span>
            <div className="h-[1px] flex-1 bg-hardware-line" />
            <span className="micro-label">Spatial_Nav_Test</span>
          </div>
          <SnakeGame />
        </motion.section>

        {/* Secondary Control Zone */}
        <motion.section 
          className="flex flex-col gap-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="micro-label">Module 02</span>
              <div className="h-[1px] flex-1 bg-hardware-line" />
              <span className="micro-label">Audio_Core</span>
            </div>
            <MusicPlayer />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="micro-label">Module 03</span>
              <div className="h-[1px] flex-1 bg-hardware-line" />
              <span className="micro-label">Documentation</span>
            </div>
            <div className="hardware-surface p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neon-green">Control Mapping</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="micro-label opacity-50">Navigation</span>
                    <span className="text-[10px] font-mono">WASD / ARROWS</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="micro-label opacity-50">State</span>
                    <span className="text-[10px] font-mono">SPACEBAR</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-hardware-line">
                <p className="text-[10px] text-white/40 font-mono leading-relaxed">
                  Protocol: Consume magenta data clusters to expand neural capacity. Avoid perimeter breaches and self-collision to maintain system integrity.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="w-full max-w-7xl mt-32 pt-8 border-t border-hardware-line flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
        <span className="micro-label">© 2026 Neon Protocol Systems</span>
        <div className="flex gap-8">
          <span className="micro-label hover:text-neon-green cursor-pointer transition-colors">Security</span>
          <span className="micro-label hover:text-neon-green cursor-pointer transition-colors">API</span>
          <span className="micro-label hover:text-neon-green cursor-pointer transition-colors">Logs</span>
        </div>
      </footer>
    </div>
  );
}
