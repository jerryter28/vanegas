// Web Audio API synthesizer for acoustic warnings without external dependencies

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Alerta Temprana (15, 30 o 60 min antes del vencimiento):
   * Tono triple armónico ejecutivo de advertencia.
   */
  public playEarlyWarningChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const frequencies = [659.25, 783.99, 880.0]; // E5, G5, A5

    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.12);

      gain.gain.setValueAtTime(0.001, now + index * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.2, now + index * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.12 + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.12);
      osc.stop(now + index * 0.12 + 0.3);
    });
  }

  /**
   * Notificación Sonora de Tarea Retrasada:
   * Alarma acústica ejecutiva de alta urgencia (pulsos de frecuencia alternada).
   */
  public playDelayedAlarm() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const pulses = [
      { f: 800, time: 0.00, dur: 0.12 },
      { f: 600, time: 0.15, dur: 0.12 },
      { f: 800, time: 0.35, dur: 0.12 },
      { f: 600, time: 0.50, dur: 0.15 },
    ];

    pulses.forEach((pulse) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pulse.f, now + pulse.time);

      gain.gain.setValueAtTime(0.001, now + pulse.time);
      gain.gain.exponentialRampToValueAtTime(0.35, now + pulse.time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + pulse.time + pulse.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + pulse.time);
      osc.stop(now + pulse.time + pulse.dur + 0.05);
    });
  }

  /**
   * Notificación Sonora de Cumplimiento / Aprobación 100%:
   * Tono armónico mayor de éxito.
   */
  public playSuccessChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const chord = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.001, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.5);
    });
  }
}

export const soundManager = new SoundSynthesizer();
