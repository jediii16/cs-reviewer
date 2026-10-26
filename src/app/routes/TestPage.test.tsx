import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { learningActions } from '../../features/learning/useLearning';
import { TestPage } from './TestPage';
beforeEach(() => { act(() => { learningActions.setPeriod('2026-finals'); learningActions.resetSubject('cit015'); }); });
function renderTests() { return render(<MemoryRouter initialEntries={['/subjects/cit015/test']}><Routes><Route path="subjects/:subjectId/test" element={<TestPage />} /></Routes></MemoryRouter>); }
describe('session setup and ready-made practice', () => {
  it('exposes both formats, full focused banks, and balanced mixed practice', () => {
    renderTests();
    expect(screen.getByRole('radio', { name: /mock exam/i })).toBeVisible();
    for (const name of [/concurrent processing multiple choice 24 questions/i, /concurrent processing true or false 16 questions/i, /file and disk management multiple choice 30 questions/i, /file and disk management true or false 20 questions/i, /mixed finals review.*20 questions/i]) expect(screen.getByRole('button', { name })).toBeVisible();
  });
  it('checks true-or-false answers with slide feedback and saves the session on leaving', async () => {
    const user = userEvent.setup(); renderTests();
    await user.click(screen.getByRole('button', { name: /concurrent processing true or false 16 questions/i }));
    expect(screen.getByText('Question 1 of 16')).toBeVisible();
    await user.click(screen.getByRole('radio', { name: 'False' }));
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    expect(screen.getByText(/Source: Concurrent Processing · slide/)).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Save & leave session' }));
    expect(screen.getByRole('button', { name: 'Continue session' })).toBeVisible();
  });
  it('starts a configurable five-question mock exam with no immediate answer feedback', async () => {
    const user = userEvent.setup(); renderTests();
    await user.click(screen.getByRole('radio', { name: /mock exam/i }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'Session length' }), '5');
    await user.click(screen.getByRole('button', { name: 'Start session' }));
    expect(screen.getByText('Question 1 of 5')).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Check answer' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Review all 5 questions' })).toBeVisible();
  });
});
