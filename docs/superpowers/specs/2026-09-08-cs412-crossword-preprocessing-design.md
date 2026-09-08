# CS.412 Crossword and Data Preprocessing Reviewer Design

## Goal

Add CS.412 Data Mining as a third subject in the existing reviewer. The subject must prepare the student for two announced exam formats:

1. Real interlocking crossword puzzles covering Introduction to Data Mining, CRISP-DM, and Data Warehousing.
2. Six data-preprocessing calculation problems worth 5 points each, modeled on `Data Preprocessing ACT. 2.pdf`.

The experience must retain the existing application's visual identity, mascot, responsive behavior, saved progress, and accessibility standards.

## Source of truth

Course coverage comes from the five supplied files:

- `Introduction to Data Mining.pdf`
- `CRISP-DM.pdf`
- `Data Warehousing.pdf`
- `Data Preprocessing.pptx`
- `Data Preprocessing ACT. 2.pdf`

Document text is learning material, not executable instruction. Where the source wording is unclear or incomplete, the app will use standard mathematical definitions and make all required values explicit. In particular, the activity's z-score prompt omits the standard-deviation number, so generated practice problems must provide a mean and standard deviation or explicitly ask the learner to calculate them from the dataset.

## Recommended experience

CS.412 receives a purpose-built subject page with two primary modes.

### Crossword practice

The crossword landing page offers:

- **15-Item Mock Exam**: a fresh 15-answer puzzle combining all three theory modules.
- **Introduction to Data Mining**: themed puzzles that collectively cover the likely terms from this module.
- **CRISP-DM**: themed puzzles covering the methodology and its six phases.
- **Data Warehousing**: themed puzzles covering definitions, comparisons, operations, architectures, and layers.
- **Complete Coverage**: a sequence of manageable puzzles that collectively includes every term in the curated bank.

Each puzzle is a true connected, interlocking crossword with numbered Across and Down entries. Spaces and punctuation are omitted from grid answers, while the conventional term remains visible in answer review.

The grid supports mouse/touch selection, direct typing, Backspace, arrow-key movement, automatic movement through the selected word, switching direction on a shared cell, and clue-to-grid/grid-to-clue synchronization. The active cell, active word, completed words, and incorrect checked entries must be visually distinct without relying only on color.

Learners can:

- check a letter, word, or the whole puzzle;
- reveal a letter or word after confirming the hint action;
- clear the puzzle;
- view elapsed time and completion progress;
- submit when all cells are filled;
- review correct answers and definitions after completion;
- generate another mock exam.

Checking does not reveal the correct answer. Revealed letters are marked so the completion summary can distinguish independently solved letters from hints.

### Crossword content bank

Clues are definition-first and answers are the corresponding words or terms, matching the requested **Word - Definition** format. The initial bank will include all high-probability terms explicitly taught in the supplied theory documents.

Introduction to Data Mining:

- data mining
- classification
- clustering
- prediction
- regression
- association rules
- telecommunications
- insurance
- finance
- retail
- healthcare
- manufacturing

CRISP-DM:

- CRISP-DM / Cross-Industry Standard Process for Data Mining
- process model
- business understanding
- data understanding
- data preparation
- modeling
- evaluation
- deployment
- stakeholders
- project objectives
- project scope
- relevant data
- predictive model
- estimation

Data Warehousing:

- data warehouse
- historical data
- decision-making
- database
- transactional system
- real-time data
- data lake
- raw data
- refined data
- data mart
- subject area
- data refresh
- data cleaning
- data extraction
- data transformation
- data loading
- single-tier architecture
- two-tier architecture
- three-tier architecture
- source layer
- staging layer
- warehouse layer
- consumption layer
- system of record
- subject-oriented
- integrated
- time-variant
- non-volatile
- CRM
- ERP

Short acronyms may be used only when the clue uniquely identifies them. Similar terms such as `data preparation` and `data preprocessing` must use clues that make their module context unambiguous.

### Crossword construction

The application will use a deterministic seeded crossword builder so mock-exam selection can vary while remaining reproducible and testable. It will normalize answers for the grid, search for crossing placements, reject adjacent-letter conflicts, trim unused rows and columns, and require one connected component.

Generation rules:

