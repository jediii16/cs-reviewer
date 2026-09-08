import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('CS.412 routes', () => {
  it('offers study and both announced exam modes', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/subjects/cs412']}><App /></MemoryRouter>);
    expect(screen.getByRole('link', { name: /crossword practice/i })).toHaveAttribute('href', '/subjects/cs412/crossword');
    expect(screen.getByRole('link', { name: /^study$/i })).toHaveAttribute('href', '/subjects/cs412/study');
    await user.click(screen.getByRole('link', { name: /data preprocessing/i }));
    expect(screen.getByRole('heading', { name: /data preprocessing lab/i })).toBeVisible();
    expect(screen.getAllByText('5 points')).toHaveLength(6);
    expect(screen.getByText(/30 points total/i)).toBeVisible();
    expect(screen.getByRole('img', { name: /bappi is ready to solve/i })).toBeVisible();
  });

  it('provides Word - Definition study lessons and preprocessing methods', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/subjects/cs412']}><App /></MemoryRouter>);
    await user.click(screen.getByRole('link', { name: /^study$/i }));
    expect(screen.getByRole('heading', { name: /study cs\.412/i })).toBeVisible();
    expect(screen.getAllByText('Data Mining', { exact: true })[0]).toBeVisible();
    expect(screen.getAllByText(/process of sorting through large data sets/i)[0]).toBeVisible();
    expect(screen.getByRole('button', { name: /data preprocessing techniques/i })).toBeVisible();
  });

  it('starts a real 15-answer crossword', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/subjects/cs412/crossword']}><App /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: /start 15-item mock exam/i }));
    expect(screen.getByRole('grid', { name: /crossword grid/i })).toBeVisible();
    expect(screen.getAllByRole('button', { name: /clue/i })).toHaveLength(15);
  });

  it('offers one complete crossword for each theory topic', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/subjects/cs412/crossword']}><App /></MemoryRouter>);
    expect(screen.getByRole('button', { name: /start introduction to data mining crossword/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /start crisp-dm crossword/i })).toBeVisible();
    await user.click(screen.getByRole('button', { name: /start data warehousing crossword/i }));
    expect(screen.getByRole('grid', { name: /crossword grid/i })).toBeVisible();
    expect(screen.getAllByRole('button', { name: /clue/i })).toHaveLength(19);
  });
});
