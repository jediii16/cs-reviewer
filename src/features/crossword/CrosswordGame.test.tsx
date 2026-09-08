import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { cs412Terms } from '../../content/cs412';
import { createMockCrossword } from './builder';
import { CrosswordGame } from './CrosswordGame';

describe('CrosswordGame', () => {
  it('focuses a selected clue and accepts continuous typing', async () => {
    const user = userEvent.setup();
    const puzzle = createMockCrossword(cs412Terms, 412);
    const entry = puzzle.entries[0];
    render(<CrosswordGame puzzle={puzzle} onExit={() => undefined} />);
    await user.click(screen.getByRole('button', { name: `${entry.number} ${entry.direction} clue` }));
    await user.keyboard(entry.answer.slice(0, 3));
    const keys = [...entry.answer].slice(0, 3).map((_, index) => ({
      row: entry.row + (entry.direction === 'down' ? index : 0),
      col: entry.col + (entry.direction === 'across' ? index : 0),
    }));
    for (const [index, cell] of keys.entries()) {
      expect(screen.getByLabelText(`Crossword cell ${cell.row + 1}, ${cell.col + 1}`)).toHaveValue(entry.answer[index]);
    }
  });
});
