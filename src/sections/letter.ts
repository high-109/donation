/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { INVITATION_CONFIG } from '../config.ts';

gsap.registerPlugin(ScrollTrigger);

export function initLetter(container: HTMLElement): void {
  const { verses, letter, couple } = INVITATION_CONFIG;

  container.innerHTML = `
    <div class="letter-pinned-container" id="letterPinned">
      <!-- Headpiece -->
      <img 
        src="/assets/headpiece.svg" 
        alt="" 
        class="letter-headpiece letter-fade-item" 
        width="180" 
        height="50" 
        loading="lazy"
        aria-hidden="true" 
      />

      <!-- Parchment Scroll Card -->
      <article class="letter-parchment" id="letterParchment">
        <!-- Quranic Verse 30:21 -->
        <div class="letter-quran-box letter-fade-item">
          <p class="quran-arabic" lang="ar" dir="rtl">
            ${verses.quranArabic}
          </p>
          <blockquote class="quran-translation">
            “${verses.quranTranslation}”
          </blockquote>
          <p class="quran-reference">${verses.quranReference}</p>
        </div>

        <!-- Letter Body -->
        <div class="letter-body">
          <p class="font-caps letter-fade-item" style="color: var(--accent-gold); margin-bottom: 0.25rem; font-size: var(--text-xs); letter-spacing: 0.25em;">
            ${letter.chapter}
          </p>
          <h2 class="parchment-heading letter-fade-item">
            ${letter.salutation}
          </h2>

          <p class="parchment-text letter-fade-item">
            ${letter.paragraphs[0]}
          </p>

          <p class="parchment-text letter-fade-item">
            ${letter.paragraphs[1]}
          </p>

          <!-- Sign-off & Small Wax Seal Monogram -->
          <div class="letter-sign-off letter-fade-item">
            <div>
              <p class="parchment-text" style="font-size: var(--text-sm); color: var(--parchment-ink-muted);">
                With endless love and gratitude,
              </p>
              <div class="signature-text">
                ${letter.signOff}
              </div>
            </div>

            <img 
              src="/assets/wax-seal.svg" 
              alt="Wax seal monogram ${couple.monogram}" 
              class="letter-seal-mini" 
              width="68" 
              height="68" 
              loading="lazy" 
            />
          </div>
        </div>
      </article>

      <p class="scroll-unroll-hint" id="letterUnrollHint" aria-hidden="true">
        Scroll to unroll letter
      </p>
    </div>
  `;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const parchment = document.getElementById('letterParchment');
  const items = container.querySelectorAll('.letter-fade-item');
  const hint = document.getElementById('letterUnrollHint');

  // Timeline for scroll-unrolled parchment
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top 75%',
      end: 'bottom 40%',
      scrub: 0.8,
      onUpdate: (self) => {
        if (self.progress > 0.05 && hint) {
          hint.style.opacity = '0';
        }
      },
    },
  });

  // Unroll physical parchment: scales from folded/curled state to flat regal parchment
  tl.fromTo(
    parchment,
    { scaleY: 0.25, transformOrigin: 'top center', filter: 'blur(3px)', opacity: 0.6 },
    { scaleY: 1, filter: 'blur(0px)', opacity: 1, duration: 1.2, ease: 'power2.out' }
  );

  // Staggered text line fades up inside the letter
  tl.fromTo(
    items,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power1.out', stagger: 0.2 },
    '-=0.7'
  );
}
