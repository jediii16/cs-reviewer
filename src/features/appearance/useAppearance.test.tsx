import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadProgress } from '../progress/storage';
import { useAppearance } from './useAppearance';

function AppearanceHarness() {
  const { resolvedTheme, toggleTheme } = useAppearance();

  return (
    <button type="button" onClick={toggleTheme}>
      {resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    </button>
  );
}

describe('useAppearance', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })));
  });

  it('uses system dark mode, applies it to the root, and persists an explicit toggle', async () => {
    const user = userEvent.setup();
    render(<AppearanceHarness />);

    expect(document.documentElement.dataset.theme).toBe('dark');
    await user.click(screen.getByRole('button', { name: /switch to light mode/i }));

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(loadProgress().appearance).toBe('light');
  });
});
