"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { ChevronRight, ChevronDown, BookOpen } from "lucide-react";

type Lesson = {
  title: string;
  content: React.ReactNode;
};

const lessons: Lesson[] = [
  {
    title: "1. Intro to Branches",
    content: (
      <div className="space-y-4 text-sm text-gray-400">
        <p>Branches allow you to develop features, fix bugs, or experiment with new ideas in a contained area of your repository.</p>
        <div className="bg-black/40 rounded p-3 border border-border-dark/50 font-mono text-xs">
          <code className="text-blue-400">git branch feature-login</code>
        </div>
      </div>
    ),
  },
  {
    title: "2. Checking Status",
    content: (
      <div className="space-y-4 text-sm text-gray-400">
        <p>Always check your status before creating a new branch to ensure a clean working directory.</p>
        <div className="bg-black/40 rounded p-3 border border-border-dark/50 font-mono text-xs">
           <code className="text-yellow-400">git status</code>
        </div>
      </div>
    ),
  },
  {
    title: "3. Creating Feature Branch",
    content: (
      <div className="space-y-4 text-sm text-gray-400">
         <p>Use the checkout command with the <code className="text-primary bg-primary/10 px-1 rounded">-b</code> flag to create and switch to a new branch simultaneously.</p>
         <div className="bg-black/40 rounded p-3 border border-border-dark/50 font-mono text-xs">
           <code className="text-green-400">git checkout -b feature-login</code>
         </div>
      </div>
    ),
  },
  {
    title: "4. Verifying Branch",
    content: (
      <div className="space-y-4 text-sm text-gray-400">
        <p>Verify that your HEAD has moved to the new branch.</p>
        <div className="bg-black/40 rounded p-3 border border-border-dark/50 font-mono text-xs">
           <code className="text-blue-400">git branch</code>
        </div>
      </div>
    ),
  },
];

export const TutorialSidebar = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(2); // Default to 3rd item open like design

  return (
    <aside className="w-80 flex flex-col border-r border-border-dark bg-background-dark shrink-0 h-full">
      {/* Breadcrumbs & Context */}
      <div className="p-5 border-b border-border-dark">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-3">
          <a className="hover:text-primary transition-colors" href="#">Courses</a>
          <span>/</span>
          <a className="hover:text-primary transition-colors" href="#">Git Basics</a>
        </div>
        <h2 className="text-lg font-bold mb-1 text-white">Branching & Merging</h2>
        <p className="text-xs text-gray-400 mb-4">Module 3 of 5</p>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-primary">Level Progress</span>
            <span className="text-white">45%</span>
          </div>
          <div className="h-1.5 w-full bg-border-dark rounded-full overflow-hidden">
            <div className="h-full bg-primary shadow-glow-sm rounded-full" style={{ width: "45%" }}></div>
          </div>
        </div>
      </div>

      {/* Steps Accordion */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">Current Task</h3>
        
        {lessons.map((lesson, i) => {
           const isOpen = openIndex === i;
           const isCompleted = i < 2; // Mock state from design
           
           return (
            <div 
                key={i} 
                className={clsx(
                    "group rounded-xl border bg-panel-bg transition-all overflow-hidden",
                    isOpen ? "border-primary shadow-glow-sm" : "border-border-dark"
                )}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex cursor-pointer items-center justify-between px-4 py-3 select-none"
              >
                <div className="flex items-center gap-3">
                  <div className={clsx(
                      "flex items-center justify-center size-6 rounded-full text-xs font-bold",
                      isCompleted ? "bg-green-500/20 text-green-500" : (isOpen ? "bg-primary text-white shadow-glow" : "bg-border-dark text-gray-400")
                  )}>
                    {isCompleted ? <span className="material-symbols-outlined text-[16px]">check</span> : i + 1}
                  </div>
                  <span className={clsx("text-sm font-medium", isOpen ? "text-white font-bold" : "text-gray-300")}>
                      {lesson.title}
                  </span>
                </div>
                <ChevronDown size={16} className={clsx("text-gray-500 transition-transform", isOpen && "rotate-180 text-white")} />
              </button>
              
              {isOpen && (
                <div className="px-4 pb-4 pt-1 pl-[3.25rem] animate-in slide-in-from-top-2 duration-200">
                  {lesson.content}
                </div>
              )}
            </div>
           );
        })}
      </div>
    </aside>
  );
};
