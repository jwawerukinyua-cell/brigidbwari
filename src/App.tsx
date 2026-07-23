/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Navbar from './components/Navbar';
import Testimonials from './components/Testimonials';
import ConsultationModal from './components/ConsultationModal';
import LegalCheckoutModal from './components/LegalCheckoutModal';
import TeacherPortalModal from './components/TeacherPortalModal';
import ParentPortalModal from './components/ParentPortalModal';
import TermsAndPrivacyModal from './components/TermsAndPrivacyModal';
import DocumentDispatcher from './components/DocumentDispatcher';
import InteractiveScheduler from './components/InteractiveScheduler';
import { BookingData } from './lib/bookingSystem';
import { Phone, BookOpen, MessageSquare, ShieldCheck, Info } from 'lucide-react';
import teacherBrigidPhoto from './assets/images/teacher_brigid_m.png';
import bbmLogo from './assets/images/bbm_logo_1784836366300.jpg';

export default function App() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTeacherPortalOpen, setIsTeacherPortalOpen] = useState(false);
  const [isParentPortalOpen, setIsParentPortalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [termsTab, setTermsTab] = useState<'terms' | 'privacy' | 'dataprotection'>('terms');

  const [bookingResult, setBookingResult] = useState<BookingData | null>(null);
  const [hoursVolume, setHoursVolume] = useState(4);
  const [selectedSubject, setSelectedSubject] = useState('Combined English & Literature');
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState<'In-Person Home Visit' | 'Online Virtual Classroom'>('In-Person Home Visit');
  const [isMonthlyPackage, setIsMonthlyPackage] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState('profile');

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    let targetId = section;
    if (section === 'profile') targetId = 'profile-header';
    if (section === 'matrices') targetId = 'profile';
    if (section === 'placements') targetId = 'placements';

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openLegalTab = (tab: 'terms' | 'privacy' | 'dataprotection') => {
    setTermsTab(tab);
    setIsTermsModalOpen(true);
  };

  return (
    <div id="profile-header" className="relative min-h-screen bg-[#FAF8F5] text-stone-900 selection:bg-rose-200 selection:text-rose-900 overflow-x-hidden font-sans">
      {/* BRAND WATERMARK BACKGROUND OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.04] select-none overflow-hidden">
        <img
          src={bbmLogo}
          alt="Brand Watermark Backdrop"
          className="w-[600px] max-w-[80vw] h-auto object-contain grayscale rounded-full filter blur-[1px] transform scale-125"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* CONTENT CONTAINER LAYER */}
      <div className="relative z-10">
        {/* PREMIUM HEADER TRACK */}
      <Navbar
        onNavClick={handleNavClick}
        activeSection={activeSection}
        onBookTeacherClick={() => setIsConsultationOpen(true)}
        onTeacherPortalClick={() => setIsTeacherPortalOpen(true)}
        onParentPortalClick={() => setIsParentPortalOpen(true)}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 sm:space-y-20">
        
        {/* HERO SECTION CONTAINER */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <span className="text-xs font-mono tracking-widest text-amber-900 uppercase block mb-3 font-bold">
              Qualified English & Literature Educator (B.Ed, Kabarak University)
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-stone-950 tracking-tight leading-tight mb-6 max-w-xl font-bold">
              English Language & Literature Private Tuition
            </h1>
            <p className="text-base text-stone-700 font-sans leading-relaxed max-w-xl mb-8">
              Interactive, student-centered 1-on-1 tuition for grammar, set book comprehension, essay drafting, and spoken English confidence. Tailored learning plans for CBC and 8-4-4 candidates in Nairobi & Kisii, or globally online.
            </p>

            {/* HERO ACTION BUTTON */}
            <div className="mb-8 w-full max-w-sm">
              <button 
                onClick={() => setIsConsultationOpen(true)}
                className="w-full bg-rose-700 hover:bg-rose-800 text-white font-sans font-bold px-8 py-4 rounded-xl transition-all shadow-md text-xs uppercase tracking-wider text-center active:scale-98 cursor-pointer flex items-center justify-center gap-2 h-14"
              >
                <span>Consult Teacher Brigid Today</span>
                <span className="text-base">→</span>
              </button>
            </div>
          </div>

          {/* EDITORIAL COLUMN: MEET YOUR TEACHER */}
          <div className="border border-stone-200/90 bg-white p-6 sm:p-7 rounded-2xl shadow-sm relative overflow-hidden">
            <span className="text-xs font-mono tracking-widest text-amber-900 uppercase block mb-3 font-bold">
              Your Professional Educator
            </span>
            
            {/* Profile Photo & Info Layout */}
            <div className="flex flex-col sm:flex-row items-center gap-5 mb-5">
              <div className="relative shrink-0">
                <img
                  src={teacherBrigidPhoto}
                  alt="Teacher Brigid Bwari Monari"
                  className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-2xl border-2 border-amber-400/90 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full border border-amber-400 shadow-sm">
                  <img
                    src={bbmLogo}
                    alt="BBM Seal Logo Badge"
                    className="w-8 h-8 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-serif text-stone-950 font-bold">Teacher Brigid Bwari</h3>
                <p className="text-xs font-mono text-amber-900 font-bold mt-1">B.Ed in English & Literature</p>
                <p className="text-xs text-stone-600 font-sans mt-1">Kabarak University (Second Class Upper)</p>
                <div className="mt-3 flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  <span className="text-[10px] font-mono bg-rose-100 text-rose-900 border border-rose-200 px-2 py-0.5 rounded-full font-bold">CBC & 8-4-4 Expert</span>
                  <span className="text-[10px] font-mono bg-stone-100 text-stone-800 border border-stone-300 px-2 py-0.5 rounded-full font-bold">1-on-1 Tuition</span>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/90 italic text-stone-800 text-xs leading-relaxed font-serif text-center mb-5">
              “My lessons are friendly, interactive, and structured to suit each learner's goals. I enjoy helping students build confidence to speak and write English naturally and clearly.”
            </div>

            {/* EMBEDDED INTRODUCTORY VIMEO VIDEO */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-amber-900 font-bold uppercase tracking-wider">
                <span>Featured Intro Video</span>
                <span className="text-stone-500 font-semibold">01:00</span>
              </div>
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-stone-300 shadow-md bg-stone-100">
                <iframe
                  title="Teacher Brigid Bwari Introduction Video"
                  src="https://player.vimeo.com/video/1189661015?h=8a7e047721"
                  className="absolute top-0 left-0 w-full h-full rounded-xl"
                  frameBorder="0"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* VERIFIED OUTCOMES REVIEWS MATRIX */}
        <section id="profile" className="scroll-mt-20">
          <Testimonials />
        </section>

        {/* CONVERSION BRIDGE */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="bg-[#0F1B2E] border border-stone-800 p-8 rounded-2xl shadow-md text-white">
            <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase block mb-2 font-bold">
              Interactive Enrollment
            </span>
            <h3 className="text-xl font-serif text-white mb-3 font-bold">
              Ready to Accelerate Your Child's Fluency & Grade?
            </h3>
            <p className="text-xs text-stone-300 font-sans max-w-lg mx-auto mb-6 leading-relaxed">
              Reserve your preferred timeslots below. The first diagnostic session hour is completely free upon booking.
            </p>
            <button 
              onClick={() => handleNavClick('placements')}
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-sans font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Book Direct Placement Allocation ↓
            </button>
          </div>
        </motion.section>

        {/* SCHEDULER & DISPATCHER */}
        <section id="placements" className="scroll-mt-24 max-w-6xl mx-auto">
          {bookingResult ? (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <span className="text-xs font-mono text-amber-900 font-bold uppercase">Interactive Placement Voucher</span>
              </div>
              <DocumentDispatcher 
                booking={bookingResult} 
                hours={hoursVolume} 
                onReset={() => setBookingResult(null)} 
              />
            </div>
          ) : (
            <InteractiveScheduler 
              onInitiateBooking={(hours, subject, slots, deliveryMode, monthlyPkg) => {
                setHoursVolume(hours);
                setSelectedSubject(subject);
                setSelectedSlots(slots);
                setSelectedDeliveryMode(deliveryMode);
                setIsMonthlyPackage(!!monthlyPkg);
                setIsCheckoutOpen(true);
              }}
            />
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-stone-800 bg-[#0F1B2E] py-10 font-sans text-stone-300 mt-20 no-print">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 bg-[#0F1B2E] p-6 sm:p-8 rounded-2xl border border-stone-800/80 shadow-md">
          
          {/* Top Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-800 text-center md:text-left">
            <div className="shrink-0">
              <span className="block font-serif text-lg font-bold tracking-tight text-white">Teacher Brigid Bwari Monari</span>
              <span className="block font-mono text-[10px] tracking-widest text-amber-400 font-bold uppercase mt-0.5">English & Literature Private Tuition</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setIsParentPortalOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800/90 px-4 py-2 text-xs font-bold text-stone-100 hover:bg-stone-700 transition-all cursor-pointer shadow-xs"
              >
                <BookOpen className="h-3.5 w-3.5 text-rose-400" />
                <span>Parent Progress Portal</span>
              </button>

              <button 
                onClick={() => setIsConsultationOpen(true)}
                className="group flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500 transition-all cursor-pointer shadow-xs"
              >
                <span>Schedule Consultation</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </button>
            </div>

            <div className="shrink-0">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setTimeout(() => setIsConsultationOpen(true), 400);
                }}
                className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-700 px-4 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer shadow-xs"
              >
                <span>Back to Top & Consult</span>
                <span className="text-amber-400 font-extrabold">↑</span>
              </button>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 text-xs text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-[11px] text-stone-400 font-medium">
              <p>© 2026 Teacher Brigid Bwari. All rights reserved.</p>
              <span className="hidden sm:inline text-stone-600">•</span>
              <p className="font-mono tracking-tight text-stone-400">Data Protection Act No. 24 of 2019 (Kenya)</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-stone-300 font-medium">
              <button onClick={() => openLegalTab('terms')} className="hover:text-white transition-colors cursor-pointer">
                Terms & Conditions
              </button>
              <span className="text-stone-600">•</span>
              <button onClick={() => openLegalTab('privacy')} className="hover:text-white transition-colors cursor-pointer">
                Privacy Policy
              </button>
              <span className="text-stone-600">•</span>
              <button onClick={() => openLegalTab('dataprotection')} className="hover:text-amber-400 font-bold transition-colors cursor-pointer">
                Data Protection (Kenya)
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* CONSULTATION MODAL */}
      <ConsultationModal 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />

      {/* TEACHER ADMINISTRATIVE PORTAL MODAL */}
      <TeacherPortalModal
        isOpen={isTeacherPortalOpen}
        onClose={() => setIsTeacherPortalOpen(false)}
      />

      {/* PARENT PORTAL MODAL */}
      <ParentPortalModal
        isOpen={isParentPortalOpen}
        onClose={() => setIsParentPortalOpen(false)}
        initialVoucherCode={bookingResult?.id}
      />

      {/* LEGAL TERMS & PRIVACY MODAL */}
      <TermsAndPrivacyModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        defaultTab={termsTab}
      />

      {/* TUITION PLACEMENT CONTRACT MODAL */}
      <LegalCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        hours={hoursVolume}
        subject={selectedSubject}
        selectedSlots={selectedSlots}
        deliveryMode={selectedDeliveryMode}
        isMonthlyPackage={isMonthlyPackage}
        onSuccess={(booking) => {
          setBookingResult(booking);
          setIsCheckoutOpen(false);
          setTimeout(() => {
            const element = document.getElementById('document-dispatcher-block');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }}
      />
      </div>
    </div>
  );
}
