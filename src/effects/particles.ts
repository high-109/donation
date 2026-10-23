/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  vx: number;
  vy: number;
  swaySpeed: number;
  swayOffset: number;
}

export class AmbientParticles {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private particles: Particle[] = [];
  private animId: number | null = null;
  private isPaused: boolean = false;
  private width = 0;
  private height = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.handleResize = this.handleResize.bind(this);
    this.tick = this.tick.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);

    this.init();
  }

  private init(): void {
    if (!this.ctx) return;
    this.handleResize();
    window.addEventListener('resize', this.handleResize, { passive: true });
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      this.start();
    }
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

    this.createParticles();
  }

  private createParticles(): void {
    const isMobile = this.width < 768;
    const count = isMobile ? 24 : 45;
    const colors = ['#c5a059', '#dfb87c', '#e6c88b', '#a67c48', '#d4af37'];

    this.particles = [];
    for (let i = 0; i < count; i++) {
      const baseAlpha = 0.2 + Math.random() * 0.55;
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: 1 + Math.random() * 2.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: baseAlpha,
        baseAlpha,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(0.3 + Math.random() * 0.6), // float gently upwards
        swaySpeed: 0.001 + Math.random() * 0.002,
        swayOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  private handleVisibilityChange(): void {
    if (document.hidden) {
      this.pause();
    } else {
      this.resume();
    }
  }

  public start(): void {
    if (this.animId !== null) return;
    this.isPaused = false;
    this.animId = requestAnimationFrame(this.tick);
  }

  public pause(): void {
    this.isPaused = true;
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  public resume(): void {
    if (this.animId === null && !document.hidden) {
      this.isPaused = false;
      this.animId = requestAnimationFrame(this.tick);
    }
  }

  private tick(timestamp: number): void {
    if (this.isPaused || !this.ctx) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Subtle horizontal sinusoidal drift
      const sway = Math.sin(timestamp * p.swaySpeed + p.swayOffset) * 0.45;
      p.x += p.vx + sway;
      p.y += p.vy;

      // Wrap around edges
      if (p.y < -10) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;

      // Render glowing soft circle
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = p.color;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    this.animId = requestAnimationFrame(this.tick);
  }

  public destroy(): void {
    this.pause();
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }
}
