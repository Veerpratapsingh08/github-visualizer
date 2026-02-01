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
      <header className="flex items-center border-b border-[#30363d] bg-[#161b22] px-6 py-3 shrink-0 z-20">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="GitHub Visualizer" width={32} height={32} className="rounded-lg" unoptimized />
          <h1 className="text-xl font-bold tracking-tight">GitViz <span className="text-[#256af4] font-normal">Learning</span></h1>
        </Link>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <TutorialSidebar />
        <Terminal />

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
               <GraphView />
            </div>

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
