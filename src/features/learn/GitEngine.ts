import { create } from 'zustand';

// Types for our simulated Git Graph
export type GitNode = {
  id: string; // Commit hash (short)
  message: string;
  parentIds: string[]; // Support for multiple parents (merges)
  branch?: string; // If this node is a branch tip
};

export type GitState = {
  nodes: GitNode[];
  HEAD: string | null; // ID of the current commit
  branches: Record<string, string>; // branchName -> commitId
  currentBranch: string;
  staging: string[]; // List of files staged
  workingDirectory: string[]; // List of modified files (simulated)
  isInitialized: boolean; // Whether git init has been run
};

type GitActions = {
  init: () => void;
  add: (files: string[]) => void;
  commit: (message: string) => void;
  checkout: (branchOrId: string) => void;
  branch: (name: string) => void;
  merge: (sourceBranch: string) => void;
  touch: (file: string) => void;
  reset: () => void; // Hard reset to initial state
};

// Helper to generate random hash
const generateHash = () => Math.random().toString(16).substring(2, 9);

export const useGitStore = create<GitState & GitActions>((set, get) => ({
  nodes: [],
  HEAD: null,
  branches: {},
  currentBranch: 'main',
  staging: [],
  workingDirectory: [],
  isInitialized: false,

  init: () => {
    set({
      nodes: [],
      HEAD: null,
      branches: { main: '' },
      currentBranch: 'main',
      staging: [],
      workingDirectory: ['README.md'],
      isInitialized: true,
    });
  },

  touch: (file) => {
      set((state) => ({
          workingDirectory: [...state.workingDirectory, file]
      }));
  },

  add: (files) => {
    set((state) => {
        if (files.includes('.')) {
            return {
                staging: [...state.staging, ...state.workingDirectory],
                workingDirectory: []
            };
        }
        return {
             staging: [...state.staging, ...files],
             workingDirectory: state.workingDirectory.filter(f => !files.includes(f))
        };
    });
  },

  commit: (message) => {
    set((state) => {
      if (state.staging.length === 0 && state.nodes.length > 0) {
          return state; // Prevent empty commits unless it's initial? Actually git allow-empty exists but let's block for now
      }

      const newCommitId = generateHash();
      const newNode: GitNode = {
        id: newCommitId,
        message,
        parentIds: state.HEAD ? [state.HEAD] : [],
      };

      const newNodes = [...state.nodes, newNode];
      const newBranches = { ...state.branches, [state.currentBranch]: newCommitId };

      return {
        nodes: newNodes,
        HEAD: newCommitId,
        branches: newBranches,
        staging: [],
        workingDirectory: [],
      };
    });
  },

  branch: (name) => {
     set((state) => {
         if (!state.HEAD) return state;
         return {
             branches: { ...state.branches, [name]: state.HEAD } // Create ref
         };
     });
  },

  checkout: (target) => {
      set((state) => {
          if (state.branches[target]) {
              return {
                  currentBranch: target,
                  HEAD: state.branches[target]
              };
          }
          // Simple detached HEAD check
          const node = state.nodes.find(n => n.id === target);
          if (node) {
               return {
                   HEAD: node.id,
                   currentBranch: 'DETACHED'
               };
          }
          return state;
      });
  },

  merge: (sourceBranch) => {
      set((state) => {
          const targetBranch = state.currentBranch;
          const sourceCommitId = state.branches[sourceBranch];
          const targetCommitId = state.branches[targetBranch];

          if (!sourceCommitId || !targetCommitId) return state;
          if (sourceCommitId === targetCommitId) return state; // Already up to date

          // Simplified merge: Create a merge commit connecting both
          const mergeCommitId = generateHash();
          const newNode: GitNode = {
              id: mergeCommitId,
              message: `Merge branch '${sourceBranch}' into ${targetBranch}`,
              parentIds: [targetCommitId, sourceCommitId], 
          };

          return {
              nodes: [...state.nodes, newNode],
              HEAD: mergeCommitId,
              branches: { ...state.branches, [targetBranch]: mergeCommitId },
              staging: [],
              workingDirectory: []
          };
      });
  },

  reset: () => {
    set({
      nodes: [],
      HEAD: null,
      branches: {},
      currentBranch: 'main',
      staging: [],
      workingDirectory: [],
      isInitialized: false,
    });
  },
}));
