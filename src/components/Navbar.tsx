'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { OakLogo } from './OakLogo';
import { PageName, UserRole, ROLE_ACCESS_MATRIX } from '@/lib/types';
import {
  QrCode,
  CalendarDays,
  Building2,
  ScanLine,
  BarChart3,
  UserPlus,
  Menu,
  X,
  User,
  RotateCcw,
} from 'lucide-react';

interface NavItem {
  name: PageName;
  href: string;
  icon: React.ElementType;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { name: 'Registration', href: '/register', icon: UserPlus },
  { name: 'QR Code Page', href: '/qr-code', icon: QrCode },
  { name: 'Program Page', href: '/program', icon: CalendarDays },
  { name: 'Partners Page', href: '/partners', icon: Building2 },
  { name: 'Check In Page', href: '/check-in', icon: ScanLine },
  { name: 'Attendance Page', href: '/attendance', icon: BarChart3 },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { activeRole, setActiveRole, currentParticipant, resetToInitialData } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter visible tabs according to Role-Based Access Matrix
  const visibleNavItems = ALL_NAV_ITEMS.filter((item) => {
    return ROLE_ACCESS_MATRIX[item.name]?.[activeRole] ?? false;
  });

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner with Role Switcher & Event Info */}
      <div className="bg-[#0f284e] text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-blue-200 tracking-wide uppercase text-[11px]">
            OAK Foundation Event
          </span>
          <span className="hidden sm:inline text-blue-300/60">•</span>
          <span className="hidden sm:inline text-slate-300">
            9–11 November 2026 | Cresta Lodge, Msasa
          </span>
        </div>

        {/* Role Switcher Pill Bar for Testing */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-slate-300 text-[11px] font-medium hidden md:inline">
            Active Role:
          </span>
          <div className="flex items-center bg-[#193c6e] rounded-md p-0.5 border border-blue-400/20">
            {(['Partner', 'OAK Staff', 'Presenter', 'Observer', 'Coordination Team'] as UserRole[]).map(
              (role) => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                    activeRole === role
                      ? 'bg-white text-[#0f284e] font-semibold shadow-xs'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                  title={`Switch active persona to ${role}`}
                >
                  {role}
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
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Reset to Initial Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/register" className="flex items-center gap-3">
            <OakLogo size="sm" />
            <div className="border-l border-slate-200 pl-3 hidden sm:block">
              <span className="block text-[13px] font-bold text-slate-900 leading-tight">
                Event Attendance Platform
              </span>
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider">
                Registration & Check-In
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href === '/register' && pathname === '/');

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#163866] text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Status / Logged-in profile indicator */}
          <div className="hidden lg:flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1 text-xs">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold text-slate-800">
                {currentParticipant
                  ? `${currentParticipant.firstName} ${currentParticipant.lastName}`
                  : activeRole}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-100 text-blue-800 font-semibold">
                {activeRole}
              </span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <div className="px-3 py-2 bg-slate-50 rounded-lg text-xs text-slate-600 mb-2">
            Logged in as: <strong className="text-slate-900">{activeRole}</strong>
          </div>
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href === '/register' && pathname === '/');

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-[#163866] text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
