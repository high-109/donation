/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class SmoothScroller {
  private lenis: Lenis | null = null;
  private progressBar: HTMLElement | null;

  constructor() {
    this.progressBar = document.getElementById('scrollProgressBar');
    this.init();
  }

  private init(): void {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.8,
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    this.lenis.on('scroll', (e: { progress: number }) => {
      ScrollTrigger.update();
      if (this.progressBar) {
        this.progressBar.style.width = `${Math.min(100, Math.max(0, e.progress * 100))}%`;
      }
    });

    gsap.ticker.add((time: number) => {
      this.lenis?.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Anchor links intercept
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = (anchor as HTMLAnchorElement).getAttribute('href');
        if (href && href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            this.scrollTo(target as HTMLElement);
          }
        }
      });
    });
  }

  public scrollTo(target: HTMLElement | string | number, offset = 0): void {
    if (this.lenis) {
      this.lenis.scrollTo(target, { offset, duration: 1.5 });
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el instanceof HTMLElement) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      }
    }
  }

  public stop(): void {
    this.lenis?.stop();
  }

  public start(): void {
    this.lenis?.start();
  }
}
