/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RsvpFormData {
  fullName: string;
  guestCount: number;
  email?: string;
  phone?: string;
  attending: boolean;
  eventAttendance?: Record<string, boolean>;
  duaNote: string;
  honeypot: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateRsvpForm(data: RsvpFormData, maxGuests = 6): ValidationResult {
  const errors: Record<string, string> = {};

  // Anti-spam honeypot
  if (data.honeypot && data.honeypot.trim().length > 0) {
    errors.honeypot = 'Automated submission detected.';
  }

  // Name validation
  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.';
  } else if (data.fullName.trim().length > 80) {
    errors.fullName = 'Name cannot exceed 80 characters.';
  }

  // Guest count validation
  if (typeof data.guestCount !== 'number' || isNaN(data.guestCount) || data.guestCount < 1) {
    errors.guestCount = 'Guest count must be at least 1.';
  } else if (data.guestCount > maxGuests) {
    errors.guestCount = `Guest count cannot exceed ${maxGuests}.`;
  }

  // Optional Email validation if entered
  if (data.email && data.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
  }

  // Optional Phone validation if entered
  if (data.phone && data.phone.trim().length > 0) {
    const cleanPhone = data.phone.replace(/[\s\-\(\)\+]/g, '');
    if (cleanPhone.length < 7 || cleanPhone.length > 15) {
      errors.phone = 'Please enter a valid phone number.';
    }
  }

  // Note validation
  if (data.duaNote && data.duaNote.length > 500) {
    errors.duaNote = 'Note cannot exceed 500 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
