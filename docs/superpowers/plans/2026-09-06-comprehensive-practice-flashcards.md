# Comprehensive Practice and Flashcards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace limited mixed-format quizzes with exhaustive source-faithful multiple-choice sets, add ungraded flashcards, and make active recall and lesson navigation stable and smooth.

**Architecture:** Keep content static and browser-only. Model explicit `TestSet` and `FlashcardDeck` collections separately, simplify graded scoring to `ChoiceQuestion`, add a dedicated flashcard route/runner, and update the existing lesson component with CSS-driven reveal and anchor scrolling. Reuse the current visual system, progress storage, and shell-level study tools.

**Tech Stack:** React 19.2.8, TypeScript 6.0.3, React Router 7.18.3, Vite 8.2.2, Lucide React 1.40.0, CSS, Vitest 5, Testing Library, Playwright 1.62.1

**Spec:** `docs/superpowers/specs/2026-09-06-comprehensive-practice-flashcards-design.md`

## Global constraints

- Use supplied source wording and concepts for all content except the existing supplemental McCumber Cube material.
- Include all questions in a selected test set; never truncate to ten except for the intentionally ten-question CIA scenario set.
- Graded tests contain only multiple-choice questions.
- Security Principles contains exactly nine study sections and nine definition questions; do not include the three scenario case studies anywhere.
- Flashcards are self-check only and never write a score.
- Preserve all existing Bappi, audio, timer, notes, theme, and progress changes.
- Because several implementation files already contain the user's uncommitted work, do not stage or commit an overlapping file wholesale.

## Planned files

### Content and models

- Modify `src/content/types.ts`
- Modify `src/content/cit017/questions.ts`
- Modify `src/content/cit017/questions.test.ts`
- Create `src/content/cit017/flashcards.ts`
- Create `src/content/cit017/flashcards.test.ts`
- Modify `src/content/cit017/principles.ts`
- Modify `src/content/cit017/content.test.ts`

### Graded practice

- Modify `src/features/test/quizEngine.ts`
- Modify `src/features/test/quizEngine.test.ts`
- Modify `src/features/test/QuizRunner.tsx`
- Modify `src/features/test/QuizRunner.test.tsx`
- Modify `src/app/routes/TestPage.tsx`

### Flashcards and navigation

- Create `src/features/flashcards/FlashcardDeck.tsx`
- Create `src/features/flashcards/FlashcardDeck.test.tsx`
- Create `src/app/routes/FlashcardsPage.tsx`
- Modify `src/app/routes/SubjectPage.tsx`
- Modify `src/app/App.tsx`
- Modify `src/app/App.test.tsx`

### Study interaction and presentation

- Modify `src/features/study/StudyLesson.tsx`
- Modify `src/features/study/StudyLesson.test.tsx`
- Modify `src/styles/global.css`
- Modify `tests/e2e/reviewer.spec.ts`

---

### Task 1: Lock the source inventory and remove principle scenarios

**Files:**
- Modify: `src/content/cit017/questions.test.ts`
- Create: `src/content/cit017/flashcards.test.ts`
- Modify: `src/content/cit017/content.test.ts`
- Modify: `src/content/cit017/principles.ts`

- [ ] **Step 1: Write failing source-coverage tests**

Assert that test-set metadata exposes these exact IDs and counts:

```ts
expect(Object.fromEntries(cit017TestSets.map((set) => [set.id, set.questions.length]))).toEqual({
  'foundations-cia-scenarios': 10,
  'foundations-concepts': 24,
  'principles-definitions': 9,
  'threat-scenarios': 12,
  'social-definitions': 17,
  'social-examples': 17,
  'social-tactics': 9,
});
```

Also assert:

- every graded question has `kind: 'multiple-choice'`;
- every graded question ID is unique and its correct option exists;
- each of the 12 exact threat labels appears once as a correct concept in the threat set;
- each of the 17 social techniques appears once in both social technique sets;
- each of the 9 psychological tactics appears once in the tactic set;
- each of the 9 Security Principles appears once in the principle set;
- the CIA scenario set contains exactly the three CIA answers and ten scenarios;
- Foundations Concepts contains CIA, AAA, the three authentication-factor groups, and all three McCumber dimensions.

Update content tests to require `principlesTopic.sections` to equal the nine principle IDs and to reject `payroll-audit`, `procurement-control`, and `exam-records`.

