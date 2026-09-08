import { describe, expect, it } from 'vitest';
import { cs412Terms } from '../../content/cs412';
import { createMockCrossword, normalizeCrosswordAnswer, validatePuzzle } from './builder';

describe('crossword builder', () => {
  it('normalizes spaces and punctuation for grid answers', () => {
    expect(normalizeCrosswordAnswer('CRISP-DM / process')).toBe('CRISPDMPROCESS');
  });

  it('creates the same valid connected 15-answer exam for the same seed', () => {
    const first = createMockCrossword(cs412Terms, 412);
    const second = createMockCrossword(cs412Terms, 412);
    expect(first).toEqual(second);
    expect(first.entries).toHaveLength(15);
    expect(new Set(first.entries.map((entry) => entry.module))).toEqual(new Set(['introduction', 'crisp-dm', 'warehousing']));
    expect(validatePuzzle(first)).toEqual([]);
    expect(first.cells.some((cell) => cell.entryIds.length > 1)).toBe(true);
  });

  it('varies answer selection between seeds', () => {
    const a = createMockCrossword(cs412Terms, 10).entries.map((entry) => entry.id);
    const b = createMockCrossword(cs412Terms, 99).entries.map((entry) => entry.id);
    expect(a).not.toEqual(b);
  });
});
