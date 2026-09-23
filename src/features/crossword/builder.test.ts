import { describe, expect, it } from 'vitest';
import { cognate4CrosswordTerms } from '../../content/cognate4/crossword';
import { cs412Terms } from '../../content/cs412';
import { buildCrossword, createCompleteCrossword, createMockCrossword, createTopicCrossword, normalizeCrosswordAnswer, validatePuzzle } from './builder';

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

  it('returns null when the requested count exceeds the number of unique terms', () => {
    const duplicate = { ...cs412Terms[0], id: cs412Terms[0].id };
    expect(buildCrossword([cs412Terms[0], duplicate], { seed: 1, count: 2, title: 'Impossible' })).toBeNull();
  }, 500);

  it('builds one connected crossword containing every term in a selected topic', () => {
    for (const module of ['introduction', 'crisp-dm', 'warehousing'] as const) {
      const topicTerms = cs412Terms.filter((term) => term.module === module);
      const puzzle = createTopicCrossword(topicTerms, 412);
      expect(puzzle.entries).toHaveLength(topicTerms.length);
      expect(new Set(puzzle.entries.map((entry) => entry.id))).toEqual(new Set(topicTerms.map((term) => term.id)));
      expect(validatePuzzle(puzzle)).toEqual([]);
    }
  });

  it('builds one connected complete crossword for every COGNATE4 lesson', () => {
    for (const module of ['cognate4-introduction', 'cognate4-introduction-extension', 'cognate4-working-with-images', 'cognate4-bitwise-operations', 'cognate4-grayscale-methods'] as const) {
      const lessonTerms = cognate4CrosswordTerms.filter((term) => term.module === module);
      const puzzle = createCompleteCrossword(lessonTerms, 404, `${module} · All Terms`);
      expect(puzzle.entries).toHaveLength(lessonTerms.length);
      expect(new Set(puzzle.entries.map((entry) => entry.id))).toEqual(new Set(lessonTerms.map((term) => term.id)));
      expect(validatePuzzle(puzzle)).toEqual([]);
    }
  });
});
