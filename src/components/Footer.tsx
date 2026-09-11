import React from 'react';
import { OakLogo } from './OakLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div>
            <div className="bg-white/10 p-3 rounded-xl inline-block mb-3">
              <OakLogo className="text-white brightness-200" size="sm" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              OAK Foundation Event Attendance & Registration Platform.
              Supporting civil society partnerships, child protection, environment, and community impact.
            </p>
          </div>

          <div className="text-xs space-y-1.5 md:border-l md:border-slate-800 md:pl-8">
            <p className="font-semibold text-slate-200 text-sm mb-2">Event Information</p>
            <p><span className="text-slate-400">Event:</span> OAK Foundation Event</p>
            <p><span className="text-slate-400">Dates:</span> 9 November 2026 to 11 November 2026</p>
            <p><span className="text-slate-400">Venue:</span> Cresta Lodge, Msasa, Harare</p>
          </div>

          <div className="text-xs space-y-2 md:text-right">
            <p className="font-semibold text-slate-200 text-sm">Supported Roles</p>
            <p className="text-slate-400">Partner • OAK Staff • Coordination Team • Presenter • Observer</p>
            <p className="text-slate-500 pt-2 text-[11px]">
              © 2026 OAK Foundation. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
