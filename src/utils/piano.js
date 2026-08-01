let audioCtx;

// C major scale, C4 through C5
const NOTES = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25];

// relative amplitude of each harmonic above the fundamental — this is what
// gives it a "piano" character instead of a flat electronic beep
const HARMONICS = [
  { mult: 1, gain: 1.0 },
  { mult: 2, gain: 0.35 },
  { mult: 3, gain: 0.12 },
  { mult: 4, gain: 0.06 },
];

export function playPianoNote(index) {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const freq = NOTES[index % NOTES.length];
  const now = audioCtx.currentTime;

  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.3, now);
  masterGain.connect(audioCtx.destination);

  HARMONICS.forEach(({ mult, gain }) => {
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * mult, now);

    // fast attack, natural-feeling exponential decay (piano notes ring out, don't cut off)
    oscGain.gain.setValueAtTime(0.0001, now);
    oscGain.gain.exponentialRampToValueAtTime(gain, now + 0.008);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

    osc.connect(oscGain);
    oscGain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 1.1);
  });
}