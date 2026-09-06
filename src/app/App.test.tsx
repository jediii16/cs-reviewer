import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

describe('App navigation', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('presents Bappi as the reviewer brand and home mascot', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /bappi home/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /bappi, a cheerful kimbap mascot/i })).toBeVisible();
  });

  it('rolls landing-page Bappi and shows the startled face while upside down', () => {
    vi.useFakeTimers();

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    const bappi = screen.getByRole('button', { name: /play with bappi/i });
    expect(bappi).toHaveAttribute('data-roll-step', '0');
    expect(bappi).toHaveStyle('--bappi-roll: 0deg');
    expect(screen.getByRole('img', { name: /bappi, a cheerful kimbap mascot/i })).toBeVisible();

    act(() => vi.advanceTimersByTime(900));

    expect(bappi).toHaveAttribute('data-roll-step', '1');
    expect(bappi).toHaveStyle('--bappi-roll: 90deg');
    expect(screen.getByRole('img', { name: /bappi is thinking/i })).toBeVisible();

    act(() => vi.advanceTimersByTime(900));

    expect(bappi).toHaveAttribute('data-roll-step', '2');
    expect(bappi).toHaveStyle('--bappi-roll: 180deg');
    expect(screen.getByRole('img', { name: /bappi looks startled/i })).toBeVisible();
  });

  it('keeps Bappi startled briefly after a tap', () => {
    vi.useFakeTimers();

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    const bappi = screen.getByRole('button', { name: /play with bappi/i });
    fireEvent.click(bappi);

    expect(screen.getByRole('img', { name: /bappi looks startled/i })).toBeVisible();

    act(() => vi.advanceTimersByTime(1_200));

    expect(screen.queryByRole('img', { name: /bappi looks startled/i })).not.toBeInTheDocument();
  });

  it('opens CIT.017 and exposes the two primary study actions', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('link', { name: /cit\.017/i }));

    expect(screen.getByRole('heading', { name: /cit\.017/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^study$/i })).toHaveAttribute(
      'href',
      '/subjects/cit017/study',
    );
    expect(screen.getByRole('link', { name: /^test$/i })).toHaveAttribute(
      'href',
      '/subjects/cit017/test',
    );
  });

  it('switches the complete app shell between dark and light themes', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /switch to dark mode/i }));

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeVisible();
  });

  it('keeps music controls available independently from the focus timer', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /^open music and ambience$/i }));
    expect(screen.getByRole('dialog', { name: /music and ambience/i })).toBeVisible();
    expect(screen.getByRole('region', { name: /music player/i })).toBeInTheDocument();
  });
});
