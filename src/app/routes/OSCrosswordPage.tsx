import { ArrowLeft, ArrowRight, Puzzle } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { osCrosswordBanks } from '../../content/cit015/crossword';
import { Button } from '../../components/Button';
import { useLearning } from '../../features/learning/useLearning';
import { CrosswordGame } from '../../features/crossword/CrosswordGame';
import { createCompleteCrossword, validatePuzzle } from '../../features/crossword/builder';
import type { CrosswordPuzzle } from '../../features/crossword/types';
const freshSeed = () => Math.floor(Math.random() * 1000000);

export function OSCrosswordPage() {
  const { period } = useLearning();
  const [puzzle, setPuzzle] = useState<CrosswordPuzzle | null>(null);
  const [error, setError] = useState('');
  const [savedSeeds, setSavedSeeds] = useState<Record<string, number>>(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem('bappi-os-crossword-seeds') ?? '{}');
      return saved && typeof saved === 'object' ? Object.fromEntries(Object.entries(saved).filter(([id, seed]) => osCrosswordBanks.some((bank) => bank.id === id) && Number.isSafeInteger(seed))) : {};
    } catch { return {}; }
  });
  if (period.id !== '2026-finals') return <Navigate to="/" replace />;
  function start(bank: typeof osCrosswordBanks[number], savedSeed?: number) {
    const seed = savedSeed ?? freshSeed();
    setError('');
    try {
      const generated = createCompleteCrossword(bank.terms, seed, bank.title);
      if (validatePuzzle(generated).length) throw new Error('Please try another puzzle.');
      setPuzzle({ ...generated, id: `os-finals-${bank.id}-${seed}` });
      const next = { ...savedSeeds, [bank.id]: seed };
      setSavedSeeds(next);
      try { localStorage.setItem('bappi-os-crossword-seeds', JSON.stringify(next)); } catch { /* The current puzzle remains playable. */ }
    } catch { setError('This arrangement could not be built. Please try again.'); }
  }
  return <section className="os-crossword-page"><Link className="back-link" to="/subjects/cit015"><ArrowLeft size={16} />Operating Systems</Link>{puzzle ? <CrosswordGame key={puzzle.id} puzzle={puzzle} onExit={() => setPuzzle(null)} /> : <><header className="page-intro"><div><span className="eyebrow">A different way to recall</span><h1>Connect the <em>ideas.</em></h1><p>New finals terms, familiar crossings. Try a complete lesson crossword at your own pace.</p></div><Puzzle size={48} /></header><div className="crossword-bank-list">{osCrosswordBanks.map((bank) => <article key={bank.id}><span className="question-type">{bank.terms.length} interlocking answers</span><h2>{bank.title}</h2><p className="source-reference">Source: {bank.source}</p><Button onClick={() => start(bank)}>New puzzle<ArrowRight size={16} /></Button><Button variant="ghost" disabled={savedSeeds[bank.id] === undefined} onClick={() => start(bank, savedSeeds[bank.id])}>Resume saved puzzle</Button><small>Resume your last arrangement, or start fresh with a new puzzle.</small></article>)}</div>{error ? <p role="alert" className="form-error">{error}</p> : null}</> }</section>;
}
