/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, Share2, Printer, RefreshCw, MessageSquare, Award, ShieldAlert } from 'lucide-react';
import { BookingData, getCommissionBreakdown } from '../lib/bookingSystem';

interface DocumentDispatcherProps {
  booking: BookingData;
  hours: number;
  onReset: () => void;
}

export default function DocumentDispatcher({ booking, hours, onReset }: DocumentDispatcherProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareText = `KCSE Tuition Placement Registered!\nID: ${booking.id}\nStudent: ${booking.studentName}\nTrack: ${booking.subject}\nHours: ${booking.hours} hours/week\nWeekly Ledger: KES ${booking.totalCost.toLocaleString()}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Tuition Placement Registered',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('Voucher data copied to clipboard!');
    }
  };

  return (
    <div id="document-dispatcher-block" className="space-y-6">
      {/* Success Jumbotron Header */}
      <div className="bg-gradient-to-br from-teal-950/40 to-stone-900 border border-teal-800/60 rounded-2xl p-6 text-center space-y-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal-950 border border-teal-400 text-teal-400">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-teal-400 uppercase block font-semibold">
            Registration Successful
          </span>
          <h3 className="text-xl font-serif text-stone-100 font-bold">
            Tuition Placement Voucher Generated
          </h3>
        </div>
        <p className="text-xs text-stone-300 max-w-lg mx-auto leading-relaxed">
          Your reservation has been locked into Teacher Brigid Bwari's official calendar. Please find your secure direct private ledger voucher details below.
        </p>
      </div>

      {/* Voucher Box */}
      <div className="bg-stone-950 border-2 border-dashed border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden font-mono text-xs">
        {/* Subtle Watermark */}
        <div className="absolute right-4 top-4 opacity-10 select-none pointer-events-none">
          <Award className="h-28 w-28 text-amber-500" />
        </div>

        {/* Voucher Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-800 pb-4">
          <div>
            <span className="block font-serif text-sm font-semibold tracking-tight text-stone-100">Teacher Brigid Bwari Tuition</span>
            <span className="block text-[9px] text-stone-500 mt-0.5">Nairobi / Kisii / Online</span>
          </div>
          <div className="text-left sm:text-right">
            <span className="block text-[9px] text-stone-500">VOUCHER NUMBER</span>
            <span className="block font-bold text-amber-500">{booking.id}</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <div className="space-y-1">
            <span className="text-stone-500 block text-[10px] uppercase">Parent/Guardian:</span>
            <span className="text-stone-200 font-sans text-sm font-bold block">{booking.parentName}</span>
          </div>
          <div className="space-y-1">
            <span className="text-stone-500 block text-[10px] uppercase">Candidate Student:</span>
            <span className="text-stone-200 font-sans text-sm font-bold block">{booking.studentName}</span>
          </div>
          <div className="space-y-1">
            <span className="text-stone-500 block text-[10px] uppercase">Class Delivery Mode:</span>
            <span className="text-teal-300 font-bold block">
              {booking.deliveryMode === 'Online Virtual Classroom' ? '💻 Online Virtual Classroom' : '📍 In-Person Home Visit'}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-stone-500 block text-[10px] uppercase">Subject Track:</span>
            <span className="text-teal-400 block">{booking.subject}</span>
          </div>
          <div className="space-y-1">
            <span className="text-stone-500 block text-[10px] uppercase">Billed Volume:</span>
            <span className="text-stone-200 block">{booking.hours} Hours / Week</span>
          </div>
          <div className="sm:col-span-2 space-y-1">
            <span className="text-stone-500 block text-[10px] uppercase">Location / Pin / Landmark:</span>
            <span className="text-stone-200 font-sans text-xs block">{booking.location}</span>
          </div>
          <div className="sm:col-span-2 space-y-1">
            <span className="text-stone-500 block text-[10px] uppercase">Confirmed Timeslots:</span>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {booking.selectedSlots.map((slot, index) => (
                <span key={index} className="bg-stone-900 border border-stone-800 text-[10px] px-2 py-0.5 rounded text-stone-300">
                  {slot}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-stone-500 block text-[10px] uppercase">Contact Phone:</span>
            <span className="text-stone-200 block">{booking.parentPhone}</span>
          </div>
          <div className="space-y-1">
            <span className="text-stone-500 block text-[10px] uppercase">Creation Timestamp:</span>
            <span className="text-stone-400 block">{booking.dateCreated}</span>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="border-t border-b border-stone-800 py-4">
          <div className="flex justify-between items-baseline">
            <span className="text-stone-400 font-semibold uppercase text-xs">Total Billed Tuition Fee:</span>
            <span className="text-xl font-serif font-bold text-amber-500">KES {booking.totalCost.toLocaleString()}</span>
          </div>
        </div>

        {/* Next Steps Directives */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-stone-300 text-[11px] font-semibold">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-amber-500" />
              <span>M-PESA / PLATFORM ESCROW ACTIVATION INSTRUCTIONS</span>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded">
              Verified Voucher
            </span>
          </div>
          <div className="bg-stone-900/60 border border-amber-500/30 p-4 rounded-xl font-sans text-stone-300 text-xs leading-relaxed space-y-2">
            <p>
              To activate this placement voucher and lock tuition slots on Teacher Brigid's calendar, send the tuition fee of <strong className="text-amber-500 font-bold">KES {booking.totalCost.toLocaleString()}</strong> via M-PESA Pochi La Biashara to <strong className="text-teal-300 font-mono">+254 703 848 313</strong>.
            </p>
            <p className="text-[11px] font-mono text-stone-400 bg-stone-950 p-2 rounded border border-stone-800">
              <span className="text-amber-400 font-bold">M-PESA Reference / Note:</span> Enter Voucher Code <strong className="text-teal-300 font-bold">{booking.id}</strong> in your transaction message.
            </p>
          </div>
        </div>

        {/* Signature Area */}
        <div className="pt-4 flex justify-between items-end border-t border-stone-900 text-[10px]">
          <div>
            <span className="text-stone-600 block">DIGITAL SECURE SEAL</span>
            <span className="text-teal-500 font-bold block">DISPATCHED BY PRIVATE CLOUD</span>
          </div>
          <div className="text-right">
            <span className="text-stone-500 block">Teacher Brigid Bwari</span>
            <span className="text-stone-300 italic font-serif block">B. Bwari</span>
          </div>
        </div>
      </div>

      {/* Action triggers */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleShare}
          className="flex-1 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 font-sans font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
        >
          <Share2 className="h-4 w-4 text-amber-500" />
          <span>Share Voucher</span>
        </button>
        <button
          onClick={handlePrint}
          className="flex-1 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 font-sans font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
        >
          <Printer className="h-4 w-4 text-amber-500" />
          <span>Print / Save PDF</span>
        </button>
        <a
          href={`https://wa.me/254703848313?text=${encodeURIComponent(
            `Hi Teacher Brigid, I've registered placement voucher ${booking.id} for ${booking.studentName}${
              booking.schoolName && !booking.studentName.includes(booking.schoolName)
                ? ` (${booking.schoolName})`
                : ''
            }. Please coordinate the first session.`
          )}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 bg-teal-600 hover:bg-teal-500 text-stone-950 font-sans font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-center"
        >
          <MessageSquare className="h-4 w-4" />
          <span>WhatsApp Teacher Brigid</span>
        </a>
      </div>

      {/* Reset */}
      <div className="text-center pt-2">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-[11px] font-mono text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Configure a New Placements Schedule</span>
        </button>
      </div>
    </div>
  );
}
