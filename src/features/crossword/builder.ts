import type { TheoryTerm } from '../../content/types';
import { seededShuffle } from '../../lib/seededRandom';
import type { CrosswordDirection, CrosswordEntry, CrosswordPuzzle } from './types';

export const normalizeCrosswordAnswer = (answer: string) => answer.toUpperCase().replace(/[^A-Z]/g, '');
const key = (row: number, col: number) => `${row}:${col}`;
interface Placed { term: TheoryTerm; word: string; row: number; col: number; direction: CrosswordDirection }
interface Occupied { letter: string; directions: Set<CrosswordDirection>; entryIds: string[] }

function cellsFor(entry: Placed) {
  return [...entry.word].map((letter, index) => ({ letter, row: entry.row + (entry.direction === 'down' ? index : 0), col: entry.col + (entry.direction === 'across' ? index : 0) }));
}

function occupiedMap(entries: readonly Placed[]) {
  const map = new Map<string, Occupied>();
  for (const entry of entries) for (const cell of cellsFor(entry)) {
    const item = map.get(key(cell.row, cell.col)) ?? { letter: cell.letter, directions: new Set(), entryIds: [] };
    item.directions.add(entry.direction); item.entryIds.push(entry.term.id); map.set(key(cell.row, cell.col), item);
  }
  return map;
}

function legalPlacement(candidate: Placed, entries: readonly Placed[]) {
  const map = occupiedMap(entries); const cells = cellsFor(candidate); let crossings = 0;
  const before = candidate.direction === 'across' ? key(candidate.row, candidate.col - 1) : key(candidate.row - 1, candidate.col);
  const after = candidate.direction === 'across' ? key(candidate.row, candidate.col + candidate.word.length) : key(candidate.row + candidate.word.length, candidate.col);
  if (map.has(before) || map.has(after)) return -1;
  for (const cell of cells) {
    const existing = map.get(key(cell.row, cell.col));
    if (existing) {
      if (existing.letter !== cell.letter || existing.directions.has(candidate.direction)) return -1;
      crossings += 1;
    } else {
      const neighbors = candidate.direction === 'across'
        ? [key(cell.row - 1, cell.col), key(cell.row + 1, cell.col)]
        : [key(cell.row, cell.col - 1), key(cell.row, cell.col + 1)];
      if (neighbors.some((neighbor) => map.has(neighbor))) return -1;
    }
  }
  return crossings;
}

function candidatePlacements(term: TheoryTerm, entries: readonly Placed[]) {
  const word = normalizeCrosswordAnswer(term.answer); const map = occupiedMap(entries); const candidates: { placed: Placed; score: number }[] = [];
  for (let index = 0; index < word.length; index += 1) {
    for (const [coordinate, occupied] of map) {
      if (occupied.letter !== word[index]) continue;
      const [row, col] = coordinate.split(':').map(Number);
      for (const direction of ['across', 'down'] as const) {
        const placed = { term, word, direction, row: row - (direction === 'down' ? index : 0), col: col - (direction === 'across' ? index : 0) };
        const crossings = legalPlacement(placed, entries);
        if (crossings > 0) {
          const all = [...entries, placed].flatMap(cellsFor); const rows = all.map((cell) => cell.row); const cols = all.map((cell) => cell.col);
          const area = (Math.max(...rows) - Math.min(...rows) + 1) * (Math.max(...cols) - Math.min(...cols) + 1);
          candidates.push({ placed, score: crossings * 1000 - area });
        }
      }
    }
  }
  return candidates.sort((a, b) => b.score - a.score);
}

function orderedTerms(terms: readonly TheoryTerm[], seed: number) {
  const modules = ['introduction', 'crisp-dm', 'warehousing'] as const;
  const groups = modules.map((module, index) => seededShuffle(terms.filter((term) => term.module === module), seed + index * 97));
  const balanced: TheoryTerm[] = [];
  for (let index = 0; index < Math.max(...groups.map((group) => group.length)); index += 1) for (const group of groups) if (group[index]) balanced.push(group[index]);
  return balanced;
}

