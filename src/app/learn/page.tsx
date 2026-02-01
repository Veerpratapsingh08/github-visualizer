"use client";

import React from 'react';
import { Terminal } from '@/features/learn/Terminal';
import { GraphView } from '@/features/learn/GraphView';
import { TutorialSidebar } from '@/features/learn/TutorialSidebar';
import Link from 'next/link';

export default function LearnPage() {
  return (
    <div className="flex flex-col h-screen bg-background text-white font-display overflow-hidden">
      {/* Top Navigation */}
      <header className="flex items-center justify-between border-b border-white/5 bg-panel px-6 py-3 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/" className="size-8 text-primary bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-primary">hub</span>
          </Link>
          <h1 className="text-xl font-bold tracking-tight">GitViz <span className="text-primary font-normal">Learning</span></h1>
        </div>
        
        {/* Mock Search Bar */}
        <div className="hidden md:flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
            <span className="material-symbols-outlined text-gray-500 text-[18px]">search</span>
            <span className="text-sm text-gray-500 w-48">Search commands...</span>
            <span className="text-xs text-gray-600 border border-white/10 rounded px-1.5">⌘K</span>
        </div>

        <div className="flex items-center gap-3">
            <button className="size-9 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined">help</span>
            </button>
            <div className="h-4 w-[1px] bg-white/10 mx-1"></div>
            <div className="size-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 ring-2 ring-white/10"></div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar: Guide */}
        <aside className="w-80 flex flex-col border-r border-white/5 bg-background shrink-0 hidden md:flex">
             {/* Use existing component but wrap it to fit styling if needed */}
             {/* We might need to style TutorialSidebar to match this darker theme perfectly. 
                 It's currently using slate-900 which is close but maybe not exact match.
                 Let's wrap it in a div that forces some overrides or just let it coexist. */}
             <TutorialSidebar /> 
        </aside>

        {/* Center: Terminal */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0d1117] relative">
            {/* Terminal Header */}
            <div className="h-10 bg-panel border-b border-white/5 flex items-center px-4 justify-between select-none">
                <div className="flex items-center gap-2">
                    <span className="flex gap-1.5">
                        <span className="size-3 rounded-full bg-red-500/80"></span>
                        <span className="size-3 rounded-full bg-yellow-500/80"></span>
                        <span className="size-3 rounded-full bg-green-500/80"></span>
                    </span>
                    <span className="ml-4 text-xs font-mono text-gray-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">terminal</span>
                        user@gitviz:~/project
                    </span>
                </div>
            </div>
            
            {/* Terminal Content */}
            <div className="flex-1 overflow-hidden relative">
                <Terminal />
            </div>
        </main>

        {/* Right: Visualizer */}
        <aside className="w-[400px] bg-panel border-l border-white/5 flex flex-col shrink-0 hidden lg:flex">
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                    <span className="material-symbols-outlined text-primary text-lg">account_tree</span>
                    Commit Graph
                </h3>
            </div>
            <div className="flex-1 bg-[radial-gradient(#282e39_1px,transparent_1px)] [background-size:20px_20px] relative overflow-hidden">
                <GraphView />
            </div>
        </aside>

      </div>
    </div>
  );
}
