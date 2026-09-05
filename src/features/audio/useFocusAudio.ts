import { useEffect, useRef, useState } from 'react';
import { useProgress } from '../progress/useProgress';
import type { MusicLoopMode } from '../progress/storage';
import {
  musicTracks as defaultMusicTracks,
  noiseTracks as defaultNoiseTracks,
  type MusicTrack,
  type NoiseKind,
  type NoiseTrack,
} from './audioLibrary';
import { createMediaAudio, type MediaAudioEngine } from './mediaAudio';

interface FocusAudioDependencies {
  musicTracks: MusicTrack[];
  noiseTracks: NoiseTrack[];
  createMusicEngine: () => MediaAudioEngine;
  createNoiseEngine: () => MediaAudioEngine;
}

const defaultDependencies: FocusAudioDependencies = {
  musicTracks: defaultMusicTracks,
  noiseTracks: defaultNoiseTracks,
  createMusicEngine: createMediaAudio,
  createNoiseEngine: createMediaAudio,
};

const legacyNoiseKinds: Record<string, NoiseKind> = {
  rain: 'rain',
  'brown-noise': 'brown',
  brown: 'brown',
  'pink-noise': 'pink',
  pink: 'pink',
};

function resolveMusicTrack(tracks: MusicTrack[], id: string | null) {
  return tracks.find((track) => track.id === id) ?? tracks[0];
}

function resolveNoiseTrack(tracks: NoiseTrack[], id: string | null) {
  const exact = tracks.find((track) => track.id === id);
  if (exact) return exact;
  const legacyKind = id ? legacyNoiseKinds[id] : undefined;
  return tracks.find((track) => track.noiseKind === legacyKind) ?? tracks[0];
}

