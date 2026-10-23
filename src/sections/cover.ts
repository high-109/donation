/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { INVITATION_CONFIG } from '../config.ts';
import { audioManager } from '../effects/audio.ts';

export interface CoverCallbacks {
  onOpen: () => void;
}

export function initCover(container: HTMLElement, callbacks: CoverCallbacks): void {
  const { couple, eventDate } = INVITATION_CONFIG;

  container.innerHTML = `
    <!-- Royal Haveli Sandstone Arch Frame -->
    <div class="haveli-arch-frame" aria-hidden="true">
      <div class="haveli-scallop-arch"></div>
    </div>

    <!-- Double Wooden Palace Doors -->
    <div class="haveli-door-container" id="haveliDoorContainer">
      <!-- Left Door Panel -->
      <div class="haveli-door haveli-door-left">
        <div class="door-panels-grid">
          ${Array(8)
            .fill(0)
            .map(
              () => `
            <div class="door-panel-cell">
              <span class="door-stud"></span>
            </div>
          `
            )
            .join('')}
        </div>
        <div class="door-handle door-handle-left">
          <div class="door-ring"></div>
        </div>
      </div>

      <!-- Right Door Panel -->
      <div class="haveli-door haveli-door-right">
        <div class="door-panels-grid">
          ${Array(8)
            .fill(0)
            .map(
              () => `
            <div class="door-panel-cell">
              <span class="door-stud"></span>
            </div>
          `
            )
            .join('')}
        </div>
        <div class="door-handle door-handle-right">
          <div class="door-ring"></div>
        </div>
      </div>

      <!-- Center Floral Wreath Seal with AH Monogram -->
      <div class="door-center-seal-wrapper">
        <button 
          id="haveliSealBtn" 
          class="haveli-seal-btn" 
          type="button" 
          aria-label="Tap to open Hammad & Ayesha's engagement invitation"
          title="Tap to open the royal doors"
        >
          <img 
            src="/assets/floral-wreath-ah.svg" 
            alt="Floral wreath with AH monogram" 
            class="haveli-wreath-img" 
            width="220" 
            height="220" 
          />
        </button>

        <div class="door-tap-cue">
          <span class="pulse-dot"></span>
          <span>Tap the seal to open</span>
          <span class="pulse-dot"></span>
        </div>
      </div>
    </div>
  `;

  const sealBtn = document.getElementById('haveliSealBtn');
  const doorContainer = document.getElementById('haveliDoorContainer');
  let hasOpened = false;

  const openDoors = () => {
    if (hasOpened) return;
    hasOpened = true;

    // Play tactile sound effect
    audioManager.playSealCrack();
    sealBtn?.classList.add('seal-cracking');

    // Start background music if enabled
    if (!audioManager.getMuted()) {
      audioManager.startAmbient();
    }

    // Update floating audio UI
    const audioBtn = document.getElementById('audioToggleBtn');
    if (audioBtn) {
      audioBtn.setAttribute('aria-pressed', String(!audioManager.getMuted()));
      const mutedIcon = document.getElementById('audioIconMuted');
      const playIcon = document.getElementById('audioIconPlaying');
      if (!audioManager.getMuted()) {
        mutedIcon?.classList.add('hidden');
        playIcon?.classList.remove('hidden');
      }
    }

    // Animate Haveli doors splitting open outwards
    doorContainer?.classList.add('doors-open');
    container.classList.add('opened');

    setTimeout(() => {
      document.body.classList.remove('scroll-locked');
      callbacks.onOpen();
    }, 600);

    setTimeout(() => {
      container.style.display = 'none';
    }, 1800);
  };

  sealBtn?.addEventListener('click', openDoors);
  sealBtn?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDoors();
    }
  });
}
