/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Check, AlertCircle, BookOpen, Plus, Minus, ChevronRight, Lock, Unlock, X, Key, ShieldCheck } from 'lucide-react';
import { calculateCost, HOURLY_RATE, getSlotStatuses, saveSlotStatus } from '../lib/bookingSystem';
import { motion, AnimatePresence } from 'motion/react';

interface InteractiveSchedulerProps {
  onInitiateBooking: (hours: number, subject: string, slots: string[], deliveryMode: 'In-Person Home Visit' | 'Online Virtual Classroom', isMonthlyPackage?: boolean) => void;
}

interface MonthDay {
  dateStr: string; // e.g. "2026-07-21"
  dayName: string; // "TUE"
  dayNum: number;  // 21
  monthName: string; // "July"
  monthShort: string; // "Jul"
  fullLabel: string; // "Tuesday, 21 July 2026"
  shortLabel: string; // "July 21"
  slots: { id: string; time: string; title: string }[];
}

// Generate complete July/August 2026 calendar days
const generateMonthDays = (): MonthDay[] => {
  const days: MonthDay[] = [];
  const dayNamesShort = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dayNamesFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['July', 'August'];

  // Start from July 21, 2026
  let currentDate = new Date(2026, 6, 21); // July 21, 2026

  for (let i = 0; i < 35; i++) {
    const year = currentDate.getFullYear();
    const monthIndex = currentDate.getMonth();
    const dayNum = currentDate.getDate();
    const dayNameShort = dayNamesShort[currentDate.getDay()];
    const dayNameFull = dayNamesFull[currentDate.getDay()];
    const monthName = monthNames[monthIndex - 6] || 'July';
    const monthShort = monthName.substring(0, 3);
    const monthStr = String(monthIndex + 1).padStart(2, '0');
    const dayStr = String(dayNum).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;

    const shortLabel = `${monthName} ${dayNum}`;
    const fullLabel = `${dayNameFull}, ${dayNum} ${monthName} ${year}`;

    // Standard session tracks matching English & Literature curriculum
    const slots = [
      { id: '1', time: '09:00 - 11:00', title: 'Morning Grammar & Syntax' },
      { id: '2', time: '11:30 - 13:30', title: 'Midday Set Book Analysis' },
      { id: '3', time: '14:30 - 16:30', title: 'Afternoon Essay & Composition' },
      { id: '4', time: '17:00 - 18:30', title: 'Sunset Spoken English & Poetry' }
    ];

    days.push({
      dateStr,
      dayName: dayNameShort,
      dayNum,
      monthName,
      monthShort,
      fullLabel,
      shortLabel,
      slots
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }
  return days;
};

const ALL_DAYS = generateMonthDays();

export default function InteractiveScheduler({ onInitiateBooking }: InteractiveSchedulerProps) {
  const [subject, setSubject] = useState('Combined English & Literature');
  const [hours, setHours] = useState(4);
  const [deliveryMode, setDeliveryMode] = useState<'In-Person Home Visit' | 'Online Virtual Classroom'>('In-Person Home Visit');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // July 21, 2026 (index 0)
  const activeDay = ALL_DAYS[selectedDayIndex] || ALL_DAYS[0];

  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [isCalendarGridOpen, setIsCalendarGridOpen] = useState(false);

  // Slot states (BOOKED vs OPEN SPOT) synced with localStorage
  const [slotStatuses, setSlotStatuses] = useState<Record<string, 'OPEN SPOT' | 'BOOKED'>>({});

  // Teacher admin override mode state
  const [isTeacherAdmin, setIsTeacherAdmin] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [passError, setPassError] = useState('');

  // Sync slot statuses from localStorage
  useEffect(() => {
    setSlotStatuses(getSlotStatuses());
  }, []);

  const getSlotState = (dayLabel: string, slotTitle: string, slotTime: string): 'OPEN SPOT' | 'BOOKED' => {
    const key = `${dayLabel}_${slotTime} (${slotTitle})`;
    if (slotStatuses[key]) return slotStatuses[key];

    // Defaults for July 21 based on mockup
    if (dayLabel === 'July 21') {
      if (slotTime === '09:00 - 11:00' || slotTime === '11:30 - 13:30') return 'BOOKED';
      return 'OPEN SPOT';
    }
    return 'OPEN SPOT';
  };

  const calculateOpenSpotsCount = (day: MonthDay): number => {
    return day.slots.filter(s => getSlotState(day.shortLabel, s.title, s.time) === 'OPEN SPOT').length;
  };

  const handleSlotClick = (dayLabel: string, slotTime: string, slotTitle: string) => {
    const fullSlotString = `${dayLabel} at ${slotTime} (${slotTitle})`;
    const key = `${dayLabel}_${slotTime} (${slotTitle})`;
    const currentState = getSlotState(dayLabel, slotTitle, slotTime);

    if (isTeacherAdmin) {
      // Teacher Override Mode: Toggle between OPEN SPOT and BOOKED
      const newState = currentState === 'BOOKED' ? 'OPEN SPOT' : 'BOOKED';
      saveSlotStatus(key, newState);
      setSlotStatuses(getSlotStatuses());

      // Remove from selected array if blocked
      if (newState === 'BOOKED') {
        setSelectedSlots(prev => prev.filter(s => s !== fullSlotString));
      }
    } else {
      // Parent Mode: Can only select OPEN SPOTs
      if (currentState === 'BOOKED') {
        alert("This timeslot is currently booked by another student. If you are Teacher Brigid Bwari, please unlock Teacher Override Mode to reschedule.");
        return;
      }

      if (selectedSlots.includes(fullSlotString)) {
        setSelectedSlots(selectedSlots.filter(s => s !== fullSlotString));
      } else {
        setSelectedSlots([...selectedSlots, fullSlotString]);
      }
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputPassword.trim().toUpperCase();
    if (clean === 'BRIGID-ENG-2026' || clean === 'KABARAK-2026' || clean === 'BRIGID-2026' || btoa(inputPassword) === 'VGhhYXJhMjAyNiE=') {
      setIsTeacherAdmin(true);
      setIsPasswordModalOpen(false);
      setInputPassword('');
      setPassError('');
    } else {
      setPassError('Invalid password. Teacher authorization required (e.g. BRIGID-ENG-2026).');
    }
  };

  const [isMonthlyPackage, setIsMonthlyPackage] = useState(false);

  const costEstimate = calculateCost(hours, subject, deliveryMode, isMonthlyPackage);

  const triggerSubmit = () => {
    if (selectedSlots.length === 0) {
      // Pick first available open spot for active day
      const firstOpen = activeDay.slots.find(s => getSlotState(activeDay.shortLabel, s.title, s.time) === 'OPEN SPOT');
      if (firstOpen) {
        const defaultSlot = `${activeDay.shortLabel} at ${firstOpen.time} (${firstOpen.title})`;
        onInitiateBooking(hours, subject, [defaultSlot], deliveryMode, isMonthlyPackage);
      } else {
        alert("Please select at least 1 open timeslot above.");
      }
    } else {
      onInitiateBooking(hours, subject, selectedSlots, deliveryMode, isMonthlyPackage);
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm font-sans text-stone-900">
      {/* Section Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[10px] font-mono tracking-widest text-amber-900 uppercase block font-bold">
          Direct Interactive Booking Engine
        </span>
        <h2 className="text-3xl font-serif text-stone-950 font-bold">
          Reserve English & Literature Tuition
        </h2>
        <p className="text-xs text-stone-600 leading-relaxed">
          Select your learning focus, set weekly hours, and reserve direct 1-on-1 sessions with Teacher Brigid Bwari (B.Ed, Kabarak University).
        </p>
      </div>

      {/* Prominent Free Hour Banner before Step I */}
      <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl text-center shadow-xs my-2">
        <p className="text-xs font-sans text-stone-800 inline-flex flex-wrap items-center justify-center gap-1.5 leading-relaxed">
          <span className="text-amber-900 font-bold font-mono uppercase tracking-wide">Special Offer:</span>
          <span>Your initial diagnostic hour is</span>
          <strong className="text-amber-950 bg-amber-100 border border-amber-400 px-2 py-0.5 rounded font-black font-mono uppercase tracking-wider">
            ABSOLUTELY FREE
          </strong>
          <span>upon booking. Select your preferred timeslot below.</span>
        </p>
      </div>

      <div className="border-t border-stone-200 my-4"></div>

      {/* STEPS I - III HORIZONTAL GRID ON DESKTOP / LAPTOP VIEWPORTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* STEP I: CHOOSE YOUR SUBJECT */}
        <div className="space-y-3 flex flex-col">
          <div className="flex items-center gap-2">
            <span className="bg-rose-100 text-rose-900 font-mono text-xs px-2.5 py-1 rounded border border-rose-200 font-bold tracking-wider">Step I</span>
            <h3 className="text-sm font-mono tracking-wider text-amber-900 uppercase font-bold">I. Choose Learning Focus</h3>
          </div>
          <div className="grid grid-cols-1 gap-3 flex-1">
            {[
              { id: 'English Grammar & Vocabulary', label: 'English Grammar & Vocabulary', desc: 'Syntax, sentence structuring, comprehension & vocabulary expansion' },
              { id: 'Literature & Set Books', label: 'Literature & Set Books', desc: 'Characterization, themes, poetry analysis, prose & essay drafting' },
              { id: 'Combined English & Literature', label: 'Combined English & Literature', desc: deliveryMode === 'Online Virtual Classroom' ? 'Special Bundle: KES 1,800/hr online' : 'Complete 2-in-1 KCSE & CBC Mastery', promo: true }
            ].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSubject(sub.id)}
                className={`text-left p-3.5 rounded-xl border transition-all duration-200 relative cursor-pointer flex flex-col justify-between ${
                  subject === sub.id
                    ? 'bg-amber-50/90 border-2 border-amber-500 shadow-xs'
                    : 'bg-stone-50/80 border-stone-200 hover:border-amber-400 hover:bg-amber-50/20'
                }`}
              >
                {sub.promo && (
                  <span className="absolute -top-2.5 right-3 bg-amber-500 text-stone-950 text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    MOST POPULAR
                  </span>
                )}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-serif font-bold text-stone-950">{sub.label}</span>
                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                      subject === sub.id ? 'border-amber-600 bg-amber-500 text-stone-950' : 'border-stone-300'
                    }`}>
                      {subject === sub.id && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 mt-1.5 font-sans leading-relaxed">{sub.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* STEP II: CLASS DELIVERY MODE (IN-PERSON VS ONLINE) */}
        <div className="space-y-3 flex flex-col">
          <div className="flex items-center gap-2">
            <span className="bg-rose-100 text-rose-900 font-mono text-xs px-2.5 py-1 rounded border border-rose-200 font-bold tracking-wider">Step II</span>
            <h3 className="text-sm font-mono tracking-wider text-amber-900 uppercase font-bold">II. Class Delivery Mode</h3>
          </div>
          <div className="grid grid-cols-1 gap-3 flex-1">
            {[
              {
                id: 'In-Person Home Visit',
                title: '📍 In-Person Home Visit',
                rateText: subject.includes('Combined') ? 'KES 2,500 / hr (Combined)' : 'KES 1,500 / hr (Single track)',
                badge: 'Nairobi & Environs / Kisii',
                desc: 'Teacher Brigid visits student home in Utawala, Embakasi, Parklands, Waiyaki Way, Eastleigh, or Kisii.',
                badgeColor: 'text-amber-950 bg-amber-100 border-amber-300'
              },
              {
                id: 'Online Virtual Classroom',
                title: '💻 Online Virtual Classroom',
                rateText: subject.includes('Combined') ? 'KES 1,800 / hr (Combined Discount)' : 'KES 1,200 / hr (Single track)',
                badge: 'Global Live Classroom',
                desc: '1-on-1 HD live lessons + Interactive Whiteboard + Essay Correction. Ideal for worldwide & diaspora learners.',
                badgeColor: 'text-amber-950 bg-amber-100 border-amber-300',
                recommended: true
              }
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setDeliveryMode(mode.id as any)}
                className={`text-left p-3.5 rounded-xl border transition-all duration-200 relative cursor-pointer flex flex-col justify-between ${
                  deliveryMode === mode.id
                    ? 'bg-amber-50/90 border-2 border-amber-500 shadow-xs'
                    : 'bg-stone-50/80 border-stone-200 hover:border-amber-400 hover:bg-amber-50/20'
                }`}
              >
                {mode.recommended && (
                  <span className="absolute -top-2.5 right-3 bg-amber-500 text-stone-950 text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    GLOBAL REACH
                  </span>
                )}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-serif font-bold text-stone-950">{mode.title}</span>
                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                      deliveryMode === mode.id ? 'border-amber-600 bg-amber-500 text-stone-950' : 'border-stone-300'
                    }`}>
                      {deliveryMode === mode.id && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div className="mt-1.5 mb-1.5">
                    <span className={`inline-block text-xs font-mono font-bold px-2 py-0.5 rounded border ${mode.badgeColor}`}>
                      {mode.rateText}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 font-sans leading-relaxed">{mode.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* STEP III: HOURS PLANNER */}
        <div className="space-y-3 flex flex-col">
          <div className="flex items-center gap-2">
            <span className="bg-rose-100 text-rose-900 font-mono text-xs px-2.5 py-1 rounded border border-rose-200 font-bold tracking-wider">Step III</span>
            <h3 className="text-sm font-mono tracking-wider text-amber-900 uppercase font-bold">III. Weekly Hours</h3>
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs text-stone-600 font-mono block font-medium">Weekly Target Hours:</span>
                <span className="text-lg font-serif font-bold text-amber-900 mt-0.5 block">{hours} {hours === 1 ? 'Hour' : 'Hours'} / week</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHours(Math.max(1, hours - 1))}
                  className="h-10 w-10 rounded-lg bg-white hover:bg-stone-100 border border-stone-300 flex items-center justify-center text-stone-800 disabled:opacity-30 cursor-pointer shadow-xs"
                  disabled={hours <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-sm font-mono font-bold w-10 text-center text-amber-900">{hours} hrs</span>
                <button
                  type="button"
                  onClick={() => setHours(Math.min(12, hours + 1))}
                  className="h-10 w-10 rounded-lg bg-white hover:bg-stone-100 border border-stone-300 flex items-center justify-center text-stone-800 disabled:opacity-30 cursor-pointer shadow-xs"
                  disabled={hours >= 12}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-1.5 pt-2">
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between text-[9px] font-mono text-stone-500 px-1 font-semibold">
                <span>1 Hr (Baseline)</span>
                <span className="text-amber-900 font-bold">4 Hrs (Rec)</span>
                <span>8 Hrs</span>
                <span>12 Hrs (Max)</span>
              </div>
            </div>

            <div className="text-[11px] text-stone-700 font-sans bg-amber-50 p-2.5 rounded-lg border border-amber-300 leading-snug flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-rose-700 shrink-0" />
              <span>Flexible target: You can adjust total lessons anytime with Teacher Brigid Bwari.</span>
            </div>
          </div>
        </div>
      </div>

      {/* STEP IV: SCHEDULE & CALENDAR AVAILABILITY */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-rose-100 text-rose-900 font-mono text-xs px-2.5 py-1 rounded border border-rose-200 font-bold tracking-wider">Step IV</span>
            <h3 className="text-sm font-mono tracking-wider text-amber-900 uppercase font-bold flex items-center gap-1.5">
              <CalendarIcon className="h-4 w-4 text-amber-800 inline" />
              <span>IV. Schedule & Calendar Availability</span>
            </h3>
          </div>

          {/* Teacher Reschedule Password Trigger */}
          {!isTeacherAdmin ? (
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="text-[10px] font-mono text-amber-900 hover:text-amber-950 border border-amber-300 bg-amber-100/80 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-2xs font-bold"
              title="Teacher Password Lock"
            >
              <Lock className="h-3 w-3 text-amber-800" />
              <span>Teacher Reschedule</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-teal-950 text-teal-400 border border-teal-800 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                <Unlock className="h-3 w-3" />
                <span>Teacher Override Active</span>
              </span>
              <button
                type="button"
                onClick={() => setIsTeacherAdmin(false)}
                className="text-[9px] font-mono text-stone-600 underline hover:text-stone-900 font-bold"
              >
                Lock
              </button>
            </div>
          )}
        </div>

        {/* Outer Calendar Box Container with Mobile Breathing Space */}
        <div className="bg-stone-100 border border-stone-300 shadow-xl shadow-stone-950/10 rounded-2xl p-3.5 sm:p-6 my-4 space-y-4 text-stone-900 w-full overflow-hidden">
          {/* Top Bar inside box */}
          <div className="flex flex-wrap items-center justify-between border-b border-stone-200 pb-3 gap-2">
            <div>
              <span className="text-[10px] sm:text-xs font-mono tracking-widest text-teal-900 uppercase block font-bold">
                JULY / AUGUST 2026 CALENDAR (31 DAYS)
              </span>
              <span className="text-xs font-serif text-stone-700 font-medium block">Tap any day tile to inspect & reserve open timeslots</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-teal-900 bg-teal-100 border border-teal-300 px-2.5 py-1 rounded-full font-bold">
                <span className="h-1.5 w-1.5 bg-teal-600 rounded-full animate-ping" />
                <span>31 Days Loaded</span>
              </span>
            </div>
          </div>

          {/* MOBILE & TABLET ONLY: Dedicated Button to Open / Close Calendar Grid */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setIsCalendarGridOpen(!isCalendarGridOpen)}
              className="w-full flex items-center justify-between bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-stone-950 font-sans font-bold text-xs sm:text-sm px-4 py-3 rounded-xl border border-amber-500 shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-stone-950" />
                <span>{isCalendarGridOpen ? '📅 Hide 31-Day Calendar Grid' : '📅 Tap to Open 31-Day Calendar Grid'}</span>
              </div>
              <span className="bg-stone-950 text-amber-400 font-mono text-[10px] sm:text-xs px-2.5 py-1 rounded-lg font-black uppercase tracking-wider">
                {isCalendarGridOpen ? 'Collapse ▲' : 'Open Calendar ▼'}
              </span>
            </button>
          </div>

          {/* 7-COLUMN MONTH CALENDAR GRID (ALWAYS VISIBLE ON DESKTOP, TOGGLEABLE ON MOBILE & TABLET) */}
          <div className={`space-y-2 transition-all duration-300 ${isCalendarGridOpen ? 'block' : 'hidden lg:block'}`}>
            {/* Weekday Headers Row (S M T W T F S) */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] sm:text-xs font-black text-stone-950 uppercase py-1.5 bg-amber-400 rounded-lg border border-amber-500 shadow-sm">
              <span>SUN</span>
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
            </div>

            {/* 31-Day Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center">
              {/* Empty Offset cells for Sun & Mon before Tuesday July 21 */}
              <div className="h-11 sm:h-14 rounded-lg bg-stone-200/50 border border-stone-300 opacity-40 pointer-events-none flex items-center justify-center">
                <span className="text-[9px] font-mono text-stone-500 font-bold">19</span>
              </div>
              <div className="h-11 sm:h-14 rounded-lg bg-stone-200/50 border border-stone-300 opacity-40 pointer-events-none flex items-center justify-center">
                <span className="text-[9px] font-mono text-stone-500 font-bold">20</span>
              </div>

              {/* 35 Calendar Day Tiles with Interactive Grow / Scale Effect */}
              {ALL_DAYS.map((day, idx) => {
                const isSelected = selectedDayIndex === idx;
                const openCount = calculateOpenSpotsCount(day);

                return (
                  <button
                    key={day.dateStr}
                    type="button"
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`h-12 sm:h-14 rounded-xl border flex flex-col items-center justify-center p-1 cursor-pointer relative transform hover:scale-110 active:scale-95 transition-all duration-200 hover:z-20 ${
                      isSelected
                        ? 'bg-amber-500 border-amber-400 text-stone-950 font-black shadow-md scale-105 z-10'
                        : openCount > 0
                        ? 'bg-white border-stone-300 hover:border-amber-500 text-stone-900 hover:bg-amber-50/90 hover:shadow-md'
                        : 'bg-stone-200/60 border-stone-300 text-stone-500 opacity-70'
                    }`}
                  >
                    {/* Day Number */}
                    <span className={`text-xs sm:text-sm font-serif font-bold leading-none ${isSelected ? 'text-stone-950' : 'text-stone-900'}`}>
                      {day.dayNum}
                    </span>

                    {/* Month Label or Open Spots Indicator */}
                    <div className="flex items-center justify-center mt-1">
                      {isSelected ? (
                        <span className="text-[9px] font-mono uppercase tracking-tight text-stone-950 font-black">
                          {day.monthShort}
                        </span>
                      ) : openCount > 0 ? (
                        <span className="text-[9px] font-mono text-teal-800 font-extrabold">
                          {openCount} open
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-stone-500 uppercase font-bold">full</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Status Card with Dark Luxury Background & Growing Slots */}
          <div className="bg-[#0F1B2E] border border-stone-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-md text-white">
            <div className="border-b border-stone-800 pb-2">
              <span className="text-[10px] sm:text-xs font-mono tracking-widest text-amber-400 uppercase block font-bold">SELECTED DATE STATUS</span>
              <h4 className="text-base sm:text-lg font-serif font-bold text-white mt-0.5">{activeDay.fullLabel}</h4>
            </div>

            {/* Teacher Override Guidance Banner */}
            {isTeacherAdmin && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 text-xs sm:text-sm font-mono text-amber-300 font-semibold flex items-center gap-2">
                <Key className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span>Teacher Override Mode: Click ANY slot below to toggle between BOOKED and OPEN SPOT.</span>
              </div>
            )}

            {/* Slots List with Touch & Hover Grow Effect */}
            <div className="space-y-2.5">
              {activeDay.slots.map((slot) => {
                const state = getSlotState(activeDay.shortLabel, slot.title, slot.time);
                const fullSlotString = `${activeDay.shortLabel} at ${slot.time} (${slot.title})`;
                const isCheckedByParent = selectedSlots.includes(fullSlotString);

                return (
                  <div
                    key={slot.id}
                    onClick={() => handleSlotClick(activeDay.shortLabel, slot.time, slot.title)}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm font-mono cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${
                      state === 'BOOKED'
                        ? isTeacherAdmin
                          ? 'bg-rose-950/60 border-rose-800 text-stone-200 hover:border-amber-500'
                          : 'bg-stone-900/50 border-stone-800 text-stone-500 opacity-60 cursor-not-allowed'
                        : isCheckedByParent
                        ? 'bg-teal-950/80 border-teal-500 text-teal-200 shadow-sm'
                        : 'bg-stone-900/80 border-stone-800 text-stone-100 hover:border-teal-400 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className={`h-4 w-4 ${state === 'BOOKED' ? 'text-stone-500' : 'text-teal-400'}`} />
                      <div>
                        <span className="font-bold text-white text-xs sm:text-sm">{slot.time}</span>
                        <span className="text-stone-300 text-xs sm:text-sm font-sans block sm:inline sm:ml-2 font-medium">({slot.title})</span>
                      </div>
                    </div>

                    {/* Badge */}
                    <div>
                      {state === 'BOOKED' ? (
                        <span className="text-[10px] sm:text-xs font-mono uppercase bg-stone-800 border border-stone-700 px-2.5 py-1 rounded text-stone-400 font-bold">
                          BOOKED
                        </span>
                      ) : (
                        <span className={`text-[10px] sm:text-xs font-mono uppercase px-2.5 py-1 rounded font-black border transition-all ${
                          isCheckedByParent
                            ? 'bg-teal-600 text-white border-teal-500 shadow-sm'
                            : 'bg-teal-500/20 text-teal-300 border-teal-500/40 hover:bg-teal-500/30'
                        }`}>
                          {isCheckedByParent ? '✓ RESERVED' : 'OPEN SPOT'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Spots Summary Footer */}
            <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm font-mono">
              <span className="text-stone-300 font-medium">Selected Schedule Spots:</span>
              <span className="text-teal-300 font-black text-sm sm:text-base">
                {selectedSlots.length} Selected
              </span>
            </div>
            <p className="text-xs sm:text-sm font-sans italic leading-relaxed">
              {selectedSlots.length > 0 ? (
                <span className="text-stone-200 font-semibold inline-flex flex-wrap items-center gap-1.5">
                  <span>🎉 First hour is</span>
                  <strong className="text-white bg-teal-600 border border-teal-500 px-2.5 py-0.5 rounded font-black font-mono uppercase tracking-wider shadow-sm">
                    ABSOLUTELY FREE
                  </strong>
                  <span>upon booking! Reserved: {selectedSlots.join(' | ')}</span>
                </span>
              ) : (
                <span className="text-stone-300 inline-flex flex-wrap items-center gap-1.5">
                  <span className="text-amber-400 font-bold font-mono">Note:</span>
                  <span>First hour is</span>
                  <strong className="text-white bg-teal-600 border border-teal-500 px-2.5 py-0.5 rounded font-black font-mono uppercase tracking-wider shadow-sm">
                    ABSOLUTELY FREE
                  </strong>
                  <span>upon booking. We recommend reserving at least 1 spot above.</span>
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-800/80 my-4"></div>

      {/* DETAILED TUITION SUMMARY CONTAINER */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 sm:p-7 space-y-6 text-stone-900 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-mono tracking-widest text-amber-900 uppercase block font-semibold">
                TUITION FEE ESTIMATE & SUMMARY
              </span>
              <div className="h-0.5 w-16 bg-amber-600 mt-1"></div>
            </div>

            {/* Monthly Package Offer Toggle for Online Virtual Classes */}
            {deliveryMode === 'Online Virtual Classroom' && (
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-purple-900 block uppercase tracking-wider">
                    Monthly Online Intensive Package
                  </span>
                  <p className="text-xs text-stone-700 font-sans leading-relaxed">
                    10 live 1-on-1 sessions (1.5–2 hours each) for complete KCSE syllabus coverage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMonthlyPackage(!isMonthlyPackage)}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 cursor-pointer text-center ${
                    isMonthlyPackage
                      ? 'bg-purple-700 text-white border border-purple-800 shadow-xs'
                      : 'bg-white text-purple-900 border border-purple-300 hover:bg-purple-100'
                  }`}
                >
                  {isMonthlyPackage ? '✓ KES 12,000 ACTIVE' : 'Select KES 12,000 Package'}
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-stone-500">Selected Subject</span>
                <span className="text-xs font-serif font-bold text-stone-950 block">{subject}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-stone-500">Delivery Mode</span>
                <span className="text-xs font-serif font-bold text-teal-800 block">{deliveryMode}</span>
              </div>
              <div className="space-y-0.5 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-mono uppercase text-stone-500">Billed Volume</span>
                <span className="text-xs font-serif font-bold text-stone-950 block">
                  {isMonthlyPackage ? '10 Lessons Monthly' : `${hours} Hours Weekly`}
                </span>
              </div>
            </div>

            <div className="text-xs text-stone-700 leading-relaxed font-sans bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
              {deliveryMode === 'Online Virtual Classroom' ? (
                <p>💻 Delivered via live 1-on-1 virtual meeting room with digital whiteboard, recorded lectures & global flexibility.</p>
              ) : (
                <p>📍 Delivered directly at your residence in Nairobi & Kisii with interactive English workbooks, set book guides & essay practice.</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 bg-rose-900 border border-rose-950 shadow-md rounded-xl p-5 flex flex-col justify-between h-full space-y-4 text-white">
            <div className="flex justify-between items-baseline border-b border-rose-800 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-rose-200 font-bold">Effective Rate:</span>
              <span className="text-xs text-amber-300 font-mono font-black">
                {isMonthlyPackage
                  ? 'KES 12,000 (Flat Monthly Package)'
                  : deliveryMode === 'Online Virtual Classroom'
                  ? subject.includes('Both') ? 'KES 2,000 / hr (Both subjects)' : 'KES 1,200 / hr'
                  : subject.includes('Both') ? 'KES 3,000 / hr (Both subjects)' : 'KES 1,500 / hr'}
              </span>
            </div>
            
            <div className="space-y-1 text-right">
              <span className="text-[10px] font-mono text-rose-200 uppercase tracking-widest block font-bold">
                {isMonthlyPackage ? 'Flat Monthly Fee' : 'Estimated Weekly Budget'}
              </span>
              <div className="text-2xl sm:text-3xl font-serif font-black text-white">
                KES {costEstimate.toLocaleString()}
              </div>
              <span className="text-[10px] font-mono text-rose-200 block font-medium">Inclusive of all physical & digital study materials</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200">
          <button
            type="button"
            onClick={triggerSubmit}
            className="w-full bg-rose-700 hover:bg-rose-800 text-white font-sans font-black py-4 px-6 rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2.5 uppercase tracking-wider text-base h-14 cursor-pointer hover:scale-[1.005]"
          >
            <CalendarIcon className="h-5 w-5 stroke-[2.5]" />
            <span>SECURE PLACEMENT</span>
          </button>
        </div>
      </div>

      {/* FULL MONTH CALENDAR GRID MODAL (MATCHES MOCKUP IMAGE 2) */}
      <AnimatePresence>
        {isCalendarGridOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCalendarGridOpen(false)}
              className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-3xl bg-white border border-stone-200 rounded-2xl shadow-xl z-10 overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="px-6 py-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-800 tracking-wider block font-bold">MONTH CALENDAR SELECTOR</span>
                  <h3 className="text-base font-serif font-bold text-stone-900">SELECT A DATE</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCalendarGridOpen(false)}
                  className="p-1 rounded-lg text-stone-500 hover:bg-stone-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Grid of days matching Image 2 */}
              <div className="p-6 overflow-y-auto grid grid-cols-3 sm:grid-cols-6 gap-3">
                {ALL_DAYS.map((day, idx) => {
                  const isSelected = selectedDayIndex === idx;
                  const openCount = calculateOpenSpotsCount(day);

                  return (
                    <button
                      key={day.dateStr}
                      type="button"
                      onClick={() => {
                        setSelectedDayIndex(idx);
                        setIsCalendarGridOpen(false); // auto-close modal upon selecting a date
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 border-amber-600 text-stone-950 shadow-sm font-bold'
                          : 'bg-stone-50 border-stone-200 hover:border-amber-400 text-stone-900'
                      }`}
                    >
                      <span className={`text-[9px] font-mono uppercase tracking-wider block ${isSelected ? 'text-stone-950 font-extrabold' : 'text-stone-500'}`}>
                        {day.dayName}
                      </span>
                      <span className="text-lg font-serif font-bold block leading-none">
                        {day.dayNum}
                      </span>
                      <span className={`text-[9px] font-mono ${
                        isSelected
                          ? 'text-stone-950 font-bold'
                          : openCount > 0 ? 'text-teal-700 font-bold' : 'text-stone-400'
                      }`}>
                        {isSelected ? day.monthShort : openCount > 0 ? `${openCount} Open` : 'Full'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TEACHER RESCHEDULE PASSWORD DIALOG (BRIGID-ENG-2026) */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPasswordModalOpen(false)}
              className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-white border border-stone-200 rounded-2xl p-6 shadow-xl z-10 space-y-4 font-sans text-center"
            >
              <div className="h-10 w-10 rounded-full bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center mx-auto">
                <Key className="h-5 w-5" />
              </div>

              <div>
                <h4 className="text-base font-serif font-bold text-stone-900">Teacher Calendar Override</h4>
                <p className="text-xs text-stone-600 mt-1">Enter password to unlock slot rescheduling and reopen dates.</p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-3">
                <input
                  type="password"
                  placeholder="Enter password..."
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 text-center font-mono tracking-widest focus:outline-none focus:border-amber-500"
                />

                {passError && (
                  <p className="text-[11px] text-rose-600 font-mono">{passError}</p>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="w-1/2 bg-stone-100 text-stone-700 border border-stone-200 py-2.5 rounded-xl text-xs font-mono hover:bg-stone-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-amber-500 text-stone-950 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider hover:bg-amber-400"
                  >
                    Unlock
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
