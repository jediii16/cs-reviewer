# Bappi — A little study companion

Bappi is a browser-only study desk with a restored gray/white and blue interface, compact header, subject list, and responsive navigation, and optional focus tools. The current Finals syllabus contains CIT.015 Operating Systems: Concurrent Processing and File and Disk Management.

## Cognate 3 Jeopardy

Open **Cognate 3** on the home subject list or **Jeopardy** in navigation. The native game at `/subjects/cognate3/jeopardy` includes 60 source-based clues, two boards, solo or 2–4 teams, answer explanations with PDF page references, missed-clue review, timers, and a final wager. Scores and open-clue notes save separately per exam period under `bappi-cognate3-jeopardy-v1:<period-id>`. The game does not alter quiz accuracy or lesson progress.

## Study and practice

- Resume the exact lesson section or unfinished quiz from Home. Quiz order, choices, selected answers, checked feedback, and question position survive reloads.
- Build learning sessions or mock exams by lesson, question type, item count, and optional time limit. Learning gives immediate feedback. Exams allow answer changes and show feedback only after submission.
- Timed sessions keep an absolute deadline while you are away. An expired session submits its saved answers when it is resumed; unanswered items count as incorrect.
- Start a five-question, five-minute review from Home or Practice.
- Revisit mistakes across sessions. New misses return after one day; correct reviews move to three, seven, then fourteen days. You may practice early or remove an item from the queue.
- Bookmark questions and save personal notes. Search your saved questions or lesson terms; lesson results link directly to their source section.
- See reviewed sections, practiced concepts, and completed-session accuracy separately. Home suggests the weakest practiced concept and opens a focused session for it.
- Review highlighted incorrect phrases and corrected versions of all sixteen false statements in the supplied finals bank.
- Play source-based connected crosswords for each OS lesson, including saved-arrangement resume.

The bank contains **90 unique questions**: 24 multiple choice and 16 true or false for Concurrent Processing, and 30 multiple choice and 20 true or false for File and Disk Management. The ready-made mixed review draws 20 questions balanced across both lessons and both formats. Notes and answer feedback retain source slide references.

Definitions and source explanations use the supplied slide wording. Questions are direct and self-contained: they name the relevant method, file type, or scenario instead of copying an ambiguous slide fragment, and omit repeated instructional lead-ins. Study definitions, recall answers, and crossword clues share the same checked passages. Adapt a prompt only as needed for clarity, preserving the underlying technical definition. Saved built-in quizzes refresh their wording on reload while retaining checked answers, scores, notes, and question order.

## Periods and local data

Finals, Midterms, and Prelims have separate learning data. Only Finals has supplied lessons. The other periods begin empty. Settings can archive/restore periods and export/import Bappi JSON syllabi with their saved progress, sessions, bookmarks, question notes, and blurting notes. Import validates the structure, previews coverage, and creates a separate period. It never replaces existing periods.

Bappi JSON is the import format. Export the current period for a complete example. PDFs and slide decks require conversion into reviewed content before import. Original PDF/PPTX files are not bundled into exports.

- `bappi-learning-v1`: active period, period definitions, section positions/review, quiz sessions, question history, mistakes, bookmarks, notes, and results.
- `cit017-reviewer-progress`: retained for global appearance, focus, and audio preferences. Eligible finals progress migrates into the new learning store once; old scores do not become finals scores.
- Crossword grids and latest seeds have separate browser-local keys. Their saves and global preferences are not included in syllabus backups.

Music starts collapsed, has an explicit collapse button, and stays independent of the focus timer. Settings includes calm mascot mode. The app also observes the system reduced-motion preference.

## Development

```sh
npm install
npm run dev
```

Routes: `/`, `/subjects/cit015`, `/subjects/cit015/study`, `/subjects/cit015/test`, `/subjects/cit015/crossword`, `/review`, `/search`, `/settings`.

## Verification

```sh
npm test -- --run
npm run typecheck
npm run lint
npm run build
npm run test:e2e -- --workers=2
```

For Windows sandbox temp-path failures in Vitest:

```powershell
New-Item -ItemType Directory -Force tmp/vitest | Out-Null
$env:TEMP = (Resolve-Path tmp/vitest).Path
$env:TMP = $env:TEMP
npm test -- --run --maxWorkers=2 --pool=threads
```

The browser suite uses Playwright Chromium by default. Set `$env:PLAYWRIGHT_CHANNEL = 'msedge'` to use installed Microsoft Edge. The suite runs both desktop and mobile projects and covers resume, answer/scoring behavior, deadlines, review intervals, note persistence, periods, archive/restore, backup transfer, search, crosswords, tools, and narrow layouts.

See `docs/finals-content.md` for sources, `docs/crossword-reuse.md` for the retained engine, and `docs/bappi-remake-ideas.md` for the completed feature checklist.
