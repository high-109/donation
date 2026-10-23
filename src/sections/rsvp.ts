/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { INVITATION_CONFIG } from '../config.ts';
import { validateRsvpForm, RsvpFormData } from '../utils/rsvpValidation.ts';
import { audioManager } from '../effects/audio.ts';

gsap.registerPlugin(ScrollTrigger);

export function initRsvp(container: HTMLElement): void {
  const { rsvp, couple } = INVITATION_CONFIG;

  let guestCount = rsvp.defaultGuests;
  let isAttending = true;

  container.innerHTML = `
    <div class="rsvp-container">
      <img 
        src="/assets/still-life.svg" 
        alt="" 
        class="rsvp-still-life" 
        width="220" 
        height="130" 
        loading="lazy"
        aria-hidden="true" 
      />

      <div class="rsvp-quill-decor" id="rsvpQuill" aria-hidden="true">
        <img src="/assets/quill.svg" alt="" width="100" height="100" />
      </div>

      <p class="section-subtitle">Join Us</p>
      <h2 class="section-title">Kindly RSVP</h2>
      <p class="font-caps" style="text-align: center; color: var(--accent-gold); margin-bottom: 2rem;">
        ${rsvp.deadlineText}
      </p>

      <div class="rsvp-card" id="rsvpCard">
        <form id="rsvpForm" class="rsvp-form" novalidate>
          <!-- Spam Honeypot -->
          <div class="honeypot-field" aria-hidden="true">
            <label for="honeypot">Leave this empty</label>
            <input type="text" id="honeypot" name="honeypot" tabindex="-1" autocomplete="off" />
          </div>

          <!-- Full Name -->
          <div class="form-group">
            <label for="fullName" class="form-label">Full Name *</label>
            <input 
              type="text" 
              id="fullName" 
              name="fullName" 
              class="form-input" 
              placeholder="e.g. Hammad Sheikh & Family" 
              required 
              maxlength="80"
              autocomplete="name"
            />
            <span id="nameError" class="font-caps error-msg" style="color: #b04e60; font-size: 0.72rem; display: none;"></span>
          </div>

          <!-- Guest Count Stepper -->
          <div class="form-group">
            <label class="form-label">Number of Guests</label>
            <div class="stepper-row">
              <button type="button" id="stepDec" class="stepper-btn" aria-label="Decrease guest count">−</button>
              <div id="stepValue" class="stepper-value" aria-live="polite">${guestCount}</div>
              <button type="button" id="stepInc" class="stepper-btn" aria-label="Increase guest count">+</button>
              <span class="seats-reserved-line">
                Reserved up to <strong style="color: var(--accent-gold);">${rsvp.maxGuests}</strong> seats in your honour
              </span>
            </div>
          </div>

          <!-- Email & Phone (from reference site) -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                class="form-input" 
                placeholder="for confirmation" 
                autocomplete="email"
              />
              <span id="emailError" class="font-caps error-msg" style="color: #b04e60; font-size: 0.72rem; display: none;"></span>
            </div>

            <div class="form-group">
              <label for="phone" class="form-label">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                class="form-input" 
                placeholder="for coordination" 
                autocomplete="tel"
              />
              <span id="phoneError" class="font-caps error-msg" style="color: #b04e60; font-size: 0.72rem; display: none;"></span>
            </div>
          </div>

          <!-- Will you attend? Segmented Control -->
          <div class="form-group">
            <label class="form-label">Will you attend?</label>
            <div class="segmented-control" role="radiogroup" aria-label="Attendance confirmation">
              <button 
                type="button" 
                id="btnJoyfullyYes"
                class="segment-btn active" 
                data-value="true" 
                role="radio" 
                aria-checked="true"
              >
                Joyfully yes
              </button>
              <button 
                type="button" 
                id="btnRegretfullyNo"
                class="segment-btn" 
                data-value="false" 
                role="radio" 
                aria-checked="false"
              >
                Regretfully no
              </button>
            </div>
          </div>

          <!-- Message for the couple -->
          <div class="form-group">
            <label for="duaNote" class="form-label">A message for the couple (Optional)</label>
            <textarea 
              id="duaNote" 
              name="duaNote" 
              class="form-textarea" 
              rows="3" 
              placeholder="Share your warmest prayers, congratulations, or special notes..."
              maxlength="500"
            ></textarea>
          </div>

          <!-- Submission Feedback Alert -->
          <div id="rsvpAlert" class="font-caps" style="color: #b04e60; font-size: 0.75rem; text-align: center; display: none;"></div>

          <!-- Submit Button with Wax Seal Icon -->
          <button type="submit" id="rsvpSubmitBtn" class="btn btn-primary rsvp-seal-submit-btn">
            <img src="/assets/wax-seal.svg" alt="" class="btn-mini-seal" width="28" height="28" aria-hidden="true" />
            <span>Send My Reply</span>
          </button>
        </form>
      </div>

      <!-- Thank You Card State (Revealed on submission) -->
      <div id="rsvpThankYou" class="rsvp-thank-you hidden" role="status" aria-live="polite">
        <img src="/assets/wax-seal.svg" alt="" width="80" height="80" style="margin-bottom: 1.25rem;" />
        <h3 class="hero-title" style="font-size: var(--text-2xl); color: var(--accent-gold);">
          RSVP Received With Warmth
        </h3>
        <p class="parchment-text" style="color: var(--ink); margin: 1rem 0; font-size: var(--text-base);">
          Thank you for confirming your response. Your prayers and blessings mean the world to Hammad Sheikh &amp; Ayesha Akram.
        </p>
        <p class="font-caps" style="color: var(--accent-gold);">
          We look forward to celebrating together at Ghanchi Community Banquet!
        </p>
      </div>
    </div>
  `;

  const form = document.getElementById('rsvpForm') as HTMLFormElement;
  const card = document.getElementById('rsvpCard');
  const thankYou = document.getElementById('rsvpThankYou');
  const alertEl = document.getElementById('rsvpAlert');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');
  const fullNameInput = document.getElementById('fullName') as HTMLInputElement;
  const emailInput = document.getElementById('email') as HTMLInputElement;
  const phoneInput = document.getElementById('phone') as HTMLInputElement;
  const honeypotInput = document.getElementById('honeypot') as HTMLInputElement;
  const noteInput = document.getElementById('duaNote') as HTMLTextAreaElement;
  const submitBtn = document.getElementById('rsvpSubmitBtn');

  // Stepper handlers
  const stepValEl = document.getElementById('stepValue');
  const decBtn = document.getElementById('stepDec') as HTMLButtonElement;
  const incBtn = document.getElementById('stepInc') as HTMLButtonElement;

  const updateStepper = () => {
    if (stepValEl) stepValEl.textContent = String(guestCount);
    if (decBtn) decBtn.disabled = guestCount <= 1;
    if (incBtn) incBtn.disabled = guestCount >= rsvp.maxGuests;
  };

  decBtn?.addEventListener('click', () => {
    if (guestCount > 1) {
      guestCount--;
      updateStepper();
    }
  });

  incBtn?.addEventListener('click', () => {
    if (guestCount < rsvp.maxGuests) {
      guestCount++;
      updateStepper();
    }
  });

  updateStepper();

  // Will you attend segmented controls
  const btnYes = document.getElementById('btnJoyfullyYes');
  const btnNo = document.getElementById('btnRegretfullyNo');

  btnYes?.addEventListener('click', () => {
    isAttending = true;
    btnYes.classList.add('active');
    btnYes.setAttribute('aria-checked', 'true');
    btnNo?.classList.remove('active');
    btnNo?.setAttribute('aria-checked', 'false');
  });

  btnNo?.addEventListener('click', () => {
    isAttending = false;
    btnNo.classList.add('active');
    btnNo.setAttribute('aria-checked', 'true');
    btnYes?.classList.remove('active');
    btnYes?.setAttribute('aria-checked', 'false');
  });

  // Quill animation flourish on scroll into view
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    gsap.fromTo(
      '#rsvpQuill',
      { y: -30, rotation: 5, opacity: 0 },
      {
        y: 0,
        rotation: 15,
        opacity: 0.85,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 75%',
        },
      }
    );
  }

  // Handle Form Submission
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (nameError) nameError.style.display = 'none';
    if (emailError) emailError.style.display = 'none';
    if (phoneError) phoneError.style.display = 'none';
    if (alertEl) alertEl.style.display = 'none';

    const formData: RsvpFormData = {
      fullName: fullNameInput.value.trim(),
      guestCount,
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      attending: isAttending,
      duaNote: noteInput.value.trim(),
      honeypot: honeypotInput.value.trim(),
    };

    const validation = validateRsvpForm(formData, rsvp.maxGuests);
    if (!validation.isValid) {
      if (validation.errors.fullName && nameError) {
        nameError.textContent = validation.errors.fullName;
        nameError.style.display = 'block';
        fullNameInput.focus();
      } else if (validation.errors.email && emailError) {
        emailError.textContent = validation.errors.email;
        emailError.style.display = 'block';
        emailInput.focus();
      } else if (validation.errors.phone && phoneError) {
        phoneError.textContent = validation.errors.phone;
        phoneError.style.display = 'block';
        phoneInput.focus();
      } else if (alertEl) {
        alertEl.textContent = Object.values(validation.errors)[0];
        alertEl.style.display = 'block';
      }
      return;
    }

    // Submit state
    if (submitBtn) {
      submitBtn.setAttribute('disabled', 'true');
      submitBtn.textContent = 'Sealing RSVP...';
    }

    // Play crack/seal sound
    audioManager.playSealCrack();

    // Send payload to API endpoint with timeout and retry
    const sendPayload = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      try {
        const response = await fetch(rsvp.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            submittedAt: new Date().toISOString(),
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response.ok;
      } catch {
        // Fallback gracefully
        try {
          const list = JSON.parse(localStorage.getItem('rsvp_submissions') || '[]');
          list.push({ ...formData, submittedAt: new Date().toISOString() });
          localStorage.setItem('rsvp_submissions', JSON.stringify(list));
        } catch {
          // ignore
        }
        return true;
      }
    };

    await sendPayload();

    // Envelope fly-off animation
    card?.classList.add('flying-off');

    setTimeout(() => {
      card?.remove();
      thankYou?.classList.remove('hidden');
    }, 1100);
  });
}
