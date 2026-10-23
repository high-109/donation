/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { INVITATION_CONFIG } from '../config.ts';

gsap.registerPlugin(ScrollTrigger);

export function initFamilies(container: HTMLElement): void {
  const { families, couple } = INVITATION_CONFIG;

  container.innerHTML = `
    <!-- Floral corners with parallax -->
    <img 
      src="/assets/floral-corner-left.svg" 
      alt="" 
      class="floral-corner floral-corner-bl families-floral-left" 
      width="200" 
      height="200" 
      loading="lazy"
      aria-hidden="true" 
    />
    <img 
      src="/assets/floral-corner-right.svg" 
      alt="" 
      class="floral-corner floral-corner-br families-floral-right" 
      width="200" 
      height="200" 
      loading="lazy"
      aria-hidden="true" 
    />

    <div class="families-container">
      <p class="section-subtitle families-reveal">Honoured Lineage</p>
      <h2 class="section-title families-reveal">Our Families</h2>

      <div class="family-card-block families-reveal">
        <p class="family-role">${families.groomParentsTitle}</p>
        <h3 class="family-names">${families.groomParents}</h3>
        <p class="font-caps" style="color: var(--ink-muted); margin-top: 0.35rem; font-size: 0.75rem;">
          ${families.groomSubtitle}
        </p>
      </div>

      <div class="families-ampersand families-reveal" aria-hidden="true">
        &amp;
      </div>

      <div class="family-card-block families-reveal">
        <p class="family-role">${families.brideParentsTitle}</p>
        <h3 class="family-names">${families.brideParents}</h3>
        <p class="font-caps" style="color: var(--ink-muted); margin-top: 0.35rem; font-size: 0.75rem;">
          ${families.brideSubtitle}
        </p>
      </div>

      <p class="invitation-cordial families-reveal">
        ${families.invitationNote}
      </p>

      <h3 class="hero-title families-reveal" style="font-size: var(--text-2xl); margin-top: 1.25rem;">
        ${couple.headline}
      </h3>
    </div>
  `;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const elements = container.querySelectorAll('.families-reveal');

  gsap.fromTo(
    elements,
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.0,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
      },
    }
  );

  gsap.to('.families-floral-left', {
    y: -50,
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });

  gsap.to('.families-floral-right', {
    y: -70,
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}
