/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import './styles/main.css';
import { initPreloader } from './sections/preloader.ts';
import { initCover } from './sections/cover.ts';
import { initHero } from './sections/hero.ts';
import { initLetter } from './sections/letter.ts';
import { initFamilies } from './sections/families.ts';
import { initCelebrations } from './sections/celebrations.ts';
import { initCountdown } from './sections/countdown.ts';
import { initRsvp } from './sections/rsvp.ts';
import { initClosing } from './sections/closing.ts';

import { AmbientParticles } from './effects/particles.ts';
import { FloatingLanternSystem } from './effects/lanterns.ts';
import { SmoothScroller } from './effects/smoothScroll.ts';
import { setupCursorGlow } from './effects/cursor.ts';
import { audioManager } from './effects/audio.ts';

document.addEventListener('DOMContentLoaded', () => {
  // Canvases
  const ambientCanvas = document.getElementById('ambientCanvas') as HTMLCanvasElement;
  const lanternsCanvas = document.getElementById('lanternsCanvas') as HTMLCanvasElement;

  if (ambientCanvas) {
    new AmbientParticles(ambientCanvas);
  }

  let lanternSystem: FloatingLanternSystem | null = null;
  if (lanternsCanvas) {
    lanternSystem = new FloatingLanternSystem(lanternsCanvas);
  }

  // Smooth Scroller
  const scroller = new SmoothScroller();

  // Desktop Cursor Glow
  setupCursorGlow();

  // Enforce strictly light luxury theme - purge any legacy dark preferences
  try {
    localStorage.removeItem('invitation_theme');
  } catch {
    // ignore
  }
  const htmlEl = document.documentElement;
  htmlEl.classList.remove('dark');
  htmlEl.setAttribute('data-theme', 'light-ivory');

  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', '#faf6f0');
  }

  // Floating Audio Toggle Button
  const audioBtn = document.getElementById('audioToggleBtn');
  const mutedIcon = document.getElementById('audioIconMuted');
  const playIcon = document.getElementById('audioIconPlaying');

  const updateAudioUI = (isMuted: boolean) => {
    audioBtn?.setAttribute('aria-pressed', String(!isMuted));
    if (isMuted) {
      mutedIcon?.classList.remove('hidden');
      playIcon?.classList.add('hidden');
    } else {
      mutedIcon?.classList.add('hidden');
      playIcon?.classList.remove('hidden');
    }
  };

  updateAudioUI(audioManager.getMuted());

  audioBtn?.addEventListener('click', () => {
    const isMuted = audioManager.toggleMute();
    updateAudioUI(isMuted);
  });

  // Sections initialization
  const heroEl = document.getElementById('hero');
  const letterEl = document.getElementById('letter');
  const familiesEl = document.getElementById('families');
  const celebrationsEl = document.getElementById('celebrations');
  const countdownEl = document.getElementById('countdown');
  const rsvpEl = document.getElementById('rsvp');
  const closingEl = document.getElementById('closing');
  const coverEl = document.getElementById('cover');
  const preloaderEl = document.getElementById('preloader');

  // Build static content for main sections
  if (heroEl) initHero(heroEl);
  if (letterEl) initLetter(letterEl);
  if (familiesEl) initFamilies(familiesEl);
  if (celebrationsEl) initCelebrations(celebrationsEl);
  if (countdownEl) initCountdown(countdownEl);
  if (rsvpEl) initRsvp(rsvpEl);

  const mountCover = () => {
    if (coverEl) {
      coverEl.style.display = 'flex';
      coverEl.classList.remove('opened');
      initCover(coverEl, {
        onOpen: () => {
          // When cover opens, refresh scroll scroller and trigger hero animations
          scroller.start();
        },
      });
    }
  };

  if (closingEl && lanternSystem) {
    initClosing(closingEl, lanternSystem, scroller, {
      onReplay: () => {
        mountCover();
      },
    });
  }

  // Check URL param ?autostart=1 for direct viewing or automated checks
  const urlParams = new URLSearchParams(window.location.search);
  const autostart = urlParams.get('autostart') === '1';

  if (autostart) {
    preloaderEl?.remove();
    coverEl?.remove();
    document.body.classList.remove('scroll-locked');
    scroller.start();
  } else {
    // Standard luxury experience: Preloader -> Wax Seal Cover -> Main Experience
    if (preloaderEl) {
      initPreloader(preloaderEl, {
        onComplete: () => {
          mountCover();
        },
      });
    }
  }
});
