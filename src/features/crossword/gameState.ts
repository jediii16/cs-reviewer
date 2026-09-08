import type { CrosswordDirection, CrosswordPuzzle } from './types';

export interface CrosswordGameState {
  values: Record<string, string>;
  selectedCellKey: string | null;
  direction: CrosswordDirection;
  incorrectCellKeys: string[];
  revealedCellKeys: string[];
  startedAt: number;
  completedAt: number | null;
}

const cellKey = (row: number, col: number) => `${row}:${col}`;
export function createGameState(puzzle: CrosswordPuzzle): CrosswordGameState {
  const first = puzzle.entries[0];
  return { values: {}, selectedCellKey: first ? cellKey(first.row, first.col) : null, direction: first?.direction ?? 'across', incorrectCellKeys: [], revealedCellKeys: [], startedAt: Date.now(), completedAt: null };
}

export function entryCellKeys(puzzle: CrosswordPuzzle, entryId: string) {
  const entry = puzzle.entries.find((item) => item.id === entryId);
  if (!entry) return [];
  return [...entry.answer].map((_, index) => cellKey(entry.row + (entry.direction === 'down' ? index : 0), entry.col + (entry.direction === 'across' ? index : 0)));
}

export function activeEntry(puzzle: CrosswordPuzzle, state: CrosswordGameState) {
  const cell = puzzle.cells.find((item) => cellKey(item.row, item.col) === state.selectedCellKey);
  return puzzle.entries.find((entry) => cell?.entryIds.includes(entry.id) && entry.direction === state.direction)
    ?? puzzle.entries.find((entry) => cell?.entryIds.includes(entry.id));
}

export function enterLetter(state: CrosswordGameState, puzzle: CrosswordPuzzle, letter: string): CrosswordGameState {
  if (!state.selectedCellKey || !/^[a-z]$/i.test(letter)) return state;
  const entry = activeEntry(puzzle, state); const keys = entry ? entryCellKeys(puzzle, entry.id) : [];
  const index = keys.indexOf(state.selectedCellKey); const next = keys[Math.min(index + 1, keys.length - 1)] ?? state.selectedCellKey;
  return { ...state, values: { ...state.values, [state.selectedCellKey]: letter.toUpperCase() }, selectedCellKey: next, direction: entry?.direction ?? state.direction, incorrectCellKeys: state.incorrectCellKeys.filter((key) => key !== state.selectedCellKey) };
}

export function eraseLetter(state: CrosswordGameState, puzzle: CrosswordPuzzle): CrosswordGameState {
  if (!state.selectedCellKey) return state; const entry = activeEntry(puzzle, state); const keys = entry ? entryCellKeys(puzzle, entry.id) : [];
  const values = { ...state.values }; let selected = state.selectedCellKey;
  if (values[selected]) delete values[selected]; else { selected = keys[Math.max(0, keys.indexOf(selected) - 1)] ?? selected; delete values[selected]; }
  return { ...state, values, selectedCellKey: selected };
}

export function revealCells(state: CrosswordGameState, puzzle: CrosswordPuzzle, keys: readonly string[]): CrosswordGameState {
  const solutions = new Map(puzzle.cells.map((cell) => [cellKey(cell.row, cell.col), cell.solution])); const values = { ...state.values };
  for (const key of keys) if (solutions.has(key)) values[key] = solutions.get(key)!;
  return { ...state, values, revealedCellKeys: [...new Set([...state.revealedCellKeys, ...keys.filter((key) => solutions.has(key))])] };
}

export function checkCells(state: CrosswordGameState, puzzle: CrosswordPuzzle, keys: readonly string[]) {
  const solutions = new Map(puzzle.cells.map((cell) => [cellKey(cell.row, cell.col), cell.solution]));
  return { ...state, incorrectCellKeys: keys.filter((key) => state.values[key] && state.values[key] !== solutions.get(key)) };
}
