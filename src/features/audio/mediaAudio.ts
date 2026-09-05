export interface MediaPlaybackRequest {
  src: string;
  volume: number;
  loop: boolean;
  onEnded?: () => void;
  onTimeChange?: (snapshot: MediaPlaybackSnapshot) => void;
}

export interface MediaPlaybackSnapshot {
  currentTime: number;
  duration: number;
}

export interface MediaAudioEngine {
  start(request: MediaPlaybackRequest): Promise<void>;
  pause(): void;
  resume(): Promise<void>;
  seek(seconds: number): void;
  getSnapshot(): MediaPlaybackSnapshot;
  setVolume(volume: number): void;
  setLoop(loop: boolean): void;
  stop(): void;
  dispose(): void;
}

type AudioElementFactory = () => HTMLAudioElement;

function clampVolume(volume: number) {
  return Math.min(1, Math.max(0, volume));
}

function snapshot(element: HTMLAudioElement | undefined): MediaPlaybackSnapshot {
  const duration = element && Number.isFinite(element.duration) ? Math.max(0, element.duration) : 0;
  const currentTime = element && Number.isFinite(element.currentTime) ? Math.max(0, element.currentTime) : 0;
  return {
    currentTime: duration > 0 ? Math.min(currentTime, duration) : currentTime,
    duration,
  };
}

export function createMediaAudio(
  createElement: AudioElementFactory = () => new Audio(),
): MediaAudioEngine {
  let element: HTMLAudioElement | undefined;
  let endedListener: (() => void) | undefined;
  let timeChangeListener: (() => void) | undefined;

  const telemetryEvents = ['loadedmetadata', 'durationchange', 'timeupdate'] as const;

  function unload() {
    if (!element) return;
    if (endedListener) element.removeEventListener('ended', endedListener);
    if (timeChangeListener) {
      telemetryEvents.forEach((event) => element?.removeEventListener(event, timeChangeListener));
    }
    endedListener = undefined;
    timeChangeListener = undefined;
    element.pause();
    element.removeAttribute('src');
    element.load();
  }

  function stop() {
    unload();
  }

  return {
    async start(request) {
      unload();

      element ??= createElement();
      element.preload = 'auto';
      element.src = request.src;
      element.volume = clampVolume(request.volume);
      element.loop = request.loop;
      endedListener = request.onEnded;
      if (endedListener) element.addEventListener('ended', endedListener);
      if (request.onTimeChange) {
        timeChangeListener = () => request.onTimeChange?.(snapshot(element));
        telemetryEvents.forEach((event) => element?.addEventListener(event, timeChangeListener));
      }

      await element.play();
    },

    pause() {
      element?.pause();
    },

    async resume() {
      if (element?.src) await element.play();
    },

    seek(seconds) {
      if (!element || !Number.isFinite(seconds)) return;
      const { duration } = snapshot(element);
      element.currentTime = Math.min(duration || Math.max(0, seconds), Math.max(0, seconds));
      timeChangeListener?.();
    },

    getSnapshot() {
      return snapshot(element);
    },

    setVolume(volume) {
      if (element) element.volume = clampVolume(volume);
    },

    setLoop(loop) {
      if (element) element.loop = loop;
    },

    stop,

    dispose() {
      stop();
      element = undefined;
    },
  };
}
