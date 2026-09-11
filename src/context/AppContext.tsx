'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Participant,
  UserRole,
  PageName,
  InvalidQrReason,
  ROLE_ACCESS_MATRIX,
} from '@/lib/types';
import { INITIAL_PARTICIPANTS } from '@/lib/mockData';

interface RegistrationInput {
  firstName: string;
  lastName: string;
  organization: string;
  subPartnerProgramArea?: string;
  role: UserRole;
  email: string;
  phoneNumber: string;
  dietaryRequirements: string;
  accessibilityRequirements: string;
  travelRequirements: string;
  accommodationRequirements: string;
}

interface CheckInResult {
  success: boolean;
  participant?: Participant;
  reason?: InvalidQrReason;
  message?: string;
}

interface AppContextType {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  participants: Participant[];
  currentParticipant: Participant | null;
  setCurrentParticipant: (p: Participant | null) => void;
  registerParticipant: (data: RegistrationInput) => {
    participant: Participant;
    qrCodeGenerated: boolean;
    redirectUrl: string;
  };
  checkInParticipant: (query: string) => CheckInResult;
  manualCheckInToggle: (id: string) => void;
  sessionNotes: Record<string, string>;
  saveSessionNote: (sessionId: string, note: string) => void;
  canAccess: (page: PageName) => boolean;
  resetToInitialData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PARTICIPANTS = 'oak_event_participants_v1';
const STORAGE_KEY_ACTIVE_ROLE = 'oak_event_active_role_v1';
const STORAGE_KEY_CURRENT_PART = 'oak_event_current_part_v1';
const STORAGE_KEY_NOTES = 'oak_event_session_notes_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRoleState] = useState<UserRole>('Coordination Team');
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [currentParticipant, setCurrentParticipantState] = useState<Participant | null>(null);
  const [sessionNotes, setSessionNotes] = useState<Record<string, string>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const storedParts = localStorage.getItem(STORAGE_KEY_PARTICIPANTS);
      if (storedParts) {
        setParticipants(JSON.parse(storedParts));
      } else {
        localStorage.setItem(STORAGE_KEY_PARTICIPANTS, JSON.stringify(INITIAL_PARTICIPANTS));
      }

      const storedRole = localStorage.getItem(STORAGE_KEY_ACTIVE_ROLE);
      if (storedRole) {
        setActiveRoleState(storedRole as UserRole);
      }

      const storedCurrent = localStorage.getItem(STORAGE_KEY_CURRENT_PART);
      if (storedCurrent) {
        setCurrentParticipantState(JSON.parse(storedCurrent));
      }

