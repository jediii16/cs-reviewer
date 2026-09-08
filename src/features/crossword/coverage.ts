import type { TheoryTerm } from '../../content/types';
import { createMockCrossword } from './builder';
import type { CrosswordPuzzle } from './types';

let cached: { signature: string; puzzles: CrosswordPuzzle[] } | null = null;

export function createCoveragePuzzles(terms: readonly TheoryTerm[]): CrosswordPuzzle[] {
  const signature = terms.map((term) => term.id).join('|');
  if (cached?.signature === signature) return cached.puzzles;
  const uncovered = new Set(terms.map((term) => term.id)); const puzzles: CrosswordPuzzle[] = [];
  for (let seed = 1; seed <= 180 && uncovered.size; seed += 1) {
    const puzzle = createMockCrossword(terms, 10_000 + seed * 137);
    const adds = puzzle.entries.filter((entry) => uncovered.has(entry.id));
    if (adds.length === 0) continue;
    puzzles.push({ ...puzzle, id: `coverage-${puzzles.length + 1}`, title: `Complete Coverage ${puzzles.length + 1}` });
    adds.forEach((entry) => uncovered.delete(entry.id));
  }
  if (uncovered.size) throw new Error(`Coverage generation missed: ${[...uncovered].join(', ')}`);
  cached = { signature, puzzles };
  return puzzles;
}
