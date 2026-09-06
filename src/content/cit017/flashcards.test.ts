import { describe, expect, it } from 'vitest';
import { cit017FlashcardDecks } from './flashcards';
import { psychologicalTactics, socialTechniques } from './social';
import { securityPrinciples } from './principles';
import { threatCategories } from './threats';

describe('CIT.017 flashcard decks', () => {
  it('contains the complete four-deck inventory', () => {
    expect(Object.fromEntries(cit017FlashcardDecks.map((deck) => [deck.id, deck.cards.length]))).toEqual({
      foundations: 17,
      principles: 9,
      threats: 12,
      social: 26,
    });
  });

  it('uses unique card ids and non-empty self-check content', () => {
    const cards = cit017FlashcardDecks.flatMap((deck) => deck.cards);
    const ids = cards.map((card) => card.id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const card of cards) {
      expect(card.prompt.trim()).not.toBe('');
      expect(card.answer.trim()).not.toBe('');
    }
  });

  it('covers every principle, threat, technique, and tactic', () => {
    const principles = cit017FlashcardDecks.find((deck) => deck.id === 'principles');
    const threats = cit017FlashcardDecks.find((deck) => deck.id === 'threats');
    const social = cit017FlashcardDecks.find((deck) => deck.id === 'social');

    expect(principles?.cards.map((card) => card.answer)).toEqual(
      securityPrinciples.map((principle) => principle.name),
    );
    expect(threats?.cards.map((card) => card.answer)).toEqual(
      threatCategories.map((category) => category.name),
    );
    expect(social?.cards.map((card) => card.answer)).toEqual([
      ...socialTechniques.map((technique) => technique.name),
      ...psychologicalTactics.map((tactic) => tactic.name),
    ]);
  });
});
