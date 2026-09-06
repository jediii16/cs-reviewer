import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { FlashcardDeck as FlashcardDeckModel } from '../../content/types';
import { FlashcardDeck } from './FlashcardDeck';

const deck: FlashcardDeckModel = {
  id: 'sample',
  title: 'Sample deck',
  description: 'Two sample cards.',
  cards: [
    {
      id: 'card-one',
      topicId: 'cia',
      prompt: 'Which property limits access?',
      answer: 'Confidentiality',
      detail: 'Only authorized users should receive access.',
    },
    {
      id: 'card-two',
      topicId: 'cia',
      prompt: 'Which property keeps data accurate?',
      answer: 'Integrity',
    },
  ],
};

describe('FlashcardDeck', () => {
  it('reveals a self-check answer without scoring it', async () => {
    const user = userEvent.setup();
    render(<FlashcardDeck deck={deck} onExit={vi.fn()} />);

    expect(screen.getByText('Card 1 of 2')).toBeVisible();
    expect(screen.getByText(deck.cards[0].prompt)).toBeVisible();
    expect(screen.queryByText(deck.cards[0].answer)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /reveal answer/i }));

    expect(screen.getByText(deck.cards[0].answer)).toBeVisible();
    expect(screen.getByText(deck.cards[0].detail!)).toBeVisible();
    expect(screen.queryByText(/correct|score/i)).not.toBeInTheDocument();
  });

  it('moves with arrow keys and resets the next card to its front', async () => {
    const user = userEvent.setup();
    render(<FlashcardDeck deck={deck} onExit={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /reveal answer/i }));
    await user.keyboard('{ArrowRight}');

    expect(screen.getByText('Card 2 of 2')).toBeVisible();
    expect(screen.getByText(deck.cards[1].prompt)).toBeVisible();
    expect(screen.queryByText(deck.cards[1].answer)).not.toBeInTheDocument();

    await user.keyboard('{ArrowLeft}');
    expect(screen.getByText('Card 1 of 2')).toBeVisible();
  });

  it('flips with the native Enter key and exposes deck controls', async () => {
    const user = userEvent.setup();
    const onExit = vi.fn();
    render(<FlashcardDeck deck={deck} onExit={onExit} />);

    const card = screen.getByRole('button', { name: /reveal answer/i });
    card.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: /show question/i })).toBeVisible();

    expect(screen.getByRole('button', { name: /previous card/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next card/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /shuffle cards/i })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: /return to decks/i }));
    expect(onExit).toHaveBeenCalledOnce();
  });
});
