import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FocusTimer } from './FocusTimer';

describe('FocusTimer', () => {
  it('opens a large focus dialog and keeps the timer running after close', async () => {
    const user = userEvent.setup();
    render(<FocusTimer />);

    await user.click(screen.getByRole('button', { name: /open focus timer/i }));

    expect(screen.getByRole('dialog')).toBeVisible();
    expect(screen.getByText('25:00', { selector: '.focus-dialog-time' })).toHaveAttribute('aria-live', 'off');
    await user.click(screen.getByRole('button', { name: /^start$/i }));
    await user.click(screen.getByRole('button', { name: /close focus timer/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open focus timer, running focus/i })).toBeVisible();

    await user.click(screen.getByRole('button', { name: /open focus timer/i }));
    expect(screen.getByRole('button', { name: /^pause$/i })).toBeVisible();
  });

  it('supports presets, break mode, and backdrop close without audio settings', async () => {
    const user = userEvent.setup();
    render(<FocusTimer />);

    await user.click(screen.getByRole('button', { name: /open focus timer/i }));
    expect(screen.getByRole('button', { name: /45 minutes/i })).toBeVisible();
    await user.click(screen.getByRole('button', { name: /45 minutes/i }));
    expect(screen.getByText('45:00', { selector: '.focus-dialog-time' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: /^break$/i }));
    expect(screen.getByText('05:00', { selector: '.focus-dialog-time' })).toBeVisible();
    expect(screen.queryByRole('heading', { name: /^music$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /background noise/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('dialog'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
