/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, BookOpen, CheckCircle2, Clock, Calendar, AlertCircle, Printer, ShieldCheck, UserCheck, Award } from 'lucide-react';
import { BookingData, findBookingByVoucher, getAllBookings } from '../lib/bookingSystem';

interface ParentPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVoucherCode?: string;
}

export default function ParentPortalModal({ isOpen, onClose, initialVoucherCode = '' }: ParentPortalModalProps) {
  const [voucherInput, setVoucherInput] = useState(initialVoucherCode);
  const [activeBooking, setActiveBooking] = useState<BookingData | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [recentBookings, setRecentBookings] = useState<BookingData[]>([]);

  useEffect(() => {
    if (isOpen) {
      const all = getAllBookings();
      setRecentBookings(all);

      if (initialVoucherCode) {
        setVoucherInput(initialVoucherCode);
        const match = findBookingByVoucher(initialVoucherCode);
        if (match) {
          setActiveBooking(match);
          setErrorMsg('');
        }
      } else if (all.length > 0) {
        // Pre-fill with the first booking for quick demonstration
        setVoucherInput(all[0].id);
        setActiveBooking(all[0]);
      }
    }
  }, [isOpen, initialVoucherCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) {
      setErrorMsg('Please enter your student voucher code.');
      return;
    }

    const match = findBookingByVoucher(voucherInput);
    if (match) {
      setActiveBooking(match);
      setErrorMsg('');
    } else {
      setActiveBooking(null);
      setErrorMsg(`No student record found for voucher "${voucherInput.trim().toUpperCase()}". Please verify your voucher number.`);
    }
  };

  const handleSelectDemo = (booking: BookingData) => {
    setVoucherInput(booking.id);
    setActiveBooking(booking);
    setErrorMsg('');
  };

  const handlePrintProgressDoc = () => {
    window.print();
  };

  return (
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

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-2xl shadow-xl z-10 overflow-hidden flex flex-col my-6 max-h-[88vh] text-stone-900"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50 no-print">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-900 font-bold tracking-wider block">
                    Parent Student Dashboard
                  </span>
                  <h3 className="text-base font-serif font-bold text-stone-950">
                    Voucher Academic Progress Tracker
                  </h3>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-200 hover:text-stone-900 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Voucher Search Bar */}
            <div className="p-6 bg-stone-50/80 border-b border-stone-200 space-y-3 no-print">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Enter Voucher Code (e.g. BRIGID-ENG-782194 or BRIGID-L-449102)"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 font-mono tracking-wider focus:outline-none focus:border-amber-500 uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs uppercase font-mono tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Verify Voucher</span>
                </button>
              </form>

              {/* Quick Demo Vouchers */}
              {recentBookings.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-mono text-stone-600">
                  <span className="text-stone-500 font-semibold uppercase">Quick Lookup Vouchers:</span>
                  {recentBookings.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => handleSelectDemo(b)}
                      className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        activeBooking?.id === b.id
                          ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold'
                          : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {b.id}
                    </button>
                  ))}
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2 font-mono">
                  <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Student Dashboard Content */}
            {activeBooking ? (
              <div id="parent-student-report" className="p-6 overflow-y-auto space-y-6">
                {/* Header Banner */}
                <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
                  <div>
                    <span className="text-[10px] font-mono text-amber-900 uppercase font-bold tracking-widest block mb-1">
                      Official Placement Ledger • {activeBooking.id}
                    </span>
                    <h2 className="text-xl font-serif font-bold text-stone-950 flex items-center gap-2">
                      <span>{activeBooking.studentName}</span>
                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase font-bold border ${
                        activeBooking.deliveryMode === 'Online Virtual Classroom'
                          ? 'bg-purple-100 text-purple-900 border-purple-300'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}>
                        {activeBooking.deliveryMode === 'Online Virtual Classroom' ? '💻 Online Virtual' : '📍 In-Person Home'}
                      </span>
                    </h2>
                    <p className="text-xs text-stone-600 font-sans mt-0.5">
                      Parent / Guardian: <span className="text-stone-900 font-medium">{activeBooking.parentName}</span> ({activeBooking.parentPhone})
                    </p>
                  </div>
                  <div className="text-left sm:text-right font-mono">
                    <span className="text-[10px] text-stone-500 block font-semibold uppercase">Payment & Status</span>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      activeBooking.paymentStatus === 'Cleared / Active' || activeBooking.status === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {activeBooking.paymentStatus || activeBooking.status}
                    </span>
                  </div>
                </div>

                {/* Virtual Classroom Direct Link for Online Sessions */}
                {activeBooking.deliveryMode === 'Online Virtual Classroom' && (
                  <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="space-y-0.5 text-center sm:text-left">
                      <span className="text-[10px] font-mono uppercase text-purple-900 font-bold tracking-wider block">
                        💻 Live Virtual Masterclass Active
                      </span>
                      <p className="text-xs text-stone-700">
                        Access 1-on-1 HD Video Room, Interactive Digital Whiteboard & Cloud Recorded Replays.
                      </p>
                    </div>
                    <a
                      href={`https://meet.google.com/lookup/${activeBooking.id.toLowerCase()}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer transition-all"
                    >
                      <span>Launch Live Class Room →</span>
                    </a>
                  </div>
                )}

                {/* Progress Grid Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-stone-500 font-semibold uppercase block">Total Lessons Booked</span>
                    <div className="text-2xl font-serif font-bold text-amber-900">
                      {activeBooking.totalLessonsBooked || activeBooking.hours * 2} <span className="text-xs font-sans text-stone-600 font-normal">lessons</span>
                    </div>
                    <span className="text-[10px] font-mono text-teal-800 font-bold block">{activeBooking.subject}</span>
                  </div>

                  <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-stone-500 font-semibold uppercase block">Lessons Covered</span>
                    <div className="text-2xl font-serif font-bold text-emerald-800">
                      {activeBooking.lessonsCovered} <span className="text-xs font-sans text-stone-600 font-normal">completed</span>
                    </div>
                    <span className="text-[10px] font-mono text-stone-600 block">Verified by Teacher Brigid Bwari</span>
                  </div>

                  <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-stone-500 font-semibold uppercase block">Lessons Remaining</span>
                    <div className="text-2xl font-serif font-bold text-teal-800">
                      {Math.max(0, (activeBooking.totalLessonsBooked || activeBooking.hours * 2) - activeBooking.lessonsCovered)} <span className="text-xs font-sans text-stone-600 font-normal">sessions</span>
                    </div>
                    <span className="text-[10px] font-mono text-stone-600 block">Schedule active</span>
                  </div>
                </div>

                {/* Visual Lessons Bar */}
                <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-stone-600 font-semibold">Lesson Completion Milestone:</span>
                    <span className="text-amber-900 font-bold">
                      {Math.round((activeBooking.lessonsCovered / (activeBooking.totalLessonsBooked || activeBooking.hours * 2 || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden border border-stone-300">
                    <div
                      className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.round((activeBooking.lessonsCovered / (activeBooking.totalLessonsBooked || activeBooking.hours * 2 || 1)) * 100))}%`
                      }}
                    />
                  </div>
                </div>

                {/* Teacher Progress Notes & Challenges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-teal-800 font-mono text-xs uppercase font-bold">
                      <Award className="h-4 w-4" />
                      <span>Academic Progress & Mastery</span>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed font-sans bg-white p-3 rounded-lg border border-stone-200 shadow-xs">
                      {activeBooking.progressNotes || "Diagnostic testing complete. Working on core practical skills and theory calculations."}
                    </p>
                  </div>

                  <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-amber-900 font-mono text-xs uppercase font-bold">
                      <Clock className="h-4 w-4" />
                      <span>Syllabus Focus & Challenges</span>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed font-sans bg-white p-3 rounded-lg border border-stone-200 shadow-xs">
                      {activeBooking.challengesAndConcerns || "Syllabus revision systematically targeting KCSE paper 1 & paper 2 exam mechanics."}
                    </p>
                  </div>
                </div>

                {/* Attendance & Topic Logs */}
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3 font-sans">
                  <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                    <span className="text-xs font-mono uppercase text-stone-800 font-bold flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-amber-800" />
                      <span>Session Attendance & Topics Covered ({activeBooking.attendanceLogs?.length || 0})</span>
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">Live Sync with Teacher Portal</span>
                  </div>

                  {activeBooking.attendanceLogs && activeBooking.attendanceLogs.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 font-mono text-xs">
                      {activeBooking.attendanceLogs.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-stone-200 shadow-xs"
                        >
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-stone-500 block">{log.date}</span>
                            <span className="text-stone-900 font-sans text-xs block font-medium">{log.topic}</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                              log.status === 'Present'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : log.status === 'Rescheduled'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-rose-100 text-rose-900 border border-rose-300'
                            }`}
                          >
                            {log.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-stone-500 text-xs italic font-sans">
                      First session pending start. Attendance logs will be posted by Teacher Brigid Bwari after each completed class.
                    </div>
                  )}
                </div>

                {/* Print & Contact Actions */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3 no-print">
                  <button
                    onClick={handlePrintProgressDoc}
                    className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono text-xs uppercase font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer border border-stone-300"
                  >
                    <Printer className="h-4 w-4 text-amber-800" />
                    <span>Print Progress Report (PDF)</span>
                  </button>

                  <a
                    href={`https://wa.me/254757280386?text=${encodeURIComponent(
                      `Hi Teacher Brigid, I'm checking the progress portal for voucher ${activeBooking.id} (${activeBooking.studentName}). Could we discuss the upcoming session?`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-rose-700 hover:bg-rose-800 text-white font-sans font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-center shadow-xs"
                  >
                    <span>Contact Teacher Brigid on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-stone-500 font-sans space-y-2">
                <BookOpen className="h-10 w-10 text-stone-400 mx-auto" />
                <p className="text-xs">Enter your student voucher code above to load your academic dashboard.</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
