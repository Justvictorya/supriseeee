import React, { useState, useEffect } from 'react';
import { PageStep, BirthdayState, DateBooking } from './types';
import { WelcomePage } from './components/WelcomePage';
import { CandleRitualPage } from './components/CandleRitualPage';
import { GiftDateCalendarPage } from './components/GiftDateCalendarPage';
import { OrganizerModal } from './components/OrganizerModal';
import { ConfettiCanvas, fireConfettiBurst } from './components/ConfettiCanvas';
import { FloatingBalloons } from './components/FloatingBalloons';
import { soundFx } from './utils/audio';
import { Music, VolumeX, Heart, Settings, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'bryan_birthday_date_v2';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageStep>('welcome');
  const [isOrganizerOpen, setIsOrganizerOpen] = useState<boolean>(false);
  const [isMelodyPlaying, setIsMelodyPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [state, setState] = useState<BirthdayState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return {
      name: 'Bryan',
      senderName: 'Victoria',
      senderEmail: 'victoriajohn0309@gmail.com',
      candleBlown: false,
      booking: null,
    };
  });

  // Persist state
  const handleUpdateState = (newState: BirthdayState) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch {
      // ignore
    }
  };

  const handleSaveBooking = (booking: DateBooking) => {
    const updated = {
      ...state,
      booking,
    };
    handleUpdateState(updated);
  };

  const handleResetFlow = () => {
    const resetState = {
      ...state,
      candleBlown: false,
      booking: null,
    };
    handleUpdateState(resetState);
    setCurrentPage('welcome');
  };

  // Music controls
  const toggleMusic = () => {
    if (isMelodyPlaying) {
      soundFx.stopMelody();
      setIsMelodyPlaying(false);
    } else {
      const started = soundFx.toggleHappyBirthdayMelody(() => {
        setIsMelodyPlaying(false);
      });
      setIsMelodyPlaying(started);
    }
  };

  const toggleMute = () => {
    soundFx.isMuted = !isMuted;
    setIsMuted(!isMuted);
    if (!isMuted && isMelodyPlaying) {
      soundFx.stopMelody();
      setIsMelodyPlaying(false);
    }
  };

  return (
    <div
      className={`min-h-screen text-slate-100 flex flex-col transition-colors duration-700 ${
        currentPage === 'candle_ritual' ? 'bg-[#050204]' : 'bg-[#080306]'
      }`}
    >
      {/* Background Ambience (Confetti and Balloons active on welcome & gift pages) */}
      {currentPage !== 'candle_ritual' && (
        <>
          <ConfettiCanvas continuous={true} />
          <FloatingBalloons />
          <div className="fixed top-[-10vw] left-[15vw] w-[45vw] h-[45vw] rounded-full bg-[#881337]/15 blur-[140px] pointer-events-none z-0" />
          <div className="fixed bottom-[-10vw] right-[10vw] w-[40vw] h-[40vw] rounded-full bg-[#4c0519]/25 blur-[150px] pointer-events-none z-0" />
        </>
      )}

      {/* TOP BAR: Black & Maroon contract */}
      <header
        className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors duration-500 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8 ${
          currentPage === 'candle_ritual'
            ? 'bg-[#050204]/90 border-[#2d0813]'
            : 'bg-[#0c0408]/85 border-[#881337]/35'
        }`}
      >
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => setCurrentPage('welcome')}
          className="text-lg font-display font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-300 to-[#e11d48] whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2"
        >
          <span>Happy Birthday {state.name}!</span>
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
        </button>

        {/* Zone 2: Navigation Steps */}
        <nav className="hidden sm:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <button
            onClick={() => setCurrentPage('welcome')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentPage === 'welcome' ? 'text-rose-300 font-bold' : 'hover:text-rose-100 text-slate-400'
            }`}
          >
            1. Wishes & Letter
          </button>
          <span className="text-[#881337]/60">→</span>
          <button
            onClick={() => setCurrentPage('candle_ritual')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentPage === 'candle_ritual' ? 'text-rose-300 font-bold' : 'hover:text-rose-100 text-slate-400'
            }`}
          >
            2. Blow The Candle
          </button>
          <span className="text-[#881337]/60">→</span>
          <button
            onClick={() => setCurrentPage('gift_reveal')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentPage === 'gift_reveal' ? 'text-rose-300 font-bold' : 'hover:text-rose-100 text-slate-400'
            }`}
          >
            3. Date with Victoria
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Melody Music Toggle */}
          <button
            onClick={toggleMusic}
            title={isMelodyPlaying ? 'Stop music' : 'Play birthday melody'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isMelodyPlaying
                ? 'bg-[#881337] text-white border-rose-400 shadow-md animate-pulse'
                : 'bg-[#18060e] text-rose-200 hover:text-white border-[#881337]/40 hover:bg-[#280a18]'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {isMelodyPlaying ? 'Playing Song 🎵' : 'Play Song 🎶'}
            </span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            className="p-2 rounded-xl bg-[#18060e] border border-[#881337]/40 text-slate-400 hover:text-rose-200 hover:bg-[#280a18] transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Sparkles className="w-4 h-4 text-rose-300" />}
          </button>

          {/* Victoria Dashboard / Settings */}
          <button
            onClick={() => setIsOrganizerOpen(true)}
            title="Victoria's Surprise Settings & Booking Status"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4c0519]/50 hover:bg-[#881337]/70 text-rose-200 hover:text-white border border-[#881337]/60 text-xs font-bold transition-all cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-rose-300" />
            <span className="hidden sm:inline">Victoria's Hub</span>
          </button>
        </div>
      </header>

      {/* MAIN VIEW CONTROLLER */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {/* PAGE 1: Welcome & Birthday Wishes */}
        {currentPage === 'welcome' && (
          <WelcomePage
            name={state.name}
            senderName={state.senderName}
            onGoToCandleRitual={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setCurrentPage('candle_ritual');
            }}
            onMoreConfetti={() => fireConfettiBurst()}
          />
        )}

        {/* PAGE 2: The Dark Screen Candle Ritual */}
        {currentPage === 'candle_ritual' && (
          <div className="w-full">
            <CandleRitualPage
              name={state.name}
              onGetYourGift={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setCurrentPage('gift_reveal');
              }}
              onBackToWelcome={() => setCurrentPage('welcome')}
            />
          </div>
        )}

        {/* PAGE 3: The Gift & October 2026 Date Calendar with Victoria */}
        {currentPage === 'gift_reveal' && (
          <GiftDateCalendarPage
            name={state.name}
            senderName={state.senderName}
            senderEmail={state.senderEmail}
            onBackToRitual={() => setCurrentPage('candle_ritual')}
            booking={state.booking}
            onSaveBooking={handleSaveBooking}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-[#2d0813] bg-[#070205]/90 py-6 px-4 text-center text-xs text-rose-300/60">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Happy Birthday {state.name} Surprise Experience ❤️</span>
          <div className="flex items-center gap-3 text-rose-300/60">
            <span>Make a Wish</span>
            <span>·</span>
            <span>Blow Candle in 5s</span>
            <span>·</span>
            <span>Date with Victoria</span>
          </div>
          <span>October 2026 Edition</span>
        </div>
      </footer>

      {/* Victoria Organizer Modal */}
      <OrganizerModal
        isOpen={isOrganizerOpen}
        onClose={() => setIsOrganizerOpen(false)}
        state={state}
        onUpdateState={handleUpdateState}
        onResetFlow={handleResetFlow}
      />
    </div>
  );
}
