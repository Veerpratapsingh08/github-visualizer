"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useGitStore } from "./GitEngine";
import clsx from "clsx";

// Smart suggestions for common mistakes
const SUGGESTIONS: Record<string, string> = {
  push: "⚠ 'push' isn't available in this simulation. Try 'git commit' to save changes locally.",
  pull: "⚠ 'pull' isn't available in this simulation. This is a local sandbox.",
  clone: "⚠ 'clone' isn't available. This sandbox starts with an empty repo. Try 'git init'.",
  remote: "⚠ 'remote' isn't available. This is a local-only simulation.",
  fetch: "⚠ 'fetch' isn't available. No remote server in this simulation.",
  stash: "⚠ 'stash' isn't implemented yet. Try 'git status' to see your changes.",
  rebase: "⚠ 'rebase' isn't implemented. Try 'git merge' instead.",
};

// Typo corrections
const TYPO_MAP: Record<string, string> = {
  comit: "commit",
  commti: "commit",
  brnach: "branch",
  brach: "branch",
  chekout: "checkout",
  chekcout: "checkout",
  statsu: "status",
  satus: "status",
  mege: "merge",
  mereg: "merge",
};

type HistoryEntry = {
  type: 'command' | 'output' | 'error' | 'success';
  content: string;
};

export const Terminal = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', content: `Last login: ${new Date().toLocaleString()} on ttys001` },
    { type: 'output', content: '' },
    { type: 'output', content: '💡 Welcome to GitViz! Try: git init' },
  ]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showIdleHint, setShowIdleHint] = useState(false);
  const [lastCommandTime, setLastCommandTime] = useState(Date.now());
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const git = useGitStore();

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Idle hint timer
  useEffect(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    
    idleTimerRef.current = setTimeout(() => {
      setShowIdleHint(true);
    }, 10000); // Show hint after 10s idle
    
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [lastCommandTime]);

  // Hide hint on input
  useEffect(() => {
    if (input.length > 0) setShowIdleHint(false);
  }, [input]);

  // Get contextual idle hint
  const getIdleHint = useCallback(() => {
    if (!git.isInitialized) return "git init";
    if (git.workingDirectory.length === 0 && git.staging.length === 0) return "touch index.js";
    if (git.workingDirectory.length > 0) return `git add ${git.workingDirectory[0]}`;
    if (git.staging.length > 0) return `git commit -m "Initial commit"`;
    if (Object.keys(git.branches).length === 1) return "git branch feature";
    return "git status";
  }, [git]);

  const handleCommand = (cmd: string): HistoryEntry[] => {
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0];
    const subCommand = parts[1];
    const args = parts.slice(2);

    if (!command) return [];

    // Handle 'clear' command
    if (command === "clear") {
      setHistory([]);
      return [];
    }

    // Handle 'help' command
    if (command === "help") {
      return [
        { type: 'output', content: '📖 Available commands:' },
        { type: 'output', content: '  git init          Initialize a new repository' },
        { type: 'output', content: '  git add <file>    Stage files for commit' },
        { type: 'output', content: '  git commit -m ""  Create a commit' },
        { type: 'output', content: '  git branch <name> Create a new branch' },
        { type: 'output', content: '  git checkout <b>  Switch to a branch' },
        { type: 'output', content: '  git merge <b>     Merge a branch' },
        { type: 'output', content: '  git status        View current state' },
        { type: 'output', content: '  git log           View commit history' },
        { type: 'output', content: '  touch <file>      Create a new file' },
        { type: 'output', content: '  clear             Clear terminal' },
      ];
    }

    // Handle 'touch' command
    if (command === "touch") {
      if (parts[1]) {
        git.touch(parts[1]);
        return [{ type: 'success', content: `Created file: ${parts[1]}` }];
      }
      return [{ type: 'error', content: "usage: touch <filename>" }];
    }

    // Non-git commands
    if (command !== "git") {
      return [{ type: 'error', content: `bash: ${command}: command not found` }];
    }

    // Check for smart suggestions
    if (subCommand && SUGGESTIONS[subCommand]) {
      return [{ type: 'error', content: SUGGESTIONS[subCommand] }];
    }

    // Check for typos
    if (subCommand && TYPO_MAP[subCommand]) {
      const corrected = TYPO_MAP[subCommand];
      return [{ type: 'error', content: `⚠ Did you mean 'git ${corrected}'? (Press ↑ to edit)` }];
    }

    try {
      switch (subCommand) {
        case "init":
          if (git.isInitialized) {
            return [{ type: 'error', content: "Reinitialized existing Git repository" }];
          }
          git.init();
          return [{ type: 'success', content: "✓ Initialized empty Git repository in ~/project-alpha/.git/" }];
        
        case "add":
          if (!git.isInitialized) {
            return [{ type: 'error', content: "fatal: not a git repository. Run 'git init' first." }];
          }
          if (args[0]) {
            if (args[0] === '.') {
              git.add(git.workingDirectory);
            } else {
              git.add(args);
            }
            return [{ type: 'success', content: `✓ Staged: ${args.join(', ')}` }];
          }
          return [{ type: 'error', content: "usage: git add <files>" }];
        
        case "commit":
          if (!git.isInitialized) {
            return [{ type: 'error', content: "fatal: not a git repository. Run 'git init' first." }];
          }
          const msgIndex = parts.indexOf("-m");
          if (msgIndex !== -1 && parts[msgIndex + 1]) {
            if (git.staging.length === 0) {
              return [{ type: 'error', content: "nothing to commit, working tree clean" }];
            }
            const message = parts.slice(msgIndex + 1).join(" ").replace(/"/g, "");
            git.commit(message);
            const isRoot = git.nodes.length === 1;
            return [{ type: 'success', content: `✓ [${git.currentBranch}${isRoot ? ' (root-commit)' : ''}] ${message}` }];
          }
          return [{ type: 'error', content: "usage: git commit -m 'message'" }];
        
        case "branch":
          if (!git.isInitialized) {
            return [{ type: 'error', content: "fatal: not a git repository. Run 'git init' first." }];
          }
          if (args[0]) {
            if (git.branches[args[0]]) {
              return [{ type: 'error', content: `fatal: branch '${args[0]}' already exists` }];
            }
            git.branch(args[0]);
            return [{ type: 'success', content: `✓ Created branch '${args[0]}'` }];
          }
          return Object.keys(git.branches).map(b => ({
            type: 'output' as const,
            content: b === git.currentBranch ? `* ${b}` : `  ${b}`
          }));
        
        case "checkout":
          if (!git.isInitialized) {
            return [{ type: 'error', content: "fatal: not a git repository. Run 'git init' first." }];
          }
          if (args[0]) {
            const isNew = args[0] === '-b';
            const branchName = isNew ? args[1] : args[0];
            
            if (!branchName) {
              return [{ type: 'error', content: "usage: git checkout [-b] <branch>" }];
            }
            
            if (isNew) {
              if (git.branches[branchName]) {
                return [{ type: 'error', content: `fatal: branch '${branchName}' already exists` }];
              }
              git.branch(branchName);
            } else if (!git.branches[branchName]) {
              return [{ type: 'error', content: `error: pathspec '${branchName}' did not match any branch` }];
            }
            
            git.checkout(branchName);
            return [{ type: 'success', content: `✓ Switched to ${isNew ? 'new ' : ''}branch '${branchName}'` }];
          }
          return [{ type: 'error', content: "usage: git checkout [-b] <branch>" }];
        
        case "merge":
          if (!git.isInitialized) {
            return [{ type: 'error', content: "fatal: not a git repository. Run 'git init' first." }];
          }
          if (args[0]) {
            if (!git.branches[args[0]]) {
              return [{ type: 'error', content: `merge: ${args[0]} - not something we can merge` }];
            }
            if (args[0] === git.currentBranch) {
              return [{ type: 'error', content: `Already on '${args[0]}'` }];
            }
            git.merge(args[0]);
            return [{ type: 'success', content: `✓ Merged '${args[0]}' into '${git.currentBranch}'` }];
          }
          return [{ type: 'error', content: "usage: git merge <branch>" }];
        
        case "status":
          if (!git.isInitialized) {
            return [{ type: 'error', content: "fatal: not a git repository. Run 'git init' first." }];
          }
          const statusLines: HistoryEntry[] = [
            { type: 'output', content: `On branch ${git.currentBranch}` },
          ];
          if (git.staging.length > 0) {
            statusLines.push({ type: 'output', content: 'Changes to be committed:' });
            git.staging.forEach(f => statusLines.push({ type: 'success', content: `  new file: ${f}` }));
          }
          if (git.workingDirectory.length > 0) {
            statusLines.push({ type: 'output', content: 'Untracked files:' });
            git.workingDirectory.forEach(f => statusLines.push({ type: 'error', content: `  ${f}` }));
          }
          if (git.staging.length === 0 && git.workingDirectory.length === 0) {
            statusLines.push({ type: 'output', content: 'nothing to commit, working tree clean' });
          }
          return statusLines;
        
        case "log":
          if (!git.isInitialized) {
            return [{ type: 'error', content: "fatal: not a git repository. Run 'git init' first." }];
          }
          if (git.nodes.length === 0) {
            return [{ type: 'error', content: "fatal: your current branch does not have any commits yet" }];
          }
          return git.nodes.map(n => ({ 
            type: 'output' as const, 
            content: `* ${n.id} - ${n.message}` 
          })).reverse();
        
        default:
          return [{ type: 'error', content: `git: '${subCommand}' is not a git command. See 'help' for available commands.` }];
      }
    } catch (e) {
      return [{ type: 'error', content: "Error executing command" }];
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add to command history
    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);
    setLastCommandTime(Date.now());
    setShowIdleHint(false);

    // Process command
    const commandEntry: HistoryEntry = { type: 'command', content: `$ ${input}` };
    const results = handleCommand(input);
    
    setHistory(prev => [...prev, commandEntry, ...results]);
    setInput("");
  };

  // Handle arrow keys for command history
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117] relative">
      {/* Terminal Header */}
      <div className="h-10 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="size-3 rounded-full bg-red-500/80 hover:bg-red-500 cursor-pointer transition-colors"></span>
            <span className="size-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 cursor-pointer transition-colors"></span>
            <span className="size-3 rounded-full bg-green-500/80 hover:bg-green-500 cursor-pointer transition-colors"></span>
          </span>
          <span className="ml-4 text-xs font-mono text-gray-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">terminal</span>
            user@gitviz:~/project-alpha
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-mono">bash</span>
          <button 
            onClick={() => git.reset?.()}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors"
            title="Reset Repository (Cmd+R)"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        className="flex-1 p-6 font-mono text-sm overflow-y-auto" 
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((entry, i) => (
          <div 
            key={i} 
            className={clsx(
              "mb-0.5 animate-in fade-in-0 slide-in-from-bottom-1 duration-150",
              entry.type === 'command' && "text-white mt-3 font-medium",
              entry.type === 'output' && "text-gray-400",
              entry.type === 'error' && "text-red-400",
              entry.type === 'success' && "text-green-400",
            )}
          >
            {entry.content}
          </div>
        ))}
        
        {/* Active Line */}
        <div className="flex items-center gap-2 group mt-4">
          <span className="text-green-500 font-bold">➜</span>
          <span className="text-blue-400 font-bold">~/project-alpha</span>
          <span className={clsx(
            "font-bold transition-colors duration-300",
            git.isInitialized ? "text-yellow-400" : "text-gray-500"
          )}>
            git:({git.currentBranch || 'main'})
          </span>
          <form onSubmit={onSubmit} className="flex-1 relative">
            <input
              ref={inputRef}
              autoComplete="off"
              className="w-full bg-transparent border-none p-0 text-white focus:ring-0 focus:outline-none font-mono caret-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck={false}
              placeholder={showIdleHint ? `💡 Try: ${getIdleHint()}` : ""}
            />
          </form>
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="absolute bottom-3 right-3 text-[10px] text-gray-600 font-mono">
        ↑↓ history · Cmd+R reset · help
      </div>
    </div>
  );
};