      const storedNotes = localStorage.getItem(STORAGE_KEY_NOTES);
      if (storedNotes) {
        setSessionNotes(JSON.parse(storedNotes));
      }
    } catch (e) {
      console.error('Error loading local data', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY_PARTICIPANTS, JSON.stringify(participants));
    } catch (e) {
      console.error('Error saving participants', e);
    }
  }, [participants, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ROLE, activeRole);
    } catch (e) {
      console.error('Error saving active role', e);
    }
  }, [activeRole, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      if (currentParticipant) {
        localStorage.setItem(STORAGE_KEY_CURRENT_PART, JSON.stringify(currentParticipant));
      } else {
        localStorage.removeItem(STORAGE_KEY_CURRENT_PART);
      }
    } catch (e) {
      console.error('Error saving current participant', e);
    }
  }, [currentParticipant, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(sessionNotes));
    } catch (e) {
      console.error('Error saving notes', e);
    }
  }, [sessionNotes, isInitialized]);

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
  };

  const setCurrentParticipant = (p: Participant | null) => {
    setCurrentParticipantState(p);
  };

  const registerParticipant = (data: RegistrationInput) => {
    const nextIndex = participants.length + 1001;
    const regId = `REG-OAK-${nextIndex}`;
    const todayStr = new Date().toISOString().split('T')[0];

    const isPartner = data.role === 'Partner';
    const qrId = isPartner ? `QR-OAK-PARTNER-${nextIndex}` : undefined;

    const newParticipant: Participant = {
      id: `part-${Date.now()}`,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      organization: data.organization.trim(),
      subPartnerProgramArea: data.subPartnerProgramArea?.trim() || 'General Program Area',
      role: data.role,
      email: data.email.trim(),
      phoneNumber: data.phoneNumber.trim(),
      dietaryRequirements: data.dietaryRequirements || 'None',
      accessibilityRequirements: data.accessibilityRequirements || 'None',
      travelRequirements: data.travelRequirements || 'Standard Local',
      accommodationRequirements: data.accommodationRequirements || 'Not required',
      registrationId: regId,
      registrationDate: todayStr,
      qrCodeId: qrId,
      registrationStatus: 'Registered',
      attendanceStatus: 'Not Attended',
      checkInTime: null,
      checkInDate: null,
    };

    const updated = [newParticipant, ...participants];
    setParticipants(updated);
    setCurrentParticipantState(newParticipant);
    setActiveRoleState(data.role);

    // Determine redirect and access according to Scenarios 1 - 5
    let redirectUrl = '/program';
    if (data.role === 'Partner') {
      redirectUrl = `/qr-code?id=${newParticipant.id}`;
    } else if (data.role === 'Coordination Team') {
      redirectUrl = '/check-in';
    } else {
      // OAK Staff, Presenter, Observer
      redirectUrl = '/program';
    }

    return {
      participant: newParticipant,
      qrCodeGenerated: isPartner,
      redirectUrl,
    };
  };

  const checkInParticipant = (query: string): CheckInResult => {
    const trimmed = query.trim();
    if (!trimmed) {
      return {
        success: false,
        reason: 'Invalid QR Code',
        message: 'No QR code payload detected.',
      };
    }

    // Try to match by qrCodeId, registrationId, id, or email
    const participant = participants.find(
      (p) =>
        (p.qrCodeId && p.qrCodeId.toLowerCase() === trimmed.toLowerCase()) ||
        p.registrationId.toLowerCase() === trimmed.toLowerCase() ||
        p.id.toLowerCase() === trimmed.toLowerCase() ||
        p.email.toLowerCase() === trimmed.toLowerCase()
    );

    if (!participant) {
      return {
        success: false,
        reason: 'Participant Not Found',
        message: 'No participant record matches this QR code or ID.',
      };
    }

    // Check if already checked in (Duplicate check)
    if (participant.attendanceStatus === 'Attended') {
      return {
        success: false,
        reason: 'Duplicate QR Code',
        participant,
        message: `Participant ${participant.firstName} ${participant.lastName} was already checked in at ${participant.checkInTime || 'an earlier time'}.`,
      };
    }

    // Success flow: Mark participant as attended, record timestamp, update records
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateFormatted = '9 November 2026';

    const updatedParticipant: Participant = {
      ...participant,
      attendanceStatus: 'Attended',
      checkInTime: timeFormatted,
      checkInDate: dateFormatted,
    };

    const updatedList = participants.map((p) =>
      p.id === participant.id ? updatedParticipant : p
    );

    setParticipants(updatedList);

    return {
      success: true,
      participant: updatedParticipant,
      message: 'Participant Successfully Checked In',
    };
  };

  const manualCheckInToggle = (id: string) => {
    const target = participants.find((p) => p.id === id);
    if (!target) return;

    const isAttended = target.attendanceStatus === 'Attended';
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updated: Participant = {
      ...target,
      attendanceStatus: isAttended ? 'Not Attended' : 'Attended',
      checkInTime: isAttended ? null : timeFormatted,
      checkInDate: isAttended ? null : '9 November 2026',
    };

    setParticipants((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const saveSessionNote = (sessionId: string, note: string) => {
    setSessionNotes((prev) => ({
      ...prev,
      [sessionId]: note,
    }));
  };

  const canAccess = (page: PageName): boolean => {
    return ROLE_ACCESS_MATRIX[page]?.[activeRole] ?? false;
  };

  const resetToInitialData = () => {
    setParticipants(INITIAL_PARTICIPANTS);
    localStorage.setItem(STORAGE_KEY_PARTICIPANTS, JSON.stringify(INITIAL_PARTICIPANTS));
    setSessionNotes({});
    localStorage.removeItem(STORAGE_KEY_NOTES);
  };

  return (
    <AppContext.Provider
      value={{
        activeRole,
        setActiveRole,
        participants,
        currentParticipant,
        setCurrentParticipant,
        registerParticipant,
        checkInParticipant,
        manualCheckInToggle,
        sessionNotes,
        saveSessionNote,
        canAccess,
        resetToInitialData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
