import { describe, expect, it } from 'vitest';
import { cs412Terms } from '../../content/cs412';
import { createCoveragePuzzles } from './coverage';

describe('complete crossword coverage', () => {
  it('includes every curated term across playable 15-answer puzzles', () => {
    const puzzles = createCoveragePuzzles(cs412Terms);
    expect(new Set(puzzles.flatMap((puzzle) => puzzle.entries.map((entry) => entry.id)))).toEqual(new Set(cs412Terms.map((term) => term.id)));
    expect(puzzles.every((puzzle) => puzzle.entries.length === 15)).toBe(true);
  });
});
