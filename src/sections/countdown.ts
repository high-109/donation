/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { INVITATION_CONFIG } from '../config.ts';
import { calculateCountdown, CountdownValues } from '../utils/countdownCalc.ts';
import { downloadIcsFile } from '../utils/ics.ts';

export function initCountdown(container: HTMLElement): void {
  const { eventDate, couple, events } = INVITATION_CONFIG;
  const mainEvent = events[0];

  const isAlreadyRevealed = Boolean((window as unknown as { __DATE_REVEALED?: boolean }).__DATE_REVEALED);

  container.innerHTML = `
    <!-- Hanging garlands swaying above -->
    <img 
      src="/assets/garlands.svg" 
      alt="" 
      class="garlands-decor" 
      width="600" 
      height="60" 
      loading="lazy"
      aria-hidden="true" 
    />

    <div class="countdown-container">
      <p class="section-subtitle">The Blessed Day Awaits</p>
      <h2 class="section-title">Counting the Days</h2>

      <!-- Teaser shown if user scrolls down before scratching card above -->
      <div class="countdown-teaser-box ${isAlreadyRevealed ? 'hidden' : ''}" id="cdTeaserBox">
        <p class="font-caps" style="color: var(--card-gold); font-size: 0.75rem; letter-spacing: 0.2em;">Sacred Date Awaiting</p>
        <p style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--card-text-primary); margin: 0.4rem 0;">
          The exact celebration date is hidden beneath the golden scratch card in the invitation above.
        </p>
        <a href="#heroScratchSection" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 0.5rem;">
          ✨ Scratch Card Above to Reveal ✨
        </a>
      </div>

      <!-- Date summary card -->
      <div id="cdDateSummary" class="${isAlreadyRevealed ? '' : 'hidden'}" style="text-align: center; margin-bottom: 1.5rem;">
        <p class="font-caps" style="color: var(--card-gold); font-size: 0.75rem; letter-spacing: 0.2em;">Celebration Date &amp; Time</p>
        <div style="font-family: var(--font-serif); font-size: clamp(1.5rem, 1.3rem + 0.8vw, 2.1rem); font-weight: 700; color: var(--card-gold); margin: 0.25rem 0;">
          ${eventDate.displayDay} ${eventDate.displayMonthYear}
        </div>
        <p style="font-family: var(--font-serif); font-style: italic; color: var(--ink-muted); font-size: var(--text-sm);">
          ${mainEvent.time} • ${mainEvent.venue}, ${mainEvent.area}
        </p>
      </div>

      <!-- Live Countdown Clock -->
      <div class="countdown-timer-grid" role="timer" aria-label="Time remaining until engagement ceremony">
        <div class="countdown-card">
          <div class="countdown-digits" id="cdDays">--</div>
          <div class="countdown-unit">Days</div>
        </div>
        <div class="countdown-card">
          <div class="countdown-digits" id="cdHours">--</div>
          <div class="countdown-unit">Hours</div>
        </div>
        <div class="countdown-card">
          <div class="countdown-digits" id="cdMinutes">--</div>
          <div class="countdown-unit">Minutes</div>
        </div>
        <div class="countdown-card">
          <div class="countdown-digits" id="cdSeconds">--</div>
          <div class="countdown-unit">Seconds</div>
        </div>
      </div>

      <button type="button" id="saveTheDateBtn" class="btn btn-primary" style="margin-top: 1.25rem;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        Save the Date (.ICS)
      </button>
    </div>
  `;

  const teaserBox = document.getElementById('cdTeaserBox');
  const dateSummary = document.getElementById('cdDateSummary');

  // Listen for date-revealed event from scratch card
  window.addEventListener('date-revealed', () => {
    teaserBox?.classList.add('hidden');
    dateSummary?.classList.remove('hidden');
  });

  // Save the date button (.ics)
  const saveBtn = document.getElementById('saveTheDateBtn');
  saveBtn?.addEventListener('click', () => {
    downloadIcsFile(
      {
        title: `${couple.headline} - Engagement Ceremony`,
        description: `Engagement ceremony of ${couple.groom} & ${couple.bride}.\nVenue: ${mainEvent.venue}, ${mainEvent.floor}.\nKarachi, Pakistan.`,
        location: `${mainEvent.venue}, ${mainEvent.address}`,
        startISO: mainEvent.startISO,
        endISO: mainEvent.endISO,
        timeZone: eventDate.timeZone,
      },
      'hammad-ayesha-engagement-save-the-date'
    );
  });

  // Live timer tick
  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minsEl = document.getElementById('cdMinutes');
  const secsEl = document.getElementById('cdSeconds');

  let lastValues: CountdownValues | null = null;
  let timerInterval: number | null = null;

  const updateClock = () => {
    const vals = calculateCountdown(eventDate.iso);

    if (!lastValues || lastValues.days !== vals.days) {
      if (daysEl) daysEl.textContent = String(vals.days).padStart(2, '0');
    }
    if (!lastValues || lastValues.hours !== vals.hours) {
      if (hoursEl) hoursEl.textContent = String(vals.hours).padStart(2, '0');
    }
    if (!lastValues || lastValues.minutes !== vals.minutes) {
      if (minsEl) minsEl.textContent = String(vals.minutes).padStart(2, '0');
    }
    if (!lastValues || lastValues.seconds !== vals.seconds) {
      if (secsEl) secsEl.textContent = String(vals.seconds).padStart(2, '0');
    }

    lastValues = vals;
  };

  const startTimer = () => {
    if (timerInterval === null) {
      updateClock();
      timerInterval = window.setInterval(updateClock, 1000);
    }
  };

  const stopTimer = () => {
    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };

  // Respect Page Visibility API
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopTimer();
    } else {
      startTimer();
    }
  });

  startTimer();
}
