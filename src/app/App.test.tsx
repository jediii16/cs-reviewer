import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useProgress } from '../features/progress/useProgress';
import { App } from './App';

function ProgressTestControls() {
  const { progress, recordResult, reset } = useProgress();
  const cit017Result = {
    subjectId: 'cit017',
    completedAt: '2026-09-06T00:00:00.000Z',
    correct: 3,
    total: 4,
  };
  const cit016Result = {
    subjectId: 'cit016',
    completedAt: '2026-09-06T01:00:00.000Z',
    correct: 2,
    total: 3,
  };

  return (
    <>
      <button type="button" onClick={() => recordResult(cit017Result)}>Seed CIT.017 score</button>
      <button type="button" onClick={() => recordResult(cit016Result)}>Seed CIT.016 score</button>
      <button type="button" onClick={reset}>Clear test progress</button>
      <output aria-label="CIT.017 saved scores">
        {progress.recentResults.filter((result) => !result.subjectId || result.subjectId === 'cit017').length}
      </output>
      <output aria-label="CIT.016 saved scores">
        {progress.recentResults.filter((result) => result.subjectId === 'cit016').length}
      </output>
    </>
  );
}

function SubjectRouteSwitcher() {
  const navigate = useNavigate();

  return (
    <>
      <button type="button" onClick={() => navigate('/subjects/cit017/test')}>Switch test subject</button>
      <button type="button" onClick={() => navigate('/subjects/cit016/flashcards')}>Open CIT.016 flashcards</button>
      <button type="button" onClick={() => navigate('/subjects/cit017/flashcards')}>Switch flashcard subject</button>
    </>
  );
}

describe('App navigation', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
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

  it('opens CIT.017 and exposes all three review paths', async () => {
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
    expect(screen.getByRole('link', { name: /^flashcards$/i })).toHaveAttribute(
      'href',
      '/subjects/cit017/flashcards',
    );
    expect(screen.getByRole('link', { name: /^test$/i })).toHaveAttribute(
      'href',
      '/subjects/cit017/test',
    );
  });

  it('lists CIT.016 and opens its three review paths independently', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /cit\.017/i })).toBeVisible();
    await user.click(screen.getByRole('link', { name: /cit\.016/i }));

    expect(screen.getByRole('heading', { name: /cit\.016/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^study$/i })).toHaveAttribute(
      'href',
      '/subjects/cit016/study',
    );
    expect(screen.getByRole('link', { name: /^flashcards$/i })).toHaveAttribute(
      'href',
      '/subjects/cit016/flashcards',
    );
    expect(screen.getByRole('link', { name: /^test$/i })).toHaveAttribute(
      'href',
      '/subjects/cit016/test',
    );
  });

  it('renders the CIT.016 study topics without CIT.017 lessons', () => {
    render(
      <MemoryRouter initialEntries={['/subjects/cit016/study']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Study CIT.016' })).toBeVisible();
    for (const topic of [
      'Digital vs. Analog',
      'Error Detection and Correction',
      'TCP/IP Stack',
      'Transmission Media',
      'Multiplexing',
    ]) {
      expect(screen.getByRole('button', { name: new RegExp(topic, 'i') })).toBeVisible();
    }
    expect(screen.queryByRole('button', { name: /security principles/i })).not.toBeInTheDocument();
  });

  it('offers a complete CIT.016 practice set for every study topic', () => {
    render(
      <MemoryRouter initialEntries={['/subjects/cit016/test']}>
        <App />
      </MemoryRouter>,
    );

    for (const [title, count] of [
      ['Digital vs. Analog', 14],
      ['Error Detection and Correction', 12],
      ['TCP/IP Stack', 6],
      ['Transmission Media', 9],
      ['Multiplexing', 7],
    ] as const) {
      expect(screen.getByRole('heading', { name: title })).toBeVisible();
      expect(screen.getByRole('button', { name: new RegExp(`${title}.*${count} questions`, 'i') })).toBeVisible();
    }
  });

  it('offers a CIT.016 flashcard for every study section', () => {
    render(
      <MemoryRouter initialEntries={['/subjects/cit016/flashcards']}>
        <App />
      </MemoryRouter>,
    );

    for (const [title, count] of [
      ['Digital vs. Analog', 14],
      ['Error Detection and Correction', 12],
      ['TCP/IP Stack', 6],
      ['Transmission Media', 9],
      ['Multiplexing', 7],
    ] as const) {
      expect(screen.getByRole('button', { name: new RegExp(`${title}.*${count} cards`, 'i') })).toBeVisible();
    }
  });

  it('opens the Book References glossary as a paged CIT.017 lesson', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/subjects/cit017/study']}>
        <App />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /book references/i }));

    expect(screen.getByRole('heading', { name: /lesson 1: security foundations/i })).toBeVisible();
    expect(screen.getByText('Information Security')).toBeVisible();
    expect(screen.getByText(/the protection of information and its critical elements/i)).toBeVisible();

    await user.click(screen.getByRole('button', { name: /^next$/i }));
    expect(screen.getByRole('heading', { name: /core security terminology/i })).toBeVisible();
  });

  it('does not carry an active quiz or deck into another subject route', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/subjects/cit016/test']}>
        <SubjectRouteSwitcher />
        <App />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /digital vs\. analog.*14 questions/i }));
    expect(screen.getByText(/question 1 of 14/i)).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Switch test subject' }));
    expect(screen.getByRole('heading', { name: 'Security Principles' })).toBeVisible();
    expect(screen.queryByText(/question 1 of 14/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open CIT.016 flashcards' }));
    await user.click(screen.getByRole('button', { name: /digital vs\. analog.*14 cards/i }));
    expect(screen.getByText(/card 1 of 14/i)).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Switch flashcard subject' }));
    expect(screen.getByRole('heading', { name: 'Choose a flashcard deck' })).toBeVisible();
    expect(screen.queryByText(/card 1 of 14/i)).not.toBeInTheDocument();
  });

  it('does not show a CIT.017 score on the CIT.016 dashboard', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/subjects/cit016']}>
        <ProgressTestControls />
        <App />
      </MemoryRouter>,
    );

    try {
      await user.click(screen.getByRole('button', { name: 'Seed CIT.017 score' }));
      expect(screen.getByText('No test scores yet')).toBeVisible();
    } finally {
      await user.click(screen.getByRole('button', { name: 'Clear test progress' }));
    }
  });

  it('resets only the open subject while preserving another subject score', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={['/subjects/cit016']}>
        <ProgressTestControls />
        <App />
      </MemoryRouter>,
    );

    try {
      await user.click(screen.getByRole('button', { name: 'Seed CIT.017 score' }));
      await user.click(screen.getByRole('button', { name: 'Seed CIT.016 score' }));
      await user.click(screen.getByRole('button', { name: 'Reset progress' }));

      expect(screen.getByLabelText('CIT.017 saved scores')).toHaveTextContent('1');
      expect(screen.getByLabelText('CIT.016 saved scores')).toHaveTextContent('0');
    } finally {
      await user.click(screen.getByRole('button', { name: 'Clear test progress' }));
    }
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
