/**
 * Web Audio API synthesizer for birthday sound effects & cheerful melody
 * Ensures reliable audio without relying on external file downloads.
 */

class BirthdayAudioEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private isMelodyPlaying: boolean = false;
  private melodyTimeoutIds: number[] = [];

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    try {
      if (!this.ctx) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtxClass();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  /**
   * Sound of blowing out candles: filtered rushing air / whoosh
   */
  public playBlowSound() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.7);
      filter.Q.setValueAtTime(2.5, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.8);
    } catch {
      // Audio fallback silent
    }
  }

  /**
   * Snappy confetti popper sound
   */
  public playConfettiPop() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);

      // Add high sparkle
      const sparkle = ctx.createOscillator();
      const sparkleGain = ctx.createGain();
      sparkle.type = 'sine';
      sparkle.frequency.setValueAtTime(1400, ctx.currentTime + 0.05);
      sparkle.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.2);

      sparkleGain.gain.setValueAtTime(0.08, ctx.currentTime + 0.05);
      sparkleGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      sparkle.connect(sparkleGain);
      sparkleGain.connect(ctx.destination);
      sparkle.start(ctx.currentTime + 0.05);
      sparkle.stop(ctx.currentTime + 0.23);
    } catch {
      // Audio fallback silent
    }
  }

  /**
   * Cheerful celebration fanfare / arpeggio when candles are blown
   */
  public playCelebrationFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Bright major triad arpeggio with celebratory horn warmth
      const notes = [
        { freq: 261.63, time: 0, dur: 0.18 },    // C4
        { freq: 329.63, time: 0.12, dur: 0.18 }, // E4
        { freq: 392.00, time: 0.24, dur: 0.20 }, // G4
        { freq: 523.25, time: 0.38, dur: 0.65 }, // C5
        { freq: 659.25, time: 0.55, dur: 0.8 },  // E5
        { freq: 783.99, time: 0.70, dur: 1.1 },  // G5
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.001, now + time);
        gain.gain.linearRampToValueAtTime(0.25, now + time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * Magical chime for unwrapping a gift
   */
  public playGiftUnwrapChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const pitches = [587.33, 739.99, 880.0, 1174.66, 1318.51, 1760.0];
      pithesLoop: pitches.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0.18, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.5);
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * Play the iconic Happy Birthday song melody on a chime synth
   */
  public toggleHappyBirthdayMelody(onFinished?: () => void) {
    if (this.isMelodyPlaying) {
      this.stopMelody();
      return false;
    }

    const ctx = this.getContext();
    if (!ctx) return false;

    this.isMelodyPlaying = true;
    this.melodyTimeoutIds = [];

    // "Happy Birthday To You" note frequencies & relative durations
    // C4=261.63, D4=293.66, E4=329.63, F4=349.23, G4=392.00, A4=440.00, B4=493.88, C5=523.25, D5=587.33
    const song: Array<[number, number]> = [
      [261.63, 0.35], // Hap-
      [261.63, 0.35], // py
      [293.66, 0.70], // birth-
      [261.63, 0.70], // day
      [349.23, 0.70], // to
      [329.63, 1.20], // you!
      [0, 0.3],       // pause
      [261.63, 0.35], // Hap-
      [261.63, 0.35], // py
      [293.66, 0.70], // birth-
      [261.63, 0.70], // day
      [392.00, 0.70], // to
      [349.23, 1.20], // you!
      [0, 0.3],       // pause
      [261.63, 0.35], // Hap-
      [261.63, 0.35], // py
      [523.25, 0.70], // birth-
      [440.00, 0.70], // day
      [349.23, 0.70], // dear
      [329.63, 0.70], // Bry-
      [293.66, 1.10], // an!
      [0, 0.3],       // pause
      [466.16, 0.35], // Hap-
      [466.16, 0.35], // py
      [440.00, 0.70], // birth-
      [349.23, 0.70], // day
      [392.00, 0.70], // to
      [349.23, 1.50], // you!
    ];

    let accumulatedTime = 0;
    const startTime = ctx.currentTime + 0.1;

    song.forEach(([freq, dur]) => {
      if (freq > 0) {
        const noteStart = startTime + accumulatedTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.001, noteStart);
        gain.gain.linearRampToValueAtTime(0.22, noteStart + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + dur - 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + dur);
      }
      accumulatedTime += dur;
    });

    const totalDurationMs = accumulatedTime * 1000 + 400;
    const timeout = window.setTimeout(() => {
      this.isMelodyPlaying = false;
      if (onFinished) onFinished();
    }, totalDurationMs);

    this.melodyTimeoutIds.push(timeout);
    return true;
  }

  public stopMelody() {
    this.isMelodyPlaying = false;
    this.melodyTimeoutIds.forEach((id) => clearTimeout(id));
    this.melodyTimeoutIds = [];
    if (this.ctx && this.ctx.state === 'running') {
      // Let current notes complete or silence
    }
  }

  public getIsMelodyPlaying(): boolean {
    return this.isMelodyPlaying;
  }
}

export const soundFx = new BirthdayAudioEngine();
