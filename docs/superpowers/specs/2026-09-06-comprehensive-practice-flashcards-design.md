# Comprehensive Practice and Flashcards Design

## Goal

Make CIT.017 practice exhaustive without making the reviewer feel heavier: active-recall answers reveal without changing layout, lesson navigation returns to the lesson anchor, graded tests are focused multiple-choice sets built from the supplied sources, and identification practice becomes a separate self-check flashcard mode.

## Product boundaries

- Keep the existing browser-only React and Vite app, progress storage, theme, timer, audio, notes, and Bappi integration.
- Preserve the supplied PDF and threat-table wording and meaning. McCumber Cube material remains the only supplemental content.
- Keep the interface calm, minimal, and Apple-like rather than game-like.
- Add no backend, accounts, generated questions, streaks, points, or arbitrary question cap.
- Preserve the user's existing uncommitted Bappi and progress work while editing overlapping files.

## Study interaction

### Active recall

The active-recall card always renders both the prompt and answer in the same fixed-size region. The answer is visually hidden until the card is hovered or receives keyboard/touch focus. Revealing it changes only opacity and a small transform, so the panel never grows or moves surrounding content.

The panel remains accessible on devices without hover:

- mouse users hover the panel;
- keyboard users tab to the panel;
- touch users tap the focusable panel;
- the answer remains present in the document for assistive technology;
- reduced-motion users receive the same reveal without animation.

### Anchored lesson navigation

The lesson title and progress area becomes a named scroll anchor. Previous and Next update the section and call `scrollIntoView` with smooth behavior on that anchor, using a top scroll margin for the fixed app header. This returns the viewport to just before the topic title and lesson progress rather than the top of the page.

### Security-principles scope

The Security Principles study topic contains exactly the nine supplied principles. The three later scenario case studies are removed from the study sequence and are not reused in tests or flashcards. Each principle retains its supplied definition, benefits where present, and its own example.

## Graded test structure

All graded questions are multiple choice. The test landing page groups small, clearly named sets by topic and shows the exact question count before a student starts. Starting a set includes every question in that set and shuffles both questions and answer choices; there is no ten-question truncation.

### Foundations of Information Security

1. **CIA Scenario Practice — 10 questions.** Ten source-derived scenarios ask whether Confidentiality, Integrity, or Availability best describes the priority.
2. **Foundations Concepts — comprehensive.** Questions cover the CIA Triad and each property, representative controls, the AAA Framework, Authentication, Authorization, Accounting/Auditing, the three authentication-factor groups and their supplied examples, accounting records and benefits, and the McCumber Cube dimensions and 27 intersections.

### Security Principles

1. **Principle Definitions — 9 questions.** One definition question for each of Least Privilege, Need-to-Know Principle, Separation of Duties, Defense in Depth, Fail-Safe (Secure by Default), Security by Design, Principle of Complete Mediation, Economy of Mechanism (Keep it Simple), and Open Design. No scenario case-study questions are included.

### Categories of Threats

1. **Threat Scenarios — 12 questions.** One distinct scenario covers each supplied threat category, using the exact category labels shown in the uploaded table.

### Social Engineering

1. **Technique Definitions — 17 questions.** One definition or description question for every supplied technique.
2. **Technique Examples — 17 questions.** One supplied example for every technique, asking the student to identify it.
3. **Psychological Tactics — 9 questions.** Every supplied tactic example asks the student to identify Authority, Urgency, Fear, Curiosity, Greed, Trust/Familiarity, Sympathy, Scarcity, or Reciprocity.

Feedback remains immediate after submission and includes the correct answer and a concise source-faithful explanation. Results retain score, missed concepts, and retry-missed behavior. Retry includes every missed question and remains multiple choice.

## Flashcard mode

Flashcards become a third primary mode beside Study and Test at `/subjects/cit017/flashcards`.

The landing state presents four decks with clear card counts:

- Foundations: framework, CIA, AAA, authentication factors, and McCumber concepts;
- Security Principles: the nine supplied principle definitions;
- Threat Categories: supplied attack examples on the front and the category on the back;
- Social Engineering: all 17 technique descriptions plus all 9 psychological-tactic examples.

A deck is intentionally ungraded. The front asks for the term or category, and clicking/tapping the card or pressing Enter/Space flips it. The card has a stable height and a subtle 3D transition. Previous, Next, Shuffle, and Return to decks controls support short or long sessions. Progress reads `Card x of y`; there is no checker, score, or mastery claim.

## Data model

The graded bank uses only `ChoiceQuestion`. A `TestSet` contains stable metadata and a complete list of questions:

```ts
interface TestSet {
  id: string;
  topicId: QuizTopic;
  title: string;
  description: string;
  questions: ChoiceQuestion[];
}
```

Flashcards use a separate model so self-check behavior is not confused with scoring:

```ts
interface Flashcard {
  id: string;
  topicId: QuizTopic;
  prompt: string;
  answer: string;
  detail?: string;
}

interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  cards: Flashcard[];
}
```

The flattened `cit017Questions` export may remain for compatibility, but it contains only the questions from the explicit test sets. Question and card IDs must be unique, every multiple-choice correct option must exist, and tests assert exact set sizes and source coverage.

## Navigation and progress

- The subject page exposes Study, Flashcards, and Test as equal review paths.
- Existing reviewed-topic progress is unchanged.
- Graded test results continue using the existing local result record; flashcards do not write a score.
- Route changes remain client-side and browser-only.

## Visual language

- Reuse the current typography, neutral surfaces, thin borders, muted accent, and dark-mode tokens.
- Group test sets with light section labels and compact rows rather than colorful game cards.
- Use Lucide `GalleryHorizontalEnd` or `Layers3` for flashcards and restrained line icons for test groups.
- Keep motion limited to functional opacity, scroll, and card-flip transitions.
- Use practical fixed/minimum heights and responsive single-column layouts below tablet widths.

## Accessibility and resilience

- Hover-only recall is paired with keyboard and touch focus behavior.
- Flashcards are semantic buttons with keyboard flip support and descriptive front/back labels.
- All test answers remain real radio controls inside labelled fieldsets.
- Focus indicators are visible in light and dark mode.
- `prefers-reduced-motion` disables reveal and card-flip animation while preserving state changes.
- Empty or malformed data should not crash runners; route-level deck and set choices remain available.

## Verification

Implementation is test-driven and covers:

- recall answer always present, focusable reveal contract, stable-height browser behavior, and no reveal button;
- smooth scrolling to the lesson anchor on Previous and Next;
- exactly nine Security Principles study sections and no scenario cases;
- exact test-set counts and complete concept/category/technique/tactic coverage;
- graded bank contains only multiple-choice questions and starts every question in a chosen set;
- flashcard deck selection, flip, keyboard operation, navigation, shuffle, and return behavior;
- subject and route navigation for the third mode;
- responsive light/dark browser checks at desktop and mobile widths;
- full unit tests, typecheck, lint, build, Playwright, and whitespace verification.
