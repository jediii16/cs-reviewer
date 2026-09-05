import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FocusDialog } from './FocusDialog';

describe('FocusDialog effects', () => {
  it('renders a completion ripple only for a completed session signal', () => {
    const { container, rerender } = render(
      <FocusDialog
        state={{
          mode: 'break',
          remainingSeconds: 300,
          presetMinutes: 25,
          running: false,
          completedSessions: 1,
          completionEffect: true,
        }}
        dispatch={vi.fn()}
        selectPreset={vi.fn()}
        onClose={vi.fn()}
        completionEffect
      />,
    );

    expect(container.querySelector('.focus-completion-ripple')).toBeInTheDocument();

    rerender(
      <FocusDialog
        state={{
          mode: 'break',
          remainingSeconds: 300,
          presetMinutes: 25,
          running: false,
          completedSessions: 1,
          completionEffect: false,
        }}
        dispatch={vi.fn()}
        selectPreset={vi.fn()}
        onClose={vi.fn()}
        completionEffect={false}
      />,
    );

    expect(container.querySelector('.focus-completion-ripple')).not.toBeInTheDocument();
  });
});
