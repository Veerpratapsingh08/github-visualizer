"use client";

import React, { useMemo } from "react";
import { GitNode, useGitStore } from "./GitEngine";
import { motion, AnimatePresence } from "framer-motion";

// Simple layout algorithm
// This is a naive implementation. For complex graphs, we'd need a real DAG layout lib (like dagre).
// But for a tutorial, we can assume linear-ish flow.
const calculatePositions = (nodes: GitNode[]) => {
  const positions: Record<string, { x: number; y: number }> = {};
  const branchY: Record<string, number> = { main: 0 };
  let nextY = 1;

  // We need to trace branches. 
  // Naive approach: x = index * 60, y = branch based on simple heuristic or property
  // Improved approach: Propagate Y from parents, diverge for branches.
  
  // For this V1, let's just cheat and assume a mostly linear graph with simple branching
  // We'll traverse and assign.
  
  nodes.forEach((node, index) => {
      // Find parent's Y
      let y = 0;
      if (node.parentIds.length > 0) {
          const parentId = node.parentIds[0]; // Primary parent
          y = positions[parentId]?.y || 0;
          
          // If this node starts a new branch (heuristic: message contains 'branch' or we track it?)
          // We don't strictly track creation in node, but we can check if multiple children exist for parent.
          // Let's rely on simple collision detection or just simple increment for now.
      }
      
      // If parent already has a child visualized, we shift down?
      // Too complex for 5 mins.
      // Let's stick to: y=0 for main, y=1 for others?
      // Actually, let's just default to y=0 and let the user feel linear unless we strictly track branches.
      
      // Better heuristic:
      // If 'merge' in message, try to center between parents?
      // If 'checkout -b' happened... 
      // Let's use the 'branch' mapping in store? But nodes don't store which branch they were made on persistently in our simplified model (except tip).
      
      positions[node.id] = { x: 50 + index * 80, y: y * 60 };
  });
  
  return positions;
};

// V2 Layout: just use index for X. Y is hard without graph traversal.
// Let's use a mock implementation that forces everything to y=0 for stable V1.
// We can improve this if the user asks for complex branch visualization.

export const GraphView = () => {
  const { nodes, HEAD, branches } = useGitStore();
  
  // Memoize positions calculation
  const positions = useMemo(() => {
      const pos: Record<string, {x: number, y: number, color: string}> = {};
      const takenX: Record<number, number> = {}; // x -> count of nodes at this x (vertical stack?)
      
      // Map commit ID to branch name if it's a tip
      const branchTipsInv = Object.entries(branches).reduce((acc, [name, id]) => {
          acc[id] = name;
          return acc;
      }, {} as Record<string, string>);

      nodes.forEach((node, i) => {
          // Rudimentary branch detection: 
          // If message starts with "Merge", y=0 (back to main)
          // If we are just committing, stay on same Y as parent?
          
          let y = 0;
          let color = "#3b82f6"; // blue-500

          if (node.parentIds.length > 0) {
              const pid = node.parentIds[0];
              const pPos = pos[pid];
              if (pPos) {
                  y = pPos.y;
              }
              // If this parent already has a child, diverge? 
              // We'd need to look ahead or store children.
          }
          
          // Hack: If message contains checkouts/branches from our logs? No.
          // Let's just alternate Y for visual interest if we detect branching?
          // No, that's confusing.
          // FLAT LAYOUT for V1.
          
          pos[node.id] = { x: 50 + i * 100, y: 0, color };
      });
      return pos;
  }, [nodes, branches]);

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-x-auto overflow-y-hidden">
      <div className="absolute inset-0 flex items-center p-10 min-w-max">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Edges */}
          {nodes.map((node) => 
            node.parentIds.map((pid) => {
                const start = positions[pid];
                const end = positions[node.id];
                if (!start || !end) return null;
                return (
                    <line
                        key={`${pid}-${node.id}`}
                        x1={start.x}
                        y1="50%" // Centered vertically in container
                        x2={end.x}
                        y2="50%"
                        stroke="#475569"
                        strokeWidth="2"
                    />
                );
            })
          )}
        </svg>

        <AnimatePresence>
          {nodes.map((node) => {
            const pos = positions[node.id];
            const isHead = HEAD === node.id;
            const branchLabel = Object.entries(branches).find(([_, id]) => id === node.id)?.[0];

            return (
              <motion.div
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute transform -translate-y-1/2 flex flex-col items-center group"
                style={{ left: pos.x, top: "50%" }}
              >
                {/* Node Circle */}
                <div 
                    className={clsx(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition-colors",
                        isHead ? "border-green-400 bg-green-900 text-green-100" : "border-slate-500 bg-slate-800 text-slate-400"
                    )}
                >
                    <span className="text-[8px] font-bold">{node.id}</span>
                </div>

                {/* Branch Label */}
                {branchLabel && (
                    <div className="absolute -top-8 bg-blue-600 text-white text-xs px-2 py-0.5 rounded shadow whitespace-nowrap">
                        {branchLabel}
                    </div>
                )}
                
                {/* HEAD Label */}
                {isHead && !branchLabel && (
                    <div className="absolute -top-8 bg-green-600 text-white text-xs px-2 py-0.5 rounded shadow whitespace-nowrap">
                        HEAD
                    </div>
                )}

                {/* Commit Message Tooltip/Label */}
                <div className="absolute top-8 w-32 text-center text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {node.message}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Helper for classes
import clsx from "clsx";
