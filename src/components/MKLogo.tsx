import React from 'react';
import bbmLogo from '../assets/images/bbm_logo_1784836366300.jpg';

interface MKLogoProps {
  className?: string;
}

export default function MKLogo({ className = "h-10 w-10" }: MKLogoProps) {
  return (
    <div className={`relative inline-flex items-center justify-center bg-white rounded-full border border-amber-400/60 shadow-md overflow-hidden shrink-0 ${className}`}>
      <img
        src={bbmLogo}
        alt="BBM English Tutor Seal Logo"
        className="h-full w-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}


