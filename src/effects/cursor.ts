/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function setupCursorGlow(): void {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  // Only enable on fine pointer (desktop mouse), never on touch devices
  if (!window.matchMedia('(pointer: fine)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let isMoving = false;

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse') {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMoving) {
        isMoving = true;
        glow.classList.add('active');
        animate();
      }
    }
  });

  document.addEventListener('mouseleave', () => {
    glow.classList.remove('active');
  });

  document.addEventListener('mouseenter', () => {
    glow.classList.add('active');
  });

  function animate() {
    // Smooth lerp follow
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    glow!.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(animate);
  }
}
