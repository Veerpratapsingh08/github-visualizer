"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Environment, Html, Billboard, Line } from "@react-three/drei";
import { RepoFile } from "./Fetcher";
import { buildCityTree, CityNode } from "./CityBuilder";
import * as THREE from "three";

// Constants for stacked layout
const DEPTH_Y_OFFSET = 8; // Y units per depth level
const PLATFORM_SCALE_FACTOR = 0.92; // Nested platforms are slightly smaller

const Building = ({ node, baseY = 0, delay = 0 }: { node: CityNode; baseY?: number; delay?: number }) => {
  // Center the building on its footprint
  const x = node.x + node.width / 2;
  const z = node.z + node.depthSize / 2;
  
  const height = Math.max(2, Math.log2(node.size + 1) * 2);
  const y = baseY + height / 2; // Build on top of the district platform

  // Animation and Hover state
  const meshRef = useRef<THREE.Mesh>(null);
  const [active, setActive] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setActive(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  React.useLayoutEffect(() => {
    if (meshRef.current) {
        meshRef.current.scale.y = 0;
    }
  }, []);

  // Cursor change on hover
  React.useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    if (active) {
        meshRef.current.scale.y = THREE.MathUtils.damp(meshRef.current.scale.y, 1, 4, delta);
    }
    const targetScale = hovered ? 1.08 : 1;
    meshRef.current.scale.x = THREE.MathUtils.damp(meshRef.current.scale.x, targetScale, 10, delta);
    meshRef.current.scale.z = THREE.MathUtils.damp(meshRef.current.scale.z, targetScale, 10, delta);
  });

  return (
    <group position={[x, 0, z]}>
      <mesh 
        ref={meshRef} 
        position={[0, y, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => setHovered(false)}
      >
        <boxGeometry args={[node.width * 0.75, height, node.depthSize * 0.75]} />
        <meshStandardMaterial 
            color={hovered ? "#60a5fa" : node.color} 
            roughness={0.12} 
            metalness={0.25}
            emissive={hovered ? node.color : "#000"}
            emissiveIntensity={hovered ? 0.5 : 0}
        />
        {hovered && (
            <Html distanceFactor={80} center>
                <div className="bg-[#0d1117]/95 text-white p-4 rounded-xl whitespace-nowrap border border-blue-500/60 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl pointer-events-none min-w-[260px] -translate-y-[130%]">
                    <div className="font-semibold text-blue-300 flex items-center gap-2 text-base mb-1.5">
                        <span className="material-symbols-outlined text-lg">description</span>
                        {node.name}
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <span className="bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-md font-mono">{(node.size / 1024).toFixed(1)} KB</span>
                        <span className="text-xs uppercase tracking-wider text-slate-500">{node.path.split('.').pop()}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-2 font-mono truncate max-w-[240px]">{node.path}</div>
                </div>
            </Html>
        )}
      </mesh>
    </group>
  );
};

const District = ({ node, depth = 0, showLabel = true }: { node: CityNode; depth?: number; showLabel?: boolean }) => {
  const x = node.x + node.width / 2;
  const z = node.z + node.depthSize / 2;
  
  // Stacked Y position based on depth
  const baseY = depth * DEPTH_Y_OFFSET;
  const platformY = baseY + 0.1;
  
  // Platform dimensions (slightly smaller for deeper levels)
  const scale = Math.pow(PLATFORM_SCALE_FACTOR, depth);
  const platformWidth = node.width * scale;
  const platformDepth = node.depthSize * scale;

  // Stagger children for wave effect
  const stagger = 40;
  
  // Sort children by size to find largest folders
  const sortedFolders = node.children
    .filter(c => c.type === 'folder')
    .sort((a, b) => b.size - a.size);
  const topFolders = sortedFolders.slice(0, 4).map(f => f.path);
  
  // Edge glow color based on depth
  const edgeColor = depth === 0 ? "#256af4" : depth === 1 ? "#3b82f6" : "#64748b";
  const edgeOpacity = Math.max(0.3, 0.8 - depth * 0.15);
  
  // Platform corners for edge lines
  const halfW = platformWidth / 2;
  const halfD = platformDepth / 2;
  const edgePoints: [number, number, number][] = [
    [-halfW, 0, -halfD],
    [halfW, 0, -halfD],
    [halfW, 0, halfD],
    [-halfW, 0, halfD],
    [-halfW, 0, -halfD], // Close the loop
  ];

  return (
    <group>
      {/* District Platform */}
      <group position={[x, platformY, z]}>
        {/* Platform base */}
        <mesh>
          <boxGeometry args={[platformWidth, 0.3, platformDepth]} />
          <meshStandardMaterial 
            color={depth === 0 ? "#1e293b" : "#0f172a"} 
            transparent 
            opacity={Math.max(0.5, 0.8 - depth * 0.1)} 
          />
        </mesh>
        
        {/* Glowing edge line */}
        <Line
          points={edgePoints}
          color={edgeColor}
          lineWidth={2}
          transparent
          opacity={edgeOpacity}
        />
        
        {/* Top surface glow */}
        <mesh position={[0, 0.2, 0]}>
          <planeGeometry args={[platformWidth - 1, platformDepth - 1]} />
          <meshBasicMaterial 
            color={edgeColor} 
            transparent 
            opacity={0.03} 
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* District Label */}
      {showLabel && depth <= 2 && (
        <group position={[x, platformY, z]}>
          {/* Vertical connection line */}
          <Line
            points={[[0, 0.5, 0], [0, 12 - depth * 2, 0]]}
            color={edgeColor}
            lineWidth={1}
            transparent
            opacity={0.4}
          />
          
          {/* Label */}
          <Billboard position={[0, 14 - depth * 2, 0]}>
            <Text
              fontSize={depth === 0 ? 4 : depth === 1 ? 2.5 : 1.8}
              color="#fff"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.12}
              outlineColor="#0f172a"
            >
              {node.name}
            </Text>
            <Text
               position={[0, depth === 0 ? -1.8 : -1.2, 0]}
               fontSize={depth === 0 ? 1.5 : 1}
               color="#64748b"
               anchorX="center"
               anchorY="top"
            >
               {(node.size / 1024).toFixed(0)} KB
            </Text>
          </Billboard>
        </group>
      )}

      {/* Recursively render children */}
      {node.children.map((child, i) => (
         child.type === "file" ? (
             <Building 
                 key={child.path} 
                 node={child} 
                 baseY={platformY + 0.3} 
                 delay={depth * 80 + i * stagger} 
             />
         ) : (
             <District 
                 key={child.path} 
                 node={child} 
                 depth={depth + 1} 
                 showLabel={topFolders.includes(child.path) || depth === 0}
             />
         )
      ))}
    </group>
  );
};

