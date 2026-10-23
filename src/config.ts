/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EventTimelineItem {
  time: string;
  label: string;
}

export interface CelebrationEvent {
  id: string;
  title: string;
  shortTitle: string;
  date: string;
  time: string;
  startISO: string;
  endISO: string;
  venue: string;
  floor: string;
  address: string;
  area: string;
  googleMapsQuery: string;
  dressCode: string;
  icon: string;
  timeline: EventTimelineItem[];
}

export interface InvitationConfig {
  couple: {
    groom: string;
    bride: string;
    groomFull: string;
    groomBin: string;
    brideFull: string;
    monogram: string;
    headline: string;
    shortHeadline: string;
    tagline: string;
  };
  eventDate: {
    iso: string;
    displayDay: string;
    displayMonthYear: string;
    fullDisplay: string;
    time: string;
    timeZone: string;
  };
  venue: {
    name: string;
    floor: string;
    fullAddress: string;
    googleMapsQuery: string;
    directionsUrl: string;
  };
  verses: {
    bismillah: string;
    quranArabic: string;
    quranTranslation: string;
    quranReference: string;
  };
  letter: {
    chapter: string;
    salutation: string;
    paragraphs: string[];
    signOff: string;
  };
  families: {
    parentsHost: string;
    requestLine: string;
    ceremonyTitle: string;
    relationLine: string;
    groomParentsTitle: string;
    groomParents: string;
    groomSubtitle: string;
    brideParentsTitle: string;
    brideParents: string;
    brideSubtitle: string;
    invitationNote: string;
  };
  events: CelebrationEvent[];
  rsvp: {
    deadlineText: string;
    maxGuests: number;
    defaultGuests: 1;
    contactWhatsApp: string;
    contactPhone: string;
    apiEndpoint: string;
  };
  closing: {
    sentiment: string;
    foreverHeader: string;
    duaArabic: string;
    duaTranslation: string;
    signOff: string;
    familyNames: string;
    credit: string;
  };
  audio: {
    enabledByDefault: boolean;
  };
}

export const INVITATION_CONFIG: InvitationConfig = {
  couple: {
    groom: 'Hammad',
    bride: 'Ayesha',
    groomFull: 'Hammad Sheikh',
    groomBin: 'Bin Nadeem',
    brideFull: 'Ayesha Akram',
    monogram: 'AH',
    headline: 'Hammad Sheikh Bin Nadeem with Ayesha Akram',
    shortHeadline: 'Hammad & Ayesha',
    tagline: 'Request the honour of your presence at "Engagement Ceremony"',
  },
  eventDate: {
    iso: '2026-11-14T20:00:00+05:00',
    displayDay: 'Saturday, 14TH',
    displayMonthYear: 'November 2026',
    fullDisplay: '8:00 PM, Saturday, 14th November, 2026',
    time: '8:00 PM',
    timeZone: 'Asia/Karachi',
  },
  venue: {
    name: 'Ghanchi Community Banquet',
    floor: '2nd Floor',
    fullAddress: 'St 5A, Block J North Nazimabad Town, Karachi',
    googleMapsQuery: 'Ghanchi Community Banquet St 5A Block J North Nazimabad Karachi',
    directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Ghanchi%20Community%20Banquet%20North%20Nazimabad%20Karachi',
  },
  verses: {
    bismillah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    quranArabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    quranTranslation:
      'And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts.',
    quranReference: 'Surah Ar-Rum • 30:21',
  },
  letter: {
    chapter: 'A New Chapter Begins',
    salutation: 'Dearest Family & Friends,',
    paragraphs: [
      'Mr. & Mrs Nadeem Akhtar (Shaheed) request the honour of your presence at the "Engagement Ceremony" of their beloved son Hammad Sheikh Bin Nadeem with Ayesha Akram.',
      'Your presence and blessings mean the world to us as we begin this cherished new journey in the grace and guidance of Allah SWT.',
    ],
    signOff: 'Hammad & Ayesha',
  },
  families: {
    parentsHost: 'MR. & MRS NADEEM AKHTAR (SHAHEED)',
    requestLine: 'REQUEST THE HONOUR OF YOUR PRESENCE AT',
    ceremonyTitle: '"ENGAGEMENT CEREMONY"',
    relationLine: 'OF OUR BELOVED SON',
    groomParentsTitle: "Groom's Family",
    groomParents: 'Mr. & Mrs Nadeem Akhtar (Shaheed)',
    groomSubtitle: 'Beloved Parents of Hammad Sheikh Bin Nadeem',
    brideParentsTitle: "Bride's Family",
    brideParents: 'Mr. & Mrs Muhammad Akram',
    brideSubtitle: 'Beloved Parents of Ayesha Akram',
    invitationNote: 'Cordially invite you to celebrate the joyous engagement ceremony of their beloved children and bestow your heartfelt blessings and prayers.',
  },
  events: [
    {
      id: 'engagement',
      title: 'Engagement Ceremony',
      shortTitle: 'Engagement Ceremony',
      date: 'Saturday, 14th November, 2026',
      time: '8:00 PM PKT',
      startISO: '2026-11-14T20:00:00+05:00',
      endISO: '2026-11-14T23:45:00+05:00',
      venue: 'Ghanchi Community Banquet',
      floor: '2nd Floor',
      address: 'St 5A, Block J North Nazimabad Town, Karachi',
      area: 'North Nazimabad Town, Karachi',
      googleMapsQuery: 'Ghanchi Community Banquet St 5A Block J North Nazimabad Karachi',
      dressCode: 'Beige & Brown Aesthetic / Traditional Festive Elegance',
      icon: '/assets/icon-mangni.svg',
      timeline: [
        { time: '08:00 PM', label: 'Guest Arrival & Welcome Refreshments' },
        { time: '09:00 PM', label: 'Dua & Exchange of Engagement Rings' },
        { time: '10:00 PM', label: 'Celebration Banquet Feast & Family Portraits' },
      ],
    },
  ],
  rsvp: {
    deadlineText: 'Kindly respond by October 25, 2026',
    maxGuests: 6,
    defaultGuests: 1,
    contactWhatsApp: '+92 300 0000000',
    contactPhone: '+92 300 0000000',
    apiEndpoint: '/api/rsvp',
  },
  closing: {
    sentiment: 'Your presence and blessings mean the world to us.',
    foreverHeader: 'The beginning of our forever',
    duaArabic: 'بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ',
    duaTranslation: 'May Allah bless you both, shower His blessings upon you, and unite you in immense goodness.',
    signOff: 'With endless love and gratitude,',
    familyNames: 'Hammad & Ayesha · 14 November 2026',
    credit: 'Hammad & Ayesha • Engagement Ceremony 2026',
  },
  audio: {
    enabledByDefault: false,
  },
};
