import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useProgress } from '../progress/useProgress';
import type { MusicTrack, NoiseTrack } from './audioLibrary';
import type { MediaAudioEngine, MediaPlaybackRequest } from './mediaAudio';
import { useFocusAudio } from './useFocusAudio';

const music: MusicTrack[] = [
  { id: 'music-a', kind: 'music', label: 'Track A', collection: 'lofi', collectionLabel: 'Lo-fi', src: '/a.mp3' },
  { id: 'music-b', kind: 'music', label: 'Track B', collection: 'lofi', collectionLabel: 'Lo-fi', src: '/b.mp3' },
];

const noise: NoiseTrack[] = [
  { id: 'noise-rain', kind: 'noise', label: 'Soft rain', noiseKind: 'rain', src: '/rain.wav' },
];

function createFakeEngine(): MediaAudioEngine & {
  end: () => void;
  publish: (snapshot: { currentTime: number; duration: number }) => void;
} {
  let onEnded: (() => void) | undefined;
  let onTimeChange: MediaPlaybackRequest['onTimeChange'];
  let snapshot = { currentTime: 0, duration: 0 };
  return {
    start: vi.fn(async (request: MediaPlaybackRequest) => {
      onEnded = request.onEnded;
      onTimeChange = request.onTimeChange;
      snapshot = { currentTime: 0, duration: 0 };
      onTimeChange?.(snapshot);
    }),
    pause: vi.fn(),
    resume: vi.fn(async () => undefined),
    seek: vi.fn((seconds: number) => {
      snapshot = { ...snapshot, currentTime: seconds };
      onTimeChange?.(snapshot);
    }),
    getSnapshot: vi.fn(() => snapshot),
    setVolume: vi.fn(),
    setLoop: vi.fn(),
    stop: vi.fn(),
    dispose: vi.fn(),
    end() {
      onEnded?.();
    },
    publish(nextSnapshot) {
      snapshot = nextSnapshot;
      onTimeChange?.(snapshot);
    },
  };
}

function AudioHarness({
  musicEngine,
  noiseEngine,
}: {
  musicEngine: MediaAudioEngine;
  noiseEngine: MediaAudioEngine;
}) {
  const audio = useFocusAudio({
    musicTracks: music,
    noiseTracks: noise,
    createMusicEngine: () => musicEngine,
    createNoiseEngine: () => noiseEngine,
  });
  const { reset } = useProgress();

  return (
    <div>
      <button type="button" onClick={reset}>Reset state</button>
      <button type="button" onClick={() => void audio.music.toggle()}>Toggle music</button>
      <button type="button" onClick={() => void audio.noise.toggle()}>Toggle noise</button>
      <button type="button" onClick={() => void audio.music.previous()}>Previous</button>
      <button type="button" onClick={() => void audio.music.next()}>Next</button>
      <button type="button" onClick={audio.music.restart}>Restart</button>
      <button type="button" onClick={() => audio.music.seek(81)}>Seek</button>
      <output aria-label="music status">{audio.music.playing ? 'playing' : 'stopped'}</output>
      <output aria-label="music pause status">{audio.music.paused ? 'paused' : 'not paused'}</output>
      <output aria-label="noise status">{audio.noise.playing ? 'playing' : 'stopped'}</output>
      <output aria-label="current music">{audio.music.selectedTrack?.id ?? 'none'}</output>
      <output aria-label="music loop mode">{audio.music.loopMode}</output>
      <output aria-label="music time">{audio.music.currentTime}/{audio.music.duration}</output>
    </div>
  );
}

describe('useFocusAudio', () => {
  beforeEach(() => localStorage.clear());

  it('plays and stops music without interrupting the noise layer', async () => {
    const user = userEvent.setup();
    const musicEngine = createFakeEngine();
    const noiseEngine = createFakeEngine();
    render(<AudioHarness musicEngine={musicEngine} noiseEngine={noiseEngine} />);

    await user.click(screen.getByRole('button', { name: /reset state/i }));
    await user.click(screen.getByRole('button', { name: /toggle music/i }));
    await user.click(screen.getByRole('button', { name: /toggle noise/i }));

    expect(screen.getByLabelText('music status')).toHaveTextContent('playing');
    expect(screen.getByLabelText('noise status')).toHaveTextContent('playing');

    await user.click(screen.getByRole('button', { name: /toggle music/i }));
    expect(screen.getByLabelText('music status')).toHaveTextContent('stopped');
    expect(screen.getByLabelText('noise status')).toHaveTextContent('playing');
  });

  it('defaults to playlist mode and advances back through the playlist', async () => {
    const user = userEvent.setup();
    const musicEngine = createFakeEngine();
    render(<AudioHarness musicEngine={musicEngine} noiseEngine={createFakeEngine()} />);

    await user.click(screen.getByRole('button', { name: /reset state/i }));
    expect(screen.getByLabelText('music loop mode')).toHaveTextContent('playlist');

    await user.click(screen.getByRole('button', { name: /toggle music/i }));
    expect(screen.getByLabelText('current music')).toHaveTextContent('music-a');

    act(() => musicEngine.end());
    await waitFor(() => expect(screen.getByLabelText('current music')).toHaveTextContent('music-b'));

    act(() => musicEngine.end());
    await waitFor(() => expect(screen.getByLabelText('current music')).toHaveTextContent('music-a'));
  });

  it('wraps transport controls and relays media time to the interface', async () => {
    const user = userEvent.setup();
    const musicEngine = createFakeEngine();
    render(<AudioHarness musicEngine={musicEngine} noiseEngine={createFakeEngine()} />);

    await user.click(screen.getByRole('button', { name: /reset state/i }));
    await user.click(screen.getByRole('button', { name: /toggle music/i }));
    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByLabelText('current music')).toHaveTextContent('music-b');

    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByLabelText('current music')).toHaveTextContent('music-a');

    await user.click(screen.getByRole('button', { name: /previous/i }));
    expect(screen.getByLabelText('current music')).toHaveTextContent('music-b');

    act(() => musicEngine.publish({ currentTime: 34, duration: 180 }));
    expect(screen.getByLabelText('music time')).toHaveTextContent('34/180');

    await user.click(screen.getByRole('button', { name: /seek/i }));
    expect(screen.getByLabelText('music time')).toHaveTextContent('81/180');

    await user.click(screen.getByRole('button', { name: /restart/i }));
    expect(screen.getByLabelText('music time')).toHaveTextContent('0/180');
  });

  it('pauses and resumes the same loaded track without restarting it', async () => {
    const user = userEvent.setup();
    const musicEngine = createFakeEngine();
    render(<AudioHarness musicEngine={musicEngine} noiseEngine={createFakeEngine()} />);

    await user.click(screen.getByRole('button', { name: /reset state/i }));
    await user.click(screen.getByRole('button', { name: /toggle music/i }));
    await user.click(screen.getByRole('button', { name: /toggle music/i }));
    expect(screen.getByLabelText('music pause status')).toHaveTextContent('paused');

    await user.click(screen.getByRole('button', { name: /toggle music/i }));
    expect(screen.getByLabelText('music status')).toHaveTextContent('playing');
    expect(screen.getByLabelText('current music')).toHaveTextContent('music-a');
    expect(musicEngine.start).toHaveBeenCalledTimes(1);
    expect(musicEngine.resume).toHaveBeenCalledTimes(1);
  });
});
