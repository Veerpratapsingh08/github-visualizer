"use client";

import React, { useMemo, useState, useEffect } from "react";
import { GitNode, useGitStore } from "./GitEngine";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export const GraphView = () => {
  const { nodes, HEAD, branches, isInitialized } = useGitStore();
  const [newNodeId, setNewNodeId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<GitNode | null>(null);

  // Track new commits for pulse animation
  useEffect(() => {
    if (nodes.length > 0) {
      const latestNode = nodes[nodes.length - 1];
      setNewNodeId(latestNode.id);
      const timer = setTimeout(() => setNewNodeId(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [nodes.length]);

  // Memoize positions calculation
  const positions = useMemo(() => {
    const pos: Record<string, { x: number; y: number; color: string }> = {};

    nodes.forEach((node, i) => {
      let y = 0;
      let color = "#3b82f6"; // blue-500

      if (node.parentIds.length > 0) {
        const pid = node.parentIds[0];
        const pPos = pos[pid];
        if (pPos) {
          y = pPos.y;
        }
      }

      // Merge commits: use average Y of parents
      if (node.parentIds.length > 1) {
        color = "#a855f7"; // purple for merge
      }

      pos[node.id] = { x: 60 + i * 90, y: 0, color };
    });
    return pos;
  }, [nodes, branches]);

  // Empty state
  if (!isInitialized) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center mb-4 animate-pulse">
          <span className="material-symbols-outlined text-2xl text-slate-500">commit</span>
        </div>
        <p className="text-slate-400 text-sm">No repository yet</p>
        <p className="text-slate-500 text-xs mt-1">Run <code className="text-primary">git init</code> to start</p>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 rounded-full bg-green-900/30 border-2 border-green-600/50 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-2xl text-green-500">check</span>
        </div>
        <p className="text-slate-300 text-sm">Repository initialized!</p>
        <p className="text-slate-500 text-xs mt-1">Make your first commit to see the graph</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-transparent overflow-x-auto overflow-y-hidden">
      <div className="absolute inset-0 flex items-center p-10 min-w-max">
        {/* Edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#256af4" />
            </linearGradient>
          </defs>
          {nodes.map((node) =>
            node.parentIds.map((pid) => {
              const start = positions[pid];
              const end = positions[node.id];
              if (!start || !end) return null;
              const isNewEdge = node.id === newNodeId;
              return (
                <motion.line
                  key={`${pid}-${node.id}`}
                  x1={start.x}
                  y1="50%"
                  x2={end.x}
                  y2="50%"
                  stroke={isNewEdge ? "#256af4" : "#475569"}
                  strokeWidth={isNewEdge ? 3 : 2}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              );
            })
          )}
        </svg>

        <AnimatePresence>
          {nodes.map((node) => {
            const pos = positions[node.id];
            const isHead = HEAD === node.id;
            const isNew = newNodeId === node.id;
            const branchLabel = Object.entries(branches).find(([_, id]) => id === node.id)?.[0];
            const isMerge = node.parentIds.length > 1;

            return (
              <motion.div
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20,
                }}
                className="absolute transform -translate-y-1/2 flex flex-col items-center group cursor-pointer"
                style={{ left: pos.x, top: "50%" }}
                onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
              >
                {/* Pulse ring for new commits */}
                {isNew && (
                  <motion.div
                    className="absolute w-10 h-10 rounded-full border-2 border-primary"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                )}

                {/* Node Circle */}
                <div
                  className={clsx(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-200",
                    isHead && "border-green-400 bg-green-900 text-green-100 shadow-[0_0_12px_rgba(74,222,128,0.5)]",
                    !isHead && isMerge && "border-purple-400 bg-purple-900 text-purple-100",
                    !isHead && !isMerge && "border-slate-500 bg-slate-800 text-slate-400",
                    "hover:scale-110 hover:border-white"
                  )}
                >
                  <span className="text-[9px] font-mono font-bold">{node.id.substring(0, 4)}</span>
                </div>

                {/* Branch Label */}
                {branchLabel && (
                  <motion.div
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={clsx(
                      "absolute -top-9 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap font-medium",
                      branchLabel === "main" ? "bg-blue-600" : "bg-purple-600"
                    )}
                  >
                    {branchLabel}
                    {isHead && <span className="ml-1 text-[8px] opacity-70">← HEAD</span>}
                  </motion.div>
                )}

                {/* HEAD-only Label (no branch) */}
                {isHead && !branchLabel && (
                  <div className="absolute -top-9 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap font-medium">
                    HEAD
                  </div>
                )}

                {/* Hover Tooltip */}
                <div className="absolute top-10 w-40 text-center text-xs text-slate-300 bg-slate-900/95 border border-slate-700 px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-20">
                  <div className="font-mono text-[10px] text-slate-500 mb-1">{node.id}</div>
                  <div className="text-slate-200">{node.message}</div>
                  {isMerge && <div className="text-purple-400 text-[10px] mt-1">Merge commit</div>}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-4 text-[10px] text-slate-500 font-mono">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-600 border border-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]"></span>
          HEAD
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-slate-800 border-2 border-slate-500"></span>
          Commit
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-purple-900 border-2 border-purple-400"></span>
          Merge
        </span>
      </div>
    </div>
  );
};
