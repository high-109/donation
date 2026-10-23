/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PreloaderCallbacks {
  onComplete: () => void;
}

export function initPreloader(container: HTMLElement, callbacks: PreloaderCallbacks): void {
  container.innerHTML = `
    <div class="preloader-glow-burst" aria-hidden="true"></div>
    <div class="preloader-lantern-box" aria-hidden="true">
      <img src="/assets/lantern.svg" alt="" class="preloader-lantern-img" width="80" height="120" />
      <div id="preloaderLanternFill" class="preloader-lantern-fill"></div>
    </div>
    <h2 class="preloader-title">Lighting the lanterns</h2>
    <div id="preloaderPercent" class="preloader-percent" aria-live="polite">0%</div>
    <div class="preloader-track" aria-hidden="true">
      <div id="preloaderBar" class="preloader-bar"></div>
    </div>
    <button id="preloaderSkip" class="preloader-skip" type="button">
      Taking a while? Open now
    </button>
  `;

  // Lock scroll during preloader
  document.body.classList.add('scroll-locked');

  const lanternFill = document.getElementById('preloaderLanternFill');
  const percentEl = document.getElementById('preloaderPercent');
  const barEl = document.getElementById('preloaderBar');
  const skipBtn = document.getElementById('preloaderSkip');

  let currentPercent = 0;
  let targetPercent = 10;
  let isDone = false;

  // Fallback after 6s
  const fallbackTimer = window.setTimeout(() => {
    if (!isDone && skipBtn) {
      skipBtn.classList.add('visible');
    }
  }, 6000);

  const complete = () => {
    if (isDone) return;
    isDone = true;
    clearTimeout(fallbackTimer);

    // Smooth glow burst exit
    container.classList.add('fade-out');
    setTimeout(() => {
      container.remove();
      callbacks.onComplete();
    }, 700);
  };

  skipBtn?.addEventListener('click', () => {
    complete();
  });

  // Track real asset loading
  const assetsToLoad = [
    '/assets/lantern.svg',
    '/assets/wax-seal.svg',
    '/assets/floral-corner-left.svg',
    '/assets/floral-corner-right.svg',
    '/assets/divider-ornate.svg',
    '/assets/headpiece.svg',
    '/assets/quill.svg',
    '/assets/still-life.svg',
    '/assets/garlands.svg',
    '/assets/icon-mangni.svg',
    '/assets/icon-dinner.svg',
    '/assets/icon-dholki.svg',
  ];

  let loadedCount = 0;
  const totalAssets = assetsToLoad.length;

  const updateProgress = () => {
    const assetProgress = (loadedCount / totalAssets) * 80;
    targetPercent = Math.min(100, Math.floor(assetProgress + 20));
  };

  // Font loading progress
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      targetPercent = Math.max(targetPercent, 70);
    });
  }

  // Preload images
  assetsToLoad.forEach((src) => {
    const img = new Image();
    img.src = src;
    img.onload = img.onerror = () => {
      loadedCount++;
      updateProgress();
    };
  });

  // Smooth progress animation loop
  const step = () => {
    if (isDone) return;

    if (currentPercent < targetPercent) {
      currentPercent += Math.max(1, Math.floor((targetPercent - currentPercent) * 0.15));
    }

    if (percentEl) percentEl.textContent = `${currentPercent}%`;
    if (barEl) barEl.style.width = `${currentPercent}%`;
    if (lanternFill) lanternFill.style.opacity = `${currentPercent / 100}`;

    if (currentPercent >= 100) {
      setTimeout(complete, 300);
    } else {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);

  // If window loaded or cached, push to 100%
  if (document.readyState === 'complete') {
    targetPercent = 100;
  } else {
    window.addEventListener('load', () => {
      targetPercent = 100;
    });
  }
}