function finalize(entries: readonly Placed[], seed: number, title: string): CrosswordPuzzle {
  const allCells = entries.flatMap(cellsFor); const minRow = Math.min(...allCells.map((cell) => cell.row)); const minCol = Math.min(...allCells.map((cell) => cell.col));
  const shifted = entries.map((entry) => ({ ...entry, row: entry.row - minRow, col: entry.col - minCol }));
  const starts = [...new Set(shifted.map((entry) => key(entry.row, entry.col)))].sort((a, b) => { const [ar, ac] = a.split(':').map(Number); const [br, bc] = b.split(':').map(Number); return ar - br || ac - bc; });
  const numbers = new Map(starts.map((start, index) => [start, index + 1])); const map = occupiedMap(shifted);
  const puzzleEntries: CrosswordEntry[] = shifted.map((entry) => ({ id: entry.term.id, clue: entry.term.clue, answer: entry.word, displayAnswer: entry.term.displayAnswer, module: entry.term.module, row: entry.row, col: entry.col, direction: entry.direction, number: numbers.get(key(entry.row, entry.col))! })).sort((a, b) => a.number - b.number || a.direction.localeCompare(b.direction));
  const cells = [...map.entries()].map(([coordinate, value]) => { const [row, col] = coordinate.split(':').map(Number); return { row, col, solution: value.letter, number: numbers.get(coordinate), entryIds: value.entryIds }; }).sort((a, b) => a.row - b.row || a.col - b.col);
  return { id: `mock-${seed}`, seed, title, width: Math.max(...cells.map((cell) => cell.col)) + 1, height: Math.max(...cells.map((cell) => cell.row)) + 1, entries: puzzleEntries, cells };
}

export function buildCrossword(terms: readonly TheoryTerm[], options: { seed: number; count: number; title: string }): CrosswordPuzzle | null {
  const order = orderedTerms(terms, options.seed); if (!order.length) return null;
  const first = order[0]; const entries: Placed[] = [{ term: first, word: normalizeCrosswordAnswer(first.answer), row: 0, col: 0, direction: 'across' }];
  let cursor = 1; let misses = 0;
  while (entries.length < options.count && misses < order.length * 3) {
    const term = order[cursor % order.length]; cursor += 1;
    if (entries.some((entry) => entry.term.id === term.id)) continue;
    const candidates = candidatePlacements(term, entries);
    if (candidates.length) { entries.push(candidates[0].placed); misses = 0; } else misses += 1;
  }
  return entries.length === options.count ? finalize(entries, options.seed, options.title) : null;
}

export function createMockCrossword(terms: readonly TheoryTerm[], seed: number): CrosswordPuzzle {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const puzzle = buildCrossword(terms, { seed: seed + attempt, count: 15, title: '15-Item Mock Exam' });
    if (puzzle && new Set(puzzle.entries.map((entry) => entry.module)).size === 3) return { ...puzzle, id: `mock-${seed}`, seed };
  }
  throw new Error('Unable to build a connected 15-answer crossword from this term bank.');
}

export function validatePuzzle(puzzle: CrosswordPuzzle): string[] {
  const errors: string[] = []; const map = new Map(puzzle.cells.map((cell) => [key(cell.row, cell.col), cell]));
  for (const entry of puzzle.entries) {
    for (let index = 0; index < entry.answer.length; index += 1) {
      const cell = map.get(key(entry.row + (entry.direction === 'down' ? index : 0), entry.col + (entry.direction === 'across' ? index : 0)));
      if (!cell || cell.solution !== entry.answer[index] || !cell.entryIds.includes(entry.id)) errors.push(`Invalid cell for ${entry.id}`);
    }
  }
  if (puzzle.entries.length) {
    const seen = new Set([puzzle.entries[0].id]); let changed = true;
    while (changed) { changed = false; for (const cell of puzzle.cells) if (cell.entryIds.some((id) => seen.has(id))) for (const id of cell.entryIds) if (!seen.has(id)) { seen.add(id); changed = true; } }
    if (seen.size !== puzzle.entries.length) errors.push('Puzzle is disconnected');
  }
  return [...new Set(errors)];
}
