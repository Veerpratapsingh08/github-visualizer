"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

type Command = {
  command: string;
  description: string;
};

type Topic = {
  title: string;
  commands: Command[];
};

type Module = {
  name: string;
  icon: string;
  topics: Topic[];
};

const gitCourse: Module[] = [
  {
    name: "Getting Started",
    icon: "rocket_launch",
    topics: [
      {
        title: "Git Introduction",
        commands: [
          { command: "git --version", description: "Check Git version" },
          { command: "git config --global user.name \"Your Name\"", description: "Set your username" },
          { command: "git config --global user.email \"you@example.com\"", description: "Set your email" },
        ],
      },
      {
        title: "Initialize Repository",
        commands: [
          { command: "git init", description: "Initialize a new Git repository" },
          { command: "git status", description: "Check repository status" },
        ],
      },
    ],
  },
  {
    name: "Basic Commands",
    icon: "terminal",
    topics: [
      {
        title: "Staging Files",
        commands: [
          { command: "git add <file>", description: "Stage a specific file" },
          { command: "git add .", description: "Stage all changes" },
          { command: "git add -A", description: "Stage all (including deletions)" },
        ],
      },
      {
        title: "Committing",
        commands: [
          { command: "git commit -m \"message\"", description: "Commit with message" },
          { command: "git commit -am \"message\"", description: "Add and commit in one step" },
          { command: "git log", description: "View commit history" },
          { command: "git log --oneline", description: "Compact commit history" },
        ],
      },
      {
        title: "Viewing Changes",
        commands: [
          { command: "git diff", description: "Show unstaged changes" },
          { command: "git diff --staged", description: "Show staged changes" },
          { command: "git show <commit>", description: "Show commit details" },
        ],
      },
    ],
  },
  {
    name: "Branching",
    icon: "account_tree",
    topics: [
      {
        title: "Branch Basics",
        commands: [
          { command: "git branch", description: "List all branches" },
          { command: "git branch <name>", description: "Create new branch" },
          { command: "git branch -d <name>", description: "Delete branch" },
          { command: "git branch -m <new>", description: "Rename current branch" },
        ],
      },
      {
        title: "Switching Branches",
        commands: [
          { command: "git checkout <branch>", description: "Switch to branch" },
          { command: "git checkout -b <name>", description: "Create and switch" },
          { command: "git switch <branch>", description: "Switch (newer syntax)" },
          { command: "git switch -c <name>", description: "Create and switch (newer)" },
        ],
      },
      {
        title: "Merging",
        commands: [
          { command: "git merge <branch>", description: "Merge branch into current" },
          { command: "git merge --no-ff <branch>", description: "Merge with commit" },
          { command: "git merge --abort", description: "Abort merge" },
        ],
      },
    ],
  },
  {
    name: "Remote Repositories",
    icon: "cloud_sync",
    topics: [
      {
        title: "Remote Setup",
        commands: [
          { command: "git remote add origin <url>", description: "Add remote repository" },
          { command: "git remote -v", description: "List remotes" },
          { command: "git remote remove <name>", description: "Remove remote" },
        ],
      },
      {
        title: "Push & Pull",
        commands: [
          { command: "git push origin <branch>", description: "Push to remote" },
          { command: "git push -u origin <branch>", description: "Push and set upstream" },
          { command: "git pull", description: "Fetch and merge" },
          { command: "git fetch", description: "Fetch without merge" },
        ],
      },
      {
        title: "Cloning",
        commands: [
          { command: "git clone <url>", description: "Clone repository" },
          { command: "git clone <url> <dir>", description: "Clone to directory" },
        ],
      },
    ],
  },
  {
    name: "Undoing Changes",
    icon: "undo",
    topics: [
      {
        title: "Unstaging & Reverting",
        commands: [
          { command: "git restore <file>", description: "Discard changes" },
          { command: "git restore --staged <file>", description: "Unstage file" },
          { command: "git reset HEAD~1", description: "Undo last commit (keep changes)" },
          { command: "git reset --hard HEAD~1", description: "Undo and discard changes" },
        ],
      },
      {
        title: "Revert & Amend",
        commands: [
          { command: "git revert <commit>", description: "Revert a commit" },
          { command: "git commit --amend", description: "Modify last commit" },
          { command: "git commit --amend -m \"new\"", description: "Change commit message" },
        ],
      },
    ],
  },
  {
    name: "Advanced",
    icon: "bolt",
    topics: [
      {
        title: "Stashing",
        commands: [
          { command: "git stash", description: "Stash changes" },
          { command: "git stash pop", description: "Apply and remove stash" },
          { command: "git stash list", description: "List stashes" },
          { command: "git stash drop", description: "Delete stash" },
        ],
      },
      {
        title: "Rebasing",
        commands: [
          { command: "git rebase <branch>", description: "Rebase onto branch" },
          { command: "git rebase -i HEAD~3", description: "Interactive rebase" },
          { command: "git rebase --abort", description: "Abort rebase" },
        ],
      },
      {
        title: "Tags",
        commands: [
          { command: "git tag <name>", description: "Create tag" },
          { command: "git tag -a <name> -m \"msg\"", description: "Annotated tag" },
          { command: "git push --tags", description: "Push all tags" },
        ],
      },
    ],
  },
];

