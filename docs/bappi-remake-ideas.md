# Bappi remake: completed feature checklist

The recommendations from the finals content refresh are now implemented in the local app.

## Quiet study desk

Warm paper surfaces, leaf-green accents, serif display headings, a simpler desktop sidebar, and a mobile navigation bar replace the previous layout. Home gives one next action, a lesson list, and distinct reading/practice statistics. Notes, music, theme, and timer live in a compact Study tools tray. Music begins collapsed and can be collapsed explicitly. Calm mascot mode and system reduced-motion support stop automatic rolling.

## Durable sessions

Lesson section positions and quiz sessions are saved by exam period. Quiz snapshots preserve the exact question/option order, selections, checked answers, and current position. Home continues the last activity. Learning sessions reveal feedback after each checked answer. Mock exams permit answer changes and navigation, then grade only after final submission. Optional absolute deadlines survive reloads; expired sessions submit when reopened. Blanks count as incorrect. Completion and grading are idempotent.

## Practice that carries forward

Mistakes stay in a persistent queue. New misses return after 24 hours. A correct review schedules the next attempt after 3, then 7, then 14 days. Practice early and manual queue removal are available. Bookmarks retain personal question notes. Home aggregates attempted question history by concept, recommends the lowest practiced accuracy, and offers practice restricted to that concept. Reading coverage is separate from practiced concepts and completed-session accuracy.

All sixteen false source statements now have authored incorrect-phrase annotations and corrected statements. Corrections appear only once feedback is allowed.

## Find and organize

Lesson search includes headings, summaries, key points, examples, glossary terms, definitions, and glossary notes. Results jump to exact sections. A five-question, five-minute learning review is available from Home and Practice.

Finals, Midterms, and Prelims have separate progress. The latter two start empty. Settings supports archive/restore and Bappi JSON export/import with preview and validation. Imports create new periods and preserve existing ones. Backups include source-derived content and learning data, including blurting notes. Global preferences and crossword grids remain separately stored on this browser. PDF/PPTX parsing is not part of the JSON importer.

## New finals crosswords

The preserved crossword engine is connected to new banks drawn from the current OS sources: 15 Concurrent Processing terms and 16 File and Disk Management terms. It builds connected complete-topic grids and resumes the last generated arrangement. No old course lessons have returned.

## Local-first boundaries

Data is stored in the current browser; there is no account sync or remote scheduling. Due dates are shown in the app, without background notifications. Timers continue by absolute deadline, with expiry processed when the session is active again. One unfinished session per subject is retained in each period. Starting a new session clearly replaces that subject’s unfinished one. Settings provides portable JSON backups.
