"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { CityScene } from "@/features/visualizer/CityScene";
import { RepoFile, fetchRepoTree, parseRepoUrl } from "@/features/visualizer/Fetcher";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function VisualizePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RepoFile[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showExploreHint, setShowExploreHint] = useState(true);
  const [focusMode, setFocusMode] = useState(false);

  const dismissHint = useCallback(() => {
    if (showExploreHint) setShowExploreHint(false);
  }, [showExploreHint]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.key.toLowerCase()) {
        case 'f':
          setFocusMode(prev => !prev);
          break;
        case 'r':
          console.log('Reset view');
          break;
        case '?':
          alert('Shortcuts:\\nF - Toggle Focus Mode\\nR - Reset Camera\\n? - Show this help');
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (data && showExploreHint) {
      const timer = setTimeout(() => setShowExploreHint(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [data, showExploreHint]);

  const stats = useMemo(() => {
    if (!data) return null;
    const totalFiles = data.length;
    const totalLOC = data.reduce((acc, f) => acc + ((f.size || 0) > 0 ? Math.ceil((f.size || 0) / 30) : 0), 0);
    
    const STATS_STYLES: Record<string, { bg: string, text: string, border: string, dot: string, label: string }> = {
        ts: { bg: 'bg-blue-500/10', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-500/20', dot: 'bg-blue-500', label: 'TypeScript' },
        tsx: { bg: 'bg-blue-500/10', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-500/20', dot: 'bg-blue-500', label: 'TypeScript' },
        js: { bg: 'bg-yellow-500/10', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-500/20', dot: 'bg-yellow-500', label: 'JavaScript' },
        jsx: { bg: 'bg-yellow-500/10', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-500/20', dot: 'bg-yellow-500', label: 'JavaScript' },
        css: { bg: 'bg-pink-500/10', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-500/20', dot: 'bg-pink-500', label: 'CSS' },
        html: { bg: 'bg-orange-500/10', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-500/20', dot: 'bg-orange-500', label: 'HTML' },
        vue: { bg: 'bg-green-500/10', text: 'text-green-700 dark:text-green-300', border: 'border-green-500/20', dot: 'bg-green-500', label: 'Vue' },
        json: { bg: 'bg-gray-500/10', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-500/20', dot: 'bg-gray-500', label: 'JSON' },
        md: { bg: 'bg-purple-500/10', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-500/20', dot: 'bg-purple-500', label: 'Markdown' },
    };

    const labelCounts: Record<string, number> = {};
    const labelStyles: Record<string, typeof STATS_STYLES[string]> = {};

    data.forEach(f => {
         const ext = f.path.split('.').pop()?.toLowerCase() || 'other';
         const style = STATS_STYLES[ext];
         
         const label = style ? style.label : ext.toUpperCase();
         const finalStyle = style || { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20', dot: 'bg-slate-500', label };

         labelCounts[label] = (labelCounts[label] || 0) + 1;
         if (!labelStyles[label]) labelStyles[label] = finalStyle;
    });

    const languages = Object.entries(labelCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([label, count]) => {
            return {
                ...labelStyles[label],
                count,
                percentage: Math.round((count / totalFiles) * 100),
            };
        });
        
    return { totalFiles, totalLOC, languages };
  }, [data]);

  const handleVisualize = async () => {
    if (!url.trim()) return;
    
    setLoading(true);
    setError(null);
    setData(null);

    const parsed = parseRepoUrl(url);
    if (!parsed) {
      setError("Invalid GitHub URL. Please use format: owner/repo");
      setLoading(false);
      return;
    }

    try {
      const files = await fetchRepoTree(parsed.owner, parsed.repo);
      setData(files);
    } catch (err: any) {
      setError(err.message || "Failed to fetch repository");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#101622] text-white font-display">
      <header className="flex items-center justify-between border-b border-solid border-white/5 bg-[#111318]/90 backdrop-blur-md px-6 py-3 z-50 shrink-0">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="GitHub Visualizer" width={32} height={32} className="rounded-lg" unoptimized />
          <h2 className="text-white text-xl font-bold leading-tight tracking-tight">CodeCity</h2>
        </Link>
        
        <div className="flex flex-col min-w-40 h-10 w-full max-w-[500px]">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full group bg-[#1b1f27] focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <div className="text-slate-400 flex border-none items-center justify-center pl-3">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input 
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg bg-transparent text-white focus:outline-0 focus:ring-0 border-none h-full placeholder:text-slate-400 px-3 text-sm font-normal leading-normal" 
              placeholder="Enter GitHub URL (e.g. pmndrs/zustand)..." 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVisualize()}
            />
            {error ? (
              <div className="text-red-400 text-xs flex items-center pr-3 whitespace-nowrap">Error</div>
            ) : (
              <div className="text-slate-500 text-xs flex items-center pr-3 font-mono">Enter</div>
            )}
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 relative overflow-hidden bg-slate-900">
            <div className="absolute inset-0 z-0">
                 {data ? (
                     <CityScene files={data} />
                 ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
                              <div className="absolute inset-0 opacity-20">
                                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[linear-gradient(rgba(37,106,244,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(37,106,244,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)] origin-bottom"></div>
                              </div>
                              <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 flex gap-4 opacity-30">
                                  <div className="w-8 h-20 bg-gradient-to-t from-blue-500/40 to-transparent rounded-t animate-pulse"></div>
                                  <div className="w-12 h-32 bg-gradient-to-t from-purple-500/40 to-transparent rounded-t animate-pulse delay-100"></div>
                                  <div className="w-6 h-16 bg-gradient-to-t from-yellow-500/40 to-transparent rounded-t animate-pulse delay-200"></div>
                                  <div className="w-10 h-24 bg-gradient-to-t from-blue-500/40 to-transparent rounded-t animate-pulse delay-75"></div>
                                  <div className="w-8 h-28 bg-gradient-to-t from-green-500/40 to-transparent rounded-t animate-pulse delay-150"></div>
                                  <div className="w-14 h-36 bg-gradient-to-t from-blue-500/40 to-transparent rounded-t animate-pulse delay-300"></div>
                                  <div className="w-6 h-14 bg-gradient-to-t from-pink-500/40 to-transparent rounded-t animate-pulse delay-200"></div>
                              </div>
                          </div>
                          
                          <div className="relative z-10">
                              <div className="bg-primary/10 p-4 rounded-full mb-6 ring-1 ring-primary/20">
                                   <Image src="/logo.png" alt="GitHub Visualizer" width={64} height={64} className="animate-[float_4s_ease-in-out_infinite]" />
                              </div>
                              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">Build Your Code City</h1>
                              <p className="text-slate-400 max-w-md text-lg mb-8">Paste a GitHub URL to transform any repository into an immersive 3D metropolis.</p>
                              
                              <div className="flex flex-col items-center gap-3">
                                  <span className="text-xs text-slate-500 uppercase tracking-wider">Try these</span>
                                  <div className="flex flex-wrap justify-center gap-2">
                                      {[
                                          { name: 'React', repo: 'facebook/react' },
                                          { name: 'Next.js', repo: 'vercel/next.js' },
                                          { name: 'Zustand', repo: 'pmndrs/zustand' },
                                      ].map(({ name, repo }) => (
                                          <button 
                                              key={repo}
                                              onClick={() => { setUrl(repo); }}
                                              className="px-4 py-2 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 rounded-full text-sm text-slate-300 hover:text-white transition-all group"
                                          >
                                              <span className="group-hover:text-primary transition-colors">{name}</span>
                                              <span className="text-slate-500 ml-2 text-xs font-mono">{repo}</span>
                                          </button>
                                      ))}
                                  </div>
                              </div>
                          </div>
                          
                          {loading && (
                               <div className="mt-8 flex items-center gap-3 text-primary bg-primary/10 px-6 py-2 rounded-full border border-primary/20 relative z-10">
                                   <Loader2 className="animate-spin w-5 h-5" />
                                   <span className="font-mono text-sm">Fetching repository data...</span>
                               </div>
                          )}
                          {error && (
                               <div className="mt-8 text-red-400 bg-red-900/20 px-6 py-2 rounded-full border border-red-900/50 relative z-10">
                                   {error}
                               </div>
                          )}
                     </div>
                 )}
                 {loading && data && (
                     <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                         <div className="flex flex-col items-center">
                             <Loader2 className="animate-spin text-primary w-12 h-12 mb-4" />
                             <p className="text-white font-mono">Updating Visualizer...</p>
                         </div>
                     </div>
                 )}
            </div>

            {data && stats && !focusMode && (
                <div className={`absolute left-4 top-4 z-40 flex flex-col gap-2 pointer-events-none transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-12'}`}>
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="size-12 bg-[#111318]/80 backdrop-blur-md rounded-xl border border-slate-800 pointer-events-auto flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all shadow-lg"
                        title={sidebarOpen ? 'Collapse' : 'Expand'}
                    >
                        <span className="material-symbols-outlined text-xl">{sidebarOpen ? 'chevron_left' : 'bar_chart'}</span>
                    </button>
                    
                    {sidebarOpen && (
                        <>
                            <div className="bg-[#111318]/80 backdrop-blur-md rounded-xl p-4 shadow-lg border border-slate-800 pointer-events-auto animate-in slide-in-from-left-4 duration-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Vitality</span>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Total Files</p>
                                        <p className="text-white text-2xl font-bold leading-none">{stats.totalFiles.toLocaleString()}</p>
                                    </div>
                                    <div className="h-px bg-slate-700 w-full"></div>
                                    <div>
                                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Estimated LOC</p>
                                        <p className="text-white text-2xl font-bold leading-none">{stats.totalLOC.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-[#111318]/80 backdrop-blur-md rounded-xl p-3 shadow-lg border border-slate-800 pointer-events-auto animate-in slide-in-from-left-4 duration-200 delay-75">
                                <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-3 px-1">Languages</p>
                                <div className="flex flex-wrap gap-2">
                                    {stats.languages.map((lang) => (
                                        <div key={lang.label} className={`flex h-7 shrink-0 items-center justify-center gap-x-2 rounded-md ${lang.bg} px-3 border ${lang.border}`}>
                                            <span className={`size-2 rounded-full ${lang.dot}`}></span>
                                            <p className={`${lang.text} text-xs font-semibold`}>{lang.label}</p>
                                            <span className={`${lang.text} opacity-60 text-xs`}>{lang.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {data && showExploreHint && !focusMode && (
                <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none animate-in fade-in-0 zoom-in-95 duration-500"
                    onClick={dismissHint}
                >
                    <div className="bg-black/70 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white/80 text-sm flex items-center gap-3 shadow-2xl">
                        <span className="material-symbols-outlined text-primary animate-pulse">pan_tool</span>
                        <span>Hover buildings for details · Drag to orbit</span>
                    </div>
                </div>
            )}

            {data && !focusMode && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 hidden md:block pointer-events-none">
                    <div className="bg-black/80 backdrop-blur-md text-white/80 text-xs px-4 py-2 rounded-full border border-white/10 font-mono flex items-center gap-3 shadow-lg">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>Live</span>
                        <span className="opacity-50">|</span>
                        <span>Objects: {stats?.totalFiles.toLocaleString()}</span>
                        <span className="opacity-50">|</span>
                        <span className="text-slate-500">Press ? for shortcuts</span>
                    </div>
                </div>
            )}

            {focusMode && (
                <button 
                    onClick={() => setFocusMode(false)}
                    className="absolute top-4 right-4 z-50 bg-black/60 backdrop-blur-md text-white/80 text-xs px-4 py-2 rounded-full border border-white/20 font-mono flex items-center gap-2 shadow-lg hover:bg-black/80 transition-colors pointer-events-auto"
                >
                    <span className="material-symbols-outlined text-sm">fullscreen_exit</span>
                    Exit Focus (F)
                </button>
            )}
      </div>
    </div>
  );
}
