export interface User {
  id: string;
  name: string;
  age: number;
  phoneNumber: string;
  email: string;
  // Verification details
  isVerified: boolean;
  profilePhoto?: string;
  physicalDescription?: string;
  allowedLocation?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
  };
  idVerified: boolean;
  idDocumentName?: string;
}

export interface MissingPersonAlert {
  id: string;
  reporterId?: string; // Empty if reported anonymously/guest
  name: string;
  age: number;
  gender: string;
  image?: string;
  lastKnownLocation: string;
  physicalDescription: string;
  contactInformation: string;
  timeReported: string; // ISO string
  status: 'ACTIVE' | 'RESOLVED';
  isVerifiedUser: boolean; // True if it was a pre-verified user
  taggedUserId?: string; // If another registered user was tagged as missing
}

export interface SightingReport {
  id: string;
  alertId: string;
  reporterName: string;
  reporterContact: string;
  sightingTime: string;
  sightingLocation: string;
  sightingDetails: string;
  image?: string;
  status: 'UNVERIFIED' | 'INVESTIGATING' | 'CONFIRMED';
}

export interface AlertNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  alertId?: string;
  type: 'CRITICAL' | 'UPDATE' | 'INFO';
}
