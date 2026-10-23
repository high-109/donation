/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface FloatingLantern {
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  wobbleOffset: number;
  scale: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export class FloatingLanternSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private lanterns: FloatingLantern[] = [];
  private animId: number | null = null;
  private lanternImage: HTMLImageElement | null = null;
  private isPaused: boolean = false;
  private width = 0;
  private height = 0;
  private static MAX_LANTERNS = 30;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.handleResize = this.handleResize.bind(this);
    this.tick = this.tick.bind(this);
    this.handleVisibility = this.handleVisibility.bind(this);

    this.init();
  }

  private init(): void {
    if (!this.ctx) return;
    this.handleResize();
    window.addEventListener('resize', this.handleResize, { passive: true });
    document.addEventListener('visibilitychange', this.handleVisibility);

    // Load lantern asset
    const img = new Image();
    img.src = '/assets/lantern.svg';
    img.onload = () => {
      this.lanternImage = img;
    };
  }

  private handleResize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
    }
  }

  private handleVisibility(): void {
    if (document.hidden) {
      if (this.animId !== null) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    } else if (this.lanterns.length > 0) {
      this.startLoop();
    }
  }

  public launchLantern(): void {
    if (this.lanterns.length >= FloatingLanternSystem.MAX_LANTERNS) {
      // Remove oldest
      this.lanterns.shift();
    }

    const scale = 0.45 + Math.random() * 0.4;
    const baseW = 60 * scale;
    const baseH = 140 * scale;
    const spawnX = Math.random() * (this.width - baseW * 2) + baseW;
    const spawnY = this.height + 20;

    this.lanterns.push({
      x: spawnX,
      y: spawnY,
      width: baseW,
      height: baseH,
      vy: -(1.2 + Math.random() * 1.4),
      wobbleSpeed: 0.002 + Math.random() * 0.002,
      wobbleAmp: 15 + Math.random() * 20,
      wobbleOffset: Math.random() * Math.PI * 2,
      scale,
      alpha: 1,
      life: 0,
      maxLife: 550 + Math.random() * 200,
    });

    this.startLoop();
  }

  private startLoop(): void {
    if (this.animId === null && !document.hidden) {
      this.animId = requestAnimationFrame(this.tick);
    }
  }

  private tick(timestamp: number): void {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.lanterns.length - 1; i >= 0; i--) {
      const l = this.lanterns[i];
      l.life++;

      // Physics
      const wobble = Math.sin(timestamp * l.wobbleSpeed + l.wobbleOffset) * (l.wobbleAmp * 0.02);
      l.x += wobble;
      l.y += l.vy;

      // Fade out near top of screen or towards end of life
      if (l.y < this.height * 0.4) {
        l.alpha = Math.max(0, l.alpha - 0.006);
      }
      if (l.life >= l.maxLife || l.alpha <= 0.01 || l.y < -l.height) {
        this.lanterns.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = l.alpha;

      // Glow halo beneath lantern
      const glowGrad = this.ctx.createRadialGradient(
        l.x + l.width / 2,
        l.y + l.height * 0.45,
        5,
        l.x + l.width / 2,
        l.y + l.height * 0.45,
        l.width * 1.5
      );
      glowGrad.addColorStop(0, 'rgba(255, 217, 168, 0.6)');
      glowGrad.addColorStop(0.5, 'rgba(232, 180, 184, 0.25)');
      glowGrad.addColorStop(1, 'rgba(212, 175, 122, 0)');

      this.ctx.fillStyle = glowGrad;
      this.ctx.beginPath();
      this.ctx.arc(l.x + l.width / 2, l.y + l.height * 0.45, l.width * 1.5, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw lantern
      if (this.lanternImage) {
        this.ctx.drawImage(this.lanternImage, l.x, l.y, l.width, l.height);
      }
      this.ctx.restore();
    }

    if (this.lanterns.length > 0) {
      this.animId = requestAnimationFrame(this.tick);
    } else {
      this.animId = null;
    }
  }

  public getCount(): number {
    return this.lanterns.length;
  }
}
