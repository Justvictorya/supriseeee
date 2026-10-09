import React, { useState } from 'react';
import { DateBooking } from '../types';
import { soundFx } from '../utils/audio';
import { fireConfettiBurst, fireCornerCannons } from './ConfettiCanvas';
import {
  Calendar as CalendarIcon,
  Heart,
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
  Share2,
  Mail,
  Utensils,
  Film,
  Compass,
  Coffee,
  PartyPopper,
  ArrowLeft,
} from 'lucide-react';

interface GiftDateCalendarPageProps {
  name: string;
  senderName: string;
  senderEmail: string;
  onBackToRitual: () => void;
  booking: DateBooking | null;
  onSaveBooking: (booking: DateBooking) => void;
}

const ACTIVITIES = [
  {
    id: 'dinner',
    title: 'Candlelight Dinner & Cocktails',
    desc: 'Fine dining or your favorite steak/pasta spot, delicious drinks on me.',
    icon: Utensils,
    tag: 'Romantic Classic',
  },
  {
    id: 'picnic',
    title: 'Sunset Scenic Picnic & Wine',
    desc: 'Cozy blankets, scenic view, charcuterie board, wine, and great tunes.',
    icon: Coffee,
    tag: 'Cozy & Scenic',
  },
  {
    id: 'movie',
    title: 'VIP Movie & Dessert Date',
    desc: 'Luxury cinema seats with popcorn, followed by late-night artisan dessert.',
    icon: Film,
    tag: 'Relaxed & Fun',
  },
  {
    id: 'adventure',
    title: 'Fun Adventure / Arcade / Bowling',
    desc: 'Action-packed games, friendly rivalry, laughs, and casual bar bites.',
    icon: Compass,
    tag: 'High Energy',
  },
  {
    id: 'surprise',
    title: 'Surprise Itinerary (Victoria Decides!)',
    desc: 'Sit back, dress nice, and let Victoria plan the entire evening for you.',
    icon: Sparkles,
    tag: 'Top Secret',
  },
];

const TIME_SLOTS = [
  '1:00 PM (Weekend Lunch / Brunch)',
  '5:30 PM (Sunset Hour)',
  '7:30 PM (Evening Dinner)',
  '9:00 PM (Late Night & Cocktails)',
];

