import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('COGNATE4 routes', () => {
  it('appears on the home page and exposes study, multiple-choice, and crossword modes', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><App /></MemoryRouter>);

    await user.click(screen.getByRole('link', { name: /cognate4.*machine vision/i }));

    expect(screen.getByRole('heading', { name: 'COGNATE4' })).toBeVisible();
    expect(screen.getByRole('link', { name: /^study$/i })).toHaveAttribute('href', '/subjects/cognate4/study');
    expect(screen.getByRole('link', { name: /multiple choice/i })).toHaveAttribute('href', '/subjects/cognate4/test');
    expect(screen.getByRole('link', { name: /crossword/i })).toHaveAttribute('href', '/subjects/cognate4/crossword');
  });

  it('shows all five lessons in study and multiple-choice practice', () => {
    const { unmount } = render(<MemoryRouter initialEntries={['/subjects/cognate4/study']}><App /></MemoryRouter>);
    for (const lesson of [
      'Introduction to Machine Vision',
      'Introduction Extension',
      'Working with Images',
      'Java Bitwise Operations',
      'Grayscale Methods',
    ]) {
      expect(screen.getByRole('button', { name: new RegExp(lesson, 'i') })).toBeVisible();
    }

    unmount();
    render(<MemoryRouter initialEntries={['/subjects/cognate4/test']}><App /></MemoryRouter>);
    for (const [lesson, count] of [
      ['Lesson 1: Introduction to Machine Vision', 32],
      ['Lesson 2: Introduction Extension', 31],
      ['Lesson 3: Working with Images', 24],
      ['Lesson 4: Java Bitwise Operations', 21],
      ['Lesson 5: Grayscale Methods', 18],
    ] as const) {
      expect(screen.getByRole('button', { name: new RegExp(`${lesson}.*${count} questions`, 'i') })).toBeVisible();
    }
  });

  it('offers one complete crossword per lesson and starts the selected lesson puzzle', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/subjects/cognate4/crossword']}><App /></MemoryRouter>);

    expect(screen.getAllByRole('button', { name: /start lesson .* crossword/i })).toHaveLength(5);
    await user.click(screen.getByRole('button', { name: /start lesson 5: grayscale methods crossword/i }));

    expect(screen.getByRole('grid', { name: /crossword grid/i })).toBeVisible();
    expect(screen.getAllByRole('button', { name: /clue/i })).toHaveLength(8);
  });

  it('uses a readable lesson label while a multiple-choice set is running', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/subjects/cognate4/test']}><App /></MemoryRouter>);

    await user.click(screen.getByRole('button', { name: /lesson 1: introduction to machine vision.*32 questions/i }));

    expect(screen.getByText('Lesson 1', { exact: true })).toBeVisible();
    expect(screen.queryByText('introduction', { exact: true })).not.toBeInTheDocument();
  });
});
