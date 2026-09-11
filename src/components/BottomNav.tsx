'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserPlus, ScanLine, Calendar, Globe, BarChart3 } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { activeRole, canAccess } = useApp();

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

  const visibleItems = navItems.filter((i) => i.visible);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
      <nav className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-slate-200/80 p-1.5 flex items-center justify-around">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href === '/register' && pathname === '/');

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'bg-slate-100 text-[#162A48] font-bold shadow-xs scale-102'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-[#162A48]' : 'text-slate-400'}`} />
              <span className="text-[10px] tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
