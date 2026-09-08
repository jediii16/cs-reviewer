import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { PreprocessingPractice } from './PreprocessingPractice';

describe('PreprocessingPractice', () => {
  it('toggles a worked solution open and closed', async () => {
    const user = userEvent.setup();
    render(<PreprocessingPractice />);
    const show = screen.getAllByRole('button', { name: /show solution/i })[0];
    await user.click(show);
    expect(screen.getAllByRole('heading', { name: /worked solution/i })[0]).toBeVisible();
    const hide = screen.getAllByRole('button', { name: /hide solution/i })[0];
    await user.click(hide);
    expect(screen.queryByRole('heading', { name: /worked solution/i })).not.toBeInTheDocument();
  });
});
