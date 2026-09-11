'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserRole, EVENT_INFO } from '@/lib/types';
import {
  UserCheck,
  Building,
  Mail,
  Phone,
  Utensils,
  Accessibility,
  Plane,
  Hotel,
  ShieldCheck,
  CheckCircle2,
  Download,
  Calendar,
  MapPin,
  Sparkles,
} from 'lucide-react';

const ROLES: UserRole[] = [
  'Partner',
  'OAK Staff',
  'Coordination Team',
  'Presenter',
  'Observer',
];

export default function RegistrationPage() {
  const router = useRouter();
  const { registerParticipant, canAccess } = useApp();

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organization, setOrganization] = useState('');
  const [subPartnerProgramArea, setSubPartnerProgramArea] = useState('');
  const [role, setRole] = useState<UserRole>('Partner');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dietaryRequirements, setDietaryRequirements] = useState('');
  const [accessibilityRequirements, setAccessibilityRequirements] = useState('');
  const [travelRequirements, setTravelRequirements] = useState('');
  const [accommodationRequirements, setAccommodationRequirements] = useState('');

  // Submission / Modal States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailConfirmationModal, setShowEmailConfirmationModal] = useState(false);
  const [registeredData, setRegisteredData] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = registerParticipant({
        firstName,
        lastName,
        organization,
        subPartnerProgramArea: subPartnerProgramArea || undefined,
        role,
        email,
        phoneNumber,
        dietaryRequirements: dietaryRequirements || 'None',
        accessibilityRequirements: accessibilityRequirements || 'None',
        travelRequirements: travelRequirements || 'Local Transport',
        accommodationRequirements: accommodationRequirements || 'Not required',
      });

      setRegisteredData(result);

      // Workflow handling per Scenario:
      if (role === 'Partner') {
        // Show confirmation email modal with QR & event info, then user can proceed to QR page
        setShowEmailConfirmationModal(true);
      } else {
        // OAK Staff, Presenter, Observer, Coordination Team -> redirect per workflow
        router.push(result.redirectUrl);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during registration. Please check your fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Event Header Card */}
        <div className="bg-[#163866] text-white rounded-3xl p-8 sm:p-10 mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              Event Registration
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              {EVENT_INFO.name}
            </h1>
            <p className="text-slate-200 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
              Welcome to the official registration portal. Please complete all required personal,
              role, and requirement fields below to finalize your registration and access event materials.
            </p>

            <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-blue-100 font-medium pt-4 border-t border-white/15">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-300" />
                <span>{EVENT_INFO.dates}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                <MapPin className="w-4 h-4 text-blue-300" />
                <span>{EVENT_INFO.venue}, {EVENT_INFO.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200 px-6 sm:px-10 py-6 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-900">Registration Form</h2>
            <p className="text-xs text-slate-500 mt-1">
              All users must complete the following fields during registration.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
            {/* Section 1: Personal Information */}
            <div>
              <div className="flex items-center gap-2 text-[#163866] font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                <UserCheck className="w-4 h-4" />
                <span>Personal Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Tendai"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-[#163866] focus:border-transparent transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Chikwanha"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-[#163866] focus:border-transparent transition-all outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                    Organization <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Youth Empowerment Trust"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-[#163866] focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Optional Information */}
            <div>
              <div className="flex items-center gap-2 text-[#163866] font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                <ShieldCheck className="w-4 h-4" />
                <span>Optional Information</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Sub Partner Program Area (Optional)
                </label>
                <input
                  type="text"
                  value={subPartnerProgramArea}
                  onChange={(e) => setSubPartnerProgramArea(e.target.value)}
                  placeholder="e.g. Youth Livelihoods, Child Protection, Climate Action"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-[#163866] focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            {/* Section 3: Role Selection */}
            <div>
              <div className="flex items-center gap-2 text-[#163866] font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                <UserCheck className="w-4 h-4" />
                <span>Role Selection</span>
              </div>

              <p className="text-xs text-slate-500 mb-3">
                Users must select one of the following roles. Note: Unique QR codes are generated specifically for Partners for event attendance verification.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {ROLES.map((r) => {
                  const isSelected = role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                        isSelected
                          ? 'border-[#163866] bg-blue-50/70 text-[#163866] ring-2 ring-[#163866]/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{r}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#163866]" />}
                      </div>
                      <span className="block text-[11px] text-slate-500 mt-1">
                        {r === 'Partner'
                          ? 'Receives scannable QR pass'
                          : r === 'Coordination Team'
                          ? 'Scanner & Attendance access'
                          : 'Program & Partners access'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 4: Contact Information */}
            <div>
              <div className="flex items-center gap-2 text-[#163866] font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                <Mail className="w-4 h-4" />
                <span>Contact Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. tendai@organization.org.zw"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-[#163866] focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. +263 77 123 4567"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-[#163866] focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Additional Requirements */}
            <div>
              <div className="flex items-center gap-2 text-[#163866] font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                <Utensils className="w-4 h-4" />
                <span>Additional Requirements</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-slate-500" />
                    Dietary Requirements
                  </label>
                  <input
                    type="text"
                    value={dietaryRequirements}
                    onChange={(e) => setDietaryRequirements(e.target.value)}
                    placeholder="e.g. Vegetarian, Halal, Gluten-Free, Nut Allergy, None"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-[#163866] focus:border-transparent transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <Accessibility className="w-3.5 h-3.5 text-slate-500" />
                    Accessibility Requirements
                  </label>
                  <input
                    type="text"
                    value={accessibilityRequirements}
                    onChange={(e) => setAccessibilityRequirements(e.target.value)}
                    placeholder="e.g. Wheelchair access, Visual/Hearing assistance, None"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-[#163866] focus:border-transparent transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-slate-500" />
                    Travel Requirements
                  </label>
                  <input
                    type="text"
                    value={travelRequirements}
                    onChange={(e) => setTravelRequirements(e.target.value)}
                    placeholder="e.g. Local transport, Flight from Bulawayo, Coach"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-[#163866] focus:border-transparent transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <Hotel className="w-3.5 h-3.5 text-slate-500" />
                    Accommodation Requirements
                  </label>
                  <input
                    type="text"
                    value={accommodationRequirements}
                    onChange={(e) => setAccommodationRequirements(e.target.value)}
                    placeholder="e.g. Cresta Lodge (2 Nights), Not required"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-[#163866] focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Registration Action */}
            <div className="pt-6 border-t border-slate-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-8 rounded-2xl bg-[#163866] hover:bg-[#0f284e] text-white font-bold text-base shadow-lg shadow-blue-900/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <CheckCircle2 className="w-5 h-5" />
                {isSubmitting ? 'Processing Registration...' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Scenario 1 Partner Confirmation Email Simulation Modal */}
      {showEmailConfirmationModal && registeredData && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 border border-emerald-200 mx-auto">
              <Mail className="w-7 h-7" />
            </div>

            <div className="text-center mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                Confirmation Email Sent
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">Registration Confirmed!</h3>
              <p className="text-xs text-slate-600 mt-1">
                A confirmation email containing your registration details, downloadable QR code, and event info has been prepared for <strong className="text-slate-800">{registeredData.participant.email}</strong>.
              </p>
            </div>

            {/* Email Preview Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 mb-6 text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Participant Name:</span>
                <span className="font-semibold text-slate-900">{registeredData.participant.firstName} {registeredData.participant.lastName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Organization:</span>
                <span className="font-semibold text-slate-900">{registeredData.participant.organization}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Registration ID:</span>
                <span className="font-mono font-bold text-[#163866]">{registeredData.participant.registrationId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">QR Code ID:</span>
                <span className="font-mono text-slate-800">{registeredData.participant.qrCodeId}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">Event Dates & Venue:</span>
                <span className="font-medium text-slate-800 text-right">9–11 Nov 2026, Cresta Lodge</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setShowEmailConfirmationModal(false);
                  router.push(registeredData.redirectUrl);
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#163866] text-white font-semibold text-sm hover:bg-[#0f284e] transition-colors flex items-center justify-center gap-2"
              >
                Proceed to QR Code Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
