"use client";

import React, { useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Environment } from "@react-three/drei";
import { RepoFile } from "./Fetcher";
import { buildCityTree, CityNode } from "./CityBuilder";
import * as THREE from "three";

const Building = ({ node, delay = 0 }: { node: CityNode; delay?: number }) => {
  // Center the building on its footprint
  const x = node.x + node.width / 2;
  const z = node.z + node.depthSize / 2;
  
  const height = Math.max(2, Math.log2(node.size + 1) * 2);
  const y = height / 2;

  // Animation state
  const meshRef = React.useRef<THREE.Mesh>(null);
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setActive(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Smooth entrance using basic lerp
  React.useLayoutEffect(() => {
    if (meshRef.current) {
        meshRef.current.scale.y = 0;
    }
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    if (active) {
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1, delta * 3);
    }
  });

  return (
    <group position={[x, 0, z]}>
      <mesh ref={meshRef} position={[0, y, 0]}>
        <boxGeometry args={[node.width * 0.8, height, node.depthSize * 0.8]} />
        <meshStandardMaterial color={node.color} roughness={0.3} metalness={0.6} />
      </mesh>
    </group>
  );
};

const District = ({ node, depth = 0 }: { node: CityNode; depth?: number }) => {
  const x = node.x + node.width / 2;
  const z = node.z + node.depthSize / 2;
  const y = 0.1;

  // Stagger children for wave effect
  const stagger = 50; // ms

  return (
    <group>
      {/* District Floor */}
      <mesh position={[x, y, z]}>
        <boxGeometry args={[node.width, 0.2, node.depthSize]} />
        <meshStandardMaterial color="#222" transparent opacity={0.3} depthWrite={false} />
        <lineSegments>
             <edgesGeometry args={[new THREE.BoxGeometry(node.width, 0.2, node.depthSize)]} />
             <lineBasicMaterial color="#333" transparent opacity={0.5} />
        </lineSegments>
      </mesh>
      
      {/* Recursively render children */}
      {node.children.map((child, i) => (
         child.type === "file" ? (
             <Building key={child.path} node={child} delay={depth * 100 + i * stagger} />
         ) : (
             <District key={child.path} node={child} depth={depth + 1} />
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
    <Canvas camera={{ position: [cityRoot.width * 1.5, cityRoot.width, cityRoot.depthSize * 1.5], fov: 45 }}>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[cityRoot.width, 100, cityRoot.depthSize]} intensity={1.5} />
      <Environment preset="city" />

      {/* Controls */}
      <OrbitControls 
        target={[center[0], 0, center[2]] as any} 
        makeDefault 
        enableDamping
        dampingFactor={0.05}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />

      {/* City Content */}
      <group>
        <District node={cityRoot} />
      </group>
      
      {/* Floor Grid */}
      <gridHelper args={[Math.max(cityRoot.width, cityRoot.depthSize) * 2, 50, "#222", "#111"]} position={[center[0], -0.1, center[2]]} />
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#101622', 10, Math.max(cityRoot.width, cityRoot.depthSize) * 4]} />
    </Canvas>
  );
};
