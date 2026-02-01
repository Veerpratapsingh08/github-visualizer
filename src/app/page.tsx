"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-display bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1B2735] via-background to-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(37,106,244,0.15)_0%,_rgba(16,22,34,0)_50%)] pointer-events-none z-0"></div>

      <header className="flex items-center justify-between border-b border-white/5 px-6 py-4 md:px-10 lg:px-40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 text-white">
          <Image src="/logo.png" alt="GitHub Visualizer" width={36} height={36} className="rounded-lg" unoptimized />
          <h2 className="text-white text-xl font-bold leading-tight">GitHub Visualizer</h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <a 
            href="https://github.com/Veerpratapsingh08/Github-Visualizer" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-secondary hover:bg-secondary/80 text-white gap-2 text-sm font-bold px-4 transition-colors border border-white/5"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            <span className="hidden sm:inline">View on GitHub</span>
          </a>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center relative w-full z-10 px-4 md:px-10 lg:px-40">
        <div className="w-full max-w-[1200px] flex flex-col items-center py-20 text-center relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-1.5 shadow-sm mb-8">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-[pulse_3s_infinite]"></span>
                <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">V2.0 Now Available</span>
            </div>

            <h1 className="text-white text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
                Visualize Your Codebase <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-primary to-purple-500 animate-gradient">
                    Like Never Before
                </span>
            </h1>

            <h2 className="text-gray-400 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto mb-10 font-sans">
                Immerse yourself in a 3D representation of your repositories. Track changes, visualize commits, and explore your architecture in a futuristic environment.
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/visualize" className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-12 px-6 bg-primary hover:bg-blue-600 transition-all shadow-[0_0_20px_rgba(37,106,244,0.3)] hover:shadow-[0_0_30px_rgba(37,106,244,0.5)] text-white text-base font-bold">
                    <span className="truncate">Launch Visualizer</span>
                    <span className="material-symbols-outlined ml-2 text-sm">rocket_launch</span>
                </Link>
                <Link href="/learn" className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-12 px-6 bg-secondary hover:bg-[#343b48] transition-colors border border-white/10 text-white text-base font-bold">
                    <span className="truncate">Learn Git</span>
                    <span className="material-symbols-outlined ml-2 text-sm">school</span>
                </Link>
            </div>
        </div>

        <div className="w-full max-w-[1000px] relative group perspective-[1000px] mb-20">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            
            <div className="relative w-full aspect-[21/9] bg-[#0d1117] rounded-xl border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center">
                 <div className="absolute inset-0 bg-[radial-gradient(#282e39_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>
                 
                 <div className="absolute top-4 left-4 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                 </div>

                 <div className="z-10 text-center p-8 backdrop-blur-sm bg-black/40 rounded-xl border border-white/10 flex flex-col items-center">
                    <div className="relative mb-4">
                        <Image src="/logo.png" alt="GitHub Visualizer" width={96} height={96} className="animate-[float_4s_ease-in-out_infinite]" unoptimized />
                        <div className="absolute inset-0 blur-xl bg-primary/30 rounded-full animate-pulse -z-10"></div>
                    </div>
                    <p className="text-blue-100 font-mono text-sm tracking-wider">READY_TO_EXPLORE</p>
                 </div>
            </div>
        </div>

        <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
            {[
                { icon: "grid_view", title: "Treemap Visualization", desc: "See your entire repository as an interactive 2.5D heatmap. File size determines block height, colors indicate file types." },
                { icon: "school", title: "Interactive Git Learning", desc: "Master Git commands with a hands-on terminal simulator. Practice branching, merging, and more with visual feedback." },
                { icon: "palette", title: "Language Detection", desc: "Instantly identify file types with color-coded blocks. TypeScript, JavaScript, CSS, Python, and 30+ languages supported." }
            ].map((f, i) => (
                <div key={i} className="flex flex-col gap-3 p-6 rounded-2xl bg-secondary/30 border border-white/5 hover:border-primary/50 hover:bg-secondary/50 transition-all group">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:bg-primary group-hover:text-white transition-colors box-shadow-glow">
                        <span className="material-symbols-outlined">{f.icon}</span>
                    </div>
                    <h3 className="text-white text-xl font-bold font-display">{f.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed font-sans">{f.desc}</p>
                </div>
            ))}
        </div>

      </main>

      <footer className="py-6 text-center border-t border-white/5 bg-background/50 backdrop-blur-sm">
        <p className="text-gray-400 text-sm">
          Made with <span className="text-red-500">❤️</span> by{' '}
          <a 
            href="https://veerpratapsingh.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-blue-400 font-medium transition-colors"
          >
            Veer Pratap Singh
          </a>
        </p>
      </footer>
    </div>
  );
}
