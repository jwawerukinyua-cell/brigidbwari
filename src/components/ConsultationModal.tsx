/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Phone, Mail, CheckCircle, MessageSquare } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [studentName, setStudentName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [currentGrade, setCurrentGrade] = useState('Grade C');
  const [subjectFocus, setSubjectFocus] = useState('Combined English & Literature');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    // Open WhatsApp directly to Teacher Brigid
    const message = encodeURIComponent(
      `Hello Teacher Brigid Bwari,\n\nI am requesting an academic consultation for my child:\n- Parent Name: ${parentName}\n- Phone: ${phone}\n- Student: ${studentName}\n- School: ${schoolName}\n- Current Performance: ${currentGrade}\n- Subject Track: ${subjectFocus}\n- Notes: ${notes}`
    );
    window.open(`https://wa.me/254757280386?text=${message}`, '_blank');

    setTimeout(() => {
      setParentName('');
      setPhone('');
      setStudentName('');
      setSchoolName('');
      setNotes('');
    }, 4000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          {/* Backdrop Overlay */}
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
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl z-10 max-h-[92vh] flex flex-col my-auto text-stone-900 font-sans"
          >
            {/* Header */}
            <div className="sticky top-0 z-20 bg-stone-50 border-b border-stone-200 px-5 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-amber-900 uppercase block mb-0.5 font-bold">
                  Direct WhatsApp / Call Link
                </span>
                <h3 className="text-lg sm:text-xl font-serif text-stone-950 font-bold">
                  Academic Consultation Request
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

            {/* Form & Confirmation Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 scrollbar-thin">
              {submitted ? (
                <div className="py-8 px-4 text-center space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 border border-amber-300 text-amber-800 mb-2">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-serif text-stone-950 font-semibold">Consultation Request Dispatched</h4>
                  <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                    Thank you. Teacher Brigid Bwari will review your child's learning profile and reach out via WhatsApp / Call at <strong className="text-amber-900">{phone}</strong> (+254 757 280 386).
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        onClose();
                      }}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono text-xs px-6 py-2.5 rounded-lg border border-stone-300 transition-colors cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Initiate a direct diagnostic consultation with Teacher Brigid Bwari (B.Ed, Kabarak University). Discuss your child's English grammar, literature set books, or speech confidence.
                  </p>

                  {/* Parent Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-stone-700 font-semibold block">
                      Parent / Guardian Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mrs. Margaret Wanjiku"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-stone-700 font-semibold block">
                      WhatsApp / Phone Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-mono text-stone-500">+254</span>
                      <input
                        type="tel"
                        required
                        placeholder="757 280 386"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-12 pr-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Student Name & School Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-stone-700 font-semibold block">
                        Student Name & Class / Level *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Brenda (JSS / Form 4)"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-stone-700 font-semibold block">
                        Current School / Location *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Saint Triza / Utawala"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Current Grade & Target */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-stone-700 font-semibold block">
                        Current English Performance
                      </label>
                      <select
                        value={currentGrade}
                        onChange={(e) => setCurrentGrade(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="Grade E / D">Below Average (E / D)</option>
                        <option value="Grade C">Average (C / C+)</option>
                        <option value="Grade B">Good (B / B+)</option>
                        <option value="Grade A">High Achiever (A- / A)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-stone-700 font-semibold block">
                        Primary Subject Focus
                      </label>
                      <select
                        value={subjectFocus}
                        onChange={(e) => setSubjectFocus(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="Combined English & Literature">Combined English & Literature</option>
                        <option value="English Grammar & Vocabulary">English Grammar & Vocabulary</option>
                        <option value="Literature Set Books">Literature Set Books</option>
                        <option value="Conversational & Speech Support">Conversational & Speech Support</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-stone-700 font-semibold block">
                      Specific Learning Gaps or Goals
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Needs help with essay composition, set book analysis, or confidence in public speaking."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  {/* Primary CTA button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-rose-700 hover:bg-rose-800 text-white font-sans font-bold py-3.5 rounded-xl transition-all shadow-md text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Connect via WhatsApp (+254 757 280 386) →</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

