"use client";

// Tiny synthesized sound effects (no audio files to download). Every sound
// respects the visitor's sound toggle, which is stored in localStorage.

const KEY = "sound-enabled";
export const SOUND_EVENT = "sound-preference-change";

let ctx: AudioContext | null = null;

export function soundEnabled() {
  try {
    return localStorage.getItem(KEY) !== "false";
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled: boolean) {
  try {
    localStorage.setItem(KEY, String(enabled));
  } catch {}
  window.dispatchEvent(new Event(SOUND_EVENT));
}

function tone(freq: number, duration: number, type: OscillatorType, volume: number, glideTo?: number) {
  if (!soundEnabled()) return;
  try {
    ctx ??= new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, now + duration);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  } catch {
    // Audio is a nice-to-have; ignore browsers that refuse it.
  }
}

export const sounds = {
  pop: (pitch = 1) => tone(420 * pitch, 0.12, "sine", 0.18, 640 * pitch),
  click: () => tone(1200, 0.04, "square", 0.04),
  switchOn: () => tone(520, 0.12, "triangle", 0.15, 880),
  switchOff: () => tone(700, 0.12, "triangle", 0.15, 380),
  success: () => {
    tone(523, 0.15, "sine", 0.15);
    setTimeout(() => tone(784, 0.22, "sine", 0.15), 110);
  },
};
