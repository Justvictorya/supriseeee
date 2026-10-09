import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiCanvasProps {
  continuous?: boolean;
}

export const fireConfettiBurst = () => {
  const count = 220;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#881337', '#9f1239', '#4c0519', '#be123c', '#e11d48', '#fb7185', '#fbbf24', '#fef08a'],
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Multi-tier fireworks explosion
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

export const fireCornerCannons = () => {
  const end = Date.now() + 1000;
  const colors = ['#881337', '#4c0519', '#9f1239', '#be123c', '#fbbf24'];

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.85 },
      colors: colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.85 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};

export const fireCandleBlowCelebration = () => {
  // Center blast
  fireConfettiBurst();
  // Corner cannons
  setTimeout(() => fireCornerCannons(), 200);
  // Gold & maroon stars shower
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 100,
      origin: { y: 0.4 },
      shapes: ['star', 'circle'],
      colors: ['#881337', '#be123c', '#fbbf24', '#ffffff'],
      scalar: 1.2,
    });
  }, 400);
};

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({ continuous = true }) => {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!continuous) return;

    // Gentle ambient drifting confetti every 3.5 seconds
    const interval = window.setInterval(() => {
      confetti({
        particleCount: 15,
        angle: 90,
        spread: 140,
        startVelocity: 15,
        decay: 0.94,
        gravity: 0.6,
        origin: { x: Math.random() * 0.8 + 0.1, y: -0.05 },
        colors: ['#881337', '#4c0519', '#9f1239', '#be123c', '#f43f5e', '#fbbf24'],
        scalar: 0.8,
        disableForReducedMotion: true,
      });
    }, 3200);

    timerRef.current = interval;
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [continuous]);

  return null;
};
