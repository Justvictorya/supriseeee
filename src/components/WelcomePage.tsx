import React from 'react';
import { Sparkles, Flame, Heart, Cake } from 'lucide-react';
import { TypewriterWish } from './TypewriterWish';
import { soundFx } from '../utils/audio';
import { fireConfettiBurst } from './ConfettiCanvas';

interface WelcomePageProps {
  name: string;
  senderName: string;
  onGoToCandleRitual: () => void;
  onMoreConfetti: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  name,
  senderName,
  onGoToCandleRitual,
  onMoreConfetti,
}) => {
  const wishMessage = `Dearest ${name},

Happy Birthday! 🎉

Another incredible year of being someone truly extraordinary. Thank you for always bringing your humor, kindness, warmth, and spark into my life. Every single moment with you is something I cherish.

I created this little surprise just for you. Before you see what I've got planned, you need to make your birthday wish and blow out your candle!

Are you ready?`;

  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center text-center animate-in fade-in duration-500">
      {/* Decorative Pill Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4c0519]/40 border border-[#881337]/60 text-rose-200 text-xs sm:text-sm font-bold shadow-inner mb-6">
        <Sparkles className="w-4 h-4 text-rose-300 animate-spin" />
        <span>A Special Birthday Surprise from {senderName}</span>
      </div>

      {/* Main Glowing Title */}
      <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-rose-100 to-rose-300 drop-shadow-[0_0_35px_rgba(136,19,55,0.6)]">
        Happy Birthday, {name}! 🎂
      </h1>

      <p className="mt-4 text-base sm:text-xl text-rose-100/80 font-medium max-w-xl mx-auto leading-relaxed">
        Today is your special day. A private surprise is waiting for you, but first... you must make a wish.
      </p>

      {/* Typewriter Wish Card */}
      <div className="w-full my-6 text-left">
        <TypewriterWish
          name={name}
          wishText={wishMessage}
          signature={`With all my love, ${senderName} ❤️`}
        />
      </div>

      {/* THE PROMINENT FEATURE: "Blow Out The Candle" Button in Velvet Maroon */}
      <div className="mt-4 flex flex-col items-center gap-4 w-full max-w-md">
        <button
          onClick={() => {
            soundFx.playCelebrationFanfare();
            onGoToCandleRitual();
          }}
          className="group relative w-full py-5 px-8 rounded-2xl bg-gradient-to-r from-[#500724] via-[#881337] to-[#500724] hover:from-[#881337] hover:to-[#9f1239] text-white font-display font-black text-lg sm:text-xl shadow-2xl shadow-[#881337]/50 hover:shadow-[#881337]/75 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-3 border border-rose-400/40"
        >
          {/* Flame icon with pulse */}
          <span className="p-2 rounded-xl bg-black/40 text-rose-200 group-hover:scale-110 transition-transform">
            <Flame className="w-6 h-6 fill-rose-300 text-rose-300" />
          </span>
          <span>Blow Out The Candle 🕯️</span>
          <span className="text-xl">✨</span>
        </button>

        <p className="text-xs text-rose-300/70 flex items-center gap-1.5 font-medium">
          <span>Clicking will take you to your private candle lighting</span>
          <span>·</span>
          <span>Get ready to make a wish!</span>
        </p>

        {/* Secondary "More Confetti" Action */}
        <div className="pt-2">
          <button
            onClick={() => {
              soundFx.playConfettiPop();
              fireConfettiBurst();
              onMoreConfetti();
            }}
            className="px-4 py-2 rounded-xl bg-[#13070b] hover:bg-[#200810] border border-[#881337]/40 hover:border-rose-400/60 text-rose-200 hover:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>More Confetti! 🎉</span>
          </button>
        </div>
      </div>
    </div>
  );
};
