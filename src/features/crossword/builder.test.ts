import { describe, expect, it } from 'vitest';
import { crosswordTerms } from '../../test/crosswordFixtures';
import { buildCrossword, createCompleteCrossword, createMockCrossword, createTopicCrossword, normalizeCrosswordAnswer, validatePuzzle } from './builder';

describe('reusable crossword builder', () => {
  it('normalizes spaces and punctuation for grid answers', () => {
    expect(normalizeCrosswordAnswer('Apple / tree')).toBe('APPLETREE');
  });
  it('creates a deterministic, connected 15-answer exam balanced across three modules', () => {
    const first = createMockCrossword(crosswordTerms, 412);
    expect(first).toEqual(createMockCrossword(crosswordTerms, 412));
    expect(first.entries).toHaveLength(15);
    for (const module of ['fruit', 'garden', 'nature']) {
      expect(first.entries.filter((entry) => entry.module === module)).toHaveLength(5);
    }
    expect(validatePuzzle(first)).toEqual([]);
    expect(first.cells.some((cell) => cell.entryIds.length > 1)).toBe(true);
  });
  it('varies answer selection between seeds', () => {
    expect(createMockCrossword(crosswordTerms, 10).entries.map((e) => e.id))
      .not.toEqual(createMockCrossword(crosswordTerms, 99).entries.map((e) => e.id));
  });
  it('rejects a count greater than the unique term count', () => {
    expect(buildCrossword([crosswordTerms[0], crosswordTerms[0]], { seed: 1, count: 2, title: 'Impossible' })).toBeNull();
  });
  it('validates balanced mock prerequisites', () => {
    expect(() => createMockCrossword(crosswordTerms.slice(0, 4), 1)).toThrow(/three modules/i);
  });
  it('builds complete topic puzzles from arbitrary module names', () => {
    for (const module of ['fruit', 'garden', 'nature']) {
      const terms = crosswordTerms.filter((term) => term.module === module);
      for (const puzzle of [createTopicCrossword(terms, 412, module), createCompleteCrossword(terms, 404, module)]) {
        expect(new Set(puzzle.entries.map((entry) => entry.id))).toEqual(new Set(terms.map((term) => term.id)));
        expect(validatePuzzle(puzzle)).toEqual([]);
      }
    }
  });
});
