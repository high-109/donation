/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { INVITATION_CONFIG } from '../config.ts';
import { FloatingLanternSystem } from '../effects/lanterns.ts';
import { SmoothScroller } from '../effects/smoothScroll.ts';
import { audioManager } from '../effects/audio.ts';

export interface ClosingCallbacks {
  onReplay: () => void;
}

export function initClosing(
  container: HTMLElement,
  lanternSystem: FloatingLanternSystem,
  scroller: SmoothScroller,
  callbacks: ClosingCallbacks
): void {
  const { closing } = INVITATION_CONFIG;

  container.innerHTML = `
    <!-- Floral corners -->
    <img 
      src="/assets/floral-corner-left.svg" 
      alt="" 
      class="floral-corner floral-corner-bl" 
      width="180" 
      height="180" 
      loading="lazy"
      aria-hidden="true" 
    />
    <img 
      src="/assets/floral-corner-right.svg" 
      alt="" 
      class="floral-corner floral-corner-br" 
      width="180" 
      height="180" 
      loading="lazy"
      aria-hidden="true" 
    />

    <div class="closing-container">
      <!-- Main sentiment matching video 00:17 - 00:21 -->
      <h2 class="closing-sentiment-text">
        “${closing.sentiment}”
      </h2>

      <!-- Gold filigree divider -->
      <img 
        src="/assets/divider-ornate.svg" 
        alt="" 
        class="ornamental-divider" 
        width="260" 
        height="30" 
        loading="lazy"
        aria-hidden="true" 
      />

      <!-- Rose Floral Wreath with AH Monogram matching video 00:23 - 00:25 -->
      <div class="closing-wreath-box">
        <img 
          src="/assets/floral-wreath-ah.svg" 
          alt="AH monogram floral wreath" 
          class="closing-wreath-img" 
          width="200" 
          height="200" 
          loading="lazy" 
        />
      </div>

      <!-- Arabic Dua -->
      <p class="arabic-dua" lang="ar" dir="rtl" style="margin-top: 1.5rem;">
        ${closing.duaArabic}
      </p>

      <p class="font-serif" style="font-style: italic; color: var(--ink-muted); max-width: 520px; margin: 0.75rem auto 1.5rem; font-size: var(--text-base);">
        “${closing.duaTranslation}”
      </p>

      <h3 class="hero-title" style="font-size: var(--text-xl); margin: 0.5rem 0;" id="closingCoupleNames">
        ${(window as unknown as { __DATE_REVEALED?: boolean }).__DATE_REVEALED ? closing.familyNames : 'Hammad Sheikh & Ayesha Akram'}
      </h3>

      <!-- Action Buttons -->
      <div class="closing-actions">
        <button type="button" id="releaseLanternBtn" class="btn btn-primary" aria-label="Release a glowing sky lantern">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M12 2v20M17 5H7M19 12H5M16 19H8" />
          </svg>
          Release a Lantern (<span id="lanternCounter">0</span>)
        </button>

        <button type="button" id="replayInviteBtn" class="btn btn-secondary" aria-label="Replay invitation from the beginning">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg>
          Replay Invitation
        </button>
      </div>

      <footer class="footer-credit">
        <p>${closing.credit}</p>
      </footer>
    </div>
  `;

  // Listen for date-revealed event
  window.addEventListener('date-revealed', () => {
    const el = document.getElementById('closingCoupleNames');
    if (el) el.textContent = closing.familyNames;
  });

  const releaseBtn = document.getElementById('releaseLanternBtn');
  const lanternCounter = document.getElementById('lanternCounter');
  const replayBtn = document.getElementById('replayInviteBtn');

  let releasedCount = 0;

  releaseBtn?.addEventListener('click', () => {
    releasedCount++;
    if (lanternCounter) {
      lanternCounter.textContent = String(releasedCount);
    }
    lanternSystem.launchLantern();
    audioManager.playChimeNote(659.25, 2.5, 0.08);
  });

  replayBtn?.addEventListener('click', () => {
    scroller.scrollTo(0);
    setTimeout(() => {
      callbacks.onReplay();
    }, 600);
  });
}