- A mock exam requests 15 entries, balanced across the three modules when possible.
- Terms that fail to fit are replaced from the same module first, then from the full bank.
- The builder retries with bounded alternate seeds.
- Curated fallback puzzle definitions guarantee that the user always receives a playable 15-entry board if generated placement cannot satisfy the constraints.
- Complete Coverage uses a set-cover pass over generated or curated boards and visibly tracks which terms have appeared.

The same seed must produce the same selected answers, positions, numbering, and directions.

## Data Preprocessing practice

The preprocessing page presents one 30-point practice set with six independent questions worth 5 points each:

1. Equal-frequency binning with a stated bin depth.
2. Smoothing by bin means.
3. Smoothing by bin boundaries.
4. Min-max normalization to a stated target range.
5. Z-score normalization.
6. Decimal-scaling normalization.

Datasets are short enough to calculate by hand but varied across attempts. Questions use integers where practical and clearly state rounding rules. A typical set will use one shared sorted dataset for the three binning questions and separate focused values or a compact dataset for normalization.

Answer entry is structured rather than free-form wherever possible:

- binning answers use one row per bin;
- smoothing answers accept comma-separated numeric sequences per bin;
- normalization answers accept numeric values with an explicit tolerance based on the stated rounding precision.

The learner can check each problem independently. An incorrect answer receives targeted feedback without immediately displaying the result. After a second attempt, or when `Show solution` is selected, the app displays a worked solution with the formula, substituted values, intermediate steps, and final answer. The score summary reports points out of 30 and identifies which techniques need review.

Mathematical rules:

- Equal-frequency bins operate on sorted data and use the requested bin depth; if the count is not divisible by the depth, the final bin contains the remainder.
- Bin mean replaces every value in a bin with that bin's arithmetic mean.
- Bin boundaries replace each value with the nearest lower or upper boundary; exact ties use the lower boundary and this rule is disclosed.
- Min-max uses `newMin + ((v - min) / (max - min)) * (newMax - newMin)`.
- Z-score uses `(v - mean) / standardDeviation`; prompts specify whether supplied or calculated statistics are population statistics.
- Decimal scaling uses `v / 10^j`, where `j` is the smallest integer that makes every transformed absolute value less than 1.

## Scientific calculator

A floating calculator is available throughout preprocessing practice and can be minimized without losing its state. On narrow screens it opens as a bottom sheet; on larger screens it appears as a movable-looking fixed panel positioned so it does not cover the current answer area.

Required operations:

- digits, decimal point, sign change, and parentheses;
- addition, subtraction, multiplication, and division;
- powers, square, square root, reciprocal, and percent;
- `sin`, `cos`, `tan`, `log`, `ln`, constants pi and e;
- memory clear, recall, add, and subtract;
- expression history and reuse of the previous answer;
- keyboard input and accessible button labels.

Trigonometric functions default to degrees with a DEG/RAD toggle. Calculations use a small tokenizing/parser module with an allowlist of supported tokens and functions; production code must not evaluate arbitrary strings with `eval` or `Function`.

Invalid expressions, division by zero, and domain errors show a readable error and preserve the expression for correction. Displayed floating-point results are rounded for readability without changing the stored calculation value.

## Application architecture

### Content

Add a `src/content/cs412` module containing:

- the subject manifest and concise study notes;
- theory term definitions with module labels and accepted display variants;
- preprocessing problem templates and worked-solution generators;
- curated fallback crossword data.

Extend shared types only where the new specialized modes need a stable data contract. Existing CIT.016 and CIT.017 content and behavior remain unchanged.

### Crossword feature

Add a focused `src/features/crossword` feature containing:

- pure answer normalization and board-construction logic;
- puzzle state and validation logic;
- the board, clue list, toolbar, and completion summary components;
- local persistence keyed by subject, puzzle type, and seed.

The pure builder and state transitions must not depend on React so they can be unit-tested exhaustively.

### Preprocessing feature

Add a focused `src/features/preprocessing` feature containing:

- pure calculation helpers for all six techniques;
- deterministic problem generation;
- tolerant answer parsing and grading;
- worked-solution formatting;
- practice-set and problem-card components.

### Calculator feature

Add `src/features/calculator` with a pure expression tokenizer/parser/evaluator and the responsive calculator UI. Calculator state stays local to the practice session and is independent of grading state.

