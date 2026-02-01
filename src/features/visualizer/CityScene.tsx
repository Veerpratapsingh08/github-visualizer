"use client";

import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Environment } from "@react-three/drei";
import { RepoFile } from "./Fetcher";
import { buildCityTree, CityNode } from "./CityBuilder";
import * as THREE from "three";

const Building = ({ node }: { node: CityNode }) => {
  // Center the building on its footprint
  const x = node.x + node.width / 2;
  const z = node.z + node.depthSize / 2;
  
  // Height based on size (log scale was used in builder)
  // Let's use the node.size directly? No, builder already computed width/depth, but height is dynamic
  // Builder didn't set 'height'. Let's compute it here or fix builder.
  // Builder assumes node.width/depthSize are set.
  // Let's use a log scale for height here.
  const height = Math.max(2, Math.log2(node.size + 1) * 2);
  const y = height / 2;

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, y, 0]}>
        <boxGeometry args={[node.width * 0.8, height, node.depthSize * 0.8]} />
        <meshStandardMaterial color={node.color} roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Label on hover? Too expensive for all. */}
    </group>
  );
};

const District = ({ node }: { node: CityNode }) => {
  const x = node.x + node.width / 2;
  const z = node.z + node.depthSize / 2;
  const y = 0.1; // Slightly above ground

  return (
    <group>
      {/* District Floor */}
      <mesh position={[x, y, z]}>
        <boxGeometry args={[node.width, 0.2, node.depthSize]} />
        <meshStandardMaterial color="#222" transparent opacity={0.3} depthWrite={false} />
        <lineSegments>
             <edgesGeometry args={[new THREE.BoxGeometry(node.width, 0.2, node.depthSize)]} />
             <lineBasicMaterial color="#444" />
        </lineSegments>
      </mesh>
      
      {/* Recursively render children */}
      {node.children.map((child) => (
         child.type === "file" ? (
             <Building key={child.path} node={child} />
         ) : (
             <District key={child.path} node={child} />
         )
      ))}
    </group>
  );
};

export const CityScene = ({ files }: { files: RepoFile[] }) => {
  const cityRoot = useMemo(() => buildCityTree(files), [files]);

  // Center camera based on city size
  const center = [cityRoot.width / 2, 0, cityRoot.depthSize / 2];

  return (
    <Canvas camera={{ position: [cityRoot.width, cityRoot.width, cityRoot.depthSize], fov: 50 }}>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[cityRoot.width, 100, cityRoot.depthSize]} intensity={1} />
      <Environment preset="city" />

      {/* Controls */}
      <OrbitControls target={[center[0], 0, center[2]] as any} makeDefault />

      {/* City Content */}
      <group>
        <District node={cityRoot} />
      </group>
      
      {/* Floor Grid */}
      <gridHelper args={[Math.max(cityRoot.width, cityRoot.depthSize) * 2, 50, "#333", "#111"]} position={[center[0], -0.1, center[2]]} />
    </Canvas>
  );
};