export const GiftDateCalendarPage: React.FC<GiftDateCalendarPageProps> = ({
  name,
  senderName,
  senderEmail,
  onBackToRitual,
  booking,
  onSaveBooking,
}) => {
  // Calendar: October 2026.
  // Today is Friday, Oct 9, 2026.
  // Oct 1, 2026 is Thursday (day index 4: Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6).
  const startDayOfWeek = 4; // Thursday
  const totalDaysInOctober = 31;
  const todayDayNumber = 9;

  const [selectedDay, setSelectedDay] = useState<number>(booking?.selectedDay || 10);
  const [selectedActivity, setSelectedActivity] = useState<string>(
    booking?.activity || ACTIVITIES[0].title
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    booking?.timeSlot || TIME_SLOTS[2]
  );
  const [bryanNote, setBryanNote] = useState<string>(booking?.specialNote || '');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!booking?.notified);
  const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false);

  const getDayName = (day: number) => {
    // 2026-10-day
    const d = new Date(2026, 9, day);
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const handleConfirmDate = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedDate = `${getDayName(selectedDay)}, October ${selectedDay}, 2026`;
    const newBooking: DateBooking = {
      selectedDay,
      selectedMonth: 'October',
      selectedYear: 2026,
      formattedDate,
      activity: selectedActivity,
      timeSlot: selectedTime,
      specialNote: bryanNote.trim(),
      bookedAt: new Date().toISOString(),
      notified: true,
    };

    onSaveBooking(newBooking);
    setIsSubmitted(true);
    setShowNotificationModal(true);

    soundFx.playCelebrationFanfare();
    fireConfettiBurst();
    setTimeout(() => fireCornerCannons(), 200);

    // Prepare mailto link notification to Victoria
    const subject = encodeURIComponent(
      `🎉 Birthday Date Confirmed: Bryan chose October ${selectedDay}!`
    );
    const body = encodeURIComponent(
      `Hi Victoria!\n\nBryan just unwrapped his birthday gift and picked his date with you!\n\n📅 Date: ${formattedDate}\n⏰ Time: ${selectedTime}\n🍷 Activity: ${selectedActivity}\n💌 Note from Bryan: "${bryanNote || 'Can’t wait!'}"\n\nCheers to an unforgettable birthday celebration! 🥂`
    );

    // Auto open email client or fall back cleanly
    const mailtoUrl = `mailto:${senderEmail}?subject=${subject}&body=${body}`;
    const mailLink = document.createElement('a');
    mailLink.href = mailtoUrl;
    mailLink.target = '_blank';
    mailLink.rel = 'noopener noreferrer';
    document.body.appendChild(mailLink);
    mailLink.click();
    document.body.removeChild(mailLink);
  };

  const getMailtoLink = () => {
    const formattedDate = `${getDayName(selectedDay)}, October ${selectedDay}, 2026`;
    const subject = encodeURIComponent(
      `🎉 Birthday Date Confirmed: Bryan chose October ${selectedDay}!`
    );
    const body = encodeURIComponent(
      `Hi Victoria!\n\nBryan picked his birthday date with you!\n\n📅 Date: ${formattedDate}\n⏰ Time: ${selectedTime}\n🍷 Activity: ${selectedActivity}\n💌 Note from Bryan: "${bryanNote || 'Can’t wait!'}"\n\nSent with love ❤️`
    );
    return `mailto:${senderEmail}?subject=${subject}&body=${body}`;
  };

  const getWhatsAppLink = () => {
    const formattedDate = `${getDayName(selectedDay)}, October ${selectedDay}, 2026`;
    const text = encodeURIComponent(
      `Hey Victoria! ❤️ I just picked our birthday date for ${formattedDate} (${selectedTime})! Activity: ${selectedActivity}. ${bryanNote ? `Note: "${bryanNote}"` : ''} Can't wait! 🎉`
    );
    return `https://wa.me/?text=${text}`;
  };

  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-in fade-in zoom-in-95 duration-500">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToRitual}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#13060a] hover:bg-[#200910] text-rose-300/80 hover:text-white text-xs font-semibold border border-[#881337]/40 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Candle Screen</span>
        </button>

        <span className="text-xs uppercase tracking-widest text-rose-400 font-bold flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 fill-[#be123c] text-[#be123c]" />
          <span>Exclusive Birthday Gift</span>
        </span>
      </div>

      {/* GIFT REVEAL HERO HEADER - Black & Maroon */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#3b0716] via-[#0d0508] to-[#4c0519] border border-[#881337]/50 p-6 sm:p-10 shadow-2xl text-center overflow-hidden mb-10 shadow-[#881337]/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#881337]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#4c0519]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#4c0519]/60 border border-rose-500/40 text-rose-200 text-xs font-bold mb-4">
          <PartyPopper className="w-4 h-4 text-rose-300" />
          <span>Official Gift Reveal</span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight">
          Your Gift is a <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-200 to-pink-300">Date with {senderName}</span>! ❤️
        </h1>

        <p className="mt-4 text-rose-100/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Happy Birthday, {name}! For your birthday this year, I’m treating you to a special date of your choice.
          Pick any day in this month’s calendar below, select what we do, and when you submit, it notifies me right away so I can make all the arrangements!
        </p>

        {/* Maroon Voucher Seal */}
        <div className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#090306]/80 border border-[#881337]/60 text-rose-200 text-xs sm:text-sm font-semibold shadow-inner">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span>All expenses on Victoria · Zero stress · Guaranteed smiles</span>
        </div>
      </div>

      {/* INTERACTIVE OCTOBER 2026 CALENDAR & DATE SELECTOR FORM */}
      <form onSubmit={handleConfirmDate} className="space-y-8">
        {/* CALENDAR CARD */}
        <div className="rounded-3xl bg-[#0d0508]/95 border border-[#881337]/30 p-6 sm:p-8 shadow-xl backdrop-blur-md shadow-[#881337]/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#2d0813]">
            <div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-rose-400" />
                <h2 className="font-display font-extrabold text-2xl text-slate-100">
                  October 2026 Calendar
                </h2>
              </div>
              <p className="text-xs text-rose-200/70 mt-1">
                Choose the day in October that suits your schedule best.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#200810] text-rose-200 border border-[#881337]/50">
              <Heart className="w-3.5 h-3.5 fill-[#be123c] text-[#be123c]" />
              <span>
                Selected: {getDayName(selectedDay)}, Oct {selectedDay}, 2026
              </span>
            </div>
          </div>

          {/* Calendar Day Grid */}
          <div className="mt-6">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-rose-300/80 uppercase tracking-wider">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty leading spacer cells for Thursday start */}
              {[...Array(startDayOfWeek)].map((_, i) => (
                <div key={`empty-${i}`} className="h-12 sm:h-16 rounded-xl bg-black/40" />
              ))}

              {/* Day numbers 1 to 31 */}
              {[...Array(totalDaysInOctober)].map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDay === day;
                const isToday = day === todayDayNumber;
                const isPast = day < todayDayNumber;
                const isWeekend = (startDayOfWeek + i) % 7 === 0 || (startDayOfWeek + i) % 7 === 6;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`relative h-12 sm:h-16 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#881337] to-[#4c0519] text-white font-black border-rose-300 shadow-lg shadow-[#881337]/50 scale-105 z-10'
                        : isToday
                        ? 'bg-[#4c0519]/40 border-rose-400/70 text-rose-200 hover:bg-[#881337]/40 font-bold'
                        : isPast
                        ? 'bg-black/30 border-[#200810]/50 text-slate-600 hover:text-slate-400 hover:border-[#881337]/30'
                        : isWeekend
                        ? 'bg-[#15070c] border-[#380b18] text-rose-100 hover:border-rose-400/60 hover:bg-[#200810]'
                        : 'bg-[#0f0508] border-[#290812] text-slate-300 hover:border-[#881337]/60 hover:bg-[#1c0810]'
                    }`}
                  >
                    <span className="text-sm sm:text-base font-display font-extrabold leading-none">
                      {day}
                    </span>

                    {/* Small tag badge */}
                    {isSelected ? (
                      <span className="text-[10px] uppercase font-bold text-rose-100 mt-1 flex items-center gap-0.5">
                        <Heart className="w-2.5 h-2.5 fill-rose-100" /> Date
                      </span>
                    ) : isToday ? (
                      <span className="text-[9px] uppercase font-bold text-rose-300 mt-0.5">
                        Today
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ACTIVITY SELECTION - Maroon and Black */}
        <div className="rounded-3xl bg-[#0d0508]/95 border border-[#881337]/30 p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <h3 className="font-display font-extrabold text-xl text-slate-100 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-rose-400" />
              <span>What would you like to do on our date?</span>
            </h3>
            <p className="text-xs text-rose-200/70 mt-1">
              Pick the activity that sounds most fun to you for your birthday celebration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {ACTIVITIES.map((act) => {
              const Icon = act.icon;
              const isChosen = selectedActivity === act.title;

              return (
                <div
                  key={act.id}
                  onClick={() => setSelectedActivity(act.title)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isChosen
                      ? 'bg-[#4c0519]/50 border-rose-400 text-white shadow-md shadow-[#881337]/30'
                      : 'bg-[#0f0508] border-[#290812] text-slate-300 hover:border-[#881337]/50 hover:bg-[#1a070e]'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      isChosen
                        ? 'bg-[#881337] text-white border-rose-300'
                        : 'bg-[#1e070e] text-rose-300 border-[#380b18]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-slate-100">
                        {act.title}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-300 px-2 py-0.5 rounded bg-[#4c0519]/60 border border-[#881337]/40">
                        {act.tag}
                      </span>
                    </div>
                    <p className="text-xs text-rose-200/70 mt-1 leading-relaxed">
                      {act.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TIME PREFERENCE & NOTE */}
        <div className="rounded-3xl bg-[#0d0508]/95 border border-[#881337]/30 p-6 sm:p-8 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-display font-bold text-slate-200 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-400" />
              <span>Preferred Time Slot</span>
            </label>
            <div className="space-y-2">
              {TIME_SLOTS.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    selectedTime === time
                      ? 'bg-[#4c0519]/60 border-rose-400 text-rose-100'
                      : 'bg-[#0f0508] border-[#290812] text-slate-400 hover:border-[#881337]/50'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-display font-bold text-slate-200 mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Message for Victoria (Optional)</span>
            </label>
            <textarea
              rows={4}
              placeholder="e.g. Can't wait! Let's get dessert too, wear something nice ❤️"
              value={bryanNote}
              onChange={(e) => setBryanNote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-[#290812] text-slate-100 text-xs sm:text-sm focus:border-rose-400 focus:outline-none placeholder:text-slate-600"
            />
            <p className="text-[11px] text-rose-300/60 mt-1">
              Victoria will receive this note along with your chosen date.
            </p>
          </div>
        </div>

        {/* CONFIRMATION & NOTIFY VICTORIA BUTTON - Velvet Maroon */}
        <div className="flex flex-col items-center gap-4 pt-2">
          <button
            type="submit"
            className="w-full max-w-lg py-5 px-8 rounded-2xl bg-gradient-to-r from-[#500724] via-[#881337] to-[#500724] hover:from-[#881337] hover:to-[#9f1239] text-white font-display font-black text-lg sm:text-xl shadow-2xl shadow-[#881337]/50 hover:shadow-[#881337]/75 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-3 border border-rose-400/40"
          >
            <Send className="w-5 h-5 text-rose-200" />
            <span>Lock In Date & Notify Victoria 💌</span>
          </button>

          <p className="text-xs text-rose-300/70 text-center">
            Once submitted, Victoria will be notified with your chosen date ({getDayName(selectedDay)}, Oct {selectedDay}, 2026)!
          </p>
        </div>
      </form>

      {/* NOTIFIED MODAL / CONFIRMATION POPUP */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg rounded-3xl bg-[#0d0508] border border-[#881337]/60 p-6 sm:p-8 shadow-2xl relative text-center">
            {/* Celebration Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#881337] to-[#4c0519] text-white mx-auto flex items-center justify-center shadow-lg shadow-[#881337]/40 mb-4 border border-rose-400/40">
              <CheckCircle2 className="w-9 h-9 text-rose-100" />
            </div>

            <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
              Victoria Has Been Notified! 🥂
            </h3>

            <p className="mt-2 text-sm text-rose-200/90">
              Your birthday date has been officially locked in:
            </p>

            {/* Date Summary Card */}
            <div className="my-5 p-4 rounded-2xl bg-black/80 border border-[#2d0813] text-left space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Date:</span>
                <span className="font-bold text-rose-300">
                  {getDayName(selectedDay)}, October {selectedDay}, 2026
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Time:</span>
                <span className="font-semibold text-slate-200">{selectedTime}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Activity:</span>
                <span className="font-semibold text-slate-200">{selectedActivity}</span>
              </div>
              {bryanNote && (
                <div className="pt-2 border-t border-[#2d0813] text-xs">
                  <span className="text-slate-400 block mb-1">Bryan's Message:</span>
                  <p className="text-rose-100 italic font-body">"{bryanNote}"</p>
                </div>
              )}
            </div>

            {/* Quick Share / Dispatch Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <a
                href={getMailtoLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#881337] hover:bg-[#9f1239] text-white font-bold text-xs shadow-md transition-all cursor-pointer border border-rose-400/40"
              >
                <Mail className="w-4 h-4" />
                <span>Send Direct Email to Victoria</span>
              </a>

              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Text Victoria on WhatsApp</span>
              </a>
            </div>

            <button
              onClick={() => setShowNotificationModal(false)}
              className="text-xs text-rose-300/70 hover:text-white font-semibold cursor-pointer underline underline-offset-4"
            >
              Close and review calendar
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMED BANNER IF ALREADY SUBMITTED */}
      {isSubmitted && !showNotificationModal && (
        <div className="mt-8 p-6 rounded-3xl bg-[#2a0610]/80 border border-[#881337]/50 text-center animate-in fade-in duration-500">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4c0519]/70 text-rose-200 text-xs font-bold mb-2">
            <CheckCircle2 className="w-4 h-4 text-rose-300" />
            <span>Date Successfully Booked</span>
          </div>
          <h4 className="font-display font-bold text-lg text-white">
            Scheduled with {senderName} for {getDayName(selectedDay)}, October {selectedDay}, 2026
          </h4>
          <p className="text-xs text-rose-200/80 mt-1 max-w-md mx-auto">
            {selectedActivity} ({selectedTime}). Have an amazing birthday celebration!
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={() => setShowNotificationModal(true)}
              className="text-xs text-rose-300 hover:text-white font-bold cursor-pointer underline"
            >
              View Notification Summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
