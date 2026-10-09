export type PageStep = 'welcome' | 'candle_ritual' | 'gift_reveal';

export interface DateBooking {
  selectedDay: number; // Day of October 2026
  selectedMonth: string; // 'October'
  selectedYear: number; // 2026
  formattedDate: string;
  activity: string;
  timeSlot: string;
  specialNote: string;
  bookedAt: string;
  notified: boolean;
}

export interface BirthdayState {
  name: string;
  senderName: string;
  senderEmail: string;
  candleBlown: boolean;
  booking: DateBooking | null;
}
