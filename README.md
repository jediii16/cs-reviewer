# Bappi — CS Reviewer

Bappi is a focused, browser-only reviewer with separate subjects for CIT.016 Data Communication, CIT.017 Foundations of Information Security, and CS.412 Data Mining. A kimbap mascot reacts throughout source-faithful study notes, active recall, comprehensive practice, and self-check flashcards. CIT.017 also includes an interactive McCumber Cube.

CS.412 adds Word - Definition study lessons, real 15-answer interlocking crosswords, a complete 56-term theory bank drawn from the supplied lessons, six 5-point data-preprocessing problems with worked solutions, and a floating scientific calculator. Open `/subjects/cs412/study` to learn the terms and formulas, `/subjects/cs412/crossword` for definition-to-word practice, or `/subjects/cs412/preprocessing` for the 30-point problem-solving set.

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
