import { useMemo, useRef } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

function orbitalPosition(a: number, e: number, period: number, days: number, scale: 'educational' | 'true') {
  const d = scale === 'true' ? Math.log10(a + 1) * 2.2 + 0.2 : Math.pow(a, 0.55) * 1.05;
  const M = (days / period) * Math.PI * 2;
  let E = M;
  for (let i = 0; i < 6; i++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  const r = d * (1 - e * Math.cos(E));
  return [r * Math.cos(E), 0, r * Math.sqrt(1 - e * e) * Math.sin(E)] as const;
}

export function CelestialBody({ body, time, scaleMode, selected, onSelect }: any) {
  const ref = useRef<THREE.Group>(null);
  const texture = useMemo(() => {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(80, 70, 10, 128, 128, 190);
    g.addColorStop(0, '#ffffff'); g.addColorStop(.2, body.color); g.addColorStop(1, '#111827');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1000; i++) { ctx.globalAlpha = .04 + Math.random() * .12; ctx.fillStyle = '#fff'; ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2); }
    return new THREE.CanvasTexture(c);
  }, [body.id]);
  const pos = body.a ? orbitalPosition(body.a, body.e, body.period, time, scaleMode) : [0, 0, 0];
  const radius = body.id === 'sun' ? .48 : Math.max(.035, Math.pow(body.radius / 6371, .3) * .065);
  return <group ref={ref} position={pos} onClick={(e) => { e.stopPropagation(); onSelect(body.id); }}>
    <mesh castShadow><sphereGeometry args={[radius, 48, 32]} /><meshStandardMaterial map={texture} roughness={.82} /></mesh>
    {body.atmosphere && <mesh scale={[1.14, 1.14, 1.14]}><sphereGeometry args={[radius, 40, 28]} /><meshBasicMaterial color={body.color} transparent opacity={.16} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>}
    {body.rings && <mesh rotation={[Math.PI / 2.25, 0, 0]}><ringGeometry args={[radius * 1.35, radius * 2.15, 96]} /><meshBasicMaterial color="#b9aa89" transparent opacity={.55} side={THREE.DoubleSide} /></mesh>}
    {selected && <mesh scale={[1.3, 1.3, 1.3]}><sphereGeometry args={[radius, 32, 20]} /><meshBasicMaterial color="#8fc5ff" wireframe transparent opacity={.3} /></mesh>}
    <Html distanceFactor={8}><span className="body-label">{body.name}</span></Html>
  </group>;
}