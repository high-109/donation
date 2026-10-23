/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Web Audio API based luxury ambient soundscape and sound effects.
 * Avoids any external network mp3 latency or cross-origin audio failures.
 */
class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private isPlaying: boolean = false;
  private ambientInterval: number | null = null;

  constructor() {
    const saved = localStorage.getItem('invitation_audio_muted');
    if (saved !== null) {
      this.isMuted = saved === 'true';
    } else {
      // Check reduced motion or save-data preferences
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // @ts-expect-error - navigator.connection may exist in Chrome/Android
      const isSaveData = navigator.connection && navigator.connection.saveData;
      this.isMuted = prefersReduced || Boolean(isSaveData);
    }
  }

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('invitation_audio_muted', String(this.isMuted));
    if (this.isMuted) {
      this.stopAmbient();
    } else {
      this.startAmbient();
    }
    return this.isMuted;
  }

  /**
   * Generates a crystalline harp/celeste chime note
   */
  public playChimeNote(freq: number, duration = 2.4, gainLevel = 0.08): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Warm analog slight harmonic detune
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(freq * 0.5, ctx.currentTime);

      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(gainLevel, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      subGain.gain.setValueAtTime(0, now);
      subGain.gain.linearRampToValueAtTime(gainLevel * 0.4, now + 0.05);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);

      osc.connect(gain);
      subOsc.connect(subGain);
      gain.connect(ctx.destination);
      subGain.connect(ctx.destination);

      osc.start(now);
      subOsc.start(now);
      osc.stop(now + duration);
      subOsc.stop(now + duration);
    } catch {
      // AudioContext policy gracefully caught
    }
  }

  /**
   * Sound effect for wax seal cracking/opening
   */
  public playSealCrack(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.03));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      filter.Q.value = 3;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();

      // Follow with a regal resonance chime
      setTimeout(() => {
        this.playChimeNote(523.25, 3.0, 0.12); // C5
      }, 80);
    } catch {
      // Ignore audio error
    }
  }

  /**
   * Ambient melodic loop: Pentatonic luxury harp notes echoing peacefully
   */
  public startAmbient(): void {
    if (this.isMuted || this.isPlaying) return;
    this.isPlaying = true;

    // Pentatonic scale frequencies (C, D, E, G, A, C6)
    const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 659.25];
    let noteIdx = 0;

    const tick = () => {
      if (!this.isPlaying || this.isMuted) return;
      const freq = scale[noteIdx % scale.length];
      this.playChimeNote(freq, 3.2, 0.05);

      if (Math.random() > 0.4) {
        setTimeout(() => {
          const harmonyFreq = scale[(noteIdx + 2) % scale.length];
          this.playChimeNote(harmonyFreq, 2.8, 0.04);
        }, 350);
      }

      noteIdx = (noteIdx + Math.floor(Math.random() * 3 + 1)) % scale.length;
      const nextDelay = 2200 + Math.random() * 1800;
      this.ambientInterval = window.setTimeout(tick, nextDelay);
    };

    tick();
  }

  public stopAmbient(): void {
    this.isPlaying = false;
    if (this.ambientInterval !== null) {
      clearTimeout(this.ambientInterval);
      this.ambientInterval = null;
    }
  }
}

export const audioManager = new AudioManager();
