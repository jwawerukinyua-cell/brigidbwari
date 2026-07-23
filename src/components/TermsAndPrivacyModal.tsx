/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, FileText, Lock, Scale } from 'lucide-react';

interface TermsAndPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'terms' | 'privacy' | 'dataprotection';
}

export default function TermsAndPrivacyModal({
  isOpen,
  onClose,
  defaultTab = 'terms'
}: TermsAndPrivacyModalProps) {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'dataprotection'>(defaultTab);

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
            className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-2xl shadow-xl z-10 overflow-hidden flex flex-col max-h-[85vh] text-stone-900"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-amber-800" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-teal-800 tracking-wider block font-bold">
                    Legal & Compliance Framework
                  </span>
                  <h3 className="text-sm font-serif font-bold text-stone-950">
                    Teacher Brigid Bwari Tuition Standards
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

            {/* Navigation Tabs */}
            <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-3 gap-4 font-mono text-xs">
              <button
                onClick={() => setActiveTab('terms')}
                className={`pb-3 transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${
                  activeTab === 'terms'
                    ? 'border-amber-800 text-amber-950 font-bold'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Terms & Conditions</span>
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`pb-3 transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${
                  activeTab === 'privacy'
                    ? 'border-amber-800 text-amber-950 font-bold'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Privacy Policy</span>
              </button>
              <button
                onClick={() => setActiveTab('dataprotection')}
                className={`pb-3 transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${
                  activeTab === 'dataprotection'
                    ? 'border-amber-800 text-amber-950 font-bold'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <Scale className="h-3.5 w-3.5" />
                <span>Data Protection (Kenya Law)</span>
              </button>
            </div>

            {/* Tab Content Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed font-sans text-stone-700">
              {activeTab === 'terms' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-serif font-bold text-amber-900">1. Placement & Scheduling Terms</h4>
                  <p>
                    This allocation locks Teacher Brigid Bwari for your chosen time slots. Tuition is subject to weekly invoicing or agreed billing intervals.
                  </p>

                  <h4 className="text-sm font-serif font-bold text-amber-900">2. Cancellation & Rescheduling Policy</h4>
                  <p>
                    Cancellations or session reschedules must be communicated at least <strong className="text-stone-900">12 hours in advance</strong> to avoid inconveniences and permit schedule reallocation for other awaiting candidates.
                  </p>

                  <h4 className="text-sm font-serif font-bold text-amber-900">3. First Lesson Offer</h4>
                  <p>
                    The first 1-hour session is provided at zero initial fee upon booking commitment, giving parents and candidates an opportunity to undergo diagnostic English gap evaluation.
                  </p>

                  <h4 className="text-sm font-serif font-bold text-amber-900">4. Tuition Processing & Administrative Portal Terms</h4>
                  <p>
                    All tuition reservations and placement vouchers are dispatched through the central platform billing engine (+254 703 848 313). Tuition payments are processed securely. Detailed earnings breakdowns, platform service commissions, and net payout ledger statements are managed exclusively within Teacher Brigid Bwari's private administrative portal.
                  </p>

                  <h4 className="text-sm font-serif font-bold text-amber-900">5. Residence & Online Protocol</h4>
                  <p>
                    Private sessions conducted at student residences in Nairobi and Kisii or online comply with all Ministry of Education safety, decorum, and educational standards.
                  </p>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-serif font-bold text-amber-900">Information Collection & Purpose</h4>
                  <p>
                    We collect essential information—such as parent name, phone number, student name, current school, location landmark, and academic grade goals—solely to deliver personalized tuition services and track student progress.
                  </p>

                  <h4 className="text-sm font-serif font-bold text-amber-900">Confidentiality & Non-Disclosure</h4>
                  <p>
                    All diagnostic assessment records, set book analysis notes, personal phone numbers, and home address details remain strictly confidential between Teacher Brigid Bwari and the candidate's family.
                  </p>

                  <h4 className="text-sm font-serif font-bold text-amber-900">Communication Guidelines</h4>
                  <p>
                    Official lesson confirmations, weekly progress summaries, and voucher receipts are dispatched via secure direct WhatsApp messaging or email.
                  </p>
                </div>
              )}

              {activeTab === 'dataprotection' && (
                <div className="space-y-4">
                  <div className="bg-teal-50 border border-teal-200 p-3 rounded-xl text-teal-900 text-[11px] font-mono font-bold">
                    Compliant with the Data Protection Act No. 24 of 2019 (Republic of Kenya)
                  </div>

                  <h4 className="text-sm font-serif font-bold text-amber-900">Data Subject Rights (Kenya Laws)</h4>
                  <p>
                    In accordance with Kenyan Data Protection Laws, parents and guardians maintain the right to:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-stone-700">
                    <li>Access all stored personal and academic ledger records.</li>
                    <li>Request correction or updating of inaccurate candidate details.</li>
                    <li>Request deletion of data upon conclusion of tuition engagement.</li>
                  </ul>

                  <h4 className="text-sm font-serif font-bold text-amber-900">Data Security Standards</h4>
                  <p>
                    All voucher numbers and tracking records are stored with local encrypted tokens and restricted administrative password authorization. No candidate personal data is ever sold or shared with third-party advertisers.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex justify-end">
              <button
                onClick={onClose}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-2 rounded-xl text-xs uppercase font-mono tracking-wider transition-colors cursor-pointer shadow-xs"
              >
                Understood & Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
