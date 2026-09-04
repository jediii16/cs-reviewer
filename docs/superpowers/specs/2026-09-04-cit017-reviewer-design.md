# CIT.017 Reviewer Design

## Purpose

Build a small, shareable browser-based reviewer for CIT.017. It is a personal study tool rather than a commercial product. It should help students review the supplied material quickly, practice scenario identification, and stay focused without adding distracting product features.

## Scope

The first release contains one selectable subject: CIT.017. The subject opens into two primary actions: Study and Test. A compact focus timer is available throughout the subject experience. Progress, preferences, and recent scores are stored only in the current browser with no account or backend.

Excluded from this release: authentication, cloud sync, collaborative features, leaderboards, streak pressure, content editing, instructor tools, and a backend.

## Source Policy

The three supplied PDFs and the supplied 12-category threat table are authoritative. Course definitions, examples, labels, scenarios, and answer explanations must preserve their meaning and wording as closely as practical. Minor corrections may fix obvious typographical errors without changing the instructional meaning.

The only externally sourced course addition is the McCumber Cube. Its lesson will cover the three dimensions from John McCumber's model:

- Security goals: confidentiality, integrity, and availability.
- Information states: storage, processing, and transmission.
- Safeguards: technology; policy and practices; education, training, and awareness.

The cube should be explained as a 3 x 3 x 3 model whose 27 intersections prompt students to consider a security goal, an information state, and a safeguard together.

## Information Architecture

1. Subject selection
   - A simple home screen with CIT.017 as the available subject.
   - The structure must allow more subjects to be added later without redesigning the application.
2. CIT.017 dashboard
   - Continue Study.
   - Start Test.
   - Topic progress and recent score summary.
   - Focus timer access.
3. Study
   - Foundations of Information Security: CIA Triad, AAA Framework, and McCumber Cube.
   - Security Principles: all nine principles and the three supplied scenarios.
   - Categories of Threats to Information Security: all 12 categories and supplied examples.
   - Social Engineering: all supplied techniques, communication methods, and psychological tactics.
4. Test
   - Threat-category scenario identification.
   - CIA scenario identification.
   - Security-principle scenario identification.
   - Social-engineering technique identification.
   - Mixed review.

## Study Experience

Each topic uses one focused lesson layout rather than reproducing entire PDFs as images. It contains the source-faithful definition, examples, controls or related details, and a small visual relationship where helpful. Students can move between lesson sections and use a Reveal Answer interaction for active recall.

The McCumber Cube is rendered as an interactive, accessible diagram using normal web UI. Selecting one item from each dimension shows the resulting combination and a plain-language example. No decorative illustration or generated imagery is required.

The app marks a topic as reviewed after the student completes its sections. Students can reset local progress from settings.

## Test Experience

Tests are low-friction and scenario-led. A student chooses a category or Mixed Review, then receives a short set of questions in shuffled order. Each question has one best answer and plausible alternatives drawn from the same framework.

Practice behavior:

- One question at a time.
- Answer selection can be changed before submission.
- Submitted answers reveal the correct answer and a source-grounded explanation.
- The student advances manually after reading the feedback.
- The final screen shows score, topic breakdown, missed concepts, and Retry Missed.
- Question order and answer order are shuffled while scoring remains deterministic.

Tests should include the quiz formats described by the user: identifying one of the 12 threat categories from a scenario and identifying which CIA property best applies to a scenario. Additional questions cover the supplied security principles and social-engineering material.

## Focus Timer

A compact timer is available from the CIT.017 dashboard, Study, and Test screens. Defaults are 25 minutes of focus and 5 minutes of break, with 15, 25, and 45 minute focus presets. It supports start, pause, reset, and switching between focus and break. It does not block study navigation and stores only the chosen preset locally.

## Visual Direction

Use a restrained, energetic academic interface: crisp white and deep navy surfaces with a bright electric-lime accent, strong readable typography, and clear progress cues. The layout should feel more like a focused study desk than a game dashboard. Use open whitespace, compact navigation, restrained borders, and limited motion for correct-answer feedback and screen transitions. Avoid card overload, gradients, mascot art, fake statistics, and excessive gamification.

The experience must be responsive for laptops and phones, keyboard accessible, and respectful of reduced-motion preferences.

## Technical Design

Use React, TypeScript, and Vite as a static single-page application. Keep all course content in typed data modules separate from UI components. Use React Router for Home, Subject, Study, and Test routes. Use localStorage through one small persistence adapter for reviewed topics, timer preference, and recent test results.

Key boundaries:

- `content`: authoritative lesson and question data.
- `features/study`: topic navigation, reveal interactions, and completion.
- `features/test`: question selection, shuffling, scoring, feedback, and retry-missed behavior.
- `features/timer`: focus and break state.
- `lib/storage`: versioned browser persistence with safe defaults.
- `components`: reusable app shell and controls.

If stored data is missing, malformed, or from an unsupported version, the app falls back to clean defaults without preventing study. No network connection is required after the static files load.

## Testing and Verification

Unit tests will cover question shuffling without answer corruption, scoring, topic filtering, retry-missed selection, timer transitions, and storage fallback behavior. Component tests will cover the core Study and Test interactions. Browser verification will cover the complete path from subject selection through study and a completed test on desktop and mobile-sized viewports. The production build, type checking, linting, automated tests, and visible interaction checks must pass before handoff.

## Success Criteria

- A student can open CIT.017, review every supplied topic, and take useful scenario-based practice tests.
- CIA and 12-category threat questions closely match the remembered quiz style.
- The supplied source content remains recognizable and accurate.
- The McCumber Cube is understandable through a clear interactive visual.
- Progress and preferences persist independently in each browser.
- The interface remains fast, calm, readable, and useful on phone and laptop.