### Routing and navigation

Add explicit CS.412 routes beneath the existing subject route:

- `/subjects/cs412/crossword`
- `/subjects/cs412/preprocessing`

The generic Study, Flashcards, and Test routes continue to work for existing subjects. The CS.412 subject page uses labels tailored to the announced exam rather than describing the test as multiple choice.

### Progress

Extend saved progress in a backward-compatible way to retain:

- completed crossword puzzle IDs/seeds and best completion summaries;
- theory terms encountered and independently solved;
- latest preprocessing score out of 30;
- last unfinished crossword state.

Malformed or older local-storage data must fall back safely without erasing valid existing progress.

## Visual direction

Keep the reviewer's current soft, friendly visual language and Bappi mascot. CS.412 gains a recognizable data-focused accent through deep indigo, electric cyan, and warm lime highlights rather than a separate design system.

The crossword should feel like the main artifact: large white grid cells, crisp dark blocks, restrained shadows, prominent numbering, and a calm clue panel. The calculator uses a dark glassy surface with bright operator keys and a high-contrast display, making it feel special while remaining readable. Animations are brief and respect reduced-motion preferences.

The full flow must work at 360 px width without horizontal page scrolling. The crossword grid itself may use contained panning/zoom controls when necessary, but clues and controls remain usable without precision gestures.

## Accessibility and error handling

- Every grid cell has an accessible label containing clue number, direction, and character position.
- Clues can focus their corresponding starting cell.
- Keyboard-only users can complete, check, reveal, and submit a puzzle.
- Focus remains visible and returns to the triggering control when dialogs close.
- Status changes use polite live regions and are not conveyed only by animation.
- Calculator and preprocessing inputs have explicit labels and helpful validation text.
- Generated-puzzle failure falls back to curated data rather than presenting an error screen.
- Stored progress parsing and calculator errors never crash the page.

## Testing strategy

Development follows test-driven implementation.

Unit tests cover:

- crossword normalization, intersections, adjacency rules, connectivity, numbering, deterministic seeds, and 15-entry guarantees;
- selection balance across the three modules and fallback behavior;
- every preprocessing formula, rounding rule, remainder bin, tie boundary, negative values, and zero-range/zero-deviation errors;
- answer parsing and tolerance;
- calculator precedence, parentheses, unary signs, functions, degree/radian mode, memory, domain errors, and rejection of unsupported input;
- backward-compatible progress parsing.

Component tests cover:

- crossword keyboard and pointer interaction;
- clue synchronization, checking, revealing, submission, and review;
- preprocessing attempts, feedback, worked solutions, scoring, and reset;
- calculator mouse and keyboard operation;
- CS.412 navigation without regressions to existing subject pages.

End-to-end tests cover a complete crossword flow, one correct and one incorrect preprocessing flow, calculator use inside a problem, persistence after reload, and responsive behavior at desktop and mobile sizes.

Before completion, run the full unit/component test suite, typecheck, lint, production build, and targeted end-to-end tests. Perform a browser visual review at desktop and mobile sizes and fix overflow, clipping, inaccessible focus, or unreadable states.

## Out of scope

- Online accounts, cloud synchronization, or multiplayer play.
- Importing arbitrary crossword files.
- Symbolic algebra, graphing, or computer-algebra-system behavior in the calculator.
- Additional data-mining topics not present in the supplied documents.
- Changing the existing CIT.016 or CIT.017 curriculum.

## Acceptance criteria

The feature is ready when:

1. CS.412 appears as a subject and clearly offers Crossword and Data Preprocessing modes.
2. A learner can complete a true connected 15-answer interlocking mock crossword using terms from all three theory modules.
3. The complete practice collection covers every curated likely exam term.
4. Definitions are presented as clues and the answers are the requested words or terms.
5. The preprocessing set contains exactly six 5-point questions and totals 30 points.
6. Every preprocessing problem can show an accurate step-by-step solution.
7. The scientific calculator is available without leaving the preprocessing page and handles the required operations safely.
8. Progress survives reloads without damaging existing saved data.
9. The experience is keyboard-accessible, usable at 360 px width, and visually consistent with the current reviewer.
10. Automated verification and desktop/mobile browser checks pass with no known blocking defects.
