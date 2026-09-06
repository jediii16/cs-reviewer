import { ArrowLeft, ArrowRight, GalleryHorizontalEnd } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { BappiMascot } from '../../components/BappiMascot';
import { getSubject, getSubjectFlashcards } from '../../content/subjects';
import type { FlashcardDeck as FlashcardDeckModel } from '../../content/types';
import { FlashcardDeck } from '../../features/flashcards/FlashcardDeck';

export function FlashcardsPage() {
  const { subjectId } = useParams();
  const subject = getSubject(subjectId);
  const decks = getSubjectFlashcards(subjectId);
  const [activeDeck, setActiveDeck] = useState<{
    subjectId: string;
    deck: FlashcardDeckModel;
  } | null>(null);

  if (!subject || !decks) return <Navigate to="/" replace />;

  if (activeDeck?.subjectId === subject.id) {
    return (
      <section className="flashcards-page flashcards-page-running">
        <Link className="back-link" to={`/subjects/${subject.id}`}><ArrowLeft aria-hidden="true" /> {subject.code}</Link>
        <FlashcardDeck deck={activeDeck.deck} onExit={() => setActiveDeck(null)} />
      </section>
    );
  }

  return (
    <section className="flashcards-page" aria-labelledby="flashcards-title">
      <Link className="back-link" to={`/subjects/${subject.id}`}><ArrowLeft aria-hidden="true" /> {subject.code}</Link>
      <header className="test-heading test-heading-with-bappi">
        <div>
          <p className="section-label">Identification, without grading</p>
          <h1 id="flashcards-title">Choose a flashcard deck</h1>
          <p>Recall the term before revealing it. These cards are for self-checking, so there is no score or answer checker.</p>
        </div>
        <BappiMascot className="test-heading-mascot" pose="thinking" alt="Bappi is thinking through a flashcard" />
      </header>

      <div className="flashcard-deck-list">
        {decks.map((deck) => (
          <button type="button" key={deck.id} onClick={() => setActiveDeck({ subjectId: subject.id, deck })}>
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
