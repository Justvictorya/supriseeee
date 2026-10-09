import React, { useState } from 'react';
import { DateBooking, BirthdayState } from '../types';
import { X, Calendar, Heart, RotateCcw, Copy, Check, User, Mail } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface OrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: BirthdayState;
  onUpdateState: (newState: BirthdayState) => void;
  onResetFlow: () => void;
}

export const OrganizerModal: React.FC<OrganizerModalProps> = ({
  isOpen,
  onClose,
  state,
  onUpdateState,
  onResetFlow,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [bryanName, setBryanName] = useState<string>(state.name || 'Bryan');
  const [victoriaName, setVictoriaName] = useState<string>(state.senderName || 'Victoria');
  const [victoriaEmail, setVictoriaEmail] = useState<string>(state.senderEmail || 'victoriajohn0309@gmail.com');

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateState({
      ...state,
      name: bryanName.trim() || 'Bryan',
      senderName: victoriaName.trim() || 'Victoria',
      senderEmail: victoriaEmail.trim() || 'victoriajohn0309@gmail.com',
    });
    soundFx.playConfettiPop();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-[#0d0508] border border-[#881337]/50 shadow-2xl p-6 sm:p-8 relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#2d0813]">
          <div>
            <h3 className="font-display font-bold text-lg text-white">
              Victoria’s Surprise Dashboard
            </h3>
            <p className="text-xs text-rose-300/70">
              Notification & booking status for Bryan’s birthday surprise
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#200810] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Booking Status */}
        <div className="my-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-rose-300/80 mb-2">
            Date Booking Status
          </label>
          {state.booking ? (
            <div className="p-4 rounded-2xl bg-black/80 border border-[#881337]/60 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-[#881337]/30 text-rose-300 font-bold border border-rose-500/40">
                  Booked & Notified
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Date Picked:</span>
                <span className="font-bold text-rose-200">
                  {state.booking.formattedDate}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Time:</span>
                <span className="text-slate-200">{state.booking.timeSlot}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Activity:</span>
                <span className="text-slate-200">{state.booking.activity}</span>
              </div>
              {state.booking.specialNote && (
                <div className="pt-2 border-t border-[#2d0813]">
                  <span className="text-slate-400 block mb-0.5">Bryan's Message:</span>
                  <span className="text-rose-100 italic font-body">"{state.booking.specialNote}"</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-black/80 border border-[#2d0813] text-xs text-rose-300/70 text-center">
              <span>Bryan has not locked in a date yet. Once he clicks "Lock In Date & Notify Victoria", it will appear here!</span>
            </div>
          )}
        </div>

        {/* Settings form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-rose-200/90 mb-1">
                Birthday Person
              </label>
              <input
                type="text"
                value={bryanName}
                onChange={(e) => setBryanName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black border border-[#2d0813] text-slate-100 text-xs focus:border-rose-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-rose-200/90 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={victoriaName}
                onChange={(e) => setVictoriaName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black border border-[#2d0813] text-slate-100 text-xs focus:border-rose-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-200/90 mb-1">
              Your Notification Email
            </label>
            <input
              type="email"
              value={victoriaEmail}
              onChange={(e) => setVictoriaEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black border border-[#2d0813] text-slate-100 text-xs focus:border-rose-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#2d0813]">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1c080f] hover:bg-[#2c0d18] text-rose-200 text-xs font-bold transition-colors cursor-pointer border border-[#881337]/40"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Copy Link for Bryan'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onResetFlow();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#350713]/80 hover:bg-[#4c0519] border border-rose-500/40 text-rose-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset & Relight</span>
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#500724] via-[#881337] to-[#500724] hover:from-[#881337] hover:to-[#9f1239] text-white font-bold text-xs transition-colors cursor-pointer border border-rose-400/40"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
};
