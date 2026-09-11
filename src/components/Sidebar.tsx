'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { OakLogo } from './OakLogo';
import { UserRole } from '@/lib/types';
import {
  UserPlus,
  ScanLine,
  Calendar,
  Globe,
  BarChart3,
  MapPin,
  RotateCcw,
  UserCheck,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { activeRole, setActiveRole, canAccess, resetToInitialData } = useApp();

  const navItems = [
    {
      name: 'Register',
      href: '/register',
      icon: UserPlus,
      visible: true,
    },
    {
      name: 'Check In',
      href: '/check-in',
      icon: ScanLine,
      visible: canAccess('Check In Page'),
    },
    {
      name: 'Programme',
      href: '/program',
      icon: Calendar,
      visible: canAccess('Program Page'),
    },
    {
      name: 'Partners',
      href: '/partners',
      icon: Globe,
      visible: canAccess('Partners Page') || activeRole === 'Partner',
    },
    {
      name: 'Attendance',
      href: '/attendance',
      icon: BarChart3,
      visible: canAccess('Attendance Page'),
    },
  ];

  const visibleNav = navItems.filter((i) => i.visible);

  return (
    <aside className="hidden lg:flex w-64 shrink-0 bg-white border-r border-slate-200/90 flex-col justify-between min-h-screen p-6 sticky top-0 h-screen overflow-y-auto">
      {/* Sidebar Top: Logo & Title */}
      <div className="space-y-6">
        <div>
          <OakLogo size="sm" />
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-2.5">
            Partner Convening 2026
          </p>
        </div>

        {/* Navigation Items (Figma Sidebar Style) */}
        <nav className="space-y-1.5 pt-2">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href === '/register' && pathname === '/');

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#172A4A] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Role Persona Switcher for Evaluation */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Active Persona
            </span>
            <button
              onClick={() => {
                if (confirm('Reset sample data to initial state?')) {
                  resetToInitialData();
                }
              }}
              className="text-slate-400 hover:text-slate-700"
              title="Reset Sample Data"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            {(['Partner', 'OAK Staff', 'Coordination Team', 'Presenter', 'Observer'] as UserRole[]).map(
              (r) => (
                <button
                  key={r}
                  onClick={() => setActiveRole(r)}
                  className={`px-2.5 py-1.5 text-left rounded-xl text-[11px] font-semibold transition-all flex items-center justify-between ${
                    activeRole === r
                      ? 'bg-[#172A4A] text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <span>{r}</span>
                  {activeRole === r && <UserCheck className="w-3 h-3" />}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Bottom: Location Pin Info */}
      <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
          <MapPin className="w-4 h-4" />
        </div>
        <div className="leading-tight">
          <span className="block text-xs font-bold text-slate-800">
            Harare, Zimbabwe
          </span>
          <span className="block text-[10px] text-slate-400 font-medium">
            9-11 November 2026
          </span>
        </div>
      </div>
    </aside>
  );
};
