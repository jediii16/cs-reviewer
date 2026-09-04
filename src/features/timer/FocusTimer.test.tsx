import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FocusTimer } from './FocusTimer';

describe('FocusTimer', () => {
  it('starts paused and exposes focus presets', async () => {
    const user = userEvent.setup();
    render(<FocusTimer />);

    expect(screen.getByText('25:00')).toBeVisible();
    await user.click(screen.getByRole('button', { name: /^start$/i }));
    expect(screen.getByRole('button', { name: /^pause$/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /45 minutes/i })).toBeVisible();
  });
});