Add flashcard tests requiring deck counts of Foundations 17, Security Principles 9, Threat Categories 12, and Social Engineering 26, with unique IDs and complete concept coverage.

- [ ] **Step 2: Run the focused content tests and confirm RED**

Run:

```bash
npm test -- --run src/content/cit017/questions.test.ts src/content/cit017/flashcards.test.ts src/content/cit017/content.test.ts
```

Expected: FAIL because explicit sets and flashcards do not exist and principle scenarios remain in the study topic.

- [ ] **Step 3: Remove only the principle case-study sections**

Delete `principleScenarios` and its mapped sections from `principlesTopic`. Keep all nine supplied principle definitions, benefits, and per-principle examples unchanged.

- [ ] **Step 4: Re-run the content-topic test**

Run:

```bash
npm test -- --run src/content/cit017/content.test.ts
```

Expected: the nine-principle inventory assertions PASS while new question and flashcard tests remain RED.

### Task 2: Build the exhaustive multiple-choice test sets

**Files:**
- Modify: `src/content/types.ts`
- Modify: `src/content/cit017/questions.ts`
- Modify: `src/content/cit017/questions.test.ts`

- [ ] **Step 1: Add explicit test-set types**

Keep `QuizTopic`, `QuestionOption`, and `ChoiceQuestion`; add `TestSet`. Remove identification and true/false types from the graded `QuizQuestion` contract or make `QuizQuestion` an alias of `ChoiceQuestion` so impossible formats cannot enter the runner.

- [ ] **Step 2: Replace the old mixed bank with seven named sets**

Use helpers that derive stable option IDs and validate the correct concept. Build:

- 10 CIA scenarios based on the supplied CIA examples and controls;
- 24 Foundations Concepts questions covering the complete CIA, AAA, authentication-factor, Accounting/Auditing, and McCumber inventory;
- 9 Security Principle definition questions only;
- 12 threat-category scenarios using exact category labels;
- 17 social-technique descriptions;
- 17 supplied social-technique examples;
- 9 supplied psychological-tactic examples.

Every question uses four options except CIA scenarios, which use the three CIA properties. Distractors come from the same conceptual family. Export `cit017TestSets` and a flattened `cit017Questions` for compatibility.

- [ ] **Step 3: Run question-bank tests and confirm GREEN**

Run:

```bash
npm test -- --run src/content/cit017/questions.test.ts
```

Expected: all set-count, uniqueness, answer-validity, and coverage tests PASS.

### Task 3: Simplify the graded quiz engine and runner

**Files:**
- Modify: `src/features/test/quizEngine.test.ts`
- Modify: `src/features/test/QuizRunner.test.tsx`
- Modify: `src/features/test/quizEngine.ts`
- Modify: `src/features/test/QuizRunner.tsx`

- [ ] **Step 1: Replace mixed-format tests with all-question multiple-choice tests**

The engine contract becomes:

```ts
export function createQuiz(
  questions: readonly ChoiceQuestion[],
  random?: () => number,
): ChoiceQuestion[];
```

Tests verify that `createQuiz` includes every supplied question exactly once, shuffles questions and options without changing correct-answer identity, scores radio answers, and returns only missed questions.

Runner tests verify that no text field or true/false format label exists, immediate feedback still works, `setTitle` is shown, all questions can be advanced, retry missed works, and completion records the full total.

- [ ] **Step 2: Run the engine and runner tests and confirm RED**

Run:

```bash
npm test -- --run src/features/test/quizEngine.test.ts src/features/test/QuizRunner.test.tsx
```

Expected: FAIL because the engine still filters/caps mixed formats and the runner still supports identification and true/false.

- [ ] **Step 3: Implement the smaller multiple-choice-only engine**

Shuffle a full copy of the chosen set and independently shuffle each option list. Retain `scoreQuiz`, `isQuestionCorrect`, `getCorrectAnswerLabel`, and `getMissedQuestions` with `ChoiceQuestion` types and the existing by-topic score shape.

- [ ] **Step 4: Simplify `QuizRunner`**

Always render the labelled radio fieldset. Remove text-entry and true/false branches and format labels. Add optional `setTitle`; display it in quiz metadata. Keep Bappi state, immediate feedback, result score, missed concepts, retry, and exit behavior.

On question advance and retry, smoothly return focus/scroll to the runner anchor so long feedback does not strand the student below the next question.

- [ ] **Step 5: Run the focused tests and confirm GREEN**

Run:

