import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { TestPage } from './TestPage';

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
    ]) {
      expect(screen.getByRole('heading', { name: heading })).toBeVisible();
    }

    expect(screen.getByRole('button', { name: /cia scenario practice.*10 questions/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /foundations concepts.*24 questions/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /principle definitions.*9 questions/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /threat scenarios.*12 questions/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /technique definitions.*17 questions/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /technique examples.*17 questions/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /psychological tactics.*9 questions/i })).toBeVisible();
  });

  it('starts every question in the chosen set', async () => {
    const user = userEvent.setup();
    renderCit017TestPage();

    await user.click(screen.getByRole('button', { name: /technique definitions.*17 questions/i }));

    expect(screen.getByText('Question 1 of 17')).toBeVisible();
    expect(screen.getByText('Technique Definitions')).toBeVisible();
  });
});
