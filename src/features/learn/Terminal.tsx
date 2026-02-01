"use client";

import React, { useState, useRef, useEffect } from "react";
import { useGitStore } from "./GitEngine";
import clsx from "clsx";

export const Terminal = () => {
  const [history, setHistory] = useState<string[]>(["Welcome to Git Learn! Type 'git init' to start."]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const git = useGitStore();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const parts = cmd.trim().split(" ");
    const command = parts[0];
    const subCommand = parts[1];
    const args = parts.slice(2);

    if (command === "touch") {
        if (parts[1]) {
            git.touch(parts[1]);
            return [];
        }
        return ["usage: touch <filename>"];
    }

    if (command !== "git") {
      return ["bash: " + command + ": command not found"];
    }

    try {
      switch (subCommand) {
        case "init":
          git.init();
          return ["Initialized empty Git repository"];
        case "add":
          if (args[0]) {
             git.add(args);
             return [];
          }
          return ["usage: git add <files>"];
        case "commit":
           // Parsing -m "message" roughly
           const msgIndex = parts.indexOf("-m");
           if (msgIndex !== -1 && parts[msgIndex + 1]) {
               if (git.staging.length === 0 && git.nodes.length > 0) {
                   return ["nothing to commit, working tree clean"];
               }
               const message = parts.slice(msgIndex + 1).join(" ").replace(/"/g, "");
               git.commit(message);
               // We can't easily get the new ID here without async or selector hack, so we just say [branch] message
               return [`[${git.currentBranch} ${git.nodes.length === 0 ? '(root-commit)' : ''}] ${message}`];
           }
           return ["usage: git commit -m 'message'"];
        case "branch":
            if (args[0]) {
                git.branch(args[0]);
                return [];
            }
            return Object.keys(git.branches).map(b => (b === git.currentBranch ? `* ${b}` : `  ${b}`));
        case "checkout":
            if (args[0]) {
                git.checkout(args[0]);
                return [`Switched to branch '${args[0]}'`]; 
            }
            return ["usage: git checkout <branch>"];
        case "merge":
            if (args[0]) {
                git.merge(args[0]);
                return [`Merged ${args[0]} into ${git.currentBranch}`];
            }
            return ["usage: git merge <branch>"];
        case "status":
            return [
                `On branch ${git.currentBranch}`,
                `Changes to be committed: ${git.staging.join(", ") || "nothing"}`,
                `Untracked files: ${git.workingDirectory.join(", ") || "nothing"}`
            ];
        case "log":
            return git.nodes.map(n => `* ${n.id} - ${n.message}`).reverse();
        default:
          return [`git: '${subCommand}' is not a git command.`];
      }
    } catch (e) {
        return ["Error executing command"];
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setHistory((prev) => [...prev, `$ ${input}`, ...handleCommand(input)]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 font-mono text-sm text-green-400 p-4 overflow-hidden rounded-lg border border-slate-800 shadow-2xl">
      <div className="flex-1 overflow-y-auto space-y-1">
        {history.map((line, i) => (
          <div key={i} className={clsx(line.startsWith("$") ? "text-white mt-2" : "opacity-80")}>
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={onSubmit} className="mt-2 flex gap-2 border-t border-slate-800 pt-2">
        <span className="text-blue-400">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-transparent outline-none flex-1 text-white placeholder-slate-600"
          placeholder="Type git command..."
          autoFocus
        />
      </form>
    </div>
  );
};
