# Bappi — CS Reviewer

Bappi is a focused, browser-only reviewer with separate subjects for CIT.016 Data Communication and CIT.017 Foundations of Information Security. A kimbap mascot reacts throughout source-faithful study notes, active recall, comprehensive multiple-choice practice, and self-check flashcards. CIT.017 also includes an interactive McCumber Cube.

The interface supports persistent light and dark themes. The focus timer includes 15-, 25-, and 45-minute sessions, a five-minute break, and optional Soft rain or Brown noise generated locally with the browser's Web Audio API. Ambient sound is Off by default and never starts automatically.

## Run locally

```bash
npm install
npm run dev
```

Open the local address shown in the terminal.

## Verify

```bash
npm test -- --run
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

Study progress, recent scores, appearance, timer settings, and ambient preferences are stored only in the current browser. Subject dashboards show and reset their own learning progress, while appearance, timer, and audio preferences remain shared.
