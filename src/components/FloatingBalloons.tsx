import React, { useState } from 'react';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';

interface Balloon {
  id: number;
  color: string;
  shineColor: string;
  leftPercent: number;
  floatDuration: number;
  delay: number;
  size: number;
  driftX: number;
  letter?: string;
}

const INITIAL_BALLOONS: Balloon[] = [
  { id: 1, color: '#881337', shineColor: '#fda4af', leftPercent: 6, floatDuration: 14, delay: 0, size: 68, driftX: 18, letter: 'H' },
  { id: 2, color: '#4c0519', shineColor: '#f43f5e', leftPercent: 16, floatDuration: 18, delay: 2, size: 76, driftX: -22, letter: 'A' },
  { id: 3, color: '#9f1239', shineColor: '#fecdd3', leftPercent: 26, floatDuration: 16, delay: 5, size: 64, driftX: 14, letter: 'P' },
  { id: 4, color: '#1c1917', shineColor: '#e11d48', leftPercent: 36, floatDuration: 20, delay: 1, size: 74, driftX: -16, letter: 'P' },
  { id: 5, color: '#be123c', shineColor: '#ffe4e6', leftPercent: 58, floatDuration: 17, delay: 4, size: 70, driftX: 20, letter: 'Y' },
  { id: 6, color: '#800020', shineColor: '#fb7185', leftPercent: 68, floatDuration: 19, delay: 2.5, size: 78, driftX: -25, letter: '🎂' },
  { id: 7, color: '#4a0404', shineColor: '#fda4af', leftPercent: 78, floatDuration: 15, delay: 6, size: 66, driftX: 15, letter: 'B' },
  { id: 8, color: '#27040d', shineColor: '#f43f5e', leftPercent: 88, floatDuration: 21, delay: 3, size: 82, driftX: -18, letter: '✨' },
];

export const FloatingBalloons: React.FC = () => {
  const [balloons, setBalloons] = useState<Balloon[]>(INITIAL_BALLOONS);
  const [poppedCount, setPoppedCount] = useState(0);

  const popBalloon = (id: number, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    soundFx.playConfettiPop();
    confetti({
      particleCount: 22,
      origin: { x, y },
      spread: 70,
      startVelocity: 25,
      colors: ['#F59E0B', '#EF4444', '#3B82F6', '#10B981', '#EC4899'],
    });

    setBalloons((prev) => prev.filter((b) => b.id !== id));
    setPoppedCount((c) => c + 1);

    // Respawn after 6 seconds
    setTimeout(() => {
      setBalloons((prev) => {
        const found = INITIAL_BALLOONS.find((b) => b.id === id);
        if (found && !prev.some((b) => b.id === id)) {
          return [...prev, found];
        }
        return prev;
      });
    }, 6000);
  };

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none">
      {balloons.map((balloon) => (
        <div
          key={balloon.id}
          className="absolute pointer-events-auto cursor-pointer transition-transform hover:scale-110 active:scale-95"
          style={{
            left: `${balloon.leftPercent}%`,
            bottom: '-120px',
            animation: `float-up ${balloon.floatDuration}s linear infinite`,
            animationDelay: `${balloon.delay}s`,
          }}
          onClick={(e) => popBalloon(balloon.id, e)}
          title="Click to pop!"
        >
          <div className="relative flex flex-col items-center">
            {/* Balloon Body */}
            <div
              className="relative rounded-full shadow-lg flex items-center justify-center"
              style={{
                width: `${balloon.size}px`,
                height: `${balloon.size * 1.22}px`,
                backgroundColor: balloon.color,
                boxShadow: `inset -8px -10px 18px rgba(0,0,0,0.25), inset 8px 10px 18px rgba(255,255,255,0.4), 0 10px 25px ${balloon.color}40`,
              }}
            >
              {/* Highlight */}
              <div
                className="absolute top-2 left-3 rounded-full opacity-70"
                style={{
                  width: `${balloon.size * 0.28}px`,
                  height: `${balloon.size * 0.45}px`,
                  backgroundColor: balloon.shineColor,
                  transform: 'rotate(-25deg)',
                }}
              />

              {/* Celebration Letter / Emoji on Balloon */}
              {balloon.letter && (
                <span className="text-white/90 font-display font-extrabold text-sm drop-shadow pointer-events-none select-none">
                  {balloon.letter}
                </span>
              )}
            </div>

            {/* Knot */}
            <div
              className="w-3 h-2 rounded-sm -mt-0.5"
              style={{ backgroundColor: balloon.color }}
            />

            {/* String */}
            <svg
              width="24"
              height="65"
              viewBox="0 0 24 65"
              fill="none"
              className="opacity-60 stroke-slate-400"
            >
              <path
                d="M12 0 C16 15, 8 30, 14 45 C18 55, 11 60, 12 65"
                strokeWidth="1.2"
                strokeDasharray="2 1"
              />
            </svg>
          </div>
        </div>
      ))}

      {/* Floating animation keyframes injection */}
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.85;
          }
          90% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(-115vh) rotate(8deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
