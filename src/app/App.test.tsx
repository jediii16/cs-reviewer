import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { learningActions } from '../features/learning/useLearning';
import { finalsQuestions } from '../features/learning/syllabus';
import { App } from './App';
function renderApp(path = '/') { return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>); }
beforeEach(() => { act(() => { learningActions.setPeriod('2026-finals'); learningActions.resetSubject('cit015'); learningActions.setCalm(false); }); });
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });
describe('Bappi study desk navigation', () => {
  it('offers current lessons, practice, review, and settings from the desk', async () => {
    const user = userEvent.setup(); renderApp();
    expect(screen.getByRole('heading', { name: /what are we reviewing today/i })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Lessons' })).toHaveAttribute('href', '/subjects/cit015/study');
    expect(screen.getByRole('link', { name: 'Practice' })).toHaveAttribute('href', '/subjects/cit015/test');
    expect(screen.getByRole('link', { name: 'Review' })).toHaveAttribute('href', '/review');
    await user.click(screen.getByRole('link', { name: /cit\.015 operating systems/i }));
    expect(screen.getByRole('heading', { name: 'Operating Systems' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Study' })).toHaveAttribute('href', '/subjects/cit015/study');
    expect(screen.getByRole('link', { name: 'Test' })).toHaveAttribute('href', '/subjects/cit015/test');
  });
  it.each(['/subjects/cit016/study', '/subjects/cit017/test', '/subjects/cs412/crossword', '/subjects/cs412/preprocessing', '/subjects/cognate4/crossword', '/subjects/cit015/flashcards'])('keeps retired route %s out of the current syllabus', (path) => {
    renderApp(path); expect(screen.getByRole('heading', { name: /what are we reviewing today/i })).toBeVisible();
  });
  it('separates section review from practice and can reset a subject', async () => {
    const user = userEvent.setup(); renderApp('/subjects/cit015/study');
    await user.click(screen.getByRole('button', { name: 'Mark section reviewed' }));
    await user.click(screen.getByRole('link', { name: 'Bappi home' }));
    expect(screen.getByText('Concepts practiced')).toBeVisible();
    await user.click(screen.getByRole('link', { name: /cit\.015 operating systems/i }));
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    await user.click(screen.getByRole('button', { name: 'Reset progress' }));
    expect(screen.getByText('No test scores yet')).toBeVisible();
  });
  it('keeps a saved quiz reachable from home with the same session ID', () => {
    act(() => { learningActions.startQuiz('cit015', 'Saved sample', finalsQuestions.slice(0, 2)); });
    renderApp(); expect(screen.getByRole('link', { name: 'Continue session' })).toHaveAttribute('href', expect.stringContaining('/subjects/cit015/test?session='));
  });
  it('keeps Bappi playful while calm mode pauses its automatic movement', () => {
    vi.useFakeTimers(); renderApp();
    const mascot = screen.getByRole('button', { name: 'Play with Bappi' });
    act(() => vi.advanceTimersByTime(1800)); expect(mascot).toHaveAttribute('data-roll-step', '2');
    act(() => learningActions.setCalm(true)); const step = mascot.getAttribute('data-roll-step');
    act(() => vi.advanceTimersByTime(1800)); expect(mascot).toHaveAttribute('data-roll-step', step);
    fireEvent.click(mascot); expect(screen.getByRole('img', { name: /bappi looks startled/i })).toBeVisible();
  });
});
