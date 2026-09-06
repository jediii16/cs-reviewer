import { ArrowLeft, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { FlashcardDeck as FlashcardDeckModel } from '../../content/types';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';

interface FlashcardDeckProps {
  deck: FlashcardDeckModel;
  onExit: () => void;
  random?: () => number;
}

function shuffled<T>(items: readonly T[], random: () => number) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

export function FlashcardDeck({ deck, onExit, random = Math.random }: FlashcardDeckProps) {
  const [cards, setCards] = useState(deck.cards);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[cardIndex];

  const moveTo = useCallback((nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= cards.length) return;
    setCardIndex(nextIndex);
    setFlipped(false);
  }, [cards.length]);

  function shuffleCards() {
    setCards((current) => shuffled(current, random));
    setCardIndex(0);
    setFlipped(false);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName ?? '')) return;
      if (event.key === 'ArrowRight' && cardIndex < cards.length - 1) {
        event.preventDefault();
        moveTo(cardIndex + 1);
      }
      if (event.key === 'ArrowLeft' && cardIndex > 0) {
        event.preventDefault();
        moveTo(cardIndex - 1);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [cardIndex, cards.length, moveTo]);

  if (!card) {
    return (
      <section className="flashcard-runner flashcard-empty">
        <p>This deck does not have any cards yet.</p>
        <Button variant="ghost" onClick={onExit}><ArrowLeft aria-hidden="true" /> Return to decks</Button>
      </section>
    );
  }

  return (
    <section className="flashcard-runner" aria-labelledby="flashcard-deck-title">
      <div className="flashcard-progress-row">
        <div>
          <span>Self-check deck</span>
          <h1 id="flashcard-deck-title">{deck.title}</h1>
        </div>
        <span>Card {cardIndex + 1} of {cards.length}</span>
      </div>
      <ProgressBar value={cardIndex + 1} max={cards.length} label="Flashcard progress" />

      <button
        type="button"
        className={`flashcard ${flipped ? 'is-flipped' : ''}`}
        aria-label={flipped ? 'Show question' : 'Reveal answer'}
        aria-pressed={flipped}
        onClick={() => setFlipped((current) => !current)}
      >
        <span className="flashcard-face-label">{flipped ? 'Answer' : 'Question'}</span>
        {flipped ? (
          <span className="flashcard-answer" aria-live="polite">
            <strong>{card.answer}</strong>
            {card.detail ? <small>{card.detail}</small> : null}
          </span>
        ) : (
          <span className="flashcard-prompt">{card.prompt}</span>
        )}
        <span className="flashcard-hint">{flipped ? 'Tap to see the question' : 'Think first, then tap to check'}</span>
      </button>

      <div className="flashcard-controls">
        <Button variant="ghost" onClick={onExit}><ArrowLeft aria-hidden="true" /> Return to decks</Button>
        <div className="flashcard-transport">
          <Button
            variant="ghost"
            aria-label="Previous card"
            disabled={cardIndex === 0}
            onClick={() => moveTo(cardIndex - 1)}
          >
            <ChevronLeft aria-hidden="true" /> Previous
          </Button>
          <Button variant="ghost" aria-label="Shuffle cards" onClick={shuffleCards}>
            <Shuffle aria-hidden="true" /> Shuffle
          </Button>
          <Button
            variant="secondary"
            aria-label="Next card"
            disabled={cardIndex === cards.length - 1}
            onClick={() => moveTo(cardIndex + 1)}
          >
            Next <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
