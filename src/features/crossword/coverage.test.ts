import { describe, expect, it } from 'vitest';
import { crosswordTerms } from '../../test/crosswordFixtures';
import { createCoveragePuzzles } from './coverage';

describe('complete crossword coverage', () => {
  it('includes every curated term across playable 15-answer puzzles', () => {
    const puzzles = createCoveragePuzzles(crosswordTerms);
    expect(new Set(puzzles.flatMap((puzzle) => puzzle.entries.map((entry) => entry.id)))).toEqual(new Set(crosswordTerms.map((term) => term.id)));
    expect(puzzles.every((puzzle) => puzzle.entries.length === 15)).toBe(true);
  });
});
