import { User, MissingPersonAlert, SightingReport, AlertNotification } from './types';

// Let's seed some registered users who can be tagged as missing
// Some are verified, some are not. If a verified user is tagged,
// their profile photo, physical description, and location will auto-fill!
export const MOCK_REGISTERED_USERS: User[] = [
  {
    id: 'user-001',
    name: 'Aleksey Smirnov',
    age: 29,
    phoneNumber: '+1 (555) 382-9102',
    email: 'aleksey.s@example.com',
    isVerified: true,
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    physicalDescription: '6\'1" tall, athletic build. Dark blonde hair, light green eyes. Compass tattoo on right inner forearm. Usually wears athletic shoes.',
    allowedLocation: {
      latitude: 40.7128,
      longitude: -74.0060,
      accuracy: 10,
      timestamp: Date.now() - 3600000, // 1 hour ago
    },
    idVerified: true,
    idDocumentName: 'PASSPORT_US_XXXX_9102.pdf'
  },
  {
    id: 'user-002',
    name: 'Elena Rostova',
    age: 22,
    phoneNumber: '+1 (555) 482-0192',
    email: 'elena.rostova@example.com',
    isVerified: true,
    profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    physicalDescription: '5\'4" tall, petite build. Long auburn hair. Wears wire-frame reading glasses, a thin silver anchor necklace, and has a small birthmark below left temple.',
    allowedLocation: {
      latitude: 34.0522,
      longitude: -118.2437,
      accuracy: 15,
      timestamp: Date.now() - 7200000, // 2 hours ago
    },
    idVerified: true,
    idDocumentName: 'DRIVERS_LIC_CA_XXXX_0192.pdf'
  },
  {
    id: 'user-003',
    name: 'Marcus Vance',
    age: 42,
    phoneNumber: '+1 (555) 728-1194',
    email: 'marcus.v@example.com',
    isVerified: false,
    idVerified: false
  },
  {
    id: 'user-004',
    name: 'Sarah Jenkins',
    age: 31,
    phoneNumber: '+1 (555) 901-3829',
    email: 'sarah.j@example.com',
    isVerified: true,
    profilePhoto: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    physicalDescription: '5\'7" tall. Shoulder-length curly red-blonde hair. Prominent freckles on nose and cheeks. Usually carries a leather handbag and wears a gold-plated wristwatch.',
    allowedLocation: {
      latitude: 41.8781,
      longitude: -87.6298,
      accuracy: 25,
      timestamp: Date.now() - 1800000, // 30 mins ago
    },
    idVerified: true,
    idDocumentName: 'STATE_ID_IL_XXXX_3829.pdf'
  }
];

// Initial mock alerts active in system
export const MOCK_ALERTS: MissingPersonAlert[] = [
  {
    id: 'alert-1',
    name: 'Elena Rostova',
    age: 22,
    gender: 'Female',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    lastKnownLocation: 'Grand Central Terminal (Sector B), New York, NY',
    physicalDescription: '5\'4" tall, petite build. Long auburn hair. Wears wire-frame reading glasses, a thin silver anchor necklace, and has a small birthmark below left temple.',
    contactInformation: '+1 (555) 482-0192 / Emergency Rescue Dispatch Desk',
    timeReported: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    status: 'ACTIVE',
    isVerifiedUser: true,
    taggedUserId: 'user-002'
  },
  {
    id: 'alert-2',
    name: 'Liam Peterson',
    age: 9,
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=400&q=80',
    lastKnownLocation: 'Oakwood Public Park, Chicago, IL',
    physicalDescription: 'About 4\'2" tall. Bright blue t-shirt, beige cargo shorts, green sneakers. Short brown hair. Left-handed. Unusually expressive eyes.',
    contactInformation: '+1 (555) 103-9482 (Parent: Jessica Peterson)',
    timeReported: new Date(Date.now() - 3600000 * 8).toISOString(), // 8 hours ago
    status: 'ACTIVE',
    isVerifiedUser: false,
  },
  {
    id: 'alert-3',
    name: 'Aleksey Smirnov',
    age: 29,
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    lastKnownLocation: 'Market Square Tech District, Downtown Austin, TX',
    physicalDescription: '6\'1" tall, athletic build. Dark blonde hair, light green eyes. Compass tattoo on right inner forearm. Usually wears athletic shoes.',
    contactInformation: '+1 (555) 382-9102 / Guardian Task Force Contact',
    timeReported: new Date(Date.now() - 3600000 * 18).toISOString(), // 18 hours ago
    status: 'ACTIVE',
    isVerifiedUser: true,
    taggedUserId: 'user-001'
  }
];

export const MOCK_SIGHTINGS: SightingReport[] = [
  {
    id: 'sight-1',
    alertId: 'alert-1',
    reporterName: 'David K.',
    reporterContact: '+1 (555) 902-1203',
    sightingTime: new Date(Date.now() - 3600000 * 4).toISOString(),
    sightingLocation: 'Times Square Subway Station Platform 3',
    sightingDetails: 'Spotted a young woman matching her height and hair layout boarding the N train uptown. She was wearing a grey hoodie and looked a bit disoriented.',
    status: 'INVESTIGATING'
  },
  {
    id: 'sight-2',
    alertId: 'alert-2',
    reporterName: 'Maria G.',
    reporterContact: '+1 (555) 441-2940',
    sightingTime: new Date(Date.now() - 3600000 * 7).toISOString(),
    sightingLocation: 'Convenience Store at 4th St & Oak Ave',
    sightingDetails: 'Saw a boy in a green hat buying a drink. He fit the description perfectly. He walked away towards the North park entrance quickly.',
    status: 'CONFIRMED'
  }
];

export const MOCK_NOTIFICATIONS: AlertNotification[] = [
  {
    id: 'notif-1',
    title: 'CRITICAL ALERT: Liam Peterson (Age 9)',
    message: 'Missing child alert launched near Oakwood Public Park. Citizens within 15 miles are requested to inspect garages, backyards, and nearby fields.',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    alertId: 'alert-2',
    type: 'CRITICAL'
  },
  {
    id: 'notif-2',
    title: 'New Sighting Confirmed',
    message: 'A sighting report near Oak Ave convenience store for Liam Peterson was flagged as highly credible. Search efforts are converging there.',
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    alertId: 'alert-2',
    type: 'UPDATE'
  },
  {
    id: 'notif-3',
    title: 'ALERT ACTIVATED: Aleksey Smirnov (Age 29)',
    message: 'Aleksey Smirnov has been reported missing. Verified medical profile and last known device coordinate of 30.2672 N, 97.7431 W loaded.',
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    alertId: 'alert-3',
    type: 'CRITICAL'
  }
];
