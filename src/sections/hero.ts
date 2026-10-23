/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { INVITATION_CONFIG } from '../config.ts';
import { ScratchCard } from '../effects/scratchCard.ts';
import { calculateCountdown } from '../utils/countdownCalc.ts';
import { downloadIcsFile } from '../utils/ics.ts';
import { audioManager } from '../effects/audio.ts';

gsap.registerPlugin(ScrollTrigger);

export function initHero(container: HTMLElement): void {
  const { couple, verses, eventDate, families, venue } = INVITATION_CONFIG;

  container.innerHTML = `
    <div class="video-invitation-card" id="mainInvitationCard">
      <!-- Decorative floral corners -->
      <img 
        src="/assets/floral-corner-left.svg" 
        alt="" 
        class="floral-corner floral-corner-tl hero-floral" 
        width="160" 
        height="160" 
        loading="eager"
        aria-hidden="true" 
      />
      <img 
        src="/assets/floral-corner-right.svg" 
        alt="" 
        class="floral-corner floral-corner-tr hero-floral" 
        width="160" 
        height="160" 
        loading="eager"
        aria-hidden="true" 
      />

      <!-- Arabic Bismillah Calligraphy -->
      <div class="arabic-text bismillah-heading video-elem" lang="ar" dir="rtl">
        ${verses.bismillah}
      </div>

      <!-- Parents' Line -->
      <div class="card-announcement video-elem">
        <p class="parents-line">${families.parentsHost}</p>
        <p class="request-line">${families.requestLine}</p>
        <p class="ceremony-line">${families.ceremonyTitle}</p>
        <p class="relation-line">${families.relationLine}</p>
      </div>

      <!-- Couple's Names matching video layout -->
      <div class="couple-names-block video-elem">
        <h1 class="groom-name">${couple.groomFull}</h1>
        <p class="groom-bin">${couple.groomBin}</p>
        <p class="names-connector font-script">with</p>
        <h2 class="bride-name">${couple.brideFull}</h2>
      </div>

      <!-- Couple Artwork (Replaced gazebo with user transparent couple image) -->
      <div class="couple-illustration-wrapper video-elem">
        <div class="couple-pedestal-glow" aria-hidden="true"></div>
        <img 
          src="/assets/couple_transparent.png" 
          alt="Hammad Sheikh and Ayesha Akram exchanging rings in elegant ivory and gold celebration attire" 
          class="couple-illustration-img" 
          width="300" 
          height="380" 
          loading="eager"
        />
      </div>

      <!-- Ornamental separator divider -->
      <div class="video-elem">
        <img 
          src="/assets/divider-ornate.svg" 
          alt="" 
          class="ornamental-divider" 
          width="280" 
          height="30" 
          aria-hidden="true" 
        />
      </div>

      <!-- Interactive Date Reveal Scratch Card directly after couple introduction -->
      <div class="hero-scratch-section video-elem" id="heroScratchSection">
        <div class="scratch-headline-box">
          <span class="scratch-badge">✦ Celebration Date &amp; Venue ✦</span>
          <h3 class="scratch-prompt-title">Uncover the Sacred Day</h3>
          <p class="scratch-prompt-sub">Scratch the golden card below with your finger or mouse to reveal the auspicious date &amp; venue</p>
        </div>

        <div class="scratch-card-box hero-scratch-box" id="heroScratchBox">
          <!-- Hidden content revealed upon scratching -->
          <div class="scratch-hidden-content" id="heroScratchContent">
            <div class="revealed-header">
              <span class="revealed-sparkle">✦</span>
              <span class="revealed-badge font-caps">Engagement Ceremony</span>
              <span class="revealed-sparkle">✦</span>
            </div>
            <div class="revealed-date-day">
              ${eventDate.displayDay}
            </div>
            <div class="revealed-date-month">
              ${eventDate.displayMonthYear}
            </div>
            <div class="revealed-time">
              ${eventDate.time} PKT
            </div>
            <div class="revealed-venue">
              <svg class="map-pin-icon-sm" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span>${venue.name}, ${venue.floor}</span>
            </div>
            <p class="revealed-address">${venue.fullAddress}</p>

            <!-- Mini Live Countdown -->
            <div class="revealed-countdown-row" id="heroCountdownRow" title="Time remaining until the engagement ceremony">
              <div class="mini-cd-col"><span id="heroCdDays">--</span><small>Days</small></div>
              <span class="mini-cd-sep">:</span>
              <div class="mini-cd-col"><span id="heroCdHours">--</span><small>Hours</small></div>
              <span class="mini-cd-sep">:</span>
              <div class="mini-cd-col"><span id="heroCdMins">--</span><small>Mins</small></div>
              <span class="mini-cd-sep">:</span>
              <div class="mini-cd-col"><span id="heroCdSecs">--</span><small>Secs</small></div>
            </div>

            <div class="revealed-actions-row">
              <button type="button" id="heroSaveDateBtn" class="btn btn-primary btn-sm" aria-label="Save engagement date to your calendar">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Save Date
              </button>
              <a 
                href="${venue.directionsUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="btn btn-secondary btn-sm"
                aria-label="View Ghanchi Community Banquet on Google Maps"
              >
                View on Map
              </a>
            </div>
          </div>

          <canvas id="heroScratchCanvas" class="scratch-canvas" aria-label="Scratch card to reveal engagement date"></canvas>
        </div>

        <button id="heroScratchFallbackBtn" class="scratch-reveal-btn" type="button">
          ✨ Can't scratch? Tap here to reveal date ✨
        </button>
      </div>

      <!-- Scroll cue -->
      <a href="#letter" class="scroll-cue video-elem" aria-label="Scroll down to letter">
        <span>Scroll to explore</span>
        <svg class="scroll-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </a>
    </div>
  `;

  // Mini live countdown logic
  const daysEl = document.getElementById('heroCdDays');
  const hoursEl = document.getElementById('heroCdHours');
  const minsEl = document.getElementById('heroCdMins');
  const secsEl = document.getElementById('heroCdSecs');
  let countdownInterval: number | null = null;

  const updateMiniCountdown = () => {
    const vals = calculateCountdown(eventDate.iso);
    if (daysEl) daysEl.textContent = String(vals.days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(vals.hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(vals.minutes).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(vals.seconds).padStart(2, '0');
  };

  const startMiniCountdown = () => {
    if (countdownInterval === null) {
      updateMiniCountdown();
      countdownInterval = window.setInterval(updateMiniCountdown, 1000);
    }
  };

  // Scratch card instance
  const canvasEl = document.getElementById('heroScratchCanvas') as HTMLCanvasElement;
  const fallbackBtn = document.getElementById('heroScratchFallbackBtn');
  let scratchCard: ScratchCard | null = null;

  const handleReveal = () => {
    // Mark global state
    (window as unknown as { __DATE_REVEALED?: boolean }).__DATE_REVEALED = true;
    window.dispatchEvent(new CustomEvent('date-revealed', { detail: { date: eventDate } }));

    audioManager.playChimeNote(659.25, 2.8, 0.1);
    fallbackBtn?.remove();
    startMiniCountdown();
  };

  if (canvasEl) {
    scratchCard = new ScratchCard({
      canvas: canvasEl,
      threshold: 50,
      onReveal: handleReveal,
    });
  }

  fallbackBtn?.addEventListener('click', () => {
    scratchCard?.revealDate();
  });

  // ICS download button
  const saveBtn = document.getElementById('heroSaveDateBtn');
  saveBtn?.addEventListener('click', () => {
    const mainEvent = INVITATION_CONFIG.events[0];
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

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const elements = container.querySelectorAll('.video-elem');
  gsap.fromTo(
    elements,
    { y: 25, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.1,
      stagger: 0.12,
      ease: 'power2.out',
      delay: 0.3,
    }
  );
}
