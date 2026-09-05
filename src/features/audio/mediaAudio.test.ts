import { describe, expect, it, vi } from 'vitest';
import { createMediaAudio } from './mediaAudio';

function createFakeAudio() {
  const listeners = new Map<string, Set<() => void>>();
  const element = {
    src: '',
    loop: false,
    preload: '',
    volume: 1,
    currentTime: 0,
    duration: Number.NaN,
    play: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn(),
    load: vi.fn(),
    removeAttribute: vi.fn((name: string) => {
      if (name === 'src') element.src = '';
    }),
    addEventListener: vi.fn((event: string, listener: () => void) => {
      const eventListeners = listeners.get(event) ?? new Set<() => void>();
      eventListeners.add(listener);
      listeners.set(event, eventListeners);
    }),
    removeEventListener: vi.fn((event: string, listener: () => void) => {
      listeners.get(event)?.delete(listener);
    }),
  };

  return {
    element,
    emit: (event: string) => listeners.get(event)?.forEach((listener) => listener()),
    end: () => listeners.get('ended')?.forEach((listener) => listener()),
  };
}

describe('media audio engine', () => {
  it('plays the requested file and relays playlist completion', async () => {
    const fake = createFakeAudio();
    const onEnded = vi.fn();
    const engine = createMediaAudio(() => fake.element as unknown as HTMLAudioElement);

    await engine.start({
      src: '/track-a.mp3',
      volume: 0.28,
      loop: false,
      onEnded,
    });

    expect(fake.element.src).toBe('/track-a.mp3');
    expect(fake.element.preload).toBe('auto');
    expect(fake.element.volume).toBe(0.28);
    expect(fake.element.loop).toBe(false);
    expect(fake.element.play).toHaveBeenCalledOnce();

    fake.end();
    expect(onEnded).toHaveBeenCalledOnce();
  });

  it('loops one track and clamps later volume changes', async () => {
    const fake = createFakeAudio();
    const engine = createMediaAudio(() => fake.element as unknown as HTMLAudioElement);

    await engine.start({ src: '/short-rain.wav', volume: 3, loop: true });
    engine.setVolume(-1);

    expect(fake.element.loop).toBe(true);
    expect(fake.element.volume).toBe(0);
  });

  it('publishes playback time and supports pausing, resuming, and clamped seeking', async () => {
    const fake = createFakeAudio();
    const onTimeChange = vi.fn();
    const engine = createMediaAudio(() => fake.element as unknown as HTMLAudioElement);

    await engine.start({
      src: '/track-a.mp3',
      volume: 0.28,
      loop: false,
      onTimeChange,
    });

    fake.element.duration = 180;
    fake.element.currentTime = 42;
    fake.emit('loadedmetadata');
    fake.emit('timeupdate');

    expect(onTimeChange).toHaveBeenLastCalledWith({ currentTime: 42, duration: 180 });

    engine.seek(999);
    expect(fake.element.currentTime).toBe(180);
    engine.seek(-4);
    expect(fake.element.currentTime).toBe(0);

    engine.pause();
    expect(fake.element.pause).toHaveBeenCalled();
    expect(fake.element.removeAttribute).not.toHaveBeenCalled();

    await engine.resume();
    expect(fake.element.play).toHaveBeenCalledTimes(2);
    expect(engine.getSnapshot()).toEqual({ currentTime: 0, duration: 180 });
  });

  it('pauses and unloads the file when stopped', async () => {
    const fake = createFakeAudio();
    const engine = createMediaAudio(() => fake.element as unknown as HTMLAudioElement);

    await engine.start({ src: '/track-a.mp3', volume: 0.3, loop: false });
    engine.stop();

    expect(fake.element.pause).toHaveBeenCalledOnce();
    expect(fake.element.removeAttribute).toHaveBeenCalledWith('src');
    expect(fake.element.load).toHaveBeenCalledOnce();
  });

  it('does not let an older play promise pause a newer track', async () => {
    const fake = createFakeAudio();
    const resume: Array<() => void> = [];
    fake.element.play.mockImplementation(() => new Promise<void>((resolve) => resume.push(resolve)));
    const engine = createMediaAudio(() => fake.element as unknown as HTMLAudioElement);

    const first = engine.start({ src: '/track-a.mp3', volume: 0.3, loop: false });
    const second = engine.start({ src: '/track-b.mp3', volume: 0.3, loop: false });

    resume[0]?.();
    await first;
    expect(fake.element.pause).toHaveBeenCalledOnce();

    resume[1]?.();
    await second;
  });
});
