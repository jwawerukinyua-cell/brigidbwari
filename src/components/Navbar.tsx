/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, BookOpen, Calendar, Share2, Lock, Languages } from 'lucide-react';
import MKLogo from './MKLogo';

interface NavbarProps {
  onNavClick: (section: string) => void;
  activeSection: string;
  onBookTeacherClick?: () => void;
  onTeacherPortalClick?: () => void;
  onParentPortalClick?: () => void;
}

export default function Navbar({
  onNavClick,
  activeSection,
  onBookTeacherClick,
  onTeacherPortalClick,
  onParentPortalClick
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'profile', label: 'Profile' },
    { id: 'matrices', label: 'Verified Results' },
    { id: 'placements', label: 'Placement Planner' },
  ];

  const handleShare = async () => {
    const shareData = {
      title: 'Teacher Brigid Bwari - KCSE Private Tuition Planner',
      text: 'Interactive 1-on-1 English & Literature private tuition crafted by Teacher Brigid Bwari (B.Ed, Kabarak University).',
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Application link copied to clipboard!');
      }
    } catch (err) {
      console.log('Share failed', err);
    }
  };

  const handleBookClick = () => {
    if (onBookTeacherClick) {
      onBookTeacherClick();
    } else {
      onNavClick('placements');
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-stone-800 bg-[#0F1B2E] shadow-md backdrop-blur-md no-print text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavClick('profile')}>
            <MKLogo />
            <div>
              <span className="block font-serif text-sm sm:text-base font-bold tracking-tight text-white">Teacher Brigid Bwari</span>
              <span className="block font-mono text-[9px] sm:text-[10px] tracking-wider text-amber-400 uppercase font-bold leading-none">English & Literature Specialist</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className={`text-xs uppercase tracking-wider font-mono transition-colors duration-150 cursor-pointer ${
                  activeSection === item.id
                    ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5'
                    : 'text-stone-300 hover:text-white font-medium'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Share & Mobile Actions (Desktop/Tablet) */}
          <div className="hidden md:flex items-center gap-2.5">
            {onParentPortalClick && (
              <button
                onClick={onParentPortalClick}
                className="inline-flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-800/90 hover:bg-stone-700 px-3 py-1.5 text-xs font-mono text-stone-100 transition-all cursor-pointer font-medium"
                title="Parent Progress Portal"
              >
                <BookOpen className="h-3.5 w-3.5 text-rose-400" />
                <span>Parent Portal</span>
              </button>
            )}
            {onTeacherPortalClick && (
              <button
                onClick={onTeacherPortalClick}
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 text-xs font-mono text-amber-300 font-semibold transition-all cursor-pointer"
                title="Teacher Portal Login"
              >
                <Lock className="h-3.5 w-3.5 text-amber-400" />
                <span>Teacher Login</span>
              </button>
            )}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-800/90 hover:bg-stone-700 px-2.5 py-1.5 text-xs font-mono text-stone-200 transition-all cursor-pointer font-medium"
            >
              <Share2 className="h-3.5 w-3.5 text-amber-400" />
              <span>Share</span>
            </button>
            <button
              onClick={handleBookClick}
              className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Book Class</span>
            </button>
          </div>

          {/* Mobile Header Right Actions */}
          <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center p-2 rounded-lg border border-stone-700 bg-stone-800 text-amber-400 hover:bg-stone-700 transition-all cursor-pointer active:scale-95"
              title="Share Website"
              aria-label="Share Website"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleBookClick}
              className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Book</span>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-stone-800 bg-[#0F1B2E] px-3 pt-2 pb-4 space-y-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavClick(item.id);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-3 py-2.5 rounded-md text-xs font-mono uppercase tracking-wider ${
                activeSection === item.id
                  ? 'bg-rose-950/60 text-rose-300 font-bold border-l-2 border-rose-500'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 pb-1 border-t border-stone-800 px-1 space-y-2">
            <button
              onClick={() => {
                handleShare();
                setIsOpen(false);
              }}
              className="w-full bg-stone-800/90 hover:bg-stone-700 text-stone-200 border border-stone-700 py-2.5 rounded-xl text-center text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer font-medium"
            >
              <Share2 className="h-3.5 w-3.5 text-amber-400" />
              <span>Share Application Link</span>
            </button>
            {onParentPortalClick && (
              <button
                onClick={() => {
                  onParentPortalClick();
                  setIsOpen(false);
                }}
                className="w-full bg-stone-800/90 hover:bg-stone-700 text-stone-200 border border-stone-700 py-2.5 rounded-xl text-center text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer font-medium"
              >
                <BookOpen className="h-3.5 w-3.5 text-rose-400" />
                <span>Parent Progress Portal</span>
              </button>
            )}
            {onTeacherPortalClick && (
              <button
                onClick={() => {
                  onTeacherPortalClick();
                  setIsOpen(false);
                }}
                className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 py-2.5 rounded-xl text-center text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer font-semibold"
              >
                <Lock className="h-3.5 w-3.5 text-amber-400" />
                <span>Teacher Admin Portal</span>
              </button>
            )}
            <button
              onClick={() => {
                handleBookClick();
                setIsOpen(false);
              }}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Teacher Brigid</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
