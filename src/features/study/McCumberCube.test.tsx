import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { McCumberCube } from './McCumberCube';

describe('McCumberCube', () => {
  it('explains the selected security intersection', async () => {
    const user = userEvent.setup();
    render(<McCumberCube />);

    await user.click(screen.getByRole('button', { name: 'Confidentiality' }));
    await user.click(screen.getByRole('button', { name: 'Transmission' }));
    await user.click(screen.getByRole('button', { name: 'Technology' }));

    expect(screen.getByRole('status')).toHaveTextContent(
      /technology.*confidentiality.*transmission/i,
    );
  });
});
