'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/lib/types';
import { Users, Calendar, Building2, ChevronDown, Mail, Check } from 'lucide-react';

const ROLES: UserRole[] = [
  'Partner',
  'OAK Staff',
  'Coordination Team',
  'Presenter',
  'Observer',
];

export default function RegistrationPage() {
  const router = useRouter();
  const { registerParticipant } = useApp();

  // Form Fields strictly matching Figma spec
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organization, setOrganization] = useState('');
  const [subPartnerProgramArea, setSubPartnerProgramArea] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dietaryRequirements, setDietaryRequirements] = useState('');
  const [accessibilityRequirements, setAccessibilityRequirements] = useState('');
  const [travelRequirements, setTravelRequirements] = useState('');
  const [accommodationRequirements, setAccommodationRequirements] = useState('');
  const [consentGiven, setConsentGiven] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [registeredResult, setRegisteredResult] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      alert('Please select your role / capacity.');
      return;
    }
    if (!consentGiven) {
      alert('Please accept the consent agreement before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = registerParticipant({
        firstName,
        lastName,
        organization,
        subPartnerProgramArea: subPartnerProgramArea || undefined,
        role: role as UserRole,
        email,
        phoneNumber,
        dietaryRequirements: dietaryRequirements || 'None',
        accessibilityRequirements: accessibilityRequirements || 'None',
        travelRequirements: travelRequirements || 'None',
        accommodationRequirements: accommodationRequirements || 'None',
      });

      setRegisteredResult(result);

      if (role === 'Partner') {
        setShowEmailModal(true);
      } else {
        router.push(result.redirectUrl);
      }
    } catch (err) {
      console.error(err);
      alert('Registration failed. Please check your fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-5">
        {/* Figma Hero Card */}
        <div className="bg-gradient-to-br from-[#193257] via-[#162D4F] to-[#12243E] text-white rounded-3xl p-6 sm:p-7 shadow-xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1">
            Partner<br />Convening 2026
          </h1>
          <p className="text-xs text-blue-200/90 font-medium">
            Harare · 9-11 November 2026
          </p>
        </div>

        {/* 3 Quick Stat Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 text-center">
            <Users className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
            <div className="text-lg font-black text-slate-900 leading-tight">110+</div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">Attendees</div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 text-center">
            <Calendar className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
            <div className="text-lg font-black text-slate-900 leading-tight">24</div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">Sessions</div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 text-center">
            <Building2 className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
            <div className="text-lg font-black text-slate-900 leading-tight">38</div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">Partners</div>
          </div>
        </div>

        {/* Registration Form Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200/80 p-6 sm:p-7">
          <h2 className="text-lg font-extrabold text-slate-900 mb-5">
            Registration Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* FIRST NAME & LAST NAME */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-600 uppercase mb-1.5">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Maria"
                  className="w-full px-3.5 py-3 rounded-xl bg-[#EEF3F8] border border-transparent focus:border-[#162D4F] text-slate-900 text-xs font-medium focus:bg-white transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-600 uppercase mb-1.5">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Schmidt"
                  className="w-full px-3.5 py-3 rounded-xl bg-[#EEF3F8] border border-transparent focus:border-[#162D4F] text-slate-900 text-xs font-medium focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            {/* ORGANISATION */}
            <div>
              <label className="block text-[10px] font-bold tracking-wider text-slate-600 uppercase mb-1.5">
                Organisation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Your organisation name"
                className="w-full px-3.5 py-3 rounded-xl bg-[#EEF3F8] border border-transparent focus:border-[#162D4F] text-slate-900 text-xs font-medium focus:bg-white transition-all outline-none"
              />
            </div>

            {/* SUB-PARTNER / PROGRAMME AREA */}
            <div>
              <label className="block text-[10px] font-bold tracking-wider text-slate-600 uppercase mb-1.5">
                Sub-Partner / Programme Area
              </label>
              <input
                type="text"
                value={subPartnerProgramArea}
                onChange={(e) => setSubPartnerProgramArea(e.target.value)}
                placeholder="Optional"
                className="w-full px-3.5 py-3 rounded-xl bg-[#EEF3F8] border border-transparent focus:border-[#162D4F] text-slate-900 text-xs font-medium focus:bg-white transition-all outline-none"
              />
            </div>

            {/* ROLE / CAPACITY with Custom Figma Dropdown */}
            <div className="relative">
              <label className="block text-[10px] font-bold tracking-wider text-slate-600 uppercase mb-1.5">
                Role / Capacity <span className="text-red-500">*</span>
              </label>

              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="w-full px-3.5 py-3 rounded-xl bg-[#EEF3F8] border border-transparent focus:border-[#162D4F] text-slate-900 text-xs font-medium flex items-center justify-between outline-none cursor-pointer"
              >
                <span className={role ? 'font-semibold text-slate-900' : 'text-slate-500'}>
                  {role || 'Select your role'}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    isRoleDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Opened Dropdown List Matching Figma Screenshot */}
              {isRoleDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-1.5 space-y-1">
                  <div className="bg-[#172A4A] text-white px-3 py-2 rounded-xl text-xs font-bold">
                    Select your role
                  </div>
                  {ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setRole(r);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                        role === r
                          ? 'bg-blue-50 text-[#172A4A] font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{r}</span>
                      {role === r && <Check className="w-3.5 h-3.5 text-[#172A4A]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* EMAIL ADDRESS */}
            <div>
              <label className="block text-[10px] font-bold tracking-wider text-slate-600 uppercase mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@organisation.org"
                className="w-full px-3.5 py-3 rounded-xl bg-[#EEF3F8] border border-transparent focus:border-[#162D4F] text-slate-900 text-xs font-medium focus:bg-white transition-all outline-none"
              />
            </div>

            {/* PHONE NUMBER */}
            <div>
              <label className="block text-[10px] font-bold tracking-wider text-slate-600 uppercase mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+41 xx xxx xx xx"
                className="w-full px-3.5 py-3 rounded-xl bg-[#EEF3F8] border border-transparent focus:border-[#162D4F] text-slate-900 text-xs font-medium focus:bg-white transition-all outline-none"
              />
            </div>

            {/* Figma Nested Box: REQUIREMENTS */}
            <div className="bg-[#EEF3F8] rounded-2xl p-4 space-y-3.5 border border-slate-200/60">
              <span className="block text-[9.5px] font-bold tracking-widest text-slate-500 uppercase">
                Requirements
              </span>

              {/* DIETARY REQUIREMENTS */}
              <div>
                <label className="block text-[9.5px] font-bold tracking-wider text-slate-600 uppercase mb-1">
                  Dietary Requirements
                </label>
                <input
                  type="text"
                  value={dietaryRequirements}
                  onChange={(e) => setDietaryRequirements(e.target.value)}
                  placeholder="e.g. Vegetarian, Halal, Gluten-free"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/80 text-slate-900 text-xs focus:border-[#162D4F] transition-all outline-none"
                />
              </div>

              {/* ACCESSIBILITY REQUIREMENTS */}
              <div>
                <label className="block text-[9.5px] font-bold tracking-wider text-slate-600 uppercase mb-1">
                  Accessibility Requirements
                </label>
                <input
                  type="text"
                  value={accessibilityRequirements}
                  onChange={(e) => setAccessibilityRequirements(e.target.value)}
                  placeholder="e.g. Wheelchair access, hearing loop"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/80 text-slate-900 text-xs focus:border-[#162D4F] transition-all outline-none"
                />
              </div>

              {/* TRAVEL & ACCOMMODATION */}
              <div>
                <label className="block text-[9.5px] font-bold tracking-wider text-slate-600 uppercase mb-1">
                  Travel & Accommodation
                </label>
                <input
                  type="text"
                  value={travelRequirements}
                  onChange={(e) => setTravelRequirements(e.target.value)}
                  placeholder="e.g. Flight from London, hotel needed"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/80 text-slate-900 text-xs focus:border-[#162D4F] transition-all outline-none"
                />
              </div>
            </div>

            {/* Consent Statement Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#162D4F] focus:ring-[#162D4F] border-slate-300"
                />
                <span className="text-[11px] text-slate-600 leading-tight">
                  I agree to OAK Foundation's{' '}
                  <span className="text-[#162D4F] font-semibold underline">privacy policy</span>{' '}
                  and consent to my registration data being used for event coordination.
                </span>
              </label>
            </div>

            {/* Register Action Button: exact "Register" text matching screenshot */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#172A4A] hover:bg-[#112037] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </div>

            {/* GDPR Disclaimer Footer */}
            <p className="text-[10px] text-slate-400 text-center pt-2 leading-relaxed">
              Your data is secured and handled by OAK Foundation in accordance with GDPR.
            </p>
          </form>
        </div>
      </div>

      {/* Confirmation Email Modal */}
      {showEmailModal && registeredResult && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto border border-emerald-200">
              <Mail className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Confirmation Email Sent
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">
                You're Registered, {registeredResult.participant.firstName}!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your entry pass with unique QR Code is ready.
              </p>
            </div>

            <button
              onClick={() => {
                setShowEmailModal(false);
                router.push(registeredResult.redirectUrl);
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#172A4A] hover:bg-[#112037] text-white font-bold text-xs transition-colors"
            >
              View Entry Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
