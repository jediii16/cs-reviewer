import { describe, expect, it } from 'vitest';
import { cit016FlashcardDecks } from './flashcards';

describe('CIT.016 flashcards', () => {
  it('contains five decks and one complete card per lesson section', () => {
    const cards = cit016FlashcardDecks.flatMap((deck) => deck.cards);

    expect(cit016FlashcardDecks.map((deck) => deck.cards.length)).toEqual([14, 12, 6, 9, 7]);
    expect(cards).toHaveLength(48);
    expect(new Set(cards.map((card) => card.id)).size).toBe(48);
    expect(cards.every((card) => card.prompt.length > 0 && card.answer.length > 0)).toBe(true);
  });
});
