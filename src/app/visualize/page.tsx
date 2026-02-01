"use client";

import Link from "next/link";
import { useState } from "react";
import { fetchRepoTree, parseRepoUrl } from "@/features/visualizer/Fetcher";
import { Loader2 } from "lucide-react";
import { CityScene } from "@/features/visualizer/CityScene";

export default function VisualizePage() {
  const [url, setUrl] = useState("facebook/react");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  const handleVisualize = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setData(null);

    const match = parseRepoUrl(url);
    if (!match) {
        setError("Invalid GitHub URL. Use 'owner/repo' or full URL.");
        setLoading(false);
        return;
    }

    try {
        const tree = await fetchRepoTree(match.owner, match.repo);
        console.log("Fetched Tree:", tree);
        setData(tree); // Temporary visualization: count
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden">
        {/* Header / Input */}
        <header className="p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between gap-4 z-10">
             <div className="flex items-center gap-4">
                 <Link href="/" className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    GH Viz
                 </Link>
                 <form onSubmit={handleVisualize} className="flex gap-2">
                     <input 
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded px-3 py-1 text-sm w-64 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="owner/repo"
                     />
                     <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-3 py-1 rounded text-sm font-semibold transition-colors"
                     >
                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Load"}
                     </button>
                 </form>
             </div>
             {error && <span className="text-red-400 text-sm">{error}</span>}
        </header>

        {/* Canvas Area */}
        <div className="flex-1 relative bg-black">
            {!data && !loading && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                    Enter a repository URL to generate a Code City.
                </div>
            )}
            
            {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-400 animate-pulse gap-2">
                    <Loader2 className="animate-spin w-8 h-8" />
                    <span>Scanning Repository Structure...</span>
                </div>
            )}

            {data && (
                <CityScene files={data} />
            )}
        </div>
    </div>
  );
}
