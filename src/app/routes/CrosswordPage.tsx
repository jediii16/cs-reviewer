import { ArrowLeft, BookOpen, Puzzle, Shuffle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cs412Terms } from '../../content/cs412';
import { createMockCrossword } from '../../features/crossword/builder';
import { createCoveragePuzzles } from '../../features/crossword/coverage';
import { CrosswordGame } from '../../features/crossword/CrosswordGame';
import type { CrosswordPuzzle } from '../../features/crossword/types';

export function CrosswordPage() {
  const [puzzle, setPuzzle] = useState<CrosswordPuzzle | null>(null);
  const [coverage, setCoverage] = useState<CrosswordPuzzle[] | null>(null);
  const startMock = () => setPuzzle(createMockCrossword(cs412Terms, Date.now() % 1_000_000));
  if (puzzle) return <CrosswordGame puzzle={puzzle} onExit={() => setPuzzle(null)} />;
  return <section className="cs412-page crossword-landing"><Link className="back-link" to="/subjects/cs412"><ArrowLeft /> CS.412</Link><header className="cs412-hero"><div><h1>Crossword practice</h1><p>Definitions become clues. Retrieve the exact word, use crossings, and train for the real exam.</p></div><Puzzle /></header>
    <button className="mock-exam-card" type="button" aria-label="Start 15-item mock exam" onClick={startMock}><span><Shuffle /></span><div><strong>15-Item Mock Exam</strong><p>A fresh interlocking puzzle balanced across all three lessons.</p></div><b>Start →</b></button>
    <div className="crossword-library"><h2>Complete coverage</h2><p>Review all {cs412Terms.length} likely terms across the source lessons.</p><div className="theory-modules">{[['Introduction to Data Mining', 12], ['CRISP-DM', 14], ['Data Warehousing', 30]].map(([title, count]) => <article key={title}><BookOpen /><div><strong>{title}</strong><span>{count} terms in the practice bank</span></div></article>)}</div>
      {!coverage ? <button className="build-coverage" type="button" onClick={() => setCoverage(createCoveragePuzzles(cs412Terms))}>Build complete puzzle collection</button> : <div className="coverage-list">{coverage.map((item, index) => <button type="button" key={item.id} onClick={() => setPuzzle(item)}><span>Puzzle {index + 1}</span><strong>{item.entries.length} interlocking terms</strong><small>{new Set(item.entries.map((entry) => entry.module)).size} lessons represented</small></button>)}</div>}
    </div>
  </section>;
}
