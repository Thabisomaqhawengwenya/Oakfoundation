'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { AccessDenied } from '@/components/AccessDenied';
import { UserRole, AttendanceStatus, Participant } from '@/lib/types';
import {
  BarChart3,
  Users,
  UserCheck,
  Percent,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Building,
  RotateCcw,
  Check,
  X,
  FileSpreadsheet,
} from 'lucide-react';

export default function AttendancePage() {
  const { canAccess, participants, manualCheckInToggle } = useApp();

  // Search and Filters
  const [nameQuery, setNameQuery] = useState('');
  const [organizationFilter, setOrganizationFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Role Access Guard: Coordination Team only
  if (!canAccess('Attendance Page')) {
    return <AccessDenied pageName="Attendance Page" />;
  }

  // Dashboard Statistics
  const totalRegistered = participants.length;
  const totalAttendees = participants.filter((p) => p.attendanceStatus === 'Attended').length;
  const attendancePercentage =
    totalRegistered > 0 ? Math.round((totalAttendees / totalRegistered) * 100) : 0;

  // Role Breakdown counts
  const roleCounts: Record<UserRole, { total: number; attended: number }> = {
    'Partner': {
      total: participants.filter((p) => p.role === 'Partner').length,
      attended: participants.filter((p) => p.role === 'Partner' && p.attendanceStatus === 'Attended').length,
    },
    'OAK Staff': {
      total: participants.filter((p) => p.role === 'OAK Staff').length,
      attended: participants.filter((p) => p.role === 'OAK Staff' && p.attendanceStatus === 'Attended').length,
    },
    'Coordination Team': {
      total: participants.filter((p) => p.role === 'Coordination Team').length,
      attended: participants.filter((p) => p.role === 'Coordination Team' && p.attendanceStatus === 'Attended').length,
    },
    'Presenter': {
      total: participants.filter((p) => p.role === 'Presenter').length,
      attended: participants.filter((p) => p.role === 'Presenter' && p.attendanceStatus === 'Attended').length,
    },
    'Observer': {
      total: participants.filter((p) => p.role === 'Observer').length,
      attended: participants.filter((p) => p.role === 'Observer' && p.attendanceStatus === 'Attended').length,
    },
  };

  // Distinct organizations list for filter
  const organizationsList = useMemo(() => {
    const orgs = new Set<string>();
    participants.forEach((p) => {
      if (p.organization) orgs.add(p.organization);
    });
    return Array.from(orgs).sort();
  }, [participants]);

  // Filtered Participant List
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      // Name filter
      if (nameQuery.trim()) {
        const full = `${p.firstName} ${p.lastName}`.toLowerCase();
        if (!full.includes(nameQuery.trim().toLowerCase())) {
          return false;
        }
      }

      // Organization filter
      if (organizationFilter && organizationFilter !== 'All') {
        if (p.organization !== organizationFilter) {
          return false;
        }
      }

      // Role filter
      if (roleFilter && roleFilter !== 'All') {
        if (p.role !== roleFilter) {
          return false;
        }
      }

      // Attendance Status filter
      if (statusFilter && statusFilter !== 'All') {
        if (p.attendanceStatus !== statusFilter) {
          return false;
        }
      }

      return true;
    });
  }, [participants, nameQuery, organizationFilter, roleFilter, statusFilter]);

  // Export CSV Helper
  const handleExportCsv = () => {
    const headers = [
      'Full Name',
      'Organization',
      'Role',
      'Registration ID',
      'Registration Date',
      'Attendance Status',
      'Check In Time',
      'Dietary Requirements',
      'Accessibility Requirements',
      'Accommodation Requirements',
    ];

    const rows = filteredParticipants.map((p) => [
      `"${p.firstName} ${p.lastName}"`,
      `"${p.organization}"`,
      `"${p.role}"`,
      `"${p.registrationId}"`,
      `"${p.registrationDate}"`,
      `"${p.attendanceStatus}"`,
      `"${p.checkInTime || 'N/A'}"`,
      `"${p.dietaryRequirements}"`,
      `"${p.accessibilityRequirements}"`,
      `"${p.accommodationRequirements}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `OAK_Event_Attendance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-[#163866] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
              Coordination Team Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Attendance Page</h1>
            <p className="text-xs sm:text-sm text-slate-200">
              Real-time tracking of registration and event attendance statistics for OAK Foundation Event.
            </p>
          </div>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            Export CSV
          </button>
        </div>

        {/* Dashboard Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Total Registered Participants */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Registered
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#163866] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{totalRegistered}</div>
            <p className="text-xs text-slate-500 mt-1">All registered participants</p>
          </div>

          {/* Total Attendees */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Attendees
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-600">{totalAttendees}</div>
            <p className="text-xs text-slate-500 mt-1">Successfully checked in today</p>
          </div>

          {/* Attendance Percentage */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Attendance Rate
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Percent className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{attendancePercentage}%</div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${attendancePercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Role Breakdown Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Role Breakdown</h2>
              <p className="text-xs text-slate-500">
                Participant counts by role and verified check-in status.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {(Object.keys(roleCounts) as UserRole[]).map((r) => {
              const data = roleCounts[r];
              const pct = data.total > 0 ? Math.round((data.attended / data.total) * 100) : 0;
              return (
                <div
                  key={r}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2"
                >
                  <span className="text-xs font-bold text-slate-800 block truncate">{r}</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-black text-slate-900">{data.attended}</span>
                    <span className="text-xs text-slate-500">/ {data.total}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span>{pct}% checked in</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Participant List & Search & Filters */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-6 pb-2 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Participant List</h2>
            <p className="text-xs text-slate-500">
              Showing {filteredParticipants.length} of {participants.length} registered participants.
            </p>

            {/* Filters Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              {/* Name Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={nameQuery}
                  onChange={(e) => setNameQuery(e.target.value)}
                  placeholder="Filter by Name..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#163866] outline-none"
                />
              </div>

              {/* Organization Filter */}
              <div>
                <select
                  value={organizationFilter}
                  onChange={(e) => setOrganizationFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#163866] outline-none text-slate-800 bg-white"
                >
                  <option value="All">All Organizations</option>
                  {organizationsList.map((org) => (
                    <option key={org} value={org}>
                      {org}
                    </option>
                  ))}
                </select>
              </div>

              {/* Role Filter */}
              <div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#163866] outline-none text-slate-800 bg-white"
                >
                  <option value="All">All Roles</option>
                  <option value="Partner">Partner</option>
                  <option value="OAK Staff">OAK Staff</option>
                  <option value="Coordination Team">Coordination Team</option>
                  <option value="Presenter">Presenter</option>
                  <option value="Observer">Observer</option>
                </select>
              </div>

              {/* Attendance Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#163866] outline-none text-slate-800 bg-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Attended">Attended</option>
                  <option value="Not Attended">Not Attended</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                  <th className="px-6 py-3.5">Full Name</th>
                  <th className="px-6 py-3.5">Organization</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Registration Date</th>
                  <th className="px-6 py-3.5">Attendance Status</th>
                  <th className="px-6 py-3.5">Check In Time</th>
                  <th className="px-6 py-3.5 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredParticipants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      No participants match the specified search and filters.
                    </td>
                  </tr>
                ) : (
                  filteredParticipants.map((p) => {
                    const isAttended = p.attendanceStatus === 'Attended';
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {p.firstName} {p.lastName}
                          <span className="block font-mono text-[10px] text-slate-400 font-normal">
                            {p.registrationId}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-medium">
                          {p.organization}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-[#163866] border border-blue-200 inline-block">
                            {p.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-mono">
                          {p.registrationDate}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold ${
                              isAttended
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {isAttended ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <X className="w-3 h-3 text-slate-400" />
                            )}
                            {p.attendanceStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-700">
                          {p.checkInTime ? (
                            <span className="text-emerald-800 font-medium">
                              {p.checkInTime}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => manualCheckInToggle(p.id)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                              isAttended
                                ? 'bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200'
                                : 'bg-[#163866] hover:bg-[#0f284e] text-white shadow-xs'
                            }`}
                          >
                            {isAttended ? 'Undo Check-in' : 'Manual Check-in'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
