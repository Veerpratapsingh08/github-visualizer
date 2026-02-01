import React from 'react';
import { Terminal } from '@/features/learn/Terminal';
import { GraphView } from '@/features/learn/GraphView';
import { TutorialSidebar } from '@/features/learn/TutorialSidebar';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LearnPage() {
  return (
    <div className="flex flex-col h-screen bg-black text-white p-4 gap-4">
      {/* Header */}
      <header className="flex items-center gap-4 border-b border-slate-800 pb-4">
          <Link href="/" className="p-2 hover:bg-slate-800 rounded-full transition-colors">
              <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Learn Git Interactive
          </h1>
          <div className="ml-auto text-sm text-slate-500">
              Try: <code className="text-blue-400">git init</code>, then <code className="text-blue-400">git commit -m "hello"</code>
          </div>
      </header>

      {/* Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        
        {/* Left: Guide (3 cols) */}
        <div className="hidden lg:flex flex-col min-h-0 lg:col-span-3">
             <h2 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Tutorial</h2>
             <TutorialSidebar />
        </div>

        {/* Middle: Terminal (4 cols) */}
        <div className="flex flex-col min-h-0 lg:col-span-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Terminal</h2>
                <span className="lg:hidden text-xs text-blue-400">(Scroll down for Viz)</span>
            </div>
            <Terminal />
        </div>

        {/* Right: Graph Visualization (5 cols) */}
        <div className="flex flex-col min-h-0 lg:col-span-5">
            <h2 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Visualizer</h2>
            <div className="flex-1 bg-slate-900 rounded-lg border border-slate-800 relative overflow-hidden">
                <GraphView />
            </div>
        </div>

      </div>
    </div>
  );
}
