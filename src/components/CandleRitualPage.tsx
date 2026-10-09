import React, { useState, useEffect, useRef } from 'react';
import { Wind, Sparkles, Gift, ArrowLeft } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { fireCandleBlowCelebration } from './ConfettiCanvas';

interface CandleRitualPageProps {
  name: string;
  onGetYourGift: () => void;
  onBackToWelcome: () => void;
}

export const CandleRitualPage: React.FC<CandleRitualPageProps> = ({
  name,
  onGetYourGift,
  onBackToWelcome,
}) => {
  const [isLit, setIsLit] = useState<boolean>(true);
  const [secondsLeft, setSecondsLeft] = useState<number>(5);
  const [isBlownOut, setIsBlownOut] = useState<boolean>(false);
  const [showSmoke, setShowSmoke] = useState<boolean>(false);
  const [candleIgnited, setCandleIgnited] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  // Ignite candle after mount
  useEffect(() => {
    const ignitionTimer = setTimeout(() => {
      setCandleIgnited(true);
    }, 400);

    return () => clearTimeout(ignitionTimer);
  }, []);

  // 5-second countdown timer
  useEffect(() => {
    if (!candleIgnited || isBlownOut) return;

    timerRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleExtinguish(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [candleIgnited, isBlownOut]);

  const handleExtinguish = (auto: boolean = false) => {
    if (isBlownOut) return;

    soundFx.playBlowSound();
    setIsLit(false);
    setShowSmoke(true);
    setIsBlownOut(true);

    setTimeout(() => {
      soundFx.playCelebrationFanfare();
      fireCandleBlowCelebration();
    }, 400);
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-between px-4 py-8 bg-[#050204] text-slate-100 select-none animate-in fade-in duration-700">
      {/* Back button */}
      <div className="w-full max-w-2xl flex items-center justify-between">
        <button
          onClick={onBackToWelcome}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#13060a] hover:bg-[#200910] text-rose-300/80 hover:text-white text-xs font-semibold border border-[#881337]/40 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
        <span className="text-xs uppercase tracking-widest text-rose-400/80 font-bold">
          The Candle Ritual
        </span>
      </div>

      {/* Top Warning & Instruction Bar */}
      <div className="w-full max-w-lg text-center mt-4">
        {!isBlownOut ? (
          <div className="flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#4c0519]/50 border border-[#881337]/60 text-rose-200 text-xs font-bold animate-pulse">
              <span>Make a wish, {name}!</span>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-4xl text-rose-100 tracking-tight">
              Blow Out The Candle In{' '}
              <span className="text-rose-400 tabular-nums font-black underline decoration-[#881337] decoration-wavy">
                {secondsLeft}s
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-rose-200/70 max-w-md">
              Focus on what you wish for most this year. The candle will blow out automatically in {secondsLeft} seconds, or you can blow it out right now!
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in-95 duration-500">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#4c0519]/60 border border-rose-500/50 text-rose-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-rose-300 animate-spin" />
              <span>Wish Made! ✨</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
              The Candle Has Been Blown Out!
            </h2>
            <p className="text-xs sm:text-sm text-rose-200/80">
              May every single wish you made today come true, {name}.
            </p>
          </div>
        )}
      </div>

      {/* CENTER: THE REALISTIC CANDLE IN THE DARK */}
      <div className="relative flex flex-col items-center justify-center my-10 py-8">
        {/* Warm Ambient Glow in the Dark when Candle is Lit */}
        {isLit && candleIgnited && (
          <div
            className="absolute -top-12 w-80 sm:w-96 h-80 sm:h-96 rounded-full pointer-events-none transition-opacity duration-1000"
            style={{
              background:
                'radial-gradient(circle, rgba(251, 191, 36, 0.42) 0%, rgba(245, 158, 11, 0.22) 35%, rgba(239, 68, 68, 0.08) 60%, transparent 80%)',
              filter: 'blur(28px)',
            }}
          />
        )}

        {/* Smoke Effect when blown out */}
        {!isLit && showSmoke && (
          <div className="absolute -top-16 flex flex-col items-center pointer-events-none animate-smoke z-30">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-300/70 blur-[1px]" />
            <div className="w-5 h-5 rounded-full bg-slate-400/50 blur-[2px] -mt-1" />
            <div className="w-7 h-7 rounded-full bg-slate-500/30 blur-[3px] -mt-1" />
          </div>
        )}

        {/* The Candle Assembly */}
        <div
          onClick={() => isLit && handleExtinguish(false)}
          className={`group relative flex flex-col items-center cursor-pointer transition-transform ${
            isLit ? 'hover:scale-105 active:scale-95' : ''
          }`}
          title={isLit ? 'Click to blow out the candle early!' : 'Candle extinguished'}
        >
          {/* Candle Flame */}
          {isLit && candleIgnited ? (
            <div className="relative mb-2 flex items-center justify-center animate-flame">
              {/* Outer Golden Flame */}
              <div
                className="w-8 sm:w-9 h-14 sm:h-16 rounded-full shadow-2xl"
                style={{
                  background:
                    'radial-gradient(ellipse at bottom, #FFFBEB 0%, #FBBF24 40%, #EA580C 80%, transparent 100%)',
                  borderRadius: '50% 50% 35% 35% / 60% 60% 40% 40%',
                  filter: 'drop-shadow(0 0 16px rgba(251, 191, 36, 0.9))',
                }}
              />
              {/* Core White Flame */}
              <div
                className="absolute bottom-1 w-4 h-7 rounded-full bg-white opacity-95"
                style={{
                  borderRadius: '50% 50% 40% 40%',
                  boxShadow: '0 0 10px #FFFFFF',
                }}
              />
              {/* Blue spark base */}
              <div className="absolute bottom-0 w-3 h-1.5 rounded-full bg-cyan-400/80 blur-[0.5px]" />
            </div>
          ) : (
            /* Wick with tiny glowing ember */
            <div className="h-10 flex items-end mb-2">
              <div className="w-1 h-5 bg-slate-800 rounded-sm relative">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600 -top-1 -left-[1px] absolute" />
              </div>
            </div>
          )}

          {/* Wick while lit */}
          {isLit && candleIgnited && (
            <div className="w-1 h-3 bg-slate-900 rounded-sm -mb-1 z-10" />
          )}

        {/* Realistic Pillar Candle Body in Velvet Maroon with Ivory Cream Highlights */}
          <div className="relative w-16 sm:w-20 h-40 sm:h-48 rounded-t-lg bg-gradient-to-r from-[#500724] via-[#881337] to-[#4c0519] shadow-2xl border-t border-rose-300/40 overflow-hidden flex flex-col justify-between">
            {/* Wax Drips */}
            <div className="absolute top-0 inset-x-0 flex justify-between px-1">
              <div className="w-3 h-7 bg-[#9f1239] rounded-b-full shadow-sm" />
              <div className="w-2.5 h-10 bg-[#be123c] rounded-b-full shadow-sm" />
              <div className="w-3 h-5 bg-[#9f1239] rounded-b-full shadow-sm" />
              <div className="w-2 h-8 bg-[#be123c] rounded-b-full shadow-sm" />
            </div>

            {/* Candle Embossed Name */}
            <div className="my-auto text-center z-10 select-none">
              <span className="font-display font-extrabold text-xs sm:text-sm tracking-widest uppercase text-rose-200/80 drop-shadow">
                {name}
              </span>
            </div>

            {/* Bottom Candle Shadow */}
            <div className="h-4 bg-gradient-to-b from-transparent to-black/60" />
          </div>

          {/* Candle Ceramic / Glass Plate Holder */}
          <div className="relative -mt-2 w-32 sm:w-40 h-5 rounded-full bg-gradient-to-r from-[#1c080e] via-[#4c0519] to-[#1c080e] shadow-2xl border-t border-[#881337]/50 flex items-center justify-center">
            <div className="w-24 h-1 bg-rose-500/30 rounded-full blur-[1px]" />
          </div>
        </div>

        {/* Quick Action Button during Countdown */}
        {isLit && (
          <div className="mt-8">
            <button
              onClick={() => handleExtinguish(false)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4c0519]/40 hover:bg-[#881337]/50 border border-[#881337]/60 text-rose-200 text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-lg shadow-[#881337]/20"
            >
              <Wind className="w-4 h-4 text-rose-300" />
              <span>Blow Out Candle Now 🌬️</span>
            </button>
          </div>
        )}
      </div>

      {/* BOTTOM SECTION: "GET YOUR GIFT" BUTTON AFTER BLOW OUT IN VELVET MAROON */}
      <div className="w-full max-w-md pb-6 flex flex-col items-center">
        {isBlownOut ? (
          <div className="w-full flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <button
              onClick={() => {
                soundFx.playGiftUnwrapChime();
                onGetYourGift();
              }}
              className="w-full py-5 px-8 rounded-2xl bg-gradient-to-r from-[#500724] via-[#881337] to-[#500724] hover:from-[#881337] hover:to-[#9f1239] text-white font-display font-black text-xl sm:text-2xl shadow-2xl shadow-[#881337]/60 hover:shadow-[#881337]/80 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-3 border border-rose-400/40 animate-bounce"
            >
              <Gift className="w-7 h-7 text-rose-200" />
              <span>Get Your Gift 🎁</span>
            </button>

            <p className="text-xs text-rose-300 font-semibold tracking-wide">
              Click to unwrap what Victoria has prepared for you!
            </p>
          </div>
        ) : (
          <div className="text-center text-xs text-rose-300/60">
            <span>Keep your wish in mind · {secondsLeft} seconds remaining</span>
          </div>
        )}
      </div>
    </div>
  );
};
