import { useEffect, useState } from 'react';
import Wave from 'react-wavify';

// three layered waves using react-wavify, tuned to drift at different
// speeds/heights so they read as a soft parallax ripple
export default function WaveBackground() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e) => setReduceMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="wave-bg" aria-hidden="true">
      <Wave
        className="wave-layer wave-back"
        fill="var(--wave-1)"
        paused={reduceMotion}
        options={{ height: 30, amplitude: 22, speed: 0.15, points: 4 }}
      />
      <Wave
        className="wave-layer wave-mid"
        fill="var(--wave-2)"
        paused={reduceMotion}
        options={{ height: 20, amplitude: 28, speed: 0.25, points: 3 }}
      />
      <Wave
        className="wave-layer wave-front"
        fill="var(--wave-3)"
        paused={reduceMotion}
        options={{ height: 10, amplitude: 34, speed: 0.35, points: 3 }}
      />
    </div>
  );
}
