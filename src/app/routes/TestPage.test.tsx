import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TestPage } from './TestPage';

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('TestPage', () => {
  function renderCit017TestPage() {
    return render(
      <MemoryRouter initialEntries={['/subjects/cit017/test']}>
        <Routes>
          <Route path="subjects/:subjectId/test" element={<TestPage />} />
        </Routes>
      </MemoryRouter>,
    );
  }

  it('groups every focused test set and shows its full question count', () => {
    renderCit017TestPage();

    for (const heading of [
      'Foundations of Information Security',
      'Security Principles',
      'Categories of Threats',
      'Social Engineering',
      'Book References',
    ]) {
      expect(screen.getByRole('heading', { name: heading })).toBeVisible();
    }

    expect(screen.getByRole('button', { name: /cia scenario practice.*10 questions/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /foundations concepts.*24 questions/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /principle definitions.*9 questions/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /threat scenarios.*12 questions/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /threat scenario challenge.*15 questions/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /technique definitions.*17 questions/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /technique examples.*17 questions/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /psychological tactics.*9 questions/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /book reference definitions.*33 questions/i })).toBeVisible();
  });

  it('starts every question in the chosen set', async () => {
    const user = userEvent.setup();
    renderCit017TestPage();

    await user.click(screen.getByRole('button', { name: /technique definitions.*17 questions/i }));

    expect(screen.getByText('Question 1 of 17')).toBeVisible();
    expect(screen.getByText('Technique Definitions')).toBeVisible();
  });

  it('brings the active test header into view when a set starts', async () => {
    const user = userEvent.setup();
    const scrollTo = vi.mocked(window.scrollTo);
    renderCit017TestPage();

    await user.click(screen.getByRole('button', { name: /technique definitions.*17 questions/i }));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('returns from an active test to the practice-set list', async () => {
    const user = userEvent.setup();
    renderCit017TestPage();

    await user.click(screen.getByRole('button', { name: /technique definitions.*17 questions/i }));
    await user.click(screen.getByRole('button', { name: /back to practice sets/i }));

    expect(screen.getByRole('heading', { name: /choose a practice set/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /technique definitions.*17 questions/i })).toBeVisible();
  });

  it('introduces a test once and keeps its question prompt quick to scan', async () => {
    const user = userEvent.setup();
    renderCit017TestPage();

    await user.click(screen.getByRole('button', { name: /technique definitions.*17 questions/i }));

    expect(screen.getByRole('status')).toHaveTextContent(
      'Identify the social-engineering technique described in each question.',
    );
    expect(screen.getByRole('heading', { level: 2 })).not.toHaveTextContent(
      /which social-engineering technique matches this description/i,
    );
  });

  it('starts the complete Book References definition test', async () => {
    const user = userEvent.setup();
    renderCit017TestPage();

    await user.click(screen.getByRole('button', { name: /book reference definitions.*33 questions/i }));

    expect(screen.getByText('Question 1 of 33')).toBeVisible();
    expect(screen.getByText('Book Reference Definitions')).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Identify the book-reference term that matches each definition.',
    );
  });
});
