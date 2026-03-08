import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text, Edges, Float } from '@react-three/drei';
import * as THREE from 'three';

interface MachineARFeedProps {
  currentPower: number;
  targetPower: number;
  currentRPM: number;
  targetRPM: number;
}

function DualBarGauge({ position, current, target, label, color }: { position: [number, number, number], current: number, target: number, label: string, color: string }) {
  const baseHeight = 3;
  const liveHeight = (current / target) * baseHeight;
  const isHighDrift = current > target * 1.1;

  return (
    <group position={position}>
      {/* 1. THE MAIN LABEL (At the very bottom) */}
      <Text 
        position={[0, -1.6, 0]} 
        fontSize={0.22} 
        color="#94a3b8" 
        fontWeight="bold" 
        letterSpacing={0.1}
      >
        {label}
      </Text>

      {/* 2. THE NUMERICAL VALUES (Positioned exactly below their respective bars) */}
      {/* Target Value Readout - Left Side */}
      <Text position={[-0.5, -0.8, 0]} fontSize={0.2} color="#00d4ff" fontWeight="medium">
        {target}
      </Text>
      {/* FIXED: Changed 'opacity' to 'fillOpacity' */}
      <Text position={[-0.5, -1.1, 0]} fontSize={0.12} color="#00d4ff" fillOpacity={0.7}>
        OPTIMAL
      </Text>
      
      {/* Live Value Readout - Right Side */}
      <Text 
        position={[0.5, -0.8, 0]} 
        fontSize={0.25} 
        color={isHighDrift ? "#ef4444" : "white"} 
        fontWeight="black"
      >
        {current.toFixed(1)}
      </Text>
      {/* FIXED: Changed 'opacity' to 'fillOpacity' */}
      <Text position={[0.5, -1.1, 0]} fontSize={0.12} color="white" fillOpacity={0.7}>
        ACTUAL
      </Text>

      {/* 3. THE GOLDEN SIGNATURE (GHOST BAR) - Left Side */}
      <mesh position={[-0.5, baseHeight / 2, 0]}>
        <boxGeometry args={[0.6, baseHeight, 0.4]} />
        <meshStandardMaterial color="#00d4ff" transparent opacity={0.15} metalness={1} roughness={0} />
        <Edges color="#00d4ff" threshold={15} />
      </mesh>

      {/* 4. THE LIVE DATA BAR - Right Side */}
      <mesh position={[0.5, liveHeight / 2, 0]}>
        <boxGeometry args={[0.6, liveHeight, 0.4]} />
        <meshStandardMaterial 
          color={isHighDrift ? "#ef4444" : color} 
          emissive={isHighDrift ? "#ef4444" : color}
          emissiveIntensity={0.4}
        />
        <Edges color="white" threshold={15} />
      </mesh>
      
      {/* Visual divider line between readout and bars */}
      <mesh position={[0, -0.4, 0]}>
        <planeGeometry args={[1.5, 0.02]} />
        <meshBasicMaterial color="white" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

const Scene = ({ currentPower, targetPower, currentRPM, targetRPM }: MachineARFeedProps) => (
  <>
    <ambientLight intensity={1.5} />
    <pointLight position={[10, 10, 10]} intensity={2.5} />
    <pointLight position={[-10, 5, 5]} intensity={1.5} color="#00d4ff" />
    
    <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.3}>
      <DualBarGauge 
        position={[-2.6, -0.2, 0]} 
        current={currentPower} 
        target={targetPower} 
        label="POWER CONSUMPTION (kW)" 
        color="#10b981" 
      />
      <DualBarGauge 
        position={[2.6, -0.2, 0]} 
        current={currentRPM} 
        target={targetRPM} 
        label="MOTOR SPEED (RPM)" 
        color="#8b5cf6" 
      />
    </Float>

    <gridHelper args={[40, 40, '#1e293b', '#080c14']} position={[0, -2.5, 0]} />
  </>
);

export default function MachineARFeed(props: MachineARFeedProps) {
  return (
    <div className="absolute inset-0 z-20 w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 40 }} gl={{ antialias: true, alpha: true }}>
        <Scene {...props} />
      </Canvas>
    </div>
  );
}