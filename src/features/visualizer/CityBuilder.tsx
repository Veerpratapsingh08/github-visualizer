import { RepoFile } from "./Fetcher";

export type TreemapNode = {
  name: string;
  path: string;
  type: "file" | "folder";
  size: number;
  depth: number;
  children: TreemapNode[];
  // Layout properties (set by squarify algorithm)
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

// Vibrant color palette for file types
const EXTENSION_COLORS: Record<string, string> = {
  ts: "#3178c6",
  tsx: "#3178c6",
  js: "#f0db4f",
  jsx: "#61dafb",
  css: "#264de4",
  scss: "#cc6699",
  html: "#e34c26",
  json: "#cbcb41",
  md: "#083fa1",
  yml: "#cb171e",
  yaml: "#cb171e",
  py: "#3776ab",
  go: "#00add8",
  rs: "#dea584",
  java: "#b07219",
  rb: "#cc342d",
  php: "#777bb4",
  swift: "#ffac45",
  kt: "#a97bff",
  c: "#555555",
  cpp: "#f34b7d",
  h: "#555555",
  sh: "#89e051",
  sql: "#e38c00",
  graphql: "#e535ab",
  vue: "#41b883",
  svelte: "#ff3e00",
  png: "#a855f7",
  jpg: "#a855f7",
  jpeg: "#a855f7",
  gif: "#a855f7",
  svg: "#ffb13b",
  ico: "#a855f7",
  woff: "#ec4899",
  woff2: "#ec4899",
  ttf: "#ec4899",
  eot: "#ec4899",
  lock: "#6b7280",
  gitignore: "#f05032",
  env: "#ecd53f",
  other: "#6b7280"
};

const getExtension = (path: string): string => {
  const filename = path.split('/').pop() || '';
  if (filename.startsWith('.')) return filename.slice(1); // .gitignore -> gitignore
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'other';
};

const getColor = (path: string): string => {
  const ext = getExtension(path);
  return EXTENSION_COLORS[ext] || EXTENSION_COLORS.other;
};

// Squarified Treemap Algorithm
// Based on: https://www.win.tue.nl/~vanwijk/stm.pdf
const squarify = (
  children: TreemapNode[],
  x: number,
  y: number,
  width: number,
  height: number,
  totalSize: number
) => {
  if (children.length === 0) return;
  if (children.length === 1) {
    const child = children[0];
    child.x = x;
    child.y = y;
    child.width = width;
    child.height = height;
    return;
  }

  // Sort by size descending for better squarification
  const sorted = [...children].sort((a, b) => b.size - a.size);
  
  // Simple slice-and-dice with alternating horizontal/vertical splits
  let currentX = x;
  let currentY = y;
  const isHorizontal = width >= height;
  
  sorted.forEach((child) => {
    const ratio = child.size / totalSize;
    
    if (isHorizontal) {
      const childWidth = width * ratio;
      child.x = currentX;
      child.y = y;
      child.width = Math.max(childWidth, 1);
      child.height = height;
      currentX += childWidth;
    } else {
      const childHeight = height * ratio;
      child.x = x;
      child.y = currentY;
      child.width = width;
      child.height = Math.max(childHeight, 1);
      currentY += childHeight;
    }
  });
};

// Build tree from flat file list
export const buildTreemap = (files: RepoFile[]): TreemapNode => {
  const root: TreemapNode = {
    name: "root",
    path: "",
    type: "folder",
    size: 0,
    depth: 0,
    children: [],
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    color: "#1e293b"
  };

  const map: Record<string, TreemapNode> = { "": root };

  // Build hierarchy
  files.forEach(file => {
    const parts = file.path.split('/');
    let currentPath = "";
    
    parts.forEach((part, i) => {
      const isFile = i === parts.length - 1 && file.type === "blob";
      const parentPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!map[currentPath]) {
        const node: TreemapNode = {
          name: part,
          path: currentPath,
          type: isFile ? "file" : "folder",
          size: isFile ? Math.max(file.size || 100, 50) : 0,
          depth: i + 1,
          children: [],
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          color: isFile ? getColor(currentPath) : "#1e293b"
        };
        map[currentPath] = node;
        if (map[parentPath]) {
          map[parentPath].children.push(node);
        }
      }
    });
  });

  // Propagate sizes up
  const propagateSize = (node: TreemapNode): number => {
    if (node.type === "file") return node.size;
    const total = node.children.reduce((acc, child) => acc + propagateSize(child), 0);
    node.size = Math.max(total, 1);
    return node.size;
  };
  propagateSize(root);

  // Apply treemap layout recursively
  const layoutTreemap = (
    node: TreemapNode,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    node.x = x;
    node.y = y;
    node.width = width;
    node.height = height;

    if (node.type === "file" || node.children.length === 0) return;

    // Add padding for nested folders
    const padding = node.depth === 0 ? 0 : 2;
    const innerX = x + padding;
    const innerY = y + padding;
    const innerWidth = Math.max(width - padding * 2, 1);
    const innerHeight = Math.max(height - padding * 2, 1);

    // Layout children using squarify
    squarify(node.children, innerX, innerY, innerWidth, innerHeight, node.size);

    // Recursively layout grandchildren
    node.children.forEach(child => {
      if (child.type === "folder") {
        layoutTreemap(child, child.x, child.y, child.width, child.height);
      }
    });
  };

  // Start with a fixed-size canvas
  const canvasSize = 200;
  layoutTreemap(root, 0, 0, canvasSize, canvasSize);

  return root;
};

// Legacy export for compatibility
export type CityNode = TreemapNode;
export const buildCityTree = buildTreemap;
