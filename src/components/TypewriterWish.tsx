import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Heart, Sparkles, Check } from 'lucide-react';

interface TypewriterWishProps {
  name: string;
  wishText: string;
  signature: string;
  autoStart?: boolean;
}

export const TypewriterWish: React.FC<TypewriterWishProps> = ({
  name,
  wishText,
  signature,
  autoStart = true,
}) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(autoStart);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const indexRef = useRef<number>(0);

  useEffect(() => {
    // Reset when wishText or name changes
    setDisplayedText('');
    indexRef.current = 0;
    setIsComplete(false);
    setIsTyping(true);
  }, [wishText, name]);

  useEffect(() => {
    if (!isTyping || isComplete) return;

    const interval = window.setInterval(() => {
      if (indexRef.current < wishText.length) {
        setDisplayedText(wishText.slice(0, indexRef.current + 1));
        indexRef.current += 1;
      } else {
        setIsComplete(true);
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 38);

    return () => clearInterval(interval);
  }, [isTyping, isComplete, wishText]);

  const handleReplay = () => {
    setDisplayedText('');
    indexRef.current = 0;
    setIsComplete(false);
    setIsTyping(true);
  };

  const handleSkipToEnd = () => {
    setDisplayedText(wishText);
    indexRef.current = wishText.length;
    setIsComplete(true);
    setIsTyping(false);
  };

  const handleCopyWish = () => {
    navigator.clipboard.writeText(wishText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <div className="relative rounded-3xl bg-[#0d060a]/95 border border-[#881337]/40 shadow-2xl backdrop-blur-xl p-6 sm:p-8 overflow-hidden shadow-[#881337]/15">
        {/* Decorative corner glows */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#881337]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#4c0519]/30 rounded-full blur-2xl pointer-events-none" />

        {/* Header bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2d0813] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#881337]/25 text-rose-300 border border-[#881337]/50">
              <Sparkles className="w-4 h-4 text-rose-300" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-100 text-base sm:text-lg">
                A Letter for {name}
              </h3>
              <p className="text-xs text-rose-300/70">Personal Birthday Message</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {!isComplete && (
              <button
                onClick={handleSkipToEnd}
                className="px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-rose-200 transition-colors cursor-pointer"
              >
                Skip
              </button>
            )}
            <button
              onClick={handleReplay}
              title="Replay typewriter"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-[#200810] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyWish}
              title="Copy message"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-[#200810] transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Heart className="w-4 h-4 text-rose-400" />}
            </button>
          </div>
        </div>

        {/* Message body with typewriter effect */}
        <div className="relative min-h-[140px] text-slate-200 font-body text-base sm:text-lg leading-relaxed whitespace-pre-line">
          {displayedText}
          {!isComplete && (
            <span className="inline-block w-2.5 h-5 ml-1 bg-[#e11d48] animate-pulse align-middle" />
          )}
        </div>

        {/* Signature & Wax Seal */}
        <div className="mt-6 pt-4 border-t border-[#2d0813] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-rose-500 text-lg">❤️</span>
            <span className="text-sm font-handwriting text-2xl text-rose-200">
              {signature}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>Special Day</span>
            <span>·</span>
            <span>Forever Celebrated</span>
          </div>
        </div>
      </div>
    </div>
  );
};
