/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { INVITATION_CONFIG, CelebrationEvent } from '../config.ts';
import { downloadIcsFile } from '../utils/ics.ts';

gsap.registerPlugin(ScrollTrigger);

export function initCelebrations(container: HTMLElement): void {
  const { events } = INVITATION_CONFIG;

  const renderCard = (event: CelebrationEvent) => `
    <article class="event-card" id="card-${event.id}" data-event-id="${event.id}">
      <div class="event-card-shine" aria-hidden="true"></div>

      <div class="event-icon-box">
        <img 
          src="${event.icon}" 
          alt="${event.shortTitle} icon" 
          class="event-icon-img" 
          width="72" 
          height="72" 
          loading="lazy" 
        />
      </div>

      <h3 class="event-title">${event.title}</h3>
      <p class="event-date-time">
        <span class="event-date-display" id="eventDateText-${event.id}">
          ${(window as unknown as { __DATE_REVEALED?: boolean }).__DATE_REVEALED ? event.date : '<a href="#heroScratchSection" class="date-unrevealed-link">✨ Scratch card above to reveal date ✨</a>'}
        </span> • ${event.time}
      </p>

      <div class="event-venue-box">
        <p class="event-venue-name">${event.venue}</p>
        <p class="event-venue-area">${event.area}</p>
      </div>

      <p class="event-dress-code">
        Dress Code: ${event.dressCode}
      </p>

      <ul class="event-timeline" aria-label="Order of events for ${event.shortTitle}">
        ${event.timeline
          .map(
            (step) => `
          <li class="timeline-step">
            <strong>${step.time}</strong>
            <span>${step.label}</span>
          </li>
        `
          )
          .join('')}
      </ul>

      <div class="event-actions">
        <a 
          href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.googleMapsQuery)}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="btn btn-secondary" 
          aria-label="Get directions to ${event.venue}"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
          </svg>
          Directions
        </a>

        <button 
          type="button" 
          class="btn btn-primary add-cal-btn" 
          data-event-id="${event.id}"
          aria-label="Add ${event.shortTitle} to your calendar"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Add to Cal
        </button>
      </div>
    </article>
  `;

  container.innerHTML = `
    <div class="container">
      <p class="section-subtitle celebrations-reveal">Order of Events</p>
      <h2 class="section-title celebrations-reveal">The Celebrations</h2>

      <div class="celebrations-grid">
        ${events.map(renderCard).join('')}
      </div>
    </div>
  `;

  // Attach .ics download handlers
  container.querySelectorAll('.add-cal-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-event-id');
      const event = events.find((e) => e.id === id);
      if (event) {
        downloadIcsFile(
          {
            title: `${event.title} - ${INVITATION_CONFIG.couple.shortHeadline}`,
            description: `${event.title} at ${event.venue}.\nDress code: ${event.dressCode}.\nKarachi, Pakistan.`,
            location: `${event.venue}, ${event.address}`,
            startISO: event.startISO,
            endISO: event.endISO,
            timeZone: INVITATION_CONFIG.eventDate.timeZone,
          },
          `hammad-ayesha-${event.id}`
        );
      }
    });
  });

  // Listen for date-revealed event from scratch card
  window.addEventListener('date-revealed', () => {
    events.forEach((event) => {
      const dateEl = document.getElementById(`eventDateText-${event.id}`);
      if (dateEl) {
        dateEl.innerHTML = event.date;
      }
    });
  });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Stagger entrance for event cards
  const cards = container.querySelectorAll('.event-card');
  gsap.fromTo(
    cards,
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.1,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 75%',
      },
    }
  );

  // 3D tilt hover on desktop
  if (window.matchMedia('(pointer: fine)').matches) {
    cards.forEach((card) => {
      const el = card as HTMLElement;
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotX = (y / rect.height) * -8;
        const rotY = (x / rect.width) * 8;
        el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }
}
