/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Mail, Phone, FileText, Check, Landmark, Info } from 'lucide-react';
import { BookingData, calculateCost, generateVoucherCode, saveBooking, getCommissionBreakdown } from '../lib/bookingSystem';
import TermsAndPrivacyModal from './TermsAndPrivacyModal';

interface LegalCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  hours: number;
  subject: string;
  selectedSlots: string[];
  deliveryMode?: 'In-Person Home Visit' | 'Online Virtual Classroom';
  isMonthlyPackage?: boolean;
  onSuccess: (booking: BookingData) => void;
}

export default function LegalCheckoutModal({
  isOpen,
  onClose,
  hours,
  subject,
  selectedSlots,
  deliveryMode = 'In-Person Home Visit',
  isMonthlyPackage = false,
  onSuccess
}: LegalCheckoutModalProps) {
  const [parentName, setParentName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [locationLandmark, setLocationLandmark] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [selectedMode, setSelectedMode] = useState<'In-Person Home Visit' | 'Online Virtual Classroom'>(deliveryMode);
  const [agreeToTerms, setAgreeToTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [termsTab, setTermsTab] = useState<'terms' | 'privacy' | 'dataprotection'>('terms');

  // Sync state if prop changes
  React.useEffect(() => {
    if (deliveryMode) {
      setSelectedMode(deliveryMode);
    }
  }, [deliveryMode]);

  const costWeekly = calculateCost(hours, subject, selectedMode, isMonthlyPackage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeToTerms) return;

    setIsSubmitting(true);

    const fullStudentDetail = schoolName ? `${studentName} (${schoolName})` : studentName;
    const voucherId = generateVoucherCode(subject);

    const totalLessons = isMonthlyPackage ? 10 : hours * 2;

    // Create realistic BookingData
    const booking: BookingData = {
      id: voucherId,
      parentName,
      studentName: fullStudentDetail,
      schoolName,
      parentEmail,
      parentPhone: `+254 ${parentPhone}`,
      subject,
      hours,
      selectedSlots,
      totalCost: costWeekly,
      dateCreated: new Date().toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: 'Pending Payment',
      location: locationLandmark || (selectedMode === 'Online Virtual Classroom' ? "Global Online Virtual Room" : "Nairobi / Kisii Residence"),
      deliveryMode: selectedMode,
      totalLessonsBooked: totalLessons,
      lessonsCovered: 0,
      lessonsRemaining: totalLessons,
      paymentStatus: 'Pending Payment',
      progressNotes: 'Initial placement registered. Diagnostic assessment pending first session.',
      challengesAndConcerns: 'Standard KCSE English & Literature syllabus revision & essay gap diagnostics in progress.',
      attendanceLogs: []
    };

    // Save into shared localStorage for Teacher & Parent Portals
    saveBooking(booking);

    // Save booked slots into localStorage so calendar reflects BOOKED status
    if (selectedSlots && selectedSlots.length > 0) {
      const savedStatuses = JSON.parse(localStorage.getItem('teacher_mary_slot_statuses') || '{}');
      selectedSlots.forEach((slotStr) => {
        savedStatuses[slotStr] = 'BOOKED';
      });
      localStorage.setItem('teacher_mary_slot_statuses', JSON.stringify(savedStatuses));
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(booking);
    }, 1200);
  };

  const openLegalTab = (tab: 'terms' | 'privacy' | 'dataprotection') => {
    setTermsTab(tab);
    setIsTermsModalOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-white border border-stone-200 rounded-2xl shadow-xl z-10 overflow-hidden flex flex-col max-h-[92vh] my-auto text-stone-900"
            >
              {/* Header - Sticky at top so close button X is ALWAYS visible on mobile */}
              <div className="sticky top-0 z-20 bg-stone-50 px-5 py-3.5 border-b border-stone-200 flex items-center justify-between shrink-0 shadow-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-900 tracking-widest block mb-0.5 font-bold">
                    Secure Encryption Link
                  </span>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-stone-950 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-amber-800" />
                    <span>Tuition Placement Contract</span>
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all cursor-pointer border border-stone-300 flex items-center gap-1"
                  title="Close Form"
                >
                  <X className="h-5 w-5 text-amber-800" />
                  <span className="text-[10px] font-mono uppercase font-bold sm:inline hidden">Close</span>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 scrollbar-thin">
                {/* Placement Review Box */}
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3 font-mono text-[11px]">
                  <div className="flex justify-between items-center border-b border-stone-200 pb-1.5">
                    <span className="text-[10px] text-teal-800 uppercase tracking-wider block font-bold">
                      Tuition Placement Summary
                    </span>
                    <span className="text-[10px] text-amber-900 font-mono font-bold">
                      {selectedMode === 'Online Virtual Classroom' ? '💻 Virtual Classroom' : '📍 Residence Visit'}
                    </span>
                  </div>

                  {/* Mode Selector Radio Pills inside Checkout */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedMode('In-Person Home Visit')}
                      className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                        selectedMode === 'In-Person Home Visit'
                          ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold'
                          : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <span className="block text-xs font-bold">📍 In-Person Home</span>
                      <span className="block text-[9px] opacity-75 font-normal">Murang'a & Nairobi</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedMode('Online Virtual Classroom')}
                      className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                        selectedMode === 'Online Virtual Classroom'
                          ? 'bg-purple-100 border-purple-300 text-purple-950 font-bold'
                          : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <span className="block text-xs font-bold">💻 Online Virtual</span>
                      <span className="block text-[9px] opacity-75 font-normal">Live 1-on-1 Class</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 pt-1">
                    <div>
                      <span className="text-stone-500 font-semibold">Academic Track:</span>
                      <span className="text-stone-900 block font-serif font-bold">{subject}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 font-semibold">Billed Capacity:</span>
                      <span className="text-stone-900 block font-bold">{hours} Hrs Weekly</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-stone-500 font-semibold">Draft Schedule:</span>
                      <span className="text-stone-900 block font-medium">
                        {selectedSlots.length > 0 ? selectedSlots.join(', ') : 'Pending Final Selection'}
                      </span>
                    </div>
                    <div className="col-span-2 bg-white p-3 rounded-lg border border-stone-200 space-y-1 shadow-xs">
                      <div className="flex justify-between items-baseline">
                        <span className="text-stone-800 text-xs font-serif font-bold">Total Tuition Fee:</span>
                        <span className="text-base font-bold text-amber-900 font-serif">KES {costWeekly.toLocaleString()}</span>
                      </div>
                      <span className="text-[10px] text-stone-600 block font-sans">
                        First hour is <strong className="text-emerald-800 font-bold">FREE</strong> upon booking confirmation.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 font-sans">
                  {/* Parents Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-stone-700 font-semibold block">
                      Parent / Guardian Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rose Mwangi"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Student Name & Current School */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-stone-700 font-semibold block">
                        Student Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Collins Mwangi"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-stone-700 font-semibold block">
                        Student's Current School *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kenya High / Alliance / Kabarak High"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Location / Landmark / Residence Pin */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-stone-700 font-semibold block">
                      Residence Location / Nearest Landmark / Map Pin *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kilimani, Nairobi / Kisii Town / Online Virtual"
                      value={locationLandmark}
                      onChange={(e) => setLocationLandmark(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-stone-700 font-semibold block">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="rose.mwangi@gmail.com"
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* WhatsApp/Phone */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-stone-700 font-semibold block">
                        WhatsApp Phone Number *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-xs font-mono text-stone-500">+254</span>
                        <input
                          type="tel"
                          required
                          placeholder="712345678"
                          value={parentPhone}
                          onChange={(e) => setParentPhone(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-12 pr-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Legal / Data Compliance Note */}
                  <div className="bg-stone-50 border border-stone-200 p-3.5 sm:p-4 rounded-xl flex items-start gap-3 shadow-xs">
                    <FileText className="h-5 w-5 text-teal-800 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2 text-[11px] leading-relaxed text-stone-700 w-full min-w-0">
                      <span className="font-bold text-stone-900 block">Direct Placement Terms</span>
                      <p>
                        This allocation locks Teacher Brigid Bwari for your chosen time slots. Tuition is subject to weekly invoicing. Cancellations must be communicated 12 hours in advance to avoid inconveniences.
                      </p>
                      <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center gap-2 text-[10px] font-mono">
                        <button
                          type="button"
                          onClick={() => openLegalTab('terms')}
                          className="text-amber-900 font-bold hover:underline flex items-center gap-1 cursor-pointer bg-white border border-stone-300 px-2 py-1 rounded"
                        >
                          <Info className="h-3 w-3 text-amber-800" /> Terms & Conditions
                        </button>
                        <button
                          type="button"
                          onClick={() => openLegalTab('privacy')}
                          className="text-amber-900 font-bold hover:underline flex items-center gap-1 cursor-pointer bg-white border border-stone-300 px-2 py-1 rounded"
                        >
                          <Info className="h-3 w-3 text-amber-800" /> Privacy Policy
                        </button>
                        <button
                          type="button"
                          onClick={() => openLegalTab('dataprotection')}
                          className="text-teal-800 font-bold hover:underline flex items-center gap-1 cursor-pointer bg-white border border-stone-300 px-2 py-1 rounded"
                        >
                          <Info className="h-3 w-3 text-teal-800" /> Kenya Data Protection
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Checkbox */}
                  <label className="flex items-start gap-3 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="mt-1 h-3.5 w-3.5 accent-amber-500 rounded"
                    />
                    <span className="text-[10px] text-stone-600 font-sans leading-relaxed">
                      I acknowledge that records of my child's academic performance, diagnostic matrices, and schedule hours are preserved in accordance with Kenya's <strong>Data Protection Act (2019)</strong>.
                    </span>
                  </label>
                </div>

                {/* Submit Action */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={!agreeToTerms || isSubmitting}
                    className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 font-sans font-bold py-3.5 rounded-xl transition-all duration-200 text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {isSubmitting ? (
                      <span>Registering placement...</span>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        <span>Confirm & Register Placement</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Exit / Way Out Options */}
                <div className="pt-2 border-t border-stone-200 space-y-2 text-center">
                  <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-semibold">
                    Not ready to confirm placement?
                  </span>
                  <div className="flex items-center justify-center gap-3 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setTimeout(() => {
                          const el = document.getElementById('testimonials');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="text-amber-900 font-bold hover:text-amber-950 underline cursor-pointer transition-colors"
                    >
                      ← Read Parent Reviews
                    </button>
                    <span className="text-stone-300">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setTimeout(() => {
                          const el = document.getElementById('profile-header');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="text-stone-600 hover:text-stone-900 underline cursor-pointer transition-colors font-medium"
                    >
                      Return to Home Page
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <TermsAndPrivacyModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        defaultTab={termsTab}
      />
    </>
  );
}
