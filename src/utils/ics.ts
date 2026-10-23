/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IcsEventOptions {
  title: string;
  description: string;
  location: string;
  startISO: string;
  endISO: string;
  timeZone?: string;
}

/**
 * Formats an ISO date string to ICS format (YYYYMMDDTHHMMSS)
 */
export function formatIcsDate(isoString: string): string {
  const date = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, '0');
  
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  );
}

/**
 * Generates valid iCalendar VCALENDAR string
 */
export function generateIcsContent(event: IcsEventOptions): string {
  const dtStamp = formatIcsDate(new Date().toISOString());
  const dtStart = formatIcsDate(event.startISO);
  const dtEnd = formatIcsDate(event.endISO);
  const uid = `invitation-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@engagement.local`;

  // Escape special chars in text fields
  const escapeIcs = (str: string) =>
    str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ahmad and Mawra//Engagement Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(event.description)}`,
    `LOCATION:${escapeIcs(event.location)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Triggers browser download of generated .ics file
 */
export function downloadIcsFile(event: IcsEventOptions, filename: string): void {
  const content = generateIcsContent(event);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
