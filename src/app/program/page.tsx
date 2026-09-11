'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AccessDenied } from '@/components/AccessDenied';
import { INITIAL_PROGRAM_SESSIONS } from '@/lib/mockData';
import { ProgramSession } from '@/lib/types';
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  FileText,
  Save,
  CheckCircle,
  Sparkles,
  ChevronRight,
  Info,
  Calendar,
} from 'lucide-react';

export default function ProgramPage() {
  const { canAccess, sessionNotes, saveSessionNote } = useApp();

  // Day filter: 1 (9 Nov), 2 (10 Nov), 3 (11 Nov) or All
  const [selectedDay, setSelectedDay] = useState<number>(1);

  // Selected Session for Details Modal / Drawer
  const [activeSession, setActiveSession] = useState<ProgramSession | null>(null);

  // Note editing state for active session
  const [currentNote, setCurrentNote] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Role Access Guard: OAK Staff, Presenters, Observers, Coordination Team
  if (!canAccess('Program Page')) {
    return <AccessDenied pageName="Program Page" />;
  }

  const filteredSessions =
    selectedDay === 0
      ? INITIAL_PROGRAM_SESSIONS
      : INITIAL_PROGRAM_SESSIONS.filter((s) => s.dayNumber === selectedDay);

  const handleOpenDetails = (session: ProgramSession) => {
    setActiveSession(session);
    setCurrentNote(sessionNotes[session.id] || '');
    setSaveSuccess(false);
  };

  const handleSaveNote = () => {
    if (!activeSession) return;
    saveSessionNote(activeSession.id, currentNote);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-[#163866] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-200">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                Official Event Schedule
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Program Page</h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 mt-1">
            Access the daily convening program, explore session details and speaker bios, and save personal notes.
          </p>

          {/* Day Tabs */}
          <div className="flex flex-wrap gap-2 mt-6">
            {[
              { day: 1, date: 'Day 1: Mon, 9 Nov 2026' },
              { day: 2, date: 'Day 2: Tue, 10 Nov 2026' },
              { day: 3, date: 'Day 3: Wed, 11 Nov 2026' },
              { day: 0, date: 'Full 3-Day Program' },
            ].map((tab) => (
              <button
                key={tab.day}
                onClick={() => setSelectedDay(tab.day)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedDay === tab.day
                    ? 'bg-white text-[#163866] shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {tab.date}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              {selectedDay === 0
                ? 'All Sessions (9–11 November 2026)'
                : `Day ${selectedDay} Sessions`}
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {filteredSessions.length} sessions listed
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredSessions.map((session) => {
              const hasNotes = Boolean(sessionNotes[session.id]?.trim());

              return (
                <div
                  key={session.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 font-bold text-[#163866] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                        <Clock className="w-3.5 h-3.5" />
                        {session.time}
                      </span>
                      <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {session.date}
                      </span>
                      <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {session.venue}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {session.sessionTitle}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Speaker: <strong className="text-slate-800">{session.speaker}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {hasNotes && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <FileText className="w-3 h-3" />
                        Notes Saved
                      </span>
                    )}

                    <button
                      onClick={() => handleOpenDetails(session)}
                      className="px-4 py-2.5 rounded-xl bg-[#163866] hover:bg-[#0f284e] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <span>Session Details & Notes</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Session Details & Notes Modal */}
      {activeSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  {activeSession.date} • {activeSession.time}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {activeSession.sessionTitle}
                </h3>
              </div>
              <button
                onClick={() => setActiveSession(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            {/* Session Description */}
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#163866]" />
                Session Description
              </h4>
              <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                {activeSession.sessionDescription}
              </p>
            </div>

            {/* Speaker Information */}
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#163866]" />
                Speaker Information
              </h4>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
                <p className="text-sm font-bold text-slate-900">{activeSession.speaker}</p>
                {activeSession.speakerRole && (
                  <p className="text-xs text-[#163866] font-semibold">{activeSession.speakerRole}</p>
                )}
                {activeSession.speakerBio && (
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {activeSession.speakerBio}
                  </p>
                )}
                <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Venue Location: <strong className="text-slate-700">{activeSession.venue}</strong>
                </div>
              </div>
            </div>

            {/* Notes Feature: Create personal notes, edit notes, save notes for each session */}
            <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Personal Session Notes
                </h4>
                {saveSuccess && (
                  <span className="text-emerald-700 font-bold text-xs flex items-center gap-1 animate-in fade-in">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Notes Saved!
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-[11px]">
                Type your personal notes and key takeaways for this session. Notes are automatically persisted.
              </p>
              <textarea
                rows={4}
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Write your notes here (e.g. key insights, questions for speaker, follow-up actions)..."
                className="w-full p-3.5 rounded-2xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#163866] outline-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSaveNote}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
