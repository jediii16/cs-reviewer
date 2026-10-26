# Crossword implementation and reuse

Keep the implementation under `src/features/crossword/` when changing syllabi. Old course terms are deliberately absent. Neutral fixtures live in `src/test/crosswordFixtures.ts` and never enter the app bundle.

## Term contract

Each `TheoryTerm` has a stable `id`, a `module` string, an `answer`, a human-readable `displayAnswer`, and a definition-style `clue`. Use unique IDs and answers that remain distinct after normalization. The builder normalizes answers to uppercase A–Z, removing spaces, punctuation, and digits.

## Grid generation

- `buildCrossword(terms, { seed, count, title })` returns a connected grid or `null` if it cannot place the requested number of unique terms.
- Terms are shuffled deterministically and interleaved across modules. The first term is horizontal. Later words cross existing matching letters in the perpendicular direction.
- Placement rejects conflicting letters, overlapping words in the same direction, occupied end cells, and unwanted side adjacency. The scoring favors more crossings and a smaller bounding area.
- Finalization shifts coordinates to nonnegative values and numbers starting cells in reading order.
- `validatePuzzle(puzzle)` checks cell letters, entry membership, and connectedness. Always validate a newly authored bank before exposing it.

## Existing modes

- `createMockCrossword(terms, seed)`: 15 answers, exactly 5 from each of 3 modules. Each module needs at least 5 candidates. Up to 240 attempts. Modules now come from the supplied bank rather than hardcoded course names.
- `createTopicCrossword(terms, seed, title?)`: every supplied term from one module, up to 600 attempts.
- `createCompleteCrossword(terms, seed, title)`: every supplied term, up to 1,800 attempts.
- `createCoveragePuzzles(terms)`: builds a collection of 15-answer mock puzzles covering every term. Uses the same three-module prerequisites and fails if complete coverage is not reached.

Not every term bank can form a connected grid. Handle generation errors in the future route and offer another seed or a smaller bank.

## Reconnecting the UI

1. Create a new, source-checked term bank for the new subject.
2. Generate the desired puzzle and run `validatePuzzle`.
3. Give each puzzle a bank-specific stable ID, such as `os-finals-locks-${seed}`. Wrapper IDs contain the seed and sometimes module; override them when multiple banks share those values to prevent saved-state collisions.
4. Mount `<CrosswordGame key={puzzle.id} puzzle={puzzle} onExit={...} />`. The React key resets state when changing puzzles.
5. Register a subject route and expose the crossword mode only once that bank is ready.

`CrosswordGame` stores cell state under `bappi-crossword:${puzzle.id}`. It retains clue selection, continuous typing and crossing navigation, backspace behavior, answer checking, reveal confirmation, clear confirmation, and completion celebrations. Revealed answers are tracked separately from correctly typed answers.

## Verification

Retained tests cover deterministic generation, 15-answer balance, full-topic puzzles, connectedness, all-term coverage, shared cell updates, keyboard input, saved games, reveal/clear interactions, and completion. Run `npm test -- --run src/features/crossword` (with the Windows temp workaround in README if needed).

Historical design reasoning is also in `docs/superpowers/specs/2026-09-08-cs412-crossword-preprocessing-design.md` and its companion plan. Those documents describe the prior course; the executable engine and this guide are the reference for new subjects.

## Current finals integration

The OS finals route `/subjects/cit015/crossword` now uses two new source-based term banks in `src/content/cit015/crossword.ts`. Both use complete connected puzzles, rather than the three-module mock mode. The route remembers the latest seed per bank under `bappi-os-crossword-seeds`; grid state remains under the bank-specific `bappi-crossword:` key. A new puzzle replaces the bank’s latest resume seed but does not delete earlier grid saves. Syllabus exports do not include these separate grid saves.
