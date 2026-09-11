'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AccessDenied } from '@/components/AccessDenied';
import { CameraQrScanner } from '@/components/CameraQrScanner';
import { Participant, InvalidQrReason } from '@/lib/types';
import {
  ScanLine,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  RotateCcw,
  User,
  Building2,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function CheckInPage() {
  const { canAccess, checkInParticipant, participants } = useApp();

  const [isProcessing, setIsProcessing] = useState(false);
  const [manualCode, setManualCode] = useState('');

  // Flow states: 'scanning' | 'success' | 'invalid'
  const [flowState, setFlowState] = useState<'scanning' | 'success' | 'invalid'>('scanning');

  // Successful scan data
  const [scannedParticipant, setScannedParticipant] = useState<Participant | null>(null);

  // Invalid scan data
  const [invalidReason, setInvalidReason] = useState<InvalidQrReason>('Invalid QR Code');
  const [errorMessage, setErrorMessage] = useState('');
  const [showManualSearchInput, setShowManualSearchInput] = useState(false);

  // Role Access Guard: Coordination Team only
  if (!canAccess('Check In Page')) {
    return <AccessDenied pageName="Check In Page" />;
  }

  const handleProcessScan = (codeOrId: string) => {
    setIsProcessing(true);
    const result = checkInParticipant(codeOrId);

    setTimeout(() => {
      setIsProcessing(false);
      if (result.success && result.participant) {
        setScannedParticipant(result.participant);
        setFlowState('success');
      } else {
        setInvalidReason(result.reason || 'Invalid QR Code');
        setErrorMessage(
          result.message || 'QR Code could not be validated against event database.'
        );
        setScannedParticipant(result.participant || null);
        setFlowState('invalid');
      }
    }, 400);
  };

  const handleReturnToScanner = () => {
    setFlowState('scanning');
    setScannedParticipant(null);
    setShowManualSearchInput(false);
    setManualCode('');
  };

  const handleManualSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleProcessScan(manualCode.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="bg-[#163866] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-200">
              <ScanLine className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                Coordination Team Portal
              </span>
              <h1 className="text-2xl font-black tracking-tight">Event Check In</h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 mt-1">
            Scan participant QR codes at the entry door to record attendance and update live headcounts.
          </p>
        </div>

        {/* ================= FLOW 1: SCANNING ================= */}
        {flowState === 'scanning' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">QR Scanner</h2>
                <p className="text-xs text-slate-500">
                  Align the participant's QR code within the frame to verify entry.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#163866] border border-blue-200">
                Live Camera
              </span>
            </div>

            {/* Camera Component */}
            <CameraQrScanner
              onScanSuccess={handleProcessScan}
              isProcessing={isProcessing}
            />

            {/* Manual Search & Quick Test Panel */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Manual Code Search & Test Simulation
                </span>
                <button
                  onClick={() => setShowManualSearchInput(!showManualSearchInput)}
                  className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1"
                >
                  <Search className="w-3.5 h-3.5" />
                  {showManualSearchInput ? 'Hide Search' : 'Manual Entry'}
                </button>
              </div>

              {/* Manual search input */}
              <form onSubmit={handleManualSearchSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Enter QR-ID, Reg-ID, or Name (e.g. QR-OAK-PARTNER-1001)"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-[#163866] outline-none"
                />
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2.5 bg-[#163866] text-white rounded-xl text-xs font-bold hover:bg-[#0f284e] transition-colors flex items-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  Verify
                </button>
              </form>

              {/* Quick test buttons for instant instructor testing */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
                <p className="font-semibold text-slate-700">Quick Test Actions:</p>
                <div className="flex flex-wrap gap-2">
                  {participants.slice(0, 3).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleProcessScan(p.qrCodeId || p.registrationId)}
                      className="px-2.5 py-1.5 bg-white border border-slate-300 hover:border-blue-500 rounded-lg text-slate-800 font-medium transition-all"
                    >
                      {p.firstName} ({p.role}) {p.attendanceStatus === 'Attended' ? '✓' : ''}
                    </button>
                  ))}
                  <button
                    onClick={() => handleProcessScan('INVALID-SAMPLE-QR-999')}
                    className="px-2.5 py-1.5 bg-red-50 border border-red-300 hover:bg-red-100 text-red-700 rounded-lg font-medium transition-all"
                  >
                    Test Invalid QR
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= FLOW 2: SUCCESSFUL SCAN FLOW ================= */}
        {flowState === 'success' && scannedParticipant && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-emerald-500 space-y-6 animate-in fade-in zoom-in-95">
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1 border border-emerald-200">
                Check In Verified
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                Participant Successfully Checked In
              </h2>
            </div>

            {/* Display Participant Information */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-[#163866] flex items-center justify-center font-bold text-base">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                    Full Name
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 leading-tight">
                    {scannedParticipant.firstName} {scannedParticipant.lastName}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Organization
                  </span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {scannedParticipant.organization}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Role
                  </span>
                  <span className="font-bold text-[#163866] bg-blue-50 px-2.5 py-0.5 rounded-md inline-block border border-blue-200 mt-0.5">
                    {scannedParticipant.role}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Registration Status
                  </span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block border border-emerald-200 mt-0.5">
                    {scannedParticipant.registrationStatus}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Check In Time
                  </span>
                  <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {scannedParticipant.checkInTime} ({scannedParticipant.checkInDate})
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Recorded Summary */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 space-y-1">
              <p className="font-bold">Automated System Actions Executed:</p>
              <p>✓ Participant marked as attended</p>
              <p>✓ Attendance timestamp recorded at {scannedParticipant.checkInTime}</p>
              <p>✓ Attendance records and live dashboard updated</p>
            </div>

            {/* Return action */}
            <button
              onClick={handleReturnToScanner}
              className="w-full py-4 px-6 rounded-2xl bg-[#163866] hover:bg-[#0f284e] text-white font-bold text-sm shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ScanLine className="w-4 h-4" />
              Scan Next Participant
            </button>
          </div>
        )}

        {/* ================= FLOW 3: INVALID QR CODE FLOW ================= */}
        {flowState === 'invalid' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-red-500 space-y-6 animate-in fade-in zoom-in-95">
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 ring-8 ring-red-50">
                <XCircle className="w-10 h-10" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-red-800 text-xs font-bold uppercase tracking-wider mb-1 border border-red-200">
                Verification Failed
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                QR Code Not Recognized
              </h2>
              <p className="text-xs text-red-600 mt-1 font-medium">{errorMessage}</p>
            </div>

            {/* Possible Reasons List as per spec */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-700 space-y-3">
              <p className="font-bold text-slate-900 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Possible Reasons:
              </p>
              <ul className="space-y-1.5 pl-4 list-disc text-slate-600">
                <li className={invalidReason === 'Invalid QR Code' ? 'font-bold text-red-600' : ''}>
                  Invalid QR Code (Not generated by this platform)
                </li>
                <li className={invalidReason === 'Duplicate QR Code' ? 'font-bold text-red-600' : ''}>
                  Duplicate QR Code (Participant has already checked in)
                </li>
                <li className={invalidReason === 'Network Error' ? 'font-bold text-red-600' : ''}>
                  Network Error
                </li>
                <li className={invalidReason === 'Corrupted QR Code' ? 'font-bold text-red-600' : ''}>
                  Corrupted QR Code
                </li>
                <li className={invalidReason === 'Participant Not Found' ? 'font-bold text-red-600' : ''}>
                  Participant Not Found
                </li>
              </ul>
            </div>

            {/* Available Actions as per spec: Retry Scan, Manual Search, Return to Scanner */}
            <div className="space-y-2.5">
              <button
                onClick={handleReturnToScanner}
                className="w-full py-3 px-4 rounded-xl bg-[#163866] hover:bg-[#0f284e] text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Retry Scan
              </button>

              <button
                onClick={() => {
                  setFlowState('scanning');
                  setShowManualSearchInput(true);
                }}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Manual Search
              </button>

              <button
                onClick={handleReturnToScanner}
                className="w-full py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-700 font-medium text-xs transition-colors"
              >
                Return to Scanner
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
