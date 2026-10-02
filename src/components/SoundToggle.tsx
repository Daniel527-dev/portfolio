"use client";

import { useSyncExternalStore } from "react";
import { setSoundEnabled, sounds, SOUND_EVENT, soundEnabled } from "@/lib/sound";
import { VolumeOffIcon, VolumeOnIcon } from "./icons";
import styles from "./Header.module.css";

function subscribe(onChange: () => void) {
  window.addEventListener(SOUND_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(SOUND_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export default function SoundToggle() {
  const enabled = useSyncExternalStore(subscribe, soundEnabled, () => true);

  function toggle() {
    setSoundEnabled(!enabled);
    if (!enabled) sounds.switchOn();
  }

  return (
    <button
      className={styles.iconButton}
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Mute sound effects" : "Enable sound effects"}
      title={enabled ? "Sound on" : "Sound off"}
    >
      {enabled ? <VolumeOnIcon /> : <VolumeOffIcon />}
    </button>
  );
}
