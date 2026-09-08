import { ArrowLeft, ArrowRight, BookOpen, Puzzle } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { cs412Terms } from '../../content/cs412';
import { createMockCrossword, createTopicCrossword } from '../../features/crossword/builder';
import { CrosswordGame } from '../../features/crossword/CrosswordGame';
import type { CrosswordPuzzle } from '../../features/crossword/types';

export function CrosswordPage() {
  const [puzzle, setPuzzle] = useState<CrosswordPuzzle | null>(null);
  const run = useRef(0);
  const nextSeed = () => (Date.now() + ++run.current * 412) % 2_147_483_647;
  const startMock = () => setPuzzle(createMockCrossword(cs412Terms, nextSeed()));
  const topicOptions = [
    { module: 'introduction', title: 'Introduction to Data Mining' },
    { module: 'crisp-dm', title: 'CRISP-DM' },
    { module: 'warehousing', title: 'Data Warehousing' },
  ] as const;
  if (puzzle) return <CrosswordGame puzzle={puzzle} onExit={() => setPuzzle(null)} />;
  return <section className="cs412-page crossword-landing"><Link className="back-link" to="/subjects/cs412"><ArrowLeft /> CS.412</Link><header className="cs412-hero"><div><h1>Crossword practice</h1><p>Read the clue. Recall the term. Use the crossings when you get stuck.</p></div><Puzzle /></header>
    <button className="mock-exam-card" type="button" aria-label="Start 15-item mock exam" onClick={startMock}><div><strong>15-item mock exam</strong><p>One new grid with terms from all three lessons.</p></div><span className="mock-exam-action">Start <ArrowRight /></span></button>
    <div className="crossword-library"><h2>Practice by topic</h2><p>Choose one lesson to place every term from that topic into a single interlocking puzzle.</p><div className="topic-crossword-list">{topicOptions.map(({ module, title }) => {
        const terms = cs412Terms.filter((term) => term.module === module);
        return <button type="button" key={module} aria-label={`Start ${title} crossword`} onClick={() => setPuzzle(createTopicCrossword(terms, nextSeed()))}><BookOpen /><span><strong>{title}</strong><small>{terms.length} terms · complete topic</small></span><ArrowRight /></button>;
      })}</div>
    </div>
  </section>;
}
