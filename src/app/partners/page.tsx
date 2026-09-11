'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AccessDenied } from '@/components/AccessDenied';
import { INITIAL_PARTNERS } from '@/lib/mockData';
import { PartnerOrganization } from '@/lib/types';
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Tag,
  Briefcase,
  Users,
} from 'lucide-react';

export default function PartnersPage() {
  const { canAccess } = useApp();
  const [selectedPartner, setSelectedPartner] = useState<PartnerOrganization | null>(null);

  // Role Access Guard: OAK Staff, Partners, Presenters, Observers, Coordination Team
  if (!canAccess('Partners Page')) {
    return <AccessDenied pageName="Partners Page" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-[#163866] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-200">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                Convening Directory
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Partners Page</h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl">
            Showcasing participating partner organizations and sub-partners supported by the OAK Foundation.
            Tap on any organization to view their full profile and areas of work.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INITIAL_PARTNERS.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
              onClick={() => setSelectedPartner(partner)}
            >
              <div className="space-y-4">
                {/* Header with Logo & Name */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-[#163866] flex items-center justify-center font-bold text-xl shrink-0 group-hover:bg-[#163866] group-hover:text-white transition-colors">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#163866] transition-colors leading-tight">
                      {partner.name}
                    </h2>
                    <a
                      href={partner.websiteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-semibold mt-1"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      {partner.websiteLink.replace(/^https?:\/\//, '')}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Organization Description */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {partner.description}
                </p>

                {/* Areas of Work Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {partner.areasOfWork.map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md"
                    >
                      <Tag className="w-3 h-3 text-slate-400" />
                      {area}
                    </span>
                  ))}
                </div>

                {/* Contact Information */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{partner.contactInformation.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{partner.contactInformation.phone}</span>
                  </div>
                </div>
              </div>

              {/* View Details Action */}
              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-[#163866] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Full Partner Profile
                  <ChevronRight className="w-4 h-4" />
                </span>
                <span className="text-[11px] text-slate-400">Tap card to expand</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Partner Details Page / Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#163866] flex items-center justify-center font-bold text-xl border border-blue-200 shrink-0">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                    OAK Partner Details
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    {selectedPartner.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedPartner(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            {/* Full Profile */}
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#163866]" />
                Full Profile
              </h4>
              <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                {selectedPartner.fullProfile}
              </p>
            </div>

            {/* Organization Overview */}
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-[#163866]" />
                Organization Overview
              </h4>
              <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                {selectedPartner.organizationOverview}
              </p>
            </div>

            {/* Areas of Work */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-[#163866]" />
                Areas of Work
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedPartner.areasOfWork.map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#163866]" />
                Contact Details
              </h4>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Email
                  </span>
                  <a
                    href={`mailto:${selectedPartner.contactInformation.email}`}
                    className="text-blue-700 font-medium hover:underline"
                  >
                    {selectedPartner.contactInformation.email}
                  </a>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Phone
                  </span>
                  <span className="text-slate-800 font-medium">
                    {selectedPartner.contactInformation.phone}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Website
                  </span>
                  <a
                    href={selectedPartner.websiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 font-medium hover:underline flex items-center gap-1"
                  >
                    {selectedPartner.websiteLink}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {selectedPartner.contactInformation.address && (
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                      Location / Address
                    </span>
                    <span className="text-slate-800 font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {selectedPartner.contactInformation.address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
