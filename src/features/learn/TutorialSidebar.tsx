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
    title: "1. Basics: Init & Commit",
    content: (
      <div className="space-y-2 text-sm text-slate-300">
        <p>Start by creating a simulated repository.</p>
        <code className="block bg-slate-900 p-2 rounded text-blue-400">git init</code>
        <p>This creates a hidden <b>.git</b> folder to track changes.</p>
        <p>Next, create a file and save your changes.</p>
        <code className="block bg-slate-900 p-2 rounded text-blue-400">touch hello.txt</code>
        <code className="block bg-slate-900 p-2 rounded text-blue-400">git add .</code>
        <code className="block bg-slate-900 p-2 rounded text-blue-400">git commit -m "start"</code>
        <p>Every commit is a snapshot of your project!</p>
      </div>
    ),
  },
  {
    title: "2. Branching Out",
    content: (
      <div className="space-y-2 text-sm text-slate-300">
        <p>Branches allow you to work on features without affecting the main code.</p>
        <code className="block bg-slate-900 p-2 rounded text-blue-400">git branch feature</code>
        <p>This creates a pointer to the current commit. Move to it:</p>
        <code className="block bg-slate-900 p-2 rounded text-blue-400">git checkout feature</code>
        <p>Now make a new commit on this branch:</p>
        <code className="block bg-slate-900 p-2 rounded text-blue-400">touch feature.txt</code>
        <code className="block bg-slate-900 p-2 rounded text-blue-400">git add .</code>
        <code className="block bg-slate-900 p-2 rounded text-blue-400">git commit -m "my feature"</code>
        <p>See how the graph grows sideways?</p>
      </div>
    ),
  },
  {
    title: "3. Merging",
    content: (
      <div className="space-y-2 text-sm text-slate-300">
        <p>Bring your feature back into the main branch.</p>
        <code className="block bg-slate-900 p-2 rounded text-blue-400">git checkout main</code>
        <code className="block bg-slate-900 p-2 rounded text-blue-400">git merge feature</code>
        <p>This combines the histories. In a real visualizer, you'd see the lines rejoin!</p>
      </div>
    ),
  },
];

export const TutorialSidebar = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-4 text-white font-bold pb-2 border-b border-slate-800">
        <BookOpen className="w-5 h-5 text-purple-400" />
        <span>Git Guide</span>
      </div>
      
      <div className="space-y-2">
        {lessons.map((lesson, i) => (
          <div key={i} className="border border-slate-800 rounded bg-slate-950/50 overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-800/50 transition-colors"
            >
              <span className="font-semibold text-slate-200">{lesson.title}</span>
              {openIndex === i ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            
            {openIndex === i && (
              <div className="p-3 border-t border-slate-800 animate-in slide-in-from-top-2 duration-200">
                {lesson.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
