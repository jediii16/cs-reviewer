import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ScientificCalculator } from './ScientificCalculator';

describe('ScientificCalculator', () => {
  it('exposes the promised scientific and memory controls', async () => {
    const user = userEvent.setup();
    render(<ScientificCalculator />);
    await user.click(screen.getByRole('button', { name: 'Open calculator' }));
    expect(screen.getByRole('button', { name: 'log' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'ln' })).toBeVisible();
    expect(screen.getByRole('button', { name: '1/x' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'M+' })).toBeVisible();
  });
  it('calculates from the keyboard and keeps history while minimized', async () => {
    const user = userEvent.setup();
    render(<ScientificCalculator />);
    await user.click(screen.getByRole('button', { name: 'Open calculator' }));
    await user.click(screen.getByLabelText('Calculator expression'));
    await user.keyboard('(2+3)*4{Enter}');
    expect(screen.getByTestId('calculator-result')).toHaveTextContent('20');
    await user.click(screen.getByRole('button', { name: 'Minimize calculator' }));
    await user.click(screen.getByRole('button', { name: 'Open calculator' }));
    expect(screen.getByTestId('calculator-result')).toHaveTextContent('20');
  });
});
