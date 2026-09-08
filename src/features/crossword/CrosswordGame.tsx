import { Check, Eye, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { activeEntry, checkCells, createGameState, enterLetter, entryCellKeys, eraseLetter, revealCells } from './gameState';
import type { CrosswordDirection, CrosswordPuzzle } from './types';

const key = (row: number, col: number) => `${row}:${col}`;
export function CrosswordGame({ puzzle, onExit }: { puzzle: CrosswordPuzzle; onExit: () => void }) {
  const storageKey = `cs412-crossword:${puzzle.id}`;
  const [state, setState] = useState(() => {
    try { const saved = localStorage.getItem(storageKey); return saved ? { ...createGameState(puzzle), ...JSON.parse(saved) } : createGameState(puzzle); } catch { return createGameState(puzzle); }
  });
  const [message, setMessage] = useState('Select a clue or cell, then type your answer.'); const [finished, setFinished] = useState(false);
  const cells = useMemo(() => new Map(puzzle.cells.map((cell) => [key(cell.row, cell.col), cell])), [puzzle]);
  const selected = activeEntry(puzzle, state);
  const save = (next: typeof state) => { setState(next); try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* practice continues */ } };
  const choose = (cellKey: string, preferred?: CrosswordDirection) => {
    const cell = cells.get(cellKey); if (!cell) return; const entries = puzzle.entries.filter((entry) => cell.entryIds.includes(entry.id));
    const nextDirection = preferred ?? (state.selectedCellKey === cellKey && entries.length > 1 ? (state.direction === 'across' ? 'down' : 'across') : entries[0].direction);
    save({ ...state, selectedCellKey: cellKey, direction: nextDirection });
  };
  const activeKeys = selected ? entryCellKeys(puzzle, selected.id) : [];
  const submit = () => {
    const missing = puzzle.cells.filter((cell) => !state.values[key(cell.row, cell.col)]).length;
    if (missing) { setMessage(`${missing} cells still need an answer.`); return; }
    const wrong = puzzle.cells.filter((cell) => state.values[key(cell.row, cell.col)] !== cell.solution).length;
    if (wrong) { const next = checkCells(state, puzzle, puzzle.cells.map((cell) => key(cell.row, cell.col))); save(next); setMessage(`${wrong} letters need another look.`); return; }
    setFinished(true); setMessage('Puzzle complete! Every answer is correct.'); try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
  };
  return (
    <section className="crossword-game" aria-label={puzzle.title}>
      <div className="crossword-game-bar"><button className="back-link back-link-button" type="button" onClick={onExit}>← Puzzles</button><strong>{puzzle.title}</strong><span>{puzzle.entries.length} words</span></div>
      <p className="crossword-status" role="status">{message}</p>
      <div className="crossword-layout">
        <div className="crossword-grid-wrap">
          <div className="crossword-grid" role="grid" aria-label="Crossword grid" style={{ gridTemplateColumns: `repeat(${puzzle.width}, minmax(25px, 1fr))`, aspectRatio: `${puzzle.width}/${puzzle.height}` }}>
            {Array.from({ length: puzzle.width * puzzle.height }, (_, index) => { const row = Math.floor(index / puzzle.width); const col = index % puzzle.width; const cellKey = key(row, col); const cell = cells.get(cellKey);
              if (!cell) return <span className="crossword-block" key={cellKey} aria-hidden="true" />;
              const isWord = activeKeys.includes(cellKey); const incorrect = state.incorrectCellKeys.includes(cellKey); const revealed = state.revealedCellKeys.includes(cellKey);
              return <label key={cellKey} className={`crossword-cell ${state.selectedCellKey === cellKey ? 'selected' : ''} ${isWord ? 'in-word' : ''} ${incorrect ? 'incorrect' : ''} ${revealed ? 'revealed' : ''}`}>
                {cell.number ? <span>{cell.number}</span> : null}
                <input aria-label={`Crossword cell ${row + 1}, ${col + 1}`} maxLength={1} value={state.values[cellKey] ?? ''} onFocus={() => choose(cellKey)} onClick={() => choose(cellKey)} onChange={(event) => save(enterLetter(state, puzzle, event.target.value.slice(-1)))} onKeyDown={(event) => { if (event.key === 'Backspace') { event.preventDefault(); save(eraseLetter(state, puzzle)); } }} />
              </label>;
            })}
          </div>
          <div className="crossword-tools">
            <button type="button" onClick={() => { if (selected) save(checkCells(state, puzzle, activeKeys)); setMessage('Checked the selected word.'); }}><Check /> Check word</button>
            <button type="button" onClick={() => { if (selected && window.confirm('Reveal this word? Revealed letters will be marked as hints.')) save(revealCells(state, puzzle, activeKeys)); }}><Eye /> Reveal word</button>
            <button type="button" onClick={() => { if (window.confirm('Clear this puzzle?')) save(createGameState(puzzle)); }}><RotateCcw /> Clear</button>
            <button className="crossword-submit" type="button" onClick={submit}>Submit puzzle</button>
          </div>
        </div>
        <div className="crossword-clues">
          {(['across', 'down'] as const).map((direction) => <section key={direction}><h2>{direction === 'across' ? 'Across' : 'Down'}</h2>{puzzle.entries.filter((entry) => entry.direction === direction).map((entry) => <button type="button" aria-label={`${entry.number} ${direction} clue`} className={selected?.id === entry.id ? 'active' : ''} key={entry.id} onClick={() => choose(key(entry.row, entry.col), direction)}><strong>{entry.number}</strong><span>{entry.clue}</span><small>{entry.answer.length} letters</small></button>)}</section>)}
        </div>
      </div>
      {finished ? <div className="crossword-complete"><h2>Answer review</h2><p>{state.revealedCellKeys.length ? `${state.revealedCellKeys.length} letters were revealed as hints.` : 'Solved without hints — excellent recall.'}</p><div>{puzzle.entries.map((entry) => <p key={entry.id}><strong>{entry.displayAnswer}</strong> — {entry.clue}</p>)}</div></div> : null}
    </section>
  );
}
