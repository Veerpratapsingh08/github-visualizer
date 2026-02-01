"use client";

import React from 'react';
import { Terminal } from '@/features/learn/Terminal';
import { GraphView } from '@/features/learn/GraphView';
import { TutorialSidebar } from '@/features/learn/TutorialSidebar';
import Link from 'next/link';
import Image from 'next/image';

export default function LearnPage() {
  return (
    <div className="flex flex-col h-screen bg-[#101622] text-white font-display overflow-hidden">
      {/* Top Navigation */}
      <header className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-6 py-3 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="GitHub Visualizer" width={28} height={28} className="rounded-lg" />
            <h1 className="text-xl font-bold tracking-tight">GitViz <span className="text-[#256af4] font-normal">Learning</span></h1>
          </Link>
        </div>
        
        {/* Mock Search Bar */}
        <div className="hidden md:flex items-center gap-2 bg-[#101622]/50 px-3 py-1.5 rounded-lg border border-[#30363d]/50">
            <span className="material-symbols-outlined text-gray-400 text-[18px]">search</span>
            <input 
                className="bg-transparent border-none focus:ring-0 text-sm w-48 p-0 text-gray-300 placeholder-gray-500" 
                placeholder="Search commands..." 
                type="text"
            />
            <span className="text-xs text-gray-500 border border-gray-600 rounded px-1.5">⌘K</span>
        </div>

        <div className="flex items-center gap-3">
            <button className="flex items-center justify-center size-9 rounded-lg hover:bg-[#30363d] transition-colors text-gray-400 hover:text-white">
                <span className="material-symbols-outlined">settings</span>
            </button>
            <button className="flex items-center justify-center size-9 rounded-lg hover:bg-[#30363d] transition-colors text-gray-400 hover:text-white">
                <span className="material-symbols-outlined">help</span>
            </button>
            <div className="h-8 w-[1px] bg-[#30363d] mx-1"></div>
            <div className="size-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 ring-1 ring-[#30363d]"></div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar: Guide */}
        <TutorialSidebar />

        {/* Center: Terminal */}
        <Terminal />

        {/* Right: Visualizer */}
        <aside className="w-[360px] bg-[#161b22] border-l border-[#30363d] flex flex-col shrink-0 hidden lg:flex">
            <div className="p-4 border-b border-[#30363d] flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#256af4]">account_tree</span>
                    Commit Graph
                </h3>
                <div className="flex gap-1">
                    <button className="p-1 hover:bg-[#30363d] rounded text-gray-400 hover:text-white" title="Zoom Out">
                        <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <button className="p-1 hover:bg-[#30363d] rounded text-gray-400 hover:text-white" title="Zoom In">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto relative bg-[radial-gradient(#282e39_1px,transparent_1px)] [background-size:20px_20px]">
                {/* We render our GraphView here, but we need to ensure it has transparent background or matches */}
               <GraphView />
            </div>

            {/* Legend */}
            <div className="p-3 bg-[#161b22] border-t border-[#30363d] text-[10px] text-gray-500 flex justify-center gap-4">
                <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-[#256af4] shadow-[0_0_5px_rgba(37,106,244,0.4)]"></div> Current HEAD</div>
                <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-blue-500"></div> Committed</div>
                <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-gray-500"></div> Ancestor</div>
            </div>
        </aside>

      </div>
    </div>
  );
}
