'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { AccessDenied } from '@/components/AccessDenied';
import { QRCodeCanvas } from 'qrcode.react';
import { EVENT_INFO } from '@/lib/types';
import { CheckCircle2, Download, RotateCcw } from 'lucide-react';

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

  const participant =
    participants.find((p) => p.id === selectedPartnerId) || partnerParticipants[0];

  // Role Access Guard: Available only to users registered as Partners
  if (!canAccess('QR Code Page')) {
    return <AccessDenied pageName="QR Code Page" />;
  }

  if (!participant) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md max-w-sm">
          <p className="text-slate-600 mb-4 text-xs">No Partner registration found.</p>
          <Link
            href="/register"
            className="px-4 py-2 bg-[#23416F] text-white rounded-xl text-xs font-semibold inline-block"
          >
            Register as Partner
          </Link>
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

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-md mx-auto space-y-4">
        {/* Figma Card 1: REGISTRATION COMPLETE Banner */}
        <div className="bg-gradient-to-br from-[#193257] via-[#162D4F] to-[#12243E] text-white rounded-3xl p-6 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="block text-[9.5px] font-bold tracking-widest text-blue-300 uppercase">
              Registration Complete
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight">
              You're Registered, {participant.firstName}!
            </h1>
            <p className="text-xs text-blue-200/80 font-medium mt-0.5">
              {participant.organization}
            </p>
          </div>
        </div>

        {/* Figma Card 2: YOUR ENTRY PASS (QR Code) */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200/80 p-6 text-center space-y-4">
          <span className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            Your Entry Pass
          </span>

          {/* QR Container */}
          <div className="bg-[#EEF3F8] rounded-3xl p-6 inline-block mx-auto border border-slate-200/60">
            <div ref={qrRef} className="bg-white p-3 rounded-2xl shadow-inner inline-block">
              <QRCodeCanvas
                value={qrValue}
                size={210}
                level="H"
                includeMargin={false}
                bgColor="#ffffff"
                fgColor="#162A48"
              />
            </div>
          </div>

          <div>
            <div className="font-mono text-xs font-bold text-slate-700 tracking-wider">
              {participant.qrCodeId || participant.registrationId}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
              Present at event entrance for check-in
            </p>
          </div>
        </div>

        {/* Figma Card 3: REGISTRATION DETAILS Table */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200/80 p-6 space-y-3 text-xs">
          <span className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-100 pb-2">
            Registration Details
          </span>

          <div className="space-y-2.5 pt-1 text-slate-700">
            <div className="flex justify-between items-center py-1 border-b border-slate-100/80">
              <span className="text-slate-500 font-medium">Name</span>
              <span className="font-bold text-slate-900 capitalize">
                {participant.firstName} {participant.lastName}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100/80">
              <span className="text-slate-500 font-medium">Organisation</span>
              <span className="font-bold text-slate-900">
                {participant.organization}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100/80">
              <span className="text-slate-500 font-medium">Role</span>
              <span className="font-bold text-slate-900">{participant.role}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100/80">
              <span className="text-slate-500 font-medium">Dates</span>
              <span className="font-bold text-slate-900">9-11 November 2026</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 font-medium">Location</span>
              <span className="font-bold text-slate-900">
                {EVENT_INFO.venue}, {EVENT_INFO.location}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: Download QR Code */}
        <div className="pt-2 space-y-3">
          <button
            onClick={handleDownloadPng}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#23416F] hover:bg-[#193257] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <Download className="w-4 h-4" />
            Download QR Code
          </button>

          {/* Sub-action: Register another attendee */}
          <div className="text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Register another attendee
            </Link>
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#162D4F]" />
        </div>
      }
    >
      <QrCodeContent />
    </Suspense>
  );
}
