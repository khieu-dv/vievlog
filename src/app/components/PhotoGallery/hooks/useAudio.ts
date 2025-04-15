
// src/components/PhotoGallery/hooks/useAudio.ts
import { useEffect, useRef } from "react";
import { CONFIG } from "../constants";

export const useAudio = () => {
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    try {
      const audioEl = document.createElement('audio');
      audioEl.src = CONFIG.AUDIO_URL;
      audioEl.loop = true;
      audioEl.volume = 0.3; // Lower volume for mobile
      audioEl.style.display = 'none';
      document.body.appendChild(audioEl);
      audioElementRef.current = audioEl;

      audioEl.play().catch(err => {
        console.error("Could not play audio:", err);
      });
    } catch (error) {
      console.error("Error setting up audio:", error);
    }

    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.remove();
      }
    };
  }, []);

  return audioElementRef;
};