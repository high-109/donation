/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import confetti from 'canvas-confetti';
import { calculateClearedPercentage } from '../utils/scratchMath.ts';

export interface ScratchCardOptions {
  canvas: HTMLCanvasElement;
  onReveal: () => void;
  threshold?: number; // default 60%
}

export class ScratchCard {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private onReveal: () => void;
  private threshold: number;
  private isDrawing: boolean = false;
  private isRevealed: boolean = false;
  private width: number = 340;
  private height: number = 240;
  private lastCheckTime: number = 0;

  constructor(options: ScratchCardOptions) {
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.onReveal = options.onReveal;
    this.threshold = options.threshold ?? 60;

    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);

    this.init();
  }

  private init(): void {
    if (!this.ctx) return;
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || 340;
    this.height = rect.height || 240;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);

    this.drawFoilCover();
    this.attachEvents();
  }

  private drawFoilCover(): void {
    if (!this.ctx) return;
    this.ctx.globalCompositeOperation = 'source-over';

    // Luxe brushed gold & champagne gradient
    const grad = this.ctx.createLinearGradient(0, 0, this.width, this.height);
    grad.addColorStop(0, '#d4af7a');
    grad.addColorStop(0.3, '#eed9b8');
    grad.addColorStop(0.6, '#b88b4d');
    grad.addColorStop(1, '#9a7036');

    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Decorative inner heart stamp & text on foil
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(158, 115, 59, 0.45)';
    this.ctx.lineWidth = 1.5;
    this.ctx.strokeRect(10, 10, this.width - 20, this.height - 20);

    // Subtle patterned sparkle dots
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    for (let x = 20; x < this.width; x += 30) {
      for (let y = 20; y < this.height; y += 30) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // Call to action text on top of scratch surface (warm antique bronze on gold)
    this.ctx.fillStyle = '#5a4228';
    this.ctx.font = '600 13px Cinzel, serif';
    this.ctx.textAlign = 'center';
    this.ctx.letterSpacing = '2px';
    this.ctx.fillText('SCRATCH TO REVEAL DATE', this.width / 2, this.height / 2 - 10);

    this.ctx.font = '18px Alex Brush, cursive';
    this.ctx.fillStyle = '#7d5a31';
    this.ctx.fillText('Tap or drag across with love', this.width / 2, this.height / 2 + 18);

    this.ctx.restore();
  }

  private attachEvents(): void {
    this.canvas.addEventListener('pointerdown', this.handlePointerDown);
    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp);
    window.addEventListener('pointercancel', this.handlePointerUp);
  }

  private getCanvasPoint(e: PointerEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  private handlePointerDown(e: PointerEvent): void {
    if (this.isRevealed) return;
    this.isDrawing = true;
    this.scratchAt(e);
  }

  private handlePointerMove(e: PointerEvent): void {
    if (!this.isDrawing || this.isRevealed) return;
    this.scratchAt(e);
  }

  private handlePointerUp(): void {
    this.isDrawing = false;
    this.checkClearedRatio();
  }

  private scratchAt(e: PointerEvent): void {
    if (!this.ctx || this.isRevealed) return;
    const { x, y } = this.getCanvasPoint(e);

    this.ctx.save();
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.beginPath();
    this.ctx.arc(x, y, 22, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();

    // Throttled check during dragging
    const now = performance.now();
    if (now - this.lastCheckTime > 300) {
      this.lastCheckTime = now;
      this.checkClearedRatio();
    }
  }

  public checkClearedRatio(): void {
    if (!this.ctx || this.isRevealed) return;

    try {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const imgData = this.ctx.getImageData(0, 0, this.width * dpr, this.height * dpr);
      const percent = calculateClearedPercentage(imgData, 12);

      if (percent >= this.threshold) {
        this.revealDate();
      }
    } catch {
      // Security/context fallback
    }
  }

  public revealDate(): void {
    if (this.isRevealed) return;
    this.isRevealed = true;

    // Fade out canvas
    this.canvas.classList.add('fade-revealed');

    // Confetti burst with rose petal & champagne gold palette
    this.triggerPetalConfetti();

    this.onReveal();
  }

  private triggerPetalConfetti(): void {
    const count = 65;
    const defaults = {
      origin: { y: 0.65 },
      colors: ['#d4af7a', '#eed9b8', '#f5ede2', '#c99e63', '#ffffff', '#e2caa5'],
      shapes: ['circle', 'square'] as confetti.Shape[],
      ticks: 200,
      gravity: 0.8,
      scalar: 1.1,
    };

    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.6),
      spread: 60,
      startVelocity: 35,
    });
    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.4),
      spread: 100,
      startVelocity: 45,
    });
  }

  public destroy(): void {
    this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('pointercancel', this.handlePointerUp);
  }
}