```bash
npm test -- --run src/features/test/quizEngine.test.ts src/features/test/QuizRunner.test.tsx
```

Expected: all engine and runner tests PASS.

### Task 4: Present grouped test sets without a question cap

**Files:**
- Modify: `src/app/routes/TestPage.tsx`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add a route-level test for named sets and counts**

Render the test route and require headings for Foundations, Security Principles, Categories of Threats, and Social Engineering; require the seven set titles and their question counts. Start `CIA Scenario Practice` and assert `Question 1 of 10`. Start a second set and assert its full count rather than ten.

- [ ] **Step 2: Run the route test and confirm RED**

Run the owning App or TestPage test file and confirm the generic five-mode list fails the new expectations.

- [ ] **Step 3: Implement grouped set selection**

Group `cit017TestSets` in source order. Each compact row includes a restrained icon, title, description, exact count, and arrow. `start(set)` calls `createQuiz(set.questions)` and passes `set.title` to `QuizRunner`. Remove generic Mixed Review and all copy mentioning identification or true/false.

- [ ] **Step 4: Add calm grouped-list styles and run the test**

Use thin dividers, compact topic labels, and the existing neutral hover surface. Keep the list single-column and make every row at least 44px high on narrow screens.

Expected: grouped set route tests PASS.

### Task 5: Add complete self-check flashcard data

**Files:**
- Modify: `src/content/types.ts`
- Create: `src/content/cit017/flashcards.ts`
- Create: `src/content/cit017/flashcards.test.ts`

- [ ] **Step 1: Add flashcard types**

Add `Flashcard` and `FlashcardDeck` exactly as defined in the design spec.

- [ ] **Step 2: Build four source-faithful decks**

Create:

- 17 Foundations cards covering CIA, AAA, all factor groups, Accounting/Auditing, and McCumber;
- 9 Security Principle definition cards;
- 12 Threat Category cards using supplied attack examples as prompts;
- 26 Social Engineering cards using all 17 descriptions and all 9 tactic examples.

Use `prompt` for the identification cue, `answer` for the exact term, and optional `detail` for a short supporting explanation or supplied example. Export `cit017FlashcardDecks`.

- [ ] **Step 3: Run flashcard data tests and confirm GREEN**

Run:

```bash
npm test -- --run src/content/cit017/flashcards.test.ts
```

Expected: all deck count, ID, and concept-coverage assertions PASS.

### Task 6: Build the flashcard route and runner

**Files:**
- Create: `src/features/flashcards/FlashcardDeck.test.tsx`
- Create: `src/features/flashcards/FlashcardDeck.tsx`
- Create: `src/app/routes/FlashcardsPage.tsx`
- Modify: `src/app/routes/SubjectPage.tsx`
- Modify: `src/app/App.tsx`
- Modify: `src/app/App.test.tsx`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Write failing flashcard interaction tests**

Test these behaviors:

```ts
expect(screen.getByText('Card 1 of 2')).toBeVisible();
expect(screen.getByText(first.prompt)).toBeVisible();
expect(screen.queryByText(first.answer)).not.toBeVisible();
await user.click(screen.getByRole('button', { name: /reveal answer/i }));
expect(screen.getByText(first.answer)).toBeVisible();
await user.keyboard('{ArrowRight}');
expect(screen.getByText(second.prompt)).toBeVisible();
expect(screen.queryByText(first.answer)).not.toBeVisible();
```

Also verify Enter/Space flips, Previous/Next wrap or disable consistently, Shuffle preserves the complete card set and resets to front, and Return to decks calls the supplied handler.

Update app navigation tests to require the third `Flashcards` link and route.

- [ ] **Step 2: Run flashcard and navigation tests and confirm RED**

Run:

```bash
npm test -- --run src/features/flashcards/FlashcardDeck.test.tsx src/app/App.test.tsx
```

Expected: FAIL because the route and runner do not exist.

- [ ] **Step 3: Implement the ungraded runner**

Render one semantic flip button with a fixed-height inner front/back surface. Support click/tap, Enter, and Space through native button behavior. Add optional ArrowLeft/ArrowRight document-key navigation while the deck is mounted, ignoring keystrokes originating in editable controls. Reset to the front on navigation and shuffle.

Controls: Previous, Next, Shuffle, and Return to decks. Show `Card x of y` and the deck title. Do not render scoring language.

- [ ] **Step 4: Implement the page and route**

