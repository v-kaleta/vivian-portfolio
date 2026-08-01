import { useState, useEffect } from 'react';

// 11-frame gallop cycle from the CC-BY 3.0 licensed LPC Horse spritesheet
// by bluecarrot16 (opengameart.org/content/lpc-horse), laid out on a 4-column,
// 128x128px-per-frame grid. Frames 0-10 are the galloping animation.
const FRAME_COUNT = 11;
const COLS = 4;
const NATIVE_SIZE = 128;
const DISPLAY_SIZE = 80; // scaled down for the site
const SHEET_W = 512;
const SHEET_H = 1024;
const SCALE = DISPLAY_SIZE / NATIVE_SIZE;

export default function HorseSprite() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % FRAME_COUNT);
    }, 55); // ~18fps, close to the recommended ~20fps gallop speed
    return () => clearInterval(interval);
  }, []);

  const col = frame % COLS;
  const row = Math.floor(frame / COLS);

  return (
    <div
      style={{
        width: DISPLAY_SIZE,
        height: DISPLAY_SIZE,
        backgroundImage: "url('/images/horse-sprite.png')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${SHEET_W * SCALE}px ${SHEET_H * SCALE}px`,
        backgroundPosition: `-${col * DISPLAY_SIZE}px -${row * DISPLAY_SIZE}px`,
        imageRendering: 'pixelated',
      }}
    />
  );
}
