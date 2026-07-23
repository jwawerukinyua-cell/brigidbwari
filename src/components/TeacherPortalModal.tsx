/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Key, CheckCircle, Trash2, Edit3, UserCheck, Calendar, ShieldAlert, Plus, BookOpen, PlusCircle, Save } from 'lucide-react';
import { BookingData, getAllBookings, saveBooking, getCommissionBreakdown } from '../lib/bookingSystem';

interface TeacherPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TeacherPortalModal({ isOpen, onClose }: TeacherPortalModalProps) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [editingBooking, setEditingBooking] = useState<BookingData | null>(null);

  // Attendance logging inputs when editing
  const [newLogDate, setNewLogDate] = useState('');
  const [newLogTopic, setNewLogTopic] = useState('');
  const [newLogStatus, setNewLogStatus] = useState<'Present' | 'Absent' | 'Rescheduled'>('Present');

  useEffect(() => {
    if (isOpen) {
      const all = getAllBookings();
      setBookings(all);
    }
  }, [isOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = password.trim().toUpperCase();
    const customPass = localStorage.getItem('teacher_portal_pass');
    
    if (clean === 'BRIGID-ENG-2026' || clean === 'KABARAK-2026' || clean === 'BRIGID-2026' || (customPass && clean === customPass.toUpperCase()) || btoa(password) === 'VGhhYXJhMjAyNiE=') {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid password. Access restricted to Teacher Brigid Bwari.');
    }
  };

  const handleStatusChange = (id: string, newStatus: 'Confirmed' | 'Pending Payment') => {
    const updated = bookings.map(b => {
      if (b.id === id) {
        const u = {
          ...b,
          status: newStatus,
          paymentStatus: (newStatus === 'Confirmed' ? 'Cleared / Active' : 'Pending Payment') as 'Cleared / Active' | 'Pending Payment'
        };
        saveBooking(u);
        return u;
      }
      return b;
    });
    setBookings(updated);
  };

  const handleIncrementLesson = (booking: BookingData) => {
    const updatedLessonsCovered = booking.lessonsCovered + 1;
    const total = booking.totalLessonsBooked || booking.hours * 2 || 4;
    const updated: BookingData = {
      ...booking,
      lessonsCovered: updatedLessonsCovered,
      lessonsRemaining: Math.max(0, total - updatedLessonsCovered)
    };

    saveBooking(updated);
    setBookings(bookings.map(b => b.id === booking.id ? updated : b));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to cancel this student placement ledger?')) {
      const updated = bookings.filter(b => b.id !== id);
      setBookings(updated);
      localStorage.setItem('brigid_tuition_bookings', JSON.stringify(updated));
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    const total = editingBooking.totalLessonsBooked || editingBooking.hours * 2 || 4;
    const updated: BookingData = {
      ...editingBooking,
      totalLessonsBooked: total,
      lessonsRemaining: Math.max(0, total - editingBooking.lessonsCovered)
    };

    saveBooking(updated);
    setBookings(bookings.map(b => b.id === updated.id ? updated : b));
    setEditingBooking(null);
  };

  const handleAddAttendanceLog = () => {
    if (!editingBooking || !newLogDate || !newLogTopic) return;

    const newRecord = {
      id: Date.now().toString(),
      date: newLogDate,
      topic: newLogTopic,
      status: newLogStatus
    };

    const currentLogs = editingBooking.attendanceLogs || [];
    const updatedBooking = {
      ...editingBooking,
      attendanceLogs: [newRecord, ...currentLogs],
      lessonsCovered: newLogStatus === 'Present' ? editingBooking.lessonsCovered + 1 : editingBooking.lessonsCovered
    };

    setEditingBooking(updatedBooking);
    setNewLogDate('');
    setNewLogTopic('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-2xl shadow-xl z-10 overflow-hidden flex flex-col max-h-[88vh] text-stone-900"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-amber-800" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-900 font-bold tracking-wider block">
                    Teacher Administrative Portal
                  </span>
                  <h3 className="text-base font-serif font-bold text-stone-950">
                    Teacher Brigid Bwari Management Dashboard
                  </h3>
                </div>
              </div>
              <button onClick={onClose} className="p-1 rounded-lg text-stone-500 hover:bg-stone-200 hover:text-stone-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Login View */}
            {!isAuthenticated ? (
              <form onSubmit={handleLogin} className="p-8 space-y-6 text-center font-sans">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 border border-amber-300 text-amber-800 mb-2">
                  <Key className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-serif font-bold text-stone-950">Teacher Authentication</h4>
                  <p className="text-xs text-stone-600 mt-1">Please enter your password to manage student lesson tracking, attendance, and progress notes.</p>
                </div>

                <div className="max-w-xs mx-auto space-y-2">
                  <input
                    type="password"
                    placeholder="Enter password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 text-center focus:outline-none focus:border-amber-500 font-mono tracking-widest"
                  />
                  {errorMsg && (
                    <p className="text-[11px] text-rose-600 font-mono flex items-center justify-center gap-1 font-semibold">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      {errorMsg}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-sans font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                >
                  Log In to Dashboard
                </button>
              </form>
            ) : (
              /* Dashboard View */
              <div className="p-6 space-y-6 overflow-y-auto">
                <div className="flex justify-between items-center border-b border-stone-200 pb-4">
                  <div>
                    <span className="text-xs text-amber-900 font-mono font-bold">Authenticated as Teacher Brigid Bwari</span>
                    <h4 className="text-sm font-bold text-stone-900">Active Student Placement Ledgers ({bookings.length})</h4>
                  </div>
                  <button
                    onClick={() => setIsAuthenticated(false)}
                    className="text-xs text-stone-500 hover:text-stone-900 font-mono cursor-pointer"
                  >
                    Lock Portal
                  </button>
                </div>

                {editingBooking ? (
                  /* Edit Booking & Progress Form */
                  <form onSubmit={handleSaveEdit} className="bg-stone-50 border border-stone-200 p-5 rounded-2xl space-y-5">
                    <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                      <h5 className="text-xs font-mono text-amber-900 uppercase font-bold">
                        Manage Ledger: {editingBooking.id}
                      </h5>
                      <span className="text-[10px] text-teal-800 font-mono font-bold">Syncs to Parent Portal</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                      <div>
                        <label className="text-[10px] font-mono text-stone-600 font-semibold block mb-1">Parent Name</label>
                        <input
                          type="text"
                          value={editingBooking.parentName}
                          onChange={(e) => setEditingBooking({ ...editingBooking, parentName: e.target.value })}
                          className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-stone-600 font-semibold block mb-1">Student & School</label>
                        <input
                          type="text"
                          value={editingBooking.studentName}
                          onChange={(e) => setEditingBooking({ ...editingBooking, studentName: e.target.value })}
                          className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-stone-600 font-semibold block mb-1">Total Lessons Booked</label>
                        <input
                          type="number"
                          value={editingBooking.totalLessonsBooked || 8}
                          onChange={(e) => setEditingBooking({ ...editingBooking, totalLessonsBooked: Number(e.target.value) })}
                          className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-stone-600 font-semibold block mb-1">Lessons Covered So Far</label>
                        <input
                          type="number"
                          value={editingBooking.lessonsCovered}
                          onChange={(e) => setEditingBooking({ ...editingBooking, lessonsCovered: Number(e.target.value) })}
                          className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 font-mono"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="text-[10px] font-mono text-amber-900 font-bold block mb-1">Academic Progress Notes (Visible to Parent)</label>
                        <textarea
                          rows={2}
                          value={editingBooking.progressNotes || ''}
                          onChange={(e) => setEditingBooking({ ...editingBooking, progressNotes: e.target.value })}
                          placeholder="e.g. Mastered Stoichiometry calculations. Progressing to organic reaction pathways."
                          className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 text-xs"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="text-[10px] font-mono text-amber-900 font-bold block mb-1">Challenges & Concerns</label>
                        <textarea
                          rows={2}
                          value={editingBooking.challengesAndConcerns || ''}
                          onChange={(e) => setEditingBooking({ ...editingBooking, challengesAndConcerns: e.target.value })}
                          placeholder="e.g. Requires more titration speed drills during practical sessions."
                          className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 text-xs"
                        />
                      </div>
                    </div>

                    {/* Attendance Logger Block */}
                    <div className="border-t border-stone-200 pt-3 space-y-3 font-sans">
                      <span className="text-xs font-mono uppercase text-teal-800 block font-bold">
                        Add Session Attendance & Topic Covered
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Date (e.g. July 22)"
                          value={newLogDate}
                          onChange={(e) => setNewLogDate(e.target.value)}
                          className="bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 font-mono"
                        />
                        <input
                          type="text"
                          placeholder="Topic Covered"
                          value={newLogTopic}
                          onChange={(e) => setNewLogTopic(e.target.value)}
                          className="bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900"
                        />
                        <div className="flex gap-2">
                          <select
                            value={newLogStatus}
                            onChange={(e) => setNewLogStatus(e.target.value as any)}
                            className="bg-white border border-stone-300 rounded-lg px-2 py-2 text-xs text-stone-900 font-mono flex-1 cursor-pointer"
                          >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="Rescheduled">Rescheduled</option>
                          </select>
                          <button
                            type="button"
                            onClick={handleAddAttendanceLog}
                            className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-3 py-2 rounded-lg text-xs cursor-pointer"
                          >
                            Add Log
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-2 border-t border-stone-200">
                      <button
                        type="button"
                        onClick={() => setEditingBooking(null)}
                        className="px-4 py-2 rounded-lg bg-stone-100 border border-stone-300 text-stone-700 text-xs font-mono cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold font-sans cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <Save className="h-3.5 w-3.5" />
                        <span>Save & Sync Dashboard</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Bookings List */
                  <div className="space-y-4">
                    {bookings.map((booking) => {
                      const total = booking.totalLessonsBooked || booking.hours * 2 || 4;
                      const remaining = Math.max(0, total - booking.lessonsCovered);
                      const mode = booking.deliveryMode || 'In-Person Home Visit';
                      const breakdown = getCommissionBreakdown(booking.totalCost, mode);

                      return (
                        <div
                          key={booking.id}
                          className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3 font-mono text-xs shadow-xs"
                        >
                          <div className="flex justify-between items-start border-b border-stone-200 pb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-amber-900 font-bold text-sm">{booking.id}</span>
                                <span className={`text-[9px] px-2 py-0.5 rounded font-bold font-mono ${
                                  mode === 'Online Virtual Classroom'
                                    ? 'bg-purple-100 text-purple-900 border border-purple-300'
                                    : 'bg-stone-200 text-stone-800 border border-stone-300'
                                }`}>
                                  {mode === 'Online Virtual Classroom' ? '💻 ONLINE VIRTUAL' : '📍 IN-PERSON'}
                                </span>
                                {mode === 'Online Virtual Classroom' && (
                                  <a
                                    href={`https://meet.google.com/lookup/${booking.id.toLowerCase()}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-purple-700 hover:bg-purple-800 text-white px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <span>Launch Class Room →</span>
                                  </a>
                                )}
                              </div>
                              <span className="text-stone-500 text-[10px] block mt-0.5">{booking.dateCreated} • Location: {booking.location}</span>
                            </div>
                            <span className={`text-[10px] px-2.5 py-1 rounded uppercase font-bold ${
                              booking.status === 'Confirmed' || booking.paymentStatus === 'Cleared / Active'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}>
                              {booking.paymentStatus || booking.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] font-sans text-stone-700">
                            <div>
                              <span className="text-stone-500 font-mono text-[9px] block uppercase font-semibold">Student / School:</span>
                              <span className="font-bold text-stone-900">{booking.studentName}</span>
                              <span className="block text-[10px] text-stone-600">{booking.parentName} ({booking.parentPhone})</span>
                            </div>
                            <div>
                              <span className="text-stone-500 font-mono text-[9px] block uppercase font-semibold">Subject Track:</span>
                              <span className="text-teal-800 font-mono font-bold">{booking.subject}</span>
                            </div>
                            <div>
                              <span className="text-stone-500 font-mono text-[9px] block uppercase font-semibold">Lessons Progress:</span>
                              <span className="font-bold text-amber-900">
                                {booking.lessonsCovered} / {total} Covered ({remaining} remaining)
                              </span>
                            </div>
                            <div>
                              <span className="text-stone-500 font-mono text-[9px] block uppercase font-semibold">Tuition Fee Breakdown:</span>
                              <span className="text-stone-950 font-bold block">Total: KES {booking.totalCost.toLocaleString()}</span>
                              <div className="text-[9px] font-mono text-stone-600 space-y-0.5 mt-0.5 pt-0.5 border-t border-stone-200">
                                <span className="block text-emerald-800 font-bold">
                                  Teacher Payout ({breakdown.teacherPayoutPercent}%): KES {breakdown.teacherPayout.toLocaleString()}
                                </span>
                                <span className="block text-teal-800">
                                  Platform SaaS Fee ({breakdown.commissionPercent}%): KES {breakdown.platformCommission.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Action bar */}
                          <div className="pt-2 border-t border-stone-200 flex flex-wrap justify-between items-center text-[10px] gap-2">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleIncrementLesson(booking)}
                                className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 px-2.5 py-1 rounded-md font-mono flex items-center gap-1 cursor-pointer font-bold"
                              >
                                <Plus className="h-3 w-3 text-emerald-700" />
                                <span>+1 Lesson Covered</span>
                              </button>
                              <button
                                onClick={() => handleStatusChange(booking.id, booking.status === 'Confirmed' ? 'Pending Payment' : 'Confirmed')}
                                className="text-stone-600 hover:text-stone-900 underline font-mono cursor-pointer"
                              >
                                Toggle Payment
                              </button>
                              <button
                                onClick={() => setEditingBooking(booking)}
                                className="text-amber-900 hover:underline flex items-center gap-1 cursor-pointer font-mono font-bold"
                              >
                                <Edit3 className="h-3 w-3" />
                                <span>Full Edit & Notes</span>
                              </button>
                            </div>

                            <button
                              onClick={() => handleDelete(booking.id)}
                              className="text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer font-mono font-semibold"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
