import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App navigation', () => {
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
});
