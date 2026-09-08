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
});