export function useFocusAudio(dependencies: FocusAudioDependencies = defaultDependencies) {
  const {
    progress,
    setMusicTrackId,
    setMusicLoopMode,
    setMusicVolume,
    setNoiseTrackId,
    setNoiseVolume,
  } = useProgress();
  const musicEngineRef = useRef<MediaAudioEngine | null>(null);
  const noiseEngineRef = useRef<MediaAudioEngine | null>(null);
  const loadedMusicTrackIdRef = useRef<string | null>(null);
  const musicRequestRef = useRef(0);
  const noiseRequestRef = useRef(0);
  const musicVolumeRef = useRef(progress.musicVolume);
  const noiseVolumeRef = useRef(progress.noiseVolume);
  const loopModeRef = useRef(progress.musicLoopMode);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicPaused, setMusicPaused] = useState(false);
  const [musicTime, setMusicTime] = useState({ currentTime: 0, duration: 0 });
  const [noisePlaying, setNoisePlaying] = useState(false);
  const [musicUnavailable, setMusicUnavailable] = useState(false);
  const [noiseUnavailable, setNoiseUnavailable] = useState(false);

  musicVolumeRef.current = progress.musicVolume;
  noiseVolumeRef.current = progress.noiseVolume;
  loopModeRef.current = progress.musicLoopMode;

  function getMusicEngine() {
    musicEngineRef.current ??= dependencies.createMusicEngine();
    return musicEngineRef.current;
  }

  function getNoiseEngine() {
    noiseEngineRef.current ??= dependencies.createNoiseEngine();
    return noiseEngineRef.current;
  }

  async function startMusic(track: MusicTrack) {
    const request = musicRequestRef.current + 1;
    musicRequestRef.current = request;
    setMusicTrackId(track.id);
    setMusicUnavailable(false);
    setMusicPlaying(true);
    setMusicPaused(false);
    setMusicTime({ currentTime: 0, duration: 0 });
    loadedMusicTrackIdRef.current = track.id;

    try {
      await getMusicEngine().start({
        src: track.src,
        volume: musicVolumeRef.current,
        loop: loopModeRef.current === 'track' || dependencies.musicTracks.length === 1,
        onTimeChange: (snapshot) => {
          if (request === musicRequestRef.current) setMusicTime(snapshot);
        },
        onEnded: () => {
          if (request !== musicRequestRef.current || loopModeRef.current !== 'playlist') return;
          const currentIndex = dependencies.musicTracks.findIndex((item) => item.id === track.id);
          const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % dependencies.musicTracks.length;
          const nextTrack = dependencies.musicTracks[nextIndex];
          if (nextTrack) void startMusic(nextTrack);
        },
      });
    } catch {
      if (request !== musicRequestRef.current) return;
      musicEngineRef.current?.stop();
      loadedMusicTrackIdRef.current = null;
      setMusicPlaying(false);
      setMusicPaused(false);
      setMusicUnavailable(true);
    }
  }

  async function startNoise(track: NoiseTrack) {
    const request = noiseRequestRef.current + 1;
    noiseRequestRef.current = request;
    setNoiseTrackId(track.id);
    setNoiseUnavailable(false);
    setNoisePlaying(true);

    try {
      await getNoiseEngine().start({
        src: track.src,
        volume: noiseVolumeRef.current,
        loop: true,
      });
    } catch {
      if (request !== noiseRequestRef.current) return;
      noiseEngineRef.current?.stop();
      setNoisePlaying(false);
      setNoiseUnavailable(true);
    }
  }

  async function toggleMusic() {
    if (musicPlaying) {
      musicRequestRef.current += 1;
      musicEngineRef.current?.pause();
      setMusicPlaying(false);
      setMusicPaused(true);
      return;
    }
    const selected = resolveMusicTrack(dependencies.musicTracks, progress.musicTrackId);
    if (!selected) return;

    if (musicPaused && loadedMusicTrackIdRef.current === selected.id) {
      const request = musicRequestRef.current + 1;
      musicRequestRef.current = request;
      setMusicUnavailable(false);
      setMusicPlaying(true);
      setMusicPaused(false);
      try {
        await getMusicEngine().resume();
      } catch {
        if (request !== musicRequestRef.current) return;
        musicEngineRef.current?.stop();
        loadedMusicTrackIdRef.current = null;
        setMusicPlaying(false);
        setMusicPaused(false);
        setMusicUnavailable(true);
      }
      return;
    }

    await startMusic(selected);
  }

  async function toggleNoise() {
    if (noisePlaying) {
      noiseRequestRef.current += 1;
      noiseEngineRef.current?.stop();
      setNoisePlaying(false);
      return;
    }
    const selected = resolveNoiseTrack(dependencies.noiseTracks, progress.noiseTrackId);
    if (selected) await startNoise(selected);
  }

  async function selectMusicTrack(id: string) {
    const track = dependencies.musicTracks.find((item) => item.id === id);
    if (!track) return;
    setMusicTrackId(track.id);
    if (musicPlaying) {
      await startMusic(track);
      return;
    }

    if (musicPaused) {
      musicRequestRef.current += 1;
      musicEngineRef.current?.stop();
      loadedMusicTrackIdRef.current = null;
      setMusicPaused(false);
    }
    setMusicTime({ currentTime: 0, duration: 0 });
  }

  async function moveMusic(offset: -1 | 1) {
    if (dependencies.musicTracks.length === 0) return;
    const current = resolveMusicTrack(dependencies.musicTracks, progress.musicTrackId);
    const currentIndex = dependencies.musicTracks.findIndex((track) => track.id === current?.id);
    const safeIndex = currentIndex < 0 ? 0 : currentIndex;
    const nextIndex = (safeIndex + offset + dependencies.musicTracks.length) % dependencies.musicTracks.length;
    const nextTrack = dependencies.musicTracks[nextIndex];
    if (nextTrack) await selectMusicTrack(nextTrack.id);
  }

  function seekMusic(seconds: number) {
    musicEngineRef.current?.seek(seconds);
  }

  function restartMusic() {
    setMusicTime((current) => ({ ...current, currentTime: 0 }));
    musicEngineRef.current?.seek(0);
  }

  async function selectNoiseTrack(id: string) {
    const track = dependencies.noiseTracks.find((item) => item.id === id);
    if (!track) return;
    setNoiseTrackId(track.id);
    if (noisePlaying) await startNoise(track);
  }

  function changeMusicLoopMode(mode: MusicLoopMode) {
    loopModeRef.current = mode;
    setMusicLoopMode(mode);
    if (musicPlaying) {
      musicEngineRef.current?.setLoop(mode === 'track' || dependencies.musicTracks.length === 1);
    }
  }

  function changeMusicVolume(volume: number) {
    const clamped = Math.min(1, Math.max(0, volume));
    musicVolumeRef.current = clamped;
    setMusicVolume(clamped);
    if (musicPlaying) musicEngineRef.current?.setVolume(clamped);
  }

  function changeNoiseVolume(volume: number) {
    const clamped = Math.min(1, Math.max(0, volume));
    noiseVolumeRef.current = clamped;
    setNoiseVolume(clamped);
    if (noisePlaying) noiseEngineRef.current?.setVolume(clamped);
  }

  useEffect(() => () => {
    musicRequestRef.current += 1;
    noiseRequestRef.current += 1;
    musicEngineRef.current?.dispose();
    noiseEngineRef.current?.dispose();
  }, []);

  return {
    music: {
      tracks: dependencies.musicTracks,
      selectedTrack: resolveMusicTrack(dependencies.musicTracks, progress.musicTrackId),
      playing: musicPlaying,
      paused: musicPaused,
      unavailable: musicUnavailable,
      currentTime: musicTime.currentTime,
      duration: musicTime.duration,
      volume: progress.musicVolume,
      loopMode: progress.musicLoopMode,
      toggle: toggleMusic,
      previous: () => moveMusic(-1),
      next: () => moveMusic(1),
      restart: restartMusic,
      seek: seekMusic,
      selectTrack: selectMusicTrack,
      setLoopMode: changeMusicLoopMode,
      setVolume: changeMusicVolume,
    },
    noise: {
      tracks: dependencies.noiseTracks,
      selectedTrack: resolveNoiseTrack(dependencies.noiseTracks, progress.noiseTrackId),
      playing: noisePlaying,
      unavailable: noiseUnavailable,
      volume: progress.noiseVolume,
      toggle: toggleNoise,
      selectTrack: selectNoiseTrack,
      setVolume: changeNoiseVolume,
    },
  };
}

export type FocusAudioController = ReturnType<typeof useFocusAudio>;
