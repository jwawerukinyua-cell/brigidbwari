/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AttendanceRecord {
  id: string;
  date: string;
  topic: string;
  status: 'Present' | 'Absent' | 'Rescheduled';
}

export interface BookingData {
  id: string;
  parentName: string;
  studentName: string;
  schoolName?: string;
  parentEmail: string;
  parentPhone: string;
  subject: string;
  hours: number;
  selectedSlots: string[];
  totalCost: number;
  dateCreated: string;
  status: 'Confirmed' | 'Pending Payment';
  location: string;
  deliveryMode?: 'In-Person Home Visit' | 'Online Virtual Classroom';
  
  // Link to Teacher & Parent Portals
  totalLessonsBooked: number;
  lessonsCovered: number;
  lessonsRemaining: number;
  paymentStatus: 'Pending Payment' | 'Cleared / Active' | 'Partially Paid';
  progressNotes: string;
  challengesAndConcerns: string;
  attendanceLogs: AttendanceRecord[];
}

export const HOURLY_RATE = 1500; // Base hourly rate for in-person single English/Lit subject

export function getPlatformCommissionRate(mode?: 'In-Person Home Visit' | 'Online Virtual Classroom'): number {
  if (mode === 'Online Virtual Classroom') {
    return 0.15; // 15% platform allocation
  }
  return 0.10; // 10% home visit admin allocation
}

export function getCommissionBreakdown(totalCost: number, mode?: 'In-Person Home Visit' | 'Online Virtual Classroom') {
  const commissionPercent = getPlatformCommissionRate(mode);
  const platformCommission = Math.round(totalCost * commissionPercent);
  const teacherPayout = totalCost - platformCommission;
  
  return {
    commissionPercent: Math.round(commissionPercent * 100),
    teacherPayoutPercent: Math.round((1 - commissionPercent) * 100),
    platformCommission,
    teacherPayout
  };
}

export function generateVoucherCode(subject: string): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const lowerSub = subject.toLowerCase();

  if (lowerSub.includes('both') || (lowerSub.includes('english') && lowerSub.includes('literature'))) {
    return `BRIGID-EL-${randomNum}`;
  } else if (lowerSub.includes('literature')) {
    return `BRIGID-LIT-${randomNum}`;
  } else if (lowerSub.includes('conversational') || lowerSub.includes('speaking')) {
    return `BRIGID-CONV-${randomNum}`;
  }
  return `BRIGID-ENG-${randomNum}`;
}

const STORAGE_KEY = 'brigid_tuition_bookings';

export function getInitialDefaultBookings(): BookingData[] {
  return [
    {
      id: 'BRIGID-EL-782194',
      parentName: 'Mrs. Wanjiku M.',
      studentName: 'Brenda M.',
      schoolName: 'Saint Triza Mutalia School',
      parentEmail: 'wanjiku.m@gmail.com',
      parentPhone: '+254 712 345 678',
      subject: 'Combined English & Literature (CBC / 8-4-4)',
      hours: 4,
      selectedSlots: ['Aug 1 at 9:00 AM - 11:00 AM', 'Aug 3 at 11:30 AM - 1:30 PM'],
      totalCost: 10000,
      dateCreated: 'July 20, 2026',
      status: 'Confirmed',
      location: 'Utawala Astrol / Mihango, Nairobi',
      deliveryMode: 'In-Person Home Visit',
      totalLessonsBooked: 8,
      lessonsCovered: 3,
      lessonsRemaining: 5,
      paymentStatus: 'Cleared / Active',
      progressNotes: 'Excellent progress in essay structuring, grammar syntax, and literature character analysis.',
      challengesAndConcerns: 'Needs continued practice with timing in KCSE English Paper 3 creative writing.',
      attendanceLogs: [
        { id: '1', date: 'July 10, 2026', topic: 'Grammar & Advanced Sentence Construction', status: 'Present' },
        { id: '2', date: 'July 14, 2026', topic: 'Set Book Analysis: Plot & Characterization', status: 'Present' },
        { id: '3', date: 'July 18, 2026', topic: 'Comprehension & Summary Writing Techniques', status: 'Present' }
      ]
    },
    {
      id: 'BRIGID-ENG-449102',
      parentName: 'Dr. Kiprop K.',
      studentName: 'Collins K.',
      schoolName: 'Parklands High School',
      parentEmail: 'dr.kiprop@yahoo.com',
      parentPhone: '+254 722 987 654',
      subject: 'English Conversation & Public Speaking',
      hours: 2,
      selectedSlots: ['Aug 2 at 1:00 PM - 3:00 PM'],
      totalCost: 3000,
      dateCreated: 'July 21, 2026',
      status: 'Pending Payment',
      location: 'Parklands, Nairobi / Global Online',
      deliveryMode: 'Online Virtual Classroom',
      totalLessonsBooked: 4,
      lessonsCovered: 1,
      lessonsRemaining: 3,
      paymentStatus: 'Pending Payment',
      progressNotes: 'Demonstrating great enthusiasm and improved articulation during speech drills.',
      challengesAndConcerns: 'Slight hesitation during spontaneous public speaking exercises.',
      attendanceLogs: [
        { id: '1', date: 'July 15, 2026', topic: 'Phonics, Accent & Speech Support', status: 'Present' }
      ]
    }
  ];
}

export function getAllBookings(): BookingData[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }

  const defaults = getInitialDefaultBookings();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  return defaults;
}

export function saveBooking(booking: BookingData): void {
  const all = getAllBookings();
  const existingIndex = all.findIndex(b => b.id === booking.id);
  if (existingIndex >= 0) {
    all[existingIndex] = booking;
  } else {
    all.unshift(booking);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function findBookingByVoucher(voucherCode: string): BookingData | undefined {
  const all = getAllBookings();
  const cleanSearch = voucherCode.trim().toUpperCase();
  return all.find(b => b.id.toUpperCase() === cleanSearch);
}

export function getSlotStatuses(): Record<string, 'OPEN SPOT' | 'BOOKED'> {
  const saved = localStorage.getItem('brigid_slot_statuses');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return {
    "July 21_09:00 - 11:00 (Morning Grammar & Syntax)": "BOOKED",
    "July 21_11:30 - 13:30 (Midday Set Book Analysis)": "BOOKED",
    "July 21_14:30 - 16:30 (Afternoon Essay & Composition)": "OPEN SPOT",
    "July 21_17:00 - 18:30 (Sunset Spoken English & Poetry)": "OPEN SPOT"
  };
}

export function saveSlotStatus(slotKey: string, status: 'OPEN SPOT' | 'BOOKED') {
  const current = getSlotStatuses();
  current[slotKey] = status;
  localStorage.setItem('brigid_slot_statuses', JSON.stringify(current));
}

export function calculateCost(
  hours: number,
  subject: string,
  mode: 'In-Person Home Visit' | 'Online Virtual Classroom' = 'In-Person Home Visit',
  isMonthlyPackage: boolean = false
): number {
  if (mode === 'Online Virtual Classroom' && isMonthlyPackage) {
    return 11500; // Flat KES 11,500 monthly online package (10 lessons)
  }

  const isBoth = subject.toLowerCase().includes('both') || subject.toLowerCase().includes('combined');
  
  if (mode === 'Online Virtual Classroom') {
    const hourlyRate = isBoth ? 1800 : 1200; // KES 1,200 single subject, KES 1,800 both subjects online
    return Math.round(hours * hourlyRate);
  } else {
    const hourlyRate = isBoth ? 2500 : 1500; // KES 1,500 single subject, KES 2,500 both subjects physical
    return Math.round(hours * hourlyRate);
  }
}
