import Link from "next/link";
import { ArrowRight, Github, Code2, PlayCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
      
      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        
        <div className="mb-8 p-4 bg-slate-900/50 rounded-full border border-slate-800 flex items-center gap-2 animate-fade-in-up">
           <Github className="w-5 h-5 text-white" />
           <span className="text-sm text-slate-400">Open Source Visualization Tool</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent max-w-4xl">
           Visualize Your Codebase
           <br />
           <span className="text-slate-700 block mt-2 text-4xl md:text-6xl">Like Never Before</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Explore GitHub repositories as immersive 3D cities or interactive galaxies. 
          Master Git commands with our real-time interactive simulator.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link 
            href="/visualize" 
            className="group flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
          >
            <Code2 className="w-5 h-5" />
            Launch Visualizer
          </Link>
          
          <Link 
            href="/learn" 
            className="group flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 border border-slate-700"
          >
            <PlayCircle className="w-5 h-5 group-hover:text-green-400 transition-colors" />
            Learn Git
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-600 text-sm border-t border-slate-900">
        <p>© 2026 GitHub Visualizer. Built with Next.js & Three.js.</p>
      </footer>
    </div>
  );
}
