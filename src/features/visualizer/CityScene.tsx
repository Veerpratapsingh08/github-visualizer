"use client";

import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Html, RoundedBox } from "@react-three/drei";
import { RepoFile } from "./Fetcher";
import { buildTreemap, TreemapNode } from "./CityBuilder";
import * as THREE from "three";

const FileBlock = ({ 
  node, 
  maxSize,
  onHover 
}: { 
  node: TreemapNode; 
  maxSize: number;
  onHover: (node: TreemapNode | null) => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const baseHeight = 0.5;
  const maxHeight = 15;
  const height = baseHeight + (Math.log(node.size + 1) / Math.log(maxSize + 1)) * maxHeight;
  
  const centerX = node.x + node.width / 2;
  const centerZ = node.y + node.height / 2;

  React.useEffect(() => {
    const timer = setTimeout(() => setActive(true), Math.random() * 500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetY = active ? height / 2 : 0;
    const targetScale = active ? 1 : 0;
    meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY, 6, delta);
    meshRef.current.scale.y = THREE.MathUtils.damp(meshRef.current.scale.y, targetScale, 6, delta);
    
    const hoverScale = hovered ? 1.02 : 1;
    meshRef.current.scale.x = THREE.MathUtils.damp(meshRef.current.scale.x, hoverScale, 10, delta);
    meshRef.current.scale.z = THREE.MathUtils.damp(meshRef.current.scale.z, hoverScale, 10, delta);
  });

  if (node.width < 1 || node.height < 1) return null;

  return (
    <group position={[centerX, 0, centerZ]}>
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(node); }}
        onPointerOut={() => { setHovered(false); onHover(null); }}
      >
        <boxGeometry args={[node.width * 0.92, height, node.height * 0.92]} />
        <meshStandardMaterial
          color={hovered ? "#60a5fa" : node.color}
          roughness={0.3}
          metalness={0.1}
          emissive={hovered ? node.color : "#000"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>
      
      {hovered && (
        <Html distanceFactor={50} center position={[0, height + 3, 0]}>
          <div className="bg-[#0d1117]/98 text-white p-4 rounded-xl whitespace-nowrap border border-blue-500/60 shadow-2xl backdrop-blur-xl pointer-events-none min-w-[1000px]">
            <div className="font-bold text-blue-300 text-base mb-2 flex items-center gap-3">
              <span className="w-4 h-4 rounded" style={{ backgroundColor: node.color }}></span>
              {node.name}
            </div>
            <div className="text-sm text-slate-300 mb-1">
              <span className="text-slate-500">Size:</span> {(node.size / 1024).toFixed(1)} KB
            </div>
            <div className="text-xs text-slate-500 font-mono bg-black/30 px-2 py-1 rounded mt-2">
              {node.path}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

const FolderOutline = ({ node, depth }: { node: TreemapNode; depth: number }) => {
  if (node.width < 2 || node.height < 2) return null;
  
  const centerX = node.x + node.width / 2;
  const centerZ = node.y + node.height / 2;
  const opacity = Math.max(0.15, 0.5 - depth * 0.08);
  
  const showLabel = node.width > 10 && node.height > 10 && depth <= 3;
  
  return (
    <group position={[centerX, 0.05 + depth * 0.02, centerZ]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[node.width - 0.3, node.height - 0.3]} />
        <meshBasicMaterial 
          color={depth === 0 ? "#1e293b" : depth === 1 ? "#1a2332" : "#0f172a"} 
          transparent 
          opacity={opacity}
        />
      </mesh>
      
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(node.width - 0.3, node.height - 0.3)]} />
        <lineBasicMaterial 
          color={depth === 0 ? "#3b82f6" : depth === 1 ? "#6366f1" : "#475569"} 
          transparent 
          opacity={depth <= 1 ? 0.8 : 0.4} 
        />
      </lineSegments>
      
      {showLabel && (
        <Html
          position={[0, 0.5, 0]}
          center
          distanceFactor={80}
          style={{ pointerEvents: 'none' }}
        >
          <div 
            className="px-2 py-1 rounded text-center whitespace-nowrap"
            style={{
              backgroundColor: depth <= 1 ? 'rgba(59, 130, 246, 0.8)' : 'rgba(71, 85, 105, 0.7)',
              color: 'white',
              fontSize: depth === 0 ? '14px' : depth === 1 ? '12px' : '10px',
              fontWeight: depth <= 1 ? 'bold' : 'normal',
              textShadow: '0 1px 3px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            📁 {node.name}
          </div>
        </Html>
      )}
    </group>
  );
};

const TreemapRenderer = ({ 
  node, 
  depth = 0, 
  maxSize,
  onHover
}: { 
  node: TreemapNode; 
  depth?: number;
  maxSize: number;
  onHover: (node: TreemapNode | null) => void;
}) => {
  return (
    <group>
      {node.type === "folder" && depth > 0 && (
        <FolderOutline node={node} depth={depth} />
      )}
      
      {node.children.map((child) => (
        child.type === "file" ? (
          <FileBlock key={child.path} node={child} maxSize={maxSize} onHover={onHover} />
        ) : (
          <TreemapRenderer 
            key={child.path} 
            node={child} 
            depth={depth + 1} 
            maxSize={maxSize}
            onHover={onHover}
          />
        )
      ))}
    </group>
  );
};

export const CityScene = ({ files }: { files: RepoFile[] }) => {
  const [hoveredNode, setHoveredNode] = useState<TreemapNode | null>(null);
  
  const treemap = useMemo(() => buildTreemap(files), [files]);
  
  const maxSize = useMemo(() => {
    let max = 0;
    const traverse = (node: TreemapNode) => {
      if (node.type === "file") max = Math.max(max, node.size);
      node.children.forEach(traverse);
    };
    traverse(treemap);
    return max;
  }, [treemap]);

  const center = treemap.width / 2;

  return (
    <Canvas
      gl={{ antialias: true }}
      camera={{
        position: [center * 1.5, center * 1.2, center * 1.5],
        fov: 50,
        near: 0.1,
        far: 1000
      }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[100, 100, 50]} intensity={0.8} />
      <directionalLight position={[-50, 50, -50]} intensity={0.3} />

      <OrbitControls
        target={[center, 0, center]}
        makeDefault
        enableDamping
        dampingFactor={0.05}
        autoRotate={true}
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={20}
        maxDistance={400}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[center, -0.1, center]}>
        <planeGeometry args={[treemap.width * 1.5, treemap.height * 1.5]} />
        <meshStandardMaterial color="#0a0a12" roughness={0.95} />
      </mesh>

      <gridHelper
        args={[treemap.width * 1.3, 30, "#1a1a2e", "#12121a"]}
        position={[center, 0, center]}
      />

      <TreemapRenderer node={treemap} maxSize={maxSize} onHover={setHoveredNode} />

      <fog attach="fog" args={['#0a0a12', 50, 300]} />
    </Canvas>
  );
};
