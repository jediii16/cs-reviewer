import { describe, expect, it } from 'vitest';
import { cs412Terms } from '../../content/cs412';
import { createMockCrossword, createTopicCrossword, normalizeCrosswordAnswer, validatePuzzle } from './builder';

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
    expect(Object.fromEntries(['introduction', 'crisp-dm', 'warehousing'].map((module) => [module, first.entries.filter((entry) => entry.module === module).length]))).toEqual({
      introduction: 5,
      'crisp-dm': 5,
      warehousing: 5,
    });
    expect(validatePuzzle(first)).toEqual([]);
    expect(first.cells.some((cell) => cell.entryIds.length > 1)).toBe(true);
  });

  it('varies answer selection between seeds', () => {
    const a = createMockCrossword(cs412Terms, 10).entries.map((entry) => entry.id);
    const b = createMockCrossword(cs412Terms, 99).entries.map((entry) => entry.id);
    expect(a).not.toEqual(b);
  });

  it('builds one connected crossword containing every term in a selected topic', () => {
    for (const module of ['introduction', 'crisp-dm', 'warehousing'] as const) {
      const topicTerms = cs412Terms.filter((term) => term.module === module);
      const puzzle = createTopicCrossword(topicTerms, 412);
      expect(puzzle.entries).toHaveLength(topicTerms.length);
      expect(new Set(puzzle.entries.map((entry) => entry.id))).toEqual(new Set(topicTerms.map((term) => term.id)));
      expect(validatePuzzle(puzzle)).toEqual([]);
    }
  });
});
