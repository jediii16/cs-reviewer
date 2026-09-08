import { Check, Eye, RotateCcw } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  activeEntry,
  checkCells,
  createGameState,
  enterLetter,
  entryCellKeys,
  eraseLetter,
  revealCells,
} from './gameState';
import type { CrosswordDirection, CrosswordPuzzle } from './types';

const key = (row: number, col: number) => `${row}:${col}`;
const confettiColors = ['#1689ff', '#35c98b', '#f8c14f', '#ff6b7a', '#a981ff'];
const confettiPieces = Array.from({ length: 42 }, (_, index) => ({
  left: `${(index * 37) % 100}%`,
  color: confettiColors[index % confettiColors.length],
  delay: `${(index % 9) * 0.08}s`,
  duration: `${2.1 + (index % 5) * 0.24}s`,
  rotation: `${(index * 47) % 180}deg`,
}));

export function CrosswordGame({ puzzle, onExit }: { puzzle: CrosswordPuzzle; onExit: () => void }) {
  const storageKey = `cs412-crossword:${puzzle.id}`;
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? { ...createGameState(puzzle), ...JSON.parse(saved) } : createGameState(puzzle);
    } catch {
      return createGameState(puzzle);
    }
  });
  const [message, setMessage] = useState('Choose a clue, then type the answer.');
  const [finished, setFinished] = useState(false);
  const [revealEntryId, setRevealEntryId] = useState<string | null>(null);
  const [focusRequest, setFocusRequest] = useState(0);
  const inputRefs = useRef(new Map<string, HTMLInputElement>());
  const cells = useMemo(() => new Map(puzzle.cells.map((cell) => [key(cell.row, cell.col), cell])), [puzzle]);
  const selected = activeEntry(puzzle, state);
  const activeKeys = selected ? entryCellKeys(puzzle, selected.id) : [];
  const revealEntry = puzzle.entries.find((entry) => entry.id === revealEntryId);

  useEffect(() => {
    if (state.selectedCellKey) inputRefs.current.get(state.selectedCellKey)?.focus();
  }, [state.selectedCellKey, state.direction, focusRequest]);

  const save = (next: typeof state) => {
    setState(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // The puzzle remains playable when storage is unavailable.
    }
  };

  const choose = (cellKey: string, preferred?: CrosswordDirection) => {
    const cell = cells.get(cellKey);
    if (!cell) return;
    const entries = puzzle.entries.filter((entry) => cell.entryIds.includes(entry.id));
    const nextDirection = preferred ?? (
      state.selectedCellKey === cellKey && entries.length > 1
        ? (state.direction === 'across' ? 'down' : 'across')
        : entries[0].direction
    );
    save({ ...state, selectedCellKey: cellKey, direction: nextDirection });
    setFocusRequest((request) => request + 1);
  };

  const moveByArrow = (cellKey: string, rowDelta: number, colDelta: number) => {
    const [row, col] = cellKey.split(':').map(Number);
    const nextKey = key(row + rowDelta, col + colDelta);
    if (!cells.has(nextKey)) return;
    save({
      ...state,
      selectedCellKey: nextKey,
      direction: colDelta ? 'across' : 'down',
    });
  };

  const submit = () => {
    const allCellKeys = puzzle.cells.map((cell) => key(cell.row, cell.col));
    const missing = puzzle.cells.filter((cell) => !state.values[key(cell.row, cell.col)]).length;
    const checked = checkCells(state, puzzle, allCellKeys);
    const wrong = checked.incorrectCellKeys.length;
    if (wrong || missing) {
      save(checked);
      const feedback = [
        wrong ? `${wrong} ${wrong === 1 ? 'letter needs' : 'letters need'} another look.` : '',
        missing ? `${missing} ${missing === 1 ? 'cell is' : 'cells are'} still empty.` : '',
      ].filter(Boolean).join(' ');
      setMessage(feedback);
      return;
    }
    setState(checked);
    setFinished(true);
    setMessage('Puzzle complete! Every answer is correct.');
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Completion is not blocked by storage.
    }
  };

  const clueColumn = (direction: CrosswordDirection) => (
    <section className={`crossword-clue-column crossword-clue-${direction}`} aria-label={`${direction} clues`}>
      <h2>{direction === 'across' ? 'Across' : 'Down'}</h2>
      {puzzle.entries.filter((entry) => entry.direction === direction).map((entry) => (
        <button
          type="button"
          aria-label={`${entry.number} ${direction} clue`}
          className={selected?.id === entry.id ? 'active' : ''}
          key={entry.id}
          onClick={() => choose(key(entry.row, entry.col), direction)}
        >
          <strong>{entry.number}</strong>
          <span>{entry.clue}</span>
          <small>{entry.answer.length} letters</small>
        </button>
      ))}
    </section>
  );

  return (
    <section className="crossword-game" aria-label={puzzle.title}>
      {finished ? (
        <div className="crossword-celebration" aria-live="assertive">
          <div className="crossword-confetti" data-testid="crossword-confetti" aria-hidden="true">
            {confettiPieces.map((piece, index) => (
              <i
                key={index}
                style={{
                  left: piece.left,
                  backgroundColor: piece.color,
                  animationDelay: piece.delay,
                  animationDuration: piece.duration,
                  rotate: piece.rotation,
                }}
              />
            ))}
          </div>
          <div className="crossword-banner-drop">
            <div className="crossword-success-banner">
              <span>PUZZLE COMPLETE</span>
              <h2>WOW GALING!</h2>
            </div>
          </div>
        </div>
      ) : null}
      {revealEntry ? (
        <div
          className="crossword-reveal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="crossword-reveal-title"
          onClick={(event) => { if (event.target === event.currentTarget) setRevealEntryId(null); }}
          onKeyDown={(event) => { if (event.key === 'Escape') setRevealEntryId(null); }}
        >
          <div className="crossword-reveal-modal">
            <span className="crossword-reveal-eyebrow">{revealEntry.number} {revealEntry.direction} · {revealEntry.answer.length} letters</span>
            <h2 id="crossword-reveal-title">Reveal this word?</h2>
            <p>The answer will be filled into the grid. Revealed letters stay marked as hints.</p>
            <div className="crossword-reveal-actions">
              <button type="button" onClick={() => setRevealEntryId(null)}>Cancel</button>
              <button
                className="crossword-reveal-confirm"
                type="button"
                autoFocus
                onClick={() => {
                  save(revealCells(state, puzzle, entryCellKeys(puzzle, revealEntry.id)));
                  setMessage(`Revealed clue ${revealEntry.number} ${revealEntry.direction}.`);
                  setRevealEntryId(null);
                }}
              >
                <Eye /> Reveal word
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <div className="crossword-game-bar">
        <button className="back-link back-link-button" type="button" onClick={onExit}>← Puzzles</button>
        <strong>{puzzle.title}</strong>
        <span>{puzzle.entries.length} words</span>
      </div>
      <p className="crossword-status" role="status">{message}</p>

      <div className="crossword-layout">
        {clueColumn('across')}
        <div className="crossword-grid-wrap">
          <div
            className="crossword-grid"
            role="grid"
            aria-label="Crossword grid"
            style={{
              gridTemplateColumns: `repeat(${puzzle.width}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${puzzle.height}, minmax(0, 1fr))`,
              aspectRatio: `${puzzle.width}/${puzzle.height}`,
            }}
          >
            {Array.from({ length: puzzle.width * puzzle.height }, (_, index) => {
              const row = Math.floor(index / puzzle.width);
              const col = index % puzzle.width;
              const cellKey = key(row, col);
              const cell = cells.get(cellKey);
              if (!cell) return <span className="crossword-block" key={cellKey} aria-hidden="true" />;
              const isWord = activeKeys.includes(cellKey);
              const incorrect = state.incorrectCellKeys.includes(cellKey);
              const revealed = state.revealedCellKeys.includes(cellKey);
              return (
                <label key={cellKey} className={`crossword-cell ${state.selectedCellKey === cellKey ? 'selected' : ''} ${isWord ? 'in-word' : ''} ${incorrect ? 'incorrect' : ''} ${revealed ? 'revealed' : ''} ${finished ? 'complete' : ''}`}>
                  {cell.number ? <span>{cell.number}</span> : null}
                  <input
                    ref={(node) => { if (node) inputRefs.current.set(cellKey, node); else inputRefs.current.delete(cellKey); }}
                    aria-label={`Crossword cell ${row + 1}, ${col + 1}`}
                    maxLength={1}
                    tabIndex={state.selectedCellKey === cellKey ? 0 : -1}
                    value={state.values[cellKey] ?? ''}
                    onFocus={() => { if (state.selectedCellKey !== cellKey) choose(cellKey); }}
                    onClick={() => choose(cellKey)}
                    onChange={(event) => save(enterLetter(state, puzzle, event.target.value.slice(-1)))}
                    onKeyDown={(event) => {
                      if (event.key === 'Backspace') {
                        event.preventDefault();
                        save(eraseLetter(state, puzzle));
                      } else if (event.key === 'ArrowLeft') {
                        event.preventDefault(); moveByArrow(cellKey, 0, -1);
                      } else if (event.key === 'ArrowRight') {
                        event.preventDefault(); moveByArrow(cellKey, 0, 1);
                      } else if (event.key === 'ArrowUp') {
                        event.preventDefault(); moveByArrow(cellKey, -1, 0);
                      } else if (event.key === 'ArrowDown') {
                        event.preventDefault(); moveByArrow(cellKey, 1, 0);
                      } else if ((event.key === 'Enter' || event.key === ' ') && cell.entryIds.length > 1) {
                        event.preventDefault(); choose(cellKey);
                      }
                    }}
                  />
                </label>
              );
            })}
          </div>

          <div className="crossword-tools">
            <button type="button" onClick={() => { if (selected) save(checkCells(state, puzzle, activeKeys)); setMessage('Checked the selected word.'); }}><Check /> Check word</button>
            <button type="button" onClick={() => { if (selected) setRevealEntryId(selected.id); }}><Eye /> Reveal word</button>
            <button type="button" onClick={() => { if (window.confirm('Clear this puzzle?')) save(createGameState(puzzle)); }}><RotateCcw /> Clear</button>
            <button className="crossword-submit" type="button" onClick={submit}>Submit puzzle</button>
          </div>
        </div>
        {clueColumn('down')}
      </div>

      {finished ? (
        <div className="crossword-complete">
          <h2>Answer review</h2>
          <p>{state.revealedCellKeys.length ? `${state.revealedCellKeys.length} letters were revealed as hints.` : 'Solved without hints — excellent recall.'}</p>
          <div>{puzzle.entries.map((entry) => <p key={entry.id}><strong>{entry.displayAnswer}</strong> — {entry.clue}</p>)}</div>
        </div>
      ) : null}
    </section>
  );
}