// Find the main source folder (src, lib, app) for camera focus
const findMainFolder = (node: CityNode): CityNode | null => {
  const priorityNames = ['src', 'lib', 'app', 'packages', 'components'];
  for (const name of priorityNames) {
    const found = node.children.find(c => c.name === name && c.type === 'folder');
    if (found) return found;
  }
  // Fallback: largest folder
  const folders = node.children.filter(c => c.type === 'folder');
  return folders.sort((a, b) => b.size - a.size)[0] || node;
};

export const CityScene = ({ files }: { files: RepoFile[] }) => {
  const cityRoot = useMemo(() => buildCityTree(files), [files]);
  
  // Find main folder for camera focus
  const mainFolder = useMemo(() => findMainFolder(cityRoot), [cityRoot]);

  // Center camera on main folder, or city center as fallback
  const targetX = mainFolder ? mainFolder.x + mainFolder.width / 2 : cityRoot.width / 2;
  const targetZ = mainFolder ? mainFolder.z + mainFolder.depthSize / 2 : cityRoot.depthSize / 2;
  
  // Calculate max depth for camera distance
  const maxDepth = useMemo(() => {
    let max = 0;
    const traverse = (node: CityNode, d: number) => {
      max = Math.max(max, d);
      node.children.forEach(c => traverse(c, d + 1));
    };
    traverse(cityRoot, 0);
    return max;
  }, [cityRoot]);
  
  const cameraDistance = Math.max(cityRoot.width, cityRoot.depthSize) * 1.2;
  const cameraHeight = DEPTH_Y_OFFSET * maxDepth + 40;

  return (
    <Canvas 
      gl={{ logarithmicDepthBuffer: true, antialias: true }} 
      camera={{ 
        position: [targetX + cameraDistance * 0.7, cameraHeight, targetZ + cameraDistance * 0.7], 
        fov: 50 
      }}
    >
      {/* Lighting - softer and more ambient */}
      <ambientLight intensity={0.5} />
      <pointLight position={[cityRoot.width / 2, cameraHeight + 50, cityRoot.depthSize / 2]} intensity={1.2} />
      <directionalLight position={[100, 100, 50]} intensity={0.4} />
      <Environment preset="night" />

      {/* Controls - focus on main folder */}
      <OrbitControls 
        target={[targetX, DEPTH_Y_OFFSET, targetZ]} 
        makeDefault 
        enableDamping
        dampingFactor={0.05}
        autoRotate={true}
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={20}
        maxDistance={cameraDistance * 3}
      />

      {/* City Content */}
      <group>
        <District node={cityRoot} />
      </group>
      
      {/* Ground Plane with grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cityRoot.width / 2, -0.5, cityRoot.depthSize / 2]}>
        <planeGeometry args={[cityRoot.width * 3, cityRoot.depthSize * 3]} />
        <meshStandardMaterial color="#0a0a0f" roughness={0.9} />
      </mesh>
      <gridHelper 
        args={[Math.max(cityRoot.width, cityRoot.depthSize) * 2.5, 60, "#1a1a2e", "#0f0f1a"]} 
        position={[cityRoot.width / 2, -0.3, cityRoot.depthSize / 2]} 
      />
      
      {/* Fog for depth - adjusted for stacked layout */}
      <fog attach="fog" args={['#080810', DEPTH_Y_OFFSET * maxDepth + 20, Math.max(cityRoot.width, cityRoot.depthSize) * 4]} />
    </Canvas>
  );
};
