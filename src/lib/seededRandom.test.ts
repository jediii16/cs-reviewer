import { describe, expect, it } from 'vitest';
import { createSeededRandom, seededShuffle } from './seededRandom';

describe('seeded random', () => {
  it('is deterministic and bounded', () => {
    const a = createSeededRandom(412);
    const b = createSeededRandom(412);
    const first = Array.from({ length: 5 }, () => a());
    expect(first).toEqual(Array.from({ length: 5 }, () => b()));
    expect(first.every((value) => value >= 0 && value < 1)).toBe(true);
  });
  it('shuffles without mutating its input', () => {
    const input = [1, 2, 3, 4, 5];
    expect(seededShuffle(input, 1)).not.toEqual(seededShuffle(input, 2));
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });
});
