'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { PageName, UserRole } from '@/lib/types';
import { ShieldAlert, ArrowLeft, UserCheck } from 'lucide-react';

interface AccessDeniedProps {
  pageName: PageName;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ pageName }) => {
  const { activeRole, setActiveRole } = useApp();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-amber-200 text-amber-600">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Restricted</h1>
        <p className="text-sm text-slate-600 mb-6">
          The <strong className="text-slate-900">{pageName}</strong> is not accessible to users with the role:{' '}
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
            {activeRole}
          </span>
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-left text-slate-600 mb-6">
          <p className="font-semibold text-slate-800 mb-2">Role-Based Access Rule:</p>
          <p>
            Per the OAK Foundation Event matrix, <strong>{pageName}</strong> is restricted.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/register"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#163866] text-white font-medium text-sm hover:bg-[#0f284e] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Registration
          </Link>

          <div className="pt-2 border-t border-slate-200">
            <p className="text-xs text-slate-500 mb-2">Test role switch for instructors/reviewers:</p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {(['Coordination Team', 'Partner', 'OAK Staff', 'Presenter', 'Observer'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                    activeRole === role
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <UserCheck className="w-3 h-3 inline mr-1" />
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
