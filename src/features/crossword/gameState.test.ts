import { describe, expect, it } from 'vitest';
import { cs412Terms } from '../../content/cs412';
import { createMockCrossword } from './builder';
import { createGameState, enterLetter, revealCells } from './gameState';

describe('crossword game state', () => {
  it('types, advances, and tracks hints separately', () => {
    const puzzle = createMockCrossword(cs412Terms, 412);
    let state = createGameState(puzzle);
    const first = puzzle.entries[0];
    state = { ...state, selectedCellKey: `${first.row}:${first.col}`, direction: first.direction };
    state = enterLetter(state, puzzle, first.answer[0]);
    expect(Object.values(state.values)).toContain(first.answer[0]);
    state = revealCells(state, puzzle, [`${first.row}:${first.col}`]);
    expect(state.revealedCellKeys).toContain(`${first.row}:${first.col}`);
  });

  it('types through a prefilled intersection without shifting later letters', () => {
    const puzzle = createMockCrossword(cs412Terms, 412);
    const entry = puzzle.entries.find((candidate) => {
      const keys = candidate.answer.split('').map((_, index) => `${candidate.row + (candidate.direction === 'down' ? index : 0)}:${candidate.col + (candidate.direction === 'across' ? index : 0)}`);
      return keys.slice(1, -1).some((key) => puzzle.cells.find((cell) => `${cell.row}:${cell.col}` === key)?.entryIds.length === 2);
    });
    expect(entry).toBeDefined();
    const keys = entry!.answer.split('').map((_, index) => `${entry!.row + (entry!.direction === 'down' ? index : 0)}:${entry!.col + (entry!.direction === 'across' ? index : 0)}`);
    const crossingIndex = keys.findIndex((key, index) => index > 0 && index < keys.length - 1 && puzzle.cells.find((cell) => `${cell.row}:${cell.col}` === key)?.entryIds.length === 2);
    let state = createGameState(puzzle);
    state = { ...state, selectedCellKey: keys[crossingIndex - 1], direction: entry!.direction, values: { [keys[crossingIndex]]: entry!.answer[crossingIndex] } };

    state = enterLetter(state, puzzle, entry!.answer[crossingIndex - 1]);

    expect(state.selectedCellKey).toBe(keys[crossingIndex]);
    state = enterLetter(state, puzzle, entry!.answer[crossingIndex]);

    expect(state.selectedCellKey).toBe(keys[crossingIndex + 1]);
    expect(state.values[keys[crossingIndex]]).toBe(entry!.answer[crossingIndex]);
  });
});
