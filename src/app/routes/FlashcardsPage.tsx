import { ArrowLeft, ArrowRight, GalleryHorizontalEnd } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BappiMascot } from '../../components/BappiMascot';
import { cit017FlashcardDecks } from '../../content/cit017/flashcards';
import type { FlashcardDeck as FlashcardDeckModel } from '../../content/types';
import { FlashcardDeck } from '../../features/flashcards/FlashcardDeck';

export function FlashcardsPage() {
  const [activeDeck, setActiveDeck] = useState<FlashcardDeckModel | null>(null);

  if (activeDeck) {
    return (
      <section className="flashcards-page flashcards-page-running">
        <Link className="back-link" to="/subjects/cit017"><ArrowLeft aria-hidden="true" /> CIT.017</Link>
        <FlashcardDeck deck={activeDeck} onExit={() => setActiveDeck(null)} />
      </section>
    );
  }

  return (
    <section className="flashcards-page" aria-labelledby="flashcards-title">
      <Link className="back-link" to="/subjects/cit017"><ArrowLeft aria-hidden="true" /> CIT.017</Link>
      <header className="test-heading test-heading-with-bappi">
        <div>
          <p className="section-label">Identification, without grading</p>
          <h1 id="flashcards-title">Choose a flashcard deck</h1>
          <p>Recall the term before revealing it. These cards are for self-checking, so there is no score or answer checker.</p>
        </div>
        <BappiMascot className="test-heading-mascot" pose="thinking" alt="Bappi is thinking through a flashcard" />
      </header>

      <div className="flashcard-deck-list">
        {cit017FlashcardDecks.map((deck) => (
          <button type="button" key={deck.id} onClick={() => setActiveDeck(deck)}>
            <span className="test-mode-icon" aria-hidden="true"><GalleryHorizontalEnd /></span>
            <span>
              <strong>{deck.title}</strong>
              <small>{deck.description}</small>
            </span>
            <span className="test-set-count">{deck.cards.length} cards</span>
            <ArrowRight className="test-mode-action" aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}
