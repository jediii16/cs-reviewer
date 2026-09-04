import { useEffect, useRef, useState } from 'react';
import { useProgress } from '../progress/useProgress';
import type { AmbientSound } from '../progress/storage';
import { createAmbientAudio, type AmbientAudioEngine } from './ambientAudio';

export function useAmbientAudio(
  createEngine: () => AmbientAudioEngine = createAmbientAudio,
) {
  const { progress, setAmbientSound, setAmbientVolume } = useProgress();
  const engineRef = useRef<AmbientAudioEngine | null>(null);
  const requestRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  function getEngine() {
    engineRef.current ??= createEngine();
    return engineRef.current;
  }

  async function chooseSound(sound: AmbientSound) {
    const request = requestRef.current + 1;
    requestRef.current = request;
    setUnavailable(false);

    if (sound === 'off') {
      engineRef.current?.stop();
      setAmbientSound('off');
      setPlaying(false);
      return;
    }

    try {
      await getEngine().start(sound, progress.ambientVolume);
      if (request !== requestRef.current) return;
      setAmbientSound(sound);
      setPlaying(true);
    } catch {
      if (request !== requestRef.current) return;
      engineRef.current?.stop();
      setAmbientSound('off');
      setPlaying(false);
      setUnavailable(true);
    }
  }

  function changeVolume(volume: number) {
    const clamped = Math.min(1, Math.max(0, volume));
    setAmbientVolume(clamped);
    if (playing) engineRef.current?.setVolume(clamped);
  }

  function stop() {
    void chooseSound('off');
  }

  useEffect(() => () => {
    requestRef.current += 1;
    engineRef.current?.dispose();
  }, []);

  return {
    selectedSound: progress.ambientSound,
    volume: progress.ambientVolume,
    playing,
    unavailable,
    chooseSound,
    setVolume: changeVolume,
    stop,
  };
}
