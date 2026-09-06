# Bappi — CIT.017 Reviewer

Bappi is a focused, browser-only reviewer for Foundations of Information Security, with a kimbap mascot that reacts throughout the study flow. It includes source-faithful study notes, active recall, mixed-format tests (multiple choice, identification, true or false, definitions, and scenarios), an interactive McCumber Cube, and a modal focus timer.

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

Study progress, recent scores, appearance, timer settings, and ambient preferences are stored only in the current browser, so each person and device keeps its own progress. The CIT.017 dashboard can reset that local data at any time.