`FlashcardsPage` first renders four compact deck rows with descriptions and counts. Selecting a deck mounts `FlashcardDeck`; Return restores the deck list. Add `/subjects/cit017/flashcards` to `App` and add Flashcards between Study and Test on the subject page. Update subject copy to describe lessons, self-check cards, and focused multiple-choice practice.

- [ ] **Step 5: Add stable, accessible flashcard styles**

Use a generous fixed/minimum height, perspective only for the functional flip, restrained surfaces, large readable type, and a clear front/back label. Do not change card dimensions between faces. Disable 3D transition under reduced motion. On mobile, stack footer controls without overflow.

- [ ] **Step 6: Run flashcard and navigation tests and confirm GREEN**

Run:

```bash
npm test -- --run src/features/flashcards/FlashcardDeck.test.tsx src/app/App.test.tsx
```

Expected: all flashcard and routing tests PASS.

### Task 7: Make study reveal and lesson scrolling stable

**Files:**
- Modify: `src/features/study/StudyLesson.test.tsx`
- Modify: `src/features/study/StudyLesson.tsx`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Write failing interaction-contract tests**

Require that the recall answer is always in the DOM, the panel is focusable, and there is no Reveal Answer or Hide Answer button. Use a two-section topic and mock `scrollIntoView`; clicking Next and Previous must call:

```ts
expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
```

The active section title and `x of y` progress must update.

- [ ] **Step 2: Run the lesson test and confirm RED**

Run:

```bash
npm test -- --run src/features/study/StudyLesson.test.tsx
```

Expected: FAIL because answer DOM is conditional and navigation scrolls the window to zero.

- [ ] **Step 3: Implement CSS-driven reveal and anchor scrolling**

Remove `revealed` state and related buttons/icons. Add a focusable `.recall-panel` with a short `Hover or tap to reveal` hint and render prompt and answer layers together. Add a `lessonAnchorRef` around the kicker/progress block. On Previous/Next, update the section, focus state remains sensible, and call the anchor's `scrollIntoView({ behavior: 'smooth', block: 'start' })`.

- [ ] **Step 4: Add non-shifting recall styles**

Give the reveal region a stable block size. Position prompt and answer as overlapping layers; transition opacity and a small translate only. Reveal `.recall-answer` on `:hover`, `:focus`, and `:focus-within`. Use `scroll-margin-top` to clear the app header. Under reduced motion, remove the transform transition.

- [ ] **Step 5: Run lesson tests and confirm GREEN**

Run:

```bash
npm test -- --run src/features/study/StudyLesson.test.tsx
```

Expected: all lesson interaction tests PASS.

### Task 8: Verify the full review flow

**Files:**
- Modify: `tests/e2e/reviewer.spec.ts`
- Modify only scoped owning files if verification reveals a defect

- [ ] **Step 1: Add browser-level acceptance coverage**

Add tests for:

- active-recall panel height remains unchanged before/after hover and its answer opacity changes;
- Next changes lesson content and leaves the anchor close below the fixed header rather than setting scroll position to zero;
- Security Principles reports `1 of 9` through `9 of 9` and no case-study titles appear;
- CIA set starts at `Question 1 of 10`;
- a 17-question social set reports `Question 1 of 17`;
- Flashcards route selects a deck, flips a card, advances, and returns to deck choices;
- dark mode and 390px/300px widths have no horizontal overflow.

- [ ] **Step 2: Run focused browser tests and correct demonstrated issues**

Run:

```bash
npm run test:e2e -- --grep "active recall|lesson anchor|complete test sets|flashcards"
```

Expected: all new desktop and mobile checks PASS after scoped fixes.

- [ ] **Step 3: Run complete verification**

Run each command separately:

```bash
npm test -- --run
npm run typecheck
npm run lint
npm run build
npm run test:e2e
git diff --check
```

Expected: all unit tests, typecheck, lint, build, desktop/mobile Playwright tests, and whitespace checks PASS.

- [ ] **Step 4: Perform final visual checks**

Inspect the study, test-selection, running-test, flashcard-selection, and running-flashcard states at desktop and mobile widths in light and dark mode. Verify fixed heights, focus rings, long answer wrapping, Bappi placement, and that global timer/audio/notes tools remain usable.

- [ ] **Step 5: Remove temporary PDF renders**

Delete only `tmp/pdfs` after resolving and verifying that its absolute path is inside this workspace. Report that generated source-review images were removed; source PDFs remain untouched.
