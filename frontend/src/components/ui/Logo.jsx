import React from 'react';

/**
 * Eklavya Solutions brand mark.
 * Concept: a precision target (skill mastery) with an arrow breaking
 * through and rising (career direction / growth). Kept deliberately
 * simple - one mark, one gradient, no clutter.
 */
export default function Logo({ size = 32, withWordmark = true, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="eklavyaGrad" x1="4" y1="36" x2="36" y2="4" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3AA9FF" />
            <stop offset="1" stopColor="#7C6CF0" />
          </linearGradient>
        </defs>
        <circle cx="18" cy="22" r="15" stroke="url(#eklavyaGrad)" strokeWidth="2" opacity="0.35" />
        <circle cx="18" cy="22" r="10" stroke="url(#eklavyaGrad)" strokeWidth="2" opacity="0.6" />
        <circle cx="18" cy="22" r="4.5" fill="url(#eklavyaGrad)" />
        <path
          d="M8 34 L32 6"
          stroke="url(#eklavyaGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M32 6 L23 8.5 M32 6 L29.5 15"
          stroke="url(#eklavyaGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {withWordmark && (
        <span className="font-display font-semibold tracking-tight text-ink text-lg leading-none">
          Eklavya <span className="text-accent">Solutions</span>
        </span>
      )}
    </div>
  );
}
