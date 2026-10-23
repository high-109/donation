/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { formatIcsDate, generateIcsContent } from './ics.ts';
import { calculateCountdown } from './countdownCalc.ts';
import { calculateClearedPercentage } from './scratchMath.ts';
import { validateRsvpForm } from './rsvpValidation.ts';
import { INVITATION_CONFIG } from '../config.ts';

test('ICS formatting generates RFC-5545 compliant timestamps', () => {
  const iso = '2026-11-14T19:30:00.000Z';
  const icsDate = formatIcsDate(iso);
  assert.equal(icsDate, '20261114T193000Z');
});

test('generateIcsContent includes required VCALENDAR and VEVENT properties', () => {
  const event = {
    title: 'Hammad & Ayesha Engagement Celebration',
    description: 'Ring exchange ceremony & blessings',
    location: 'Ghanchi Community Banquet, 2nd Floor',
    startISO: '2026-11-14T19:30:00+05:00',
    endISO: '2026-11-14T23:30:00+05:00',
  };

  const ics = generateIcsContent(event);
  assert.match(ics, /^BEGIN:VCALENDAR/m);
  assert.match(ics, /VERSION:2\.0/m);
  assert.match(ics, /BEGIN:VEVENT/m);
  assert.match(ics, /SUMMARY:Hammad & Ayesha Engagement Celebration/m);
  assert.match(ics, /LOCATION:Ghanchi Community Banquet\\, 2nd Floor/m);
  assert.match(ics, /END:VEVENT/m);
  assert.match(ics, /END:VCALENDAR/m);
});

test('calculateCountdown computes remaining days, hours, minutes correctly', () => {
  const now = new Date('2026-11-01T12:00:00Z').getTime();
  const target = '2026-11-14T19:30:00Z'; // 13 days and 7.5 hours later

  const cd = calculateCountdown(target, now);
  assert.equal(cd.days, 13);
  assert.equal(cd.hours, 7);
  assert.equal(cd.minutes, 30);
  assert.equal(cd.seconds, 0);
  assert.equal(cd.isPast, false);
});

test('calculateCountdown returns isPast true when target date has passed', () => {
  const now = new Date('2026-11-20T12:00:00Z').getTime();
  const target = '2026-11-14T19:30:00Z';

  const cd = calculateCountdown(target, now);
  assert.equal(cd.isPast, true);
  assert.equal(cd.days, 0);
  assert.equal(cd.hours, 0);
});

test('calculateClearedPercentage returns correct clearance ratio', () => {
  const width = 10;
  const height = 10;
  const data = new Uint8ClampedArray(width * height * 4);

  // Fill all with opaque 255 alpha
  for (let i = 0; i < data.length; i += 4) {
    data[i + 3] = 255;
  }
  const clearedZero = calculateClearedPercentage({ data, width, height }, 1);
  assert.equal(clearedZero, 0);

  // Clear first 60 pixels
  for (let i = 0; i < 60 * 4; i += 4) {
    data[i + 3] = 0;
  }
  const clearedSixty = calculateClearedPercentage({ data, width, height }, 1);
  assert.equal(clearedSixty, 60);
});

test('validateRsvpForm validates required full name and bounds', () => {
  const emptyRes = validateRsvpForm({
    fullName: '',
    guestCount: 1,
    attending: true,
    duaNote: '',
    honeypot: '',
  });
  assert.equal(emptyRes.isValid, false);
  assert.equal(Boolean(emptyRes.errors.fullName), true);

  const honeypotRes = validateRsvpForm({
    fullName: 'Bot User',
    guestCount: 2,
    attending: true,
    duaNote: '',
    honeypot: 'spam-bot-token',
  });
  assert.equal(honeypotRes.isValid, false);
  assert.equal(Boolean(honeypotRes.errors.honeypot), true);

  const validRes = validateRsvpForm({
    fullName: 'Farhan Sheikh',
    guestCount: 2,
    email: 'farhan@example.com',
    phone: '+92 300 1234567',
    attending: true,
    duaNote: 'Wishing you both eternal blessings and happiness!',
    honeypot: '',
  });
  assert.equal(validRes.isValid, true);
});

test('INVITATION_CONFIG contains Hammad & Ayesha details and Ghanchi venue', () => {
  assert.equal(INVITATION_CONFIG.couple.groom, 'Hammad');
  assert.equal(INVITATION_CONFIG.couple.bride, 'Ayesha');
  assert.match(INVITATION_CONFIG.events[0].venue, /Ghanchi Community Banquet/);
});
