/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

/**
 * Calculates remaining days, hours, minutes, and seconds until target date.
 */
export function calculateCountdown(targetIso: string, nowMs = Date.now()): CountdownValues {
  const targetTime = new Date(targetIso).getTime();
  const diff = targetTime - nowMs;

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: true,
    };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return {
    days,
    hours,
    minutes,
    seconds,
    isPast: false,
  };
}
