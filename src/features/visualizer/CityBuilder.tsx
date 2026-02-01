import { RepoFile } from "./Fetcher";

export type CityNode = {
  name: string;
  path: string;
  type: "file" | "folder";
  size: number;
  depth: number;
  children: CityNode[];
  // Layout properties
  x: number;
  z: number;
  width: number;
  depthSize: number; // along Z axis
  color: string;
};

const EXTENSION_COLORS: Record<string, string> = {
  ts: "#3178c6",
  tsx: "#3178c6",
  js: "#f7df1e",
  jsx: "#f7df1e",
  css: "#264de4",
  html: "#e34c26",
  json: "#ffffff",
  md: "#000000",
  png: "#ff00ff",
  svg: "#ff9900",
  other: "#888888"
};

const getExtension = (path: string) => {
    const parts = path.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : 'other';
};

const getColor = (path: string) => {
    return EXTENSION_COLORS[getExtension(path)] || EXTENSION_COLORS.other;
};

// Basic Treemap-like Layout Algorithm (Simplified squarified or just grid)
// For "Code City", folders contain files. We want to pack them.
// Let's build the tree first.
export const buildCityTree = (files: RepoFile[]): CityNode => {
    const root: CityNode = {
        name: "root",
        path: "",
        type: "folder",
        size: 0,
        depth: 0,
        children: [],
        x: 0, z: 0, width: 0, depthSize: 0, color: "#222"
    };

    const map: Record<string, CityNode> = { "": root };

    // 1. Build Hierarchy
    files.forEach(file => {
        const parts = file.path.split('/');
        let currentPath = "";
        
        parts.forEach((part, i) => {
            const isFile = i === parts.length - 1 && file.type === "blob";
            const parentPath = currentPath;
            currentPath = currentPath ? `${currentPath}/${part}` : part;

            if (!map[currentPath]) {
                const node: CityNode = {
                    name: part,
                    path: currentPath,
                    type: isFile ? "file" : "folder",
                    size: isFile ? (file.size || 100) : 0, 
                    depth: i + 1,
                    children: [],
                    x: 0, z: 0, width: 0, depthSize: 0,
                    color: isFile ? getColor(currentPath) : "#333" 
                };
                map[currentPath] = node;
                if (map[parentPath]) {
                    map[parentPath].children.push(node);
                    // Add size up? 
                }
            }
        });
    });

    // 2. Propagate Size (Sum of file sizes)
    const propagateSize = (node: CityNode): number => {
        if (node.type === "file") return Math.max(node.size, 100); // Min size
        const total = node.children.reduce((acc, child) => acc + propagateSize(child), 0);
        node.size = total;
        return total;
    };
    propagateSize(root);

    // 3. Compute Layout (Recursive packing)
    // We'll map 'size' to 'area'. sqrt(size) -> side length approx.
    // For a city, we want to lay out children on a 2D plane (x, z) within the parent's generic bounds.
    // Simple Packing: Place in a grid or spiral.
    
    const layout = (node: CityNode, x: number, z: number) => {
        node.x = x;
        node.z = z;
        
        if (node.type === "file") {
            // Building dimensions
            // Height usually = lines of code ~ size
            // Width/Depth fixed or related to sqrt(size)?
            // Let's make "Land area" fixed-ish for visibility, Height dynamic
            const scale = Math.log2(node.size + 1); // Log scale for height
            node.width = 10;
            node.depthSize = 10;
            return;
        }

        // Folder: Pack children
        // Simple Grid Packing
        // Calculate grid size needed
        const childCount = node.children.length;
        const cols = Math.ceil(Math.sqrt(childCount));
        const padding = 5;
        const cellSize = 15; // Assumption: children distinct enough
        
        // This is a placeholder layout. Real treemaps are harder.
        // We'll just list them in a grid for V1.
        
        node.children.forEach((child, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const childX = x + col * (cellSize + padding);
            const childZ = z + row * (cellSize + padding);
            
            layout(child, childX, childZ);
        });
        
        node.width = cols * (cellSize + padding);
        node.depthSize = Math.ceil(childCount / cols) * (cellSize + padding);
    };

    layout(root, 0, 0);

    return root;
};
