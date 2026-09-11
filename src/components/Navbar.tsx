'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { OakLogo } from './OakLogo';
import { UserRole } from '@/lib/types';
import { UserCheck, RotateCcw } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { activeRole, setActiveRole, resetToInitialData } = useApp();

  return (
    <header className="sticky top-0 z-50 bg-[#162A48] border-b border-[#223B63] text-white shadow-md">
      {/* Figma Top Header: OAK Logo | PARTNER CONVENING 2026 */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Convening Title */}
        <Link href="/register" className="flex items-center gap-3 group">
          <div className="flex items-center">
            {/* OAK Logo in crisp white/light-blue */}
            <svg
              viewBox="0 0 160 50"
              className="h-9 w-auto"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="translate(4, 2)">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#FFFFFF" strokeWidth="3.5" />
                <path
                  d="M14 8 C16 11, 18 14, 15 18 C12 22, 10 24, 12 28 C15 27, 19 24, 19 20 C19 16, 17 12, 14 8 Z"
                  fill="#9CB4D8"
                />
                <path
                  d="M21 7 C24 9, 27 11, 29 15 C31 19, 28 23, 27 27 C30 25, 32 20, 32 15 C32 11, 29 7, 24 5 Z"
                  fill="#9CB4D8"
                />
              </g>
              <text
                x="48"
                y="33"
                fontFamily="'Cinzel', 'Georgia', serif"
                fontSize="32"
                fontWeight="700"
                fill="#FFFFFF"
                letterSpacing="1.5"
              >
                AK
              </text>
              <text
                x="4"
                y="46"
                fontFamily="'Cinzel', 'Georgia', serif"
                fontSize="8.5"
                fontWeight="600"
                fill="#CBD5E1"
                letterSpacing="4"
              >
                FOUNDATION
              </text>
            </svg>
          </div>

          <div className="h-6 w-px bg-white/20 mx-1" />

          <span className="text-xs sm:text-sm font-semibold tracking-wider text-slate-200 uppercase">
            Partner Convening 2026
          </span>
        </Link>

        {/* Role Switcher Pill Bar for Testing */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center bg-[#102038] rounded-xl p-1 border border-white/10 text-[11px]">
            <span className="text-slate-400 px-2 font-medium">Role:</span>
            {(['Partner', 'OAK Staff', 'Coordination Team', 'Presenter', 'Observer'] as UserRole[]).map(
              (r) => (
                <button
                  key={r}
                  onClick={() => setActiveRole(r)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    activeRole === r
                      ? 'bg-[#294B7D] text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {r}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => {
              if (confirm('Reset sample data to initial state?')) {
                resetToInitialData();
              }
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors border border-white/10"
            title="Reset Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