export const TutorialSidebar = () => {
  const [openModule, setOpenModule] = useState<number>(0);
  const [openTopic, setOpenTopic] = useState<string | null>("Git Introduction");

  return (
    <aside className="w-80 flex flex-col border-r border-[#30363d] bg-[#0d1117] shrink-0 h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#30363d]">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-[#256af4]">menu_book</span>
          Git Reference
        </h2>
        <p className="text-xs text-gray-500 mt-1">Complete command reference</p>
      </div>

      {/* Modules List */}
      <div className="flex-1 overflow-y-auto">
        {gitCourse.map((module, moduleIdx) => (
          <div key={module.name} className="border-b border-[#30363d]/50">
            {/* Module Header */}
            <button
              onClick={() => setOpenModule(openModule === moduleIdx ? -1 : moduleIdx)}
              className={clsx(
                "w-full flex items-center justify-between px-4 py-3 hover:bg-[#161b22] transition-colors",
                openModule === moduleIdx && "bg-[#161b22]"
              )}
            >
              <div className="flex items-center gap-3">
                <span className={clsx(
                  "material-symbols-outlined text-lg",
                  openModule === moduleIdx ? "text-[#256af4]" : "text-gray-500"
                )}>
                  {module.icon}
                </span>
                <span className={clsx(
                  "font-medium text-sm",
                  openModule === moduleIdx ? "text-white" : "text-gray-300"
                )}>
                  {module.name}
                </span>
              </div>
              <ChevronDown 
                size={16} 
                className={clsx(
                  "text-gray-500 transition-transform",
                  openModule === moduleIdx && "rotate-180 text-[#256af4]"
                )} 
              />
            </button>

            {/* Topics */}
            {openModule === moduleIdx && (
              <div className="bg-[#0d1117] pb-2">
                {module.topics.map((topic) => (
                  <div key={topic.title}>
                    {/* Topic Header */}
                    <button
                      onClick={() => setOpenTopic(openTopic === topic.title ? null : topic.title)}
                      className={clsx(
                        "w-full flex items-center justify-between pl-11 pr-4 py-2 text-left hover:bg-[#161b22]/50 transition-colors",
                        openTopic === topic.title && "bg-[#256af4]/10"
                      )}
                    >
                      <span className={clsx(
                        "text-sm",
                        openTopic === topic.title ? "text-[#256af4] font-medium" : "text-gray-400"
                      )}>
                        {topic.title}
                      </span>
                      <span className="text-[10px] text-gray-600 bg-[#21262d] px-1.5 py-0.5 rounded">
                        {topic.commands.length}
                      </span>
                    </button>

                    {/* Commands */}
                    {openTopic === topic.title && (
                      <div className="pl-11 pr-4 pb-3 space-y-2">
                        {topic.commands.map((cmd, idx) => (
                          <div 
                            key={idx}
                            className="bg-[#161b22] border border-[#30363d]/50 rounded-lg p-2.5 hover:border-[#256af4]/50 transition-colors cursor-pointer group"
                          >
                            <code className="text-xs font-mono text-green-400 block mb-1 group-hover:text-green-300">
                              {cmd.command}
                            </code>
                            <span className="text-[11px] text-gray-500">
                              {cmd.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[#30363d] bg-[#0d1117]">
        <p className="text-[10px] text-gray-600 text-center">
          Try commands in the terminal →
        </p>
      </div>
    </aside>
  );
};
