import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FocusAudioController } from './useFocusAudio';
import { AudioPlayerSurface } from './AudioPlayer';

function createController(): FocusAudioController {
  return {
    music: {
      tracks: [
        {
          id: 'music-a',
          kind: 'music',
          label: 'Track A',
          collection: 'lofi',
          collectionLabel: 'Lo-fi',
          src: '/a.mp3',
        },
        {
          id: 'music-b',
          kind: 'music',
          label: 'Track B',
          collection: 'lofi',
          collectionLabel: 'Lo-fi',
          src: '/b.mp3',
        },
      ],
      selectedTrack: {
        id: 'music-a',
        kind: 'music',
        label: 'Track A',
        collection: 'lofi',
        collectionLabel: 'Lo-fi',
        src: '/a.mp3',
      },
      playing: false,
      paused: true,
      unavailable: false,
      currentTime: 45,
      duration: 180,
      volume: 0.28,
      loopMode: 'playlist',
      toggle: vi.fn(async () => undefined),
      previous: vi.fn(async () => undefined),
      next: vi.fn(async () => undefined),
      restart: vi.fn(),
      seek: vi.fn(),
      selectTrack: vi.fn(async () => undefined),
      setLoopMode: vi.fn(),
      setVolume: vi.fn(),
    },
    noise: {
      tracks: [
        {
          id: 'noise-rain',
          kind: 'noise',
          label: 'Soft rain',
          noiseKind: 'rain',
          src: '/rain.wav',
        },
      ],
      selectedTrack: {
        id: 'noise-rain',
        kind: 'noise',
        label: 'Soft rain',
        noiseKind: 'rain',
        src: '/rain.wav',
      },
      playing: false,
      unavailable: false,
      volume: 0.22,
      toggle: vi.fn(async () => undefined),
      selectTrack: vi.fn(async () => undefined),
      setVolume: vi.fn(),
    },
  };
}

afterEach(() => vi.useRealTimers());

describe('AudioPlayer', () => {
  it('opens independent music settings and exposes a draggable waveform transport', async () => {
    const user = userEvent.setup();
    const audio = createController();
    render(<AudioPlayerSurface audio={audio} />);

    await user.click(screen.getByRole('button', { name: /^open music and ambience$/i }));
    const dialog = screen.getByRole('dialog', { name: /music and ambience/i });

    expect(within(dialog).getByRole('combobox', { name: /music track/i })).toBeVisible();
    expect(within(dialog).getByRole('combobox', { name: /background noise/i })).toBeVisible();
    expect(within(dialog).getByRole('slider', { name: /music volume/i })).toBeVisible();
    expect(within(dialog).getByRole('slider', { name: /noise volume/i })).toBeVisible();

    const dock = screen.getByRole('region', { name: /music player/i });
    const seek = within(dock).getByRole('slider', { name: /seek through current track/i });
    expect(seek).toHaveValue('45');
    fireEvent.change(seek, { target: { value: '90' } });
    expect(audio.music.seek).toHaveBeenCalledWith(90);

    await user.click(within(dock).getByRole('button', { name: /previous track/i }));
    await user.click(within(dock).getByRole('button', { name: /restart current track/i }));
    await user.click(within(dock).getByRole('button', { name: /play music/i }));
    await user.click(within(dock).getByRole('button', { name: /next track/i }));

    expect(audio.music.previous).toHaveBeenCalledOnce();
    expect(audio.music.restart).toHaveBeenCalledOnce();
    expect(audio.music.toggle).toHaveBeenCalledOnce();
    expect(audio.music.next).toHaveBeenCalledOnce();
    expect(within(dock).getByText('00:45')).toBeVisible();
    expect(within(dock).getByText('03:00')).toBeVisible();
  });

  it('retracts after inactivity and returns from its bottom handle', () => {
    vi.useFakeTimers();
    const audio = createController();
    render(<AudioPlayerSurface audio={audio} />);

    const dock = screen.getByRole('region', { name: /music player/i });
    expect(dock).toHaveAttribute('data-expanded', 'true');

    fireEvent.pointerLeave(dock);
    act(() => vi.advanceTimersByTime(3200));
    expect(dock).toHaveAttribute('data-expanded', 'false');

    fireEvent.click(screen.getByRole('button', { name: /show music player/i }));
    expect(dock).toHaveAttribute('data-expanded', 'true');
  });
});
