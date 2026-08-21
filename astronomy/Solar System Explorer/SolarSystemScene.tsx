import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles } from '@react-three/drei';
import { useRef } from 'react';
import { CelestialBody } from './CelestialBody';
import { SOLAR_BODIES } from './solarData';

export function SolarSystemScene({ time, selected, onSelect, scaleMode }: any) {
  return (
    <Canvas shadows camera={{ position: [5, 3, 6], fov: 45, near: 0.01, far: 500 }}>
      <color attach="background" args={['#02040a']} />
      <ambientLight intensity={0.18} color="#7b8da8" />
      <pointLight position={[0, 0, 0]} intensity={7} color="#ffd49b" distance={100} />
      <Stars radius={180} depth={70} count={9000} factor={2} fade />
      <Sparkles count={1200} scale={80} size={1.1} speed={0.08} opacity={0.22} />
      {Object.values(SOLAR_BODIES).map((body: any) => (
        <CelestialBody key={body.id} body={body} time={time} scaleMode={scaleMode} selected={body.id === selected} onSelect={onSelect} />
      ))}
      <OrbitControls makeDefault enableDamping dampingFactor={0.06} minDistance={0.12} maxDistance={180} />
    </Canvas>
  );
}