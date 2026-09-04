# CIT.017 Reviewer

A focused, browser-only reviewer for Foundations of Information Security. It includes source-faithful study notes, active recall, mixed-format tests (multiple choice, identification, true or false, definitions, and scenarios), an interactive McCumber Cube, and a focus timer.

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

Study progress, recent scores, and timer preferences are stored only in the current browser, so each person and device keeps its own progress. The CIT.017 dashboard can reset that local progress at any time.
