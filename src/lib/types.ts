export type UserRole =
  | 'Partner'
  | 'OAK Staff'
  | 'Coordination Team'
  | 'Presenter'
  | 'Observer';

export type PageName =
  | 'Registration'
  | 'QR Code Page'
  | 'Program Page'
  | 'Partners Page'
  | 'Check In Page'
  | 'Attendance Page';

export type AttendanceStatus = 'Attended' | 'Not Attended';
export type RegistrationStatus = 'Registered' | 'Pending';

export interface Participant {
  // Personal Information
  id: string;
  firstName: string;
  lastName: string;
  organization: string;

  // Optional Information
  subPartnerProgramArea?: string;

  // Role Selection
  role: UserRole;

  // Contact Information
  email: string;
  phoneNumber: string;

  // Additional Requirements
  dietaryRequirements: string;
  accessibilityRequirements: string;
  travelRequirements: string;
  accommodationRequirements: string;

  // Registration Information
  registrationId: string; // e.g. "REG-OAK-1001"
  registrationDate: string; // ISO date string
  qrCodeId?: string; // Only for Partners, e.g. "QR-OAK-PARTNER-1001"
  registrationStatus: RegistrationStatus;

  // Attendance Information
  attendanceStatus: AttendanceStatus;
  checkInTime?: string | null; // e.g. "08:45 AM"
  checkInDate?: string | null; // e.g. "9 November 2026"
}

export interface ProgramSession {
  id: string;
  date: string; // e.g. "9 November 2026"
  dayNumber: number; // 1, 2, or 3
  time: string; // e.g. "09:00 AM - 10:30 AM"
  sessionTitle: string;
  speaker: string;
  speakerRole?: string;
  speakerBio?: string;
  venue: string; // e.g. "Main Conference Hall", "Msasa Room"
  sessionDescription: string;
}

export interface PartnerOrganization {
  id: string;
  name: string;
  logo: string;
  description: string;
  websiteLink: string;
  contactInformation: {
    email: string;
    phone: string;
    address?: string;
  };
  // Partner Details View
  fullProfile: string;
  organizationOverview: string;
  areasOfWork: string[];
}

export type InvalidQrReason =
  | 'Invalid QR Code'
  | 'Duplicate QR Code'
  | 'Network Error'
  | 'Corrupted QR Code'
  | 'Participant Not Found';

// Role-Based Access Matrix
export const ROLE_ACCESS_MATRIX: Record<PageName, Record<UserRole, boolean>> = {
  'Registration': {
    'Partner': true,
    'OAK Staff': true,
    'Presenter': true,
    'Observer': true,
    'Coordination Team': true,
  },
  'QR Code Page': {
    'Partner': true,
    'OAK Staff': false,
    'Presenter': false,
    'Observer': false,
    'Coordination Team': false,
  },
  'Program Page': {
    'Partner': false,
    'OAK Staff': true,
    'Presenter': true,
    'Observer': true,
    'Coordination Team': true,
  },
  'Partners Page': {
    'Partner': false,
    'OAK Staff': true,
    'Presenter': true,
    'Observer': true,
    'Coordination Team': true,
  },
  'Check In Page': {
    'Partner': false,
    'OAK Staff': false,
    'Presenter': false,
    'Observer': false,
    'Coordination Team': true,
  },
  'Attendance Page': {
    'Partner': false,
    'OAK Staff': false,
    'Presenter': false,
    'Observer': false,
    'Coordination Team': true,
  },
};

export const EVENT_INFO = {
  name: 'OAK Foundation Event',
  dates: '9 November 2026 to 11 November 2026',
  venue: 'Cresta Lodge, Msasa',
  location: 'Harare, Zimbabwe',
};
