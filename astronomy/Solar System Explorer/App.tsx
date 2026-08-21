import { useEffect, useState } from 'react';
import { SolarSystemScene } from './SolarSystemScene';
import { InfoPanel } from './InfoPanel';
import { SOLAR_BODIES } from './solarData';

export default function App() {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(30);
  const [selected, setSelected] = useState('sun');
  const [scale, setScale] = useState<'educational' | 'true'>('educational');

  useEffect(() => {
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      if (playing) setTime(t => t + dt * speed);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, speed]);

  return (
    <main className="solar-react-app">
      <SolarSystemScene time={time} selected={selected} onSelect={setSelected} scaleMode={scale} />
      <InfoPanel body={selected ? SOLAR_BODIES[selected] : undefined} />
    </main>
  );
}