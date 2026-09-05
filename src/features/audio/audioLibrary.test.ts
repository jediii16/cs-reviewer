import { describe, expect, it } from 'vitest';
import {
  findNoiseTrack,
  musicTracks,
  noiseTracks,
} from './audioLibrary';

describe('audio library', () => {
  it('discovers music with clean, unique display names', () => {
    expect(musicTracks.length).toBeGreaterThan(0);
    expect(musicTracks.every((track) => !/chosic|\.(mp3|wav)$/i.test(track.label))).toBe(true);
    expect(new Set(musicTracks.map((track) => track.label.toLowerCase())).size).toBe(musicTracks.length);
  });

  it('classifies the supplied rain, brown, and pink noise files', () => {
    expect(noiseTracks.map((track) => track.noiseKind)).toEqual(
      expect.arrayContaining(['rain', 'brown', 'pink']),
    );
  });

  it('resolves the old brown-noise preference to the supplied recording', () => {
    expect(findNoiseTrack('brown-noise')?.noiseKind).toBe('brown');
  });
});
