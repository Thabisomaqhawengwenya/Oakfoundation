'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { AccessDenied } from '@/components/AccessDenied';
import { QRCodeCanvas } from 'qrcode.react';
import { EVENT_INFO } from '@/lib/types';
import {
  Download,
  Calendar,
  MapPin,
  Building2,
  User,
  ShieldCheck,
  CheckCircle,
  Share2,
  Sparkles,
} from 'lucide-react';

function QrCodeContent() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get('id');
  const { canAccess, participants, currentParticipant } = useApp();
  const qrRef = useRef<HTMLDivElement>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const partnerParticipants = participants.filter((p) => p.role === 'Partner');

  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(
    queryId || currentParticipant?.id || partnerParticipants[0]?.id || ''
  );

  useEffect(() => {
    if (queryId) {
      setSelectedPartnerId(queryId);
    } else if (currentParticipant && currentParticipant.role === 'Partner') {
      setSelectedPartnerId(currentParticipant.id);
    } else if (partnerParticipants.length > 0 && !selectedPartnerId) {
      setSelectedPartnerId(partnerParticipants[0].id);
    }
  }, [queryId, currentParticipant, partnerParticipants]);

  const participant = participants.find((p) => p.id === selectedPartnerId) || partnerParticipants[0];

  // Role Access Guard: Available only to users registered as Partners
  if (!canAccess('QR Code Page')) {
    return <AccessDenied pageName="QR Code Page" />;
  }

  if (!participant) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md max-w-md">
          <p className="text-slate-600 mb-4">No Partner registration found.</p>
          <a
            href="/register"
            className="px-4 py-2 bg-[#163866] text-white rounded-xl text-sm font-semibold inline-block"
          >
            Register as Partner
          </a>
        </div>
      </div>
    );
  }

  const qrValue = participant.qrCodeId || participant.registrationId;

  // Download QR Code as PNG Functionality
  const handleDownloadPng = () => {
    try {
      const canvas = qrRef.current?.querySelector('canvas');
      if (!canvas) {
        alert('QR canvas not ready. Please try again.');
        return;
      }
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `OAK_QR_${participant.firstName}_${participant.lastName}_${participant.registrationId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      alert('Error downloading QR Code.');
    }
  };

  const handleSaveToDevice = () => {
    handleDownloadPng();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Partner Selector (if multiple partners exist) */}
        {partnerParticipants.length > 1 && (
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-slate-700">Select Registered Partner Pass:</span>
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-900 bg-white font-medium focus:ring-2 focus:ring-[#163866] outline-none"
            >
              {partnerParticipants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} ({p.organization})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Digital Pass / QR Code Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
          {/* Header Banner */}
          <div className="bg-[#163866] text-white p-6 text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-blue-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Official Partner Entry Pass
            </div>
            <h1 className="text-2xl font-black tracking-tight">{EVENT_INFO.name}</h1>
            <p className="text-xs text-blue-200 mt-0.5">Attendance Verification Pass</p>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Participant Details Display */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-[#163866] flex items-center justify-center font-bold text-sm">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                    Participant Name
                  </span>
                  <span className="text-lg font-extrabold text-slate-900 leading-tight">
                    {participant.firstName} {participant.lastName}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Organization
                  </span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {participant.organization}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Registration ID
                  </span>
                  <span className="font-mono font-bold text-[#163866] bg-blue-50 px-2 py-0.5 rounded-md inline-block border border-blue-200">
                    {participant.registrationId}
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="text-center py-2">
              <div
                ref={qrRef}
                className="inline-block p-5 bg-white rounded-3xl border-4 border-[#163866]/15 shadow-inner"
              >
                <QRCodeCanvas
                  value={qrValue}
                  size={230}
                  level="H"
                  includeMargin={false}
                  bgColor="#ffffff"
                  fgColor="#0f284e"
                />
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-2 font-medium">
                QR ID: {qrValue}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Present this QR code at the door for rapid check-in entry.
              </p>
            </div>

            {/* Download Functionality */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleDownloadPng}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#163866] hover:bg-[#0f284e] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Download className="w-4 h-4" />
                Download QR Code as PNG
              </button>

              <button
                onClick={handleSaveToDevice}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5" />
                Save QR Code to Device
              </button>

              {downloadSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center justify-center gap-2 animate-in fade-in">
                  <CheckCircle className="w-4 h-4" />
                  QR Code saved to device successfully!
                </div>
              )}
            </div>

            {/* Event Reminder Information */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2.5 text-xs text-slate-700">
              <p className="font-bold text-slate-900 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#163866]" />
                Event Reminder Information
              </p>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-[#163866] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900">Event Dates:</span>{' '}
                  {EVENT_INFO.dates}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#163866] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900">Venue Information:</span>{' '}
                  {EVENT_INFO.venue}, {EVENT_INFO.location}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QrCodePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#163866]" />
        </div>
      }
    >
      <QrCodeContent />
    </Suspense>
  );
}
