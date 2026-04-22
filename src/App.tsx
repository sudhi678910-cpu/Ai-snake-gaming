/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Cpu, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-fuchsia-600/10 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      <header className="relative z-10 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/50 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Cpu className="text-cyan-400" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter italic leading-none">
              Neon Rhythm <span className="text-cyan-400">Snake</span>
            </h1>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">Neural Link Established v2.0.4</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-[10px] font-mono text-zinc-500 uppercase tracking-widest bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-blink" />
            <span>Server Stable</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={10} className="text-yellow-500" />
            <span>Low Latency</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
          {/* Main Game Window */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="xl:col-span-8 flex flex-col items-center"
          >
            <SnakeGame />
          </motion.section>

          {/* Sidebar Components */}
          <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="xl:col-span-4 flex flex-col gap-8 items-center xl:items-start"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-[1px] flex-1 bg-zinc-800" />
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Audio Core</span>
                <div className="h-[1px] w-8 bg-zinc-800" />
              </div>
              <MusicPlayer />
            </div>

            <div className="w-full max-w-sm bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6">
              <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-1 h-1 bg-fuchsia-500 rounded-full" />
                Transmission Log
              </h4>
              <ul className="space-y-3 font-mono text-[10px] text-zinc-500 leading-relaxed uppercase">
                <li className="flex gap-2">
                  <span className="text-zinc-700">[04:22:31]</span>
                  <span>Audio synchronization complete.</span>
                </li>
                <li className="flex gap-2 text-cyan-500/50">
                  <span className="text-zinc-700">[04:22:35]</span>
                  <span>Snake speed calibrated to 150ms.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-zinc-700">[04:22:39]</span>
                  <span>Neon shaders loaded successfully.</span>
                </li>
              </ul>
            </div>
          </motion.aside>
        </div>
      </main>

      <footer className="mt-20 border-t border-zinc-900 p-8 text-center relative z-10">
        <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-[0.2em]">
          Designed for the Neural Network Interface // Built with React 19 // © 2026 Synth Labs
        </p>
      </footer>
    </div>
  );
}

