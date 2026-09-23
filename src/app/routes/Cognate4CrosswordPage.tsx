import { ArrowLeft, ArrowRight, BookOpen, Puzzle } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { cognate4Lessons } from '../../content/cognate4';
import { cognate4CrosswordTerms } from '../../content/cognate4/crossword';
import { createCompleteCrossword } from '../../features/crossword/builder';
import { CrosswordGame } from '../../features/crossword/CrosswordGame';
import type { CrosswordPuzzle } from '../../features/crossword/types';

export function Cognate4CrosswordPage() {
  const [puzzle, setPuzzle] = useState<CrosswordPuzzle | null>(null);
  const run = useRef(0);
  const nextSeed = () => 404 + ++run.current * 404;

  function startLesson(lessonId: (typeof cognate4Lessons)[number]['id'], title: string) {
    const seed = nextSeed();
    const terms = cognate4CrosswordTerms.filter((term) => term.module === lessonId);
    setPuzzle(createCompleteCrossword(terms, seed, `${title} · All Terms`));
  }

  if (puzzle) return <CrosswordGame puzzle={puzzle} onExit={() => setPuzzle(null)} />;

  return (
    <section className="cs412-page crossword-landing">
      <Link className="back-link" to="/subjects/cognate4"><ArrowLeft /> COGNATE4</Link>
      <header className="cs412-hero">
        <div>
          <h1>Machine Vision crosswords</h1>
          <p>Choose a lesson and place every key term into one connected puzzle.</p>
        </div>
        <Puzzle aria-hidden="true" />
      </header>

      <div className="crossword-library">
        <h2>Practice by lesson</h2>
        <p>Each puzzle covers the complete crossword-ready vocabulary from its source lesson.</p>
        <div className="topic-crossword-list">
          {cognate4Lessons.map((lesson) => {
            const termCount = cognate4CrosswordTerms.filter((term) => term.module === lesson.id).length;
            return (
              <button
                type="button"
                key={lesson.id}
                aria-label={`Start ${lesson.title} crossword`}
                onClick={() => startLesson(lesson.id, lesson.title)}
              >
                <BookOpen aria-hidden="true" />
                <span><strong>{lesson.title}</strong><small>{termCount} terms · complete lesson</small></span>
                <ArrowRight aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
