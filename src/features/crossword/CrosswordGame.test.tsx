import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { cs412Terms } from '../../content/cs412';
import { createMockCrossword } from './builder';
import { CrosswordGame } from './CrosswordGame';
import { createGameState } from './gameState';

describe('CrosswordGame', () => {
  beforeEach(() => localStorage.clear());

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

  it('marks wrong filled cells red even when the puzzle is incomplete', async () => {
    const user = userEvent.setup();
    const puzzle = createMockCrossword(cs412Terms, 412);
    const first = puzzle.entries[0];
    render(<CrosswordGame puzzle={puzzle} onExit={() => undefined} />);
    await user.click(screen.getByRole('button', { name: `${first.number} ${first.direction} clue` }));
    const wrongLetter = first.answer[0] === 'Z' ? 'X' : 'Z';
    await user.keyboard(wrongLetter);
    await user.click(screen.getByRole('button', { name: /submit puzzle/i }));

    expect(screen.getByRole('status')).toHaveTextContent(/letter needs another look/i);
    expect(screen.getByLabelText(`Crossword cell ${first.row + 1}, ${first.col + 1}`).closest('.crossword-cell')).toHaveClass('incorrect');
  });

  it('celebrates a correct puzzle with green cells, confetti, and the falling banner', async () => {
    const user = userEvent.setup();
    const puzzle = createMockCrossword(cs412Terms, 412);
    const solved = createGameState(puzzle);
    solved.values = Object.fromEntries(puzzle.cells.map((cell) => [`${cell.row}:${cell.col}`, cell.solution]));
    localStorage.setItem(`cs412-crossword:${puzzle.id}`, JSON.stringify(solved));
    const { container } = render(<CrosswordGame puzzle={puzzle} onExit={() => undefined} />);

    await user.click(screen.getByRole('button', { name: /submit puzzle/i }));

    expect(screen.getByRole('heading', { name: /wow galing/i })).toBeVisible();
    expect(screen.getByTestId('crossword-confetti')).toBeInTheDocument();
    expect(container.querySelectorAll('.crossword-cell.complete')).toHaveLength(puzzle.cells.length);
  });

  it('confirms a word reveal in an in-app modal', async () => {
    const user = userEvent.setup();
    const puzzle = createMockCrossword(cs412Terms, 412);
    const first = puzzle.entries[0];
    render(<CrosswordGame puzzle={puzzle} onExit={() => undefined} />);

    await user.click(screen.getByRole('button', { name: /reveal word/i }));
    const dialog = screen.getByRole('dialog', { name: /reveal this word/i });
    expect(dialog).toHaveTextContent(`${first.number} ${first.direction}`);
    await user.click(within(dialog).getByRole('button', { name: /cancel/i }));
    expect(screen.queryByRole('dialog', { name: /reveal this word/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /reveal word/i }));
    await user.click(within(screen.getByRole('dialog', { name: /reveal this word/i })).getByRole('button', { name: /^reveal word$/i }));
    expect(screen.getByLabelText(`Crossword cell ${first.row + 1}, ${first.col + 1}`)).toHaveValue(first.answer[0]);
  });
});
