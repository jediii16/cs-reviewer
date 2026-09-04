# Premium Study UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current bright, game-like presentation with a calm premium light/dark interface, a large modal focus timer, and optional locally generated ambient sounds.

**Architecture:** Keep the existing React routes, content model, quiz engine, and timer reducer. Migrate the versioned browser preferences, add a root appearance controller and isolated Web Audio engine, then rebuild the header timer as a native dialog and restyle the existing surfaces through semantic theme tokens.

**Tech Stack:** React 19, TypeScript 6, Vite 8, React Router 7, Lucide React, Inter Variable via `@fontsource-variable/inter`, Web Audio API, Vitest/Testing Library, Playwright Chromium.

**Spec:** `docs/superpowers/specs/2026-09-05-premium-study-ui-redesign.md`

## Global Constraints

- Preserve all source-faithful CIT.017 material, all 74 questions, quiz formats, scoring, progress, and Retry Missed behavior.
- Use no backend, accounts, analytics, external audio stream, copyrighted music, autoplay, points, streaks, trophies, confetti, or avatars.
- Theme defaults to the operating-system preference; explicit light/dark selection persists locally.
- Ambient sound defaults to Off and never resumes automatically after reload.
- Normal text must meet WCAG 2.2 AA contrast of at least 4.5:1.
- Use Lucide line icons with visible labels for ambiguous actions.
- All primary mobile controls must remain at least 44×44 CSS pixels and the app must reflow at 300px without horizontal scrolling.

---

### Task 1: Preference migration and appearance state

**Files:**
- Modify: `src/features/progress/storage.ts`
- Modify: `src/features/progress/storage.test.ts`
- Modify: `src/features/progress/useProgress.ts`
- Create: `src/features/appearance/useAppearance.ts`
- Create: `src/features/appearance/useAppearance.test.tsx`
- Modify: `src/test/setup.ts`

**Interfaces:**
- Produces: `AppearancePreference = 'system' | 'light' | 'dark'`
- Produces: `AmbientSound = 'off' | 'rain' | 'brown-noise'`
- Produces: `ReviewerProgress` version 2 with `appearance`, `ambientSound`, and `ambientVolume`
- Produces: `useAppearance(): { appearance; resolvedTheme; setAppearance; toggleTheme }`
- Preserves: version 1 scores, reviewed topics, and timer preset through migration

- [ ] **Step 1: Write failing storage migration tests**

```ts
it('migrates version 1 progress without losing study data', () => {
  localStorage.setItem(progressStorageKey, JSON.stringify({
    version: 1,
    reviewedTopicIds: ['foundations'],
    recentResults: [{ completedAt: '2026-09-04T12:00:00.000Z', correct: 8, total: 10 }],
    timerPresetMinutes: 45,
  }));

  expect(loadProgress()).toMatchObject({
    version: 2,
    reviewedTopicIds: ['foundations'],
    timerPresetMinutes: 45,
    appearance: 'system',
    ambientSound: 'off',
    ambientVolume: 0.22,
  });
});
```

- [ ] **Step 2: Run the migration test and verify RED**

Run: `npm test -- --run src/features/progress/storage.test.ts --reporter=default`

Expected: FAIL because version 1 is currently rejected and version 2 preferences do not exist.

- [ ] **Step 3: Implement version 2 validation and migration**

```ts
export type AppearancePreference = 'system' | 'light' | 'dark';
export type AmbientSound = 'off' | 'rain' | 'brown-noise';

export interface ReviewerProgress {
  version: 2;
  reviewedTopicIds: string[];
  recentResults: TestResultSummary[];
  timerPresetMinutes: 15 | 25 | 45;
  appearance: AppearancePreference;
  ambientSound: AmbientSound;
  ambientVolume: number;
}

function migrateVersionOne(item: LegacyReviewerProgress): ReviewerProgress {
  return { ...item, version: 2, appearance: 'system', ambientSound: 'off', ambientVolume: 0.22 };
}
```

Clamp volume to `0..1`, validate enums, keep malformed/unsupported fallback, and add `setAppearance`, `setAmbientSound`, and `setAmbientVolume` callbacks to `useProgress`.

- [ ] **Step 4: Write and verify a failing appearance hook test**

```tsx
it('uses system dark mode, applies it to the root, and persists an explicit toggle', async () => {
  matchMediaController.setDark(true);
  render(<AppearanceHarness />);
  expect(document.documentElement.dataset.theme).toBe('dark');
  await user.click(screen.getByRole('button', { name: /switch to light mode/i }));
  expect(document.documentElement.dataset.theme).toBe('light');
  expect(loadProgress().appearance).toBe('light');
});
```

Expected: FAIL because `useAppearance` does not exist.

- [ ] **Step 5: Implement `useAppearance`**

Subscribe to `(prefers-color-scheme: dark)` changes, derive the resolved theme during render, apply `data-theme` and the `<meta name="theme-color">` value in an effect, and persist only explicit light/dark choices through `useProgress`.

- [ ] **Step 6: Run Task 1 tests and commit**

Run: `npm test -- --run src/features/progress/storage.test.ts src/features/appearance/useAppearance.test.tsx --reporter=default`

Expected: PASS.

Commit: `feat: add persisted appearance preferences`

---

### Task 2: Local ambient audio engine

**Files:**
- Create: `src/features/audio/ambientAudio.ts`
- Create: `src/features/audio/ambientAudio.test.ts`
- Create: `src/features/audio/useAmbientAudio.ts`
- Create: `src/features/audio/useAmbientAudio.test.tsx`

**Interfaces:**
- Consumes: `AmbientSound` and preference setters from Task 1
- Produces: `createAmbientAudio(): AmbientAudioEngine`
- Produces: `AmbientAudioEngine` with `start(sound, volume)`, `setVolume(volume)`, `stop()`, and `dispose()`
- Produces: `useAmbientAudio(): { selectedSound; volume; playing; unavailable; chooseSound; setVolume; stop }`

- [ ] **Step 1: Write failing engine lifecycle tests**

Use a small fake `AudioContext` implementation and assert:

```ts
it('starts only when requested and disconnects every node on stop', async () => {
  const engine = createAmbientAudio(() => fakeContext);
  expect(fakeContext.createdSources).toHaveLength(0);
  await engine.start('brown-noise', 0.2);
  expect(fakeContext.resume).toHaveBeenCalledOnce();
  expect(fakeContext.createdSources).toHaveLength(1);
  engine.stop();
  expect(fakeContext.createdSources[0].stop).toHaveBeenCalledOnce();
});
```

- [ ] **Step 2: Run the engine test and verify RED**

Run: `npm test -- --run src/features/audio/ambientAudio.test.ts --reporter=default`

Expected: FAIL because the engine does not exist.

- [ ] **Step 3: Implement the engine**

Create one `AudioContext` lazily inside `start()`. Generate a looping noise buffer, use a low-pass filter and gain envelope, and vary filter/gain settings for rain versus brown noise. Clamp volume, fade gain briefly on start/stop, and disconnect/close nodes on dispose. Never start from construction or persisted state.

- [ ] **Step 4: Write failing hook preference/fallback tests**

```tsx
it('stores a selection but never starts it until the user chooses it', async () => {
  render(<AmbientHarness engine={engine} />);
  expect(engine.start).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: /soft rain/i }));
  expect(engine.start).toHaveBeenCalledWith('rain', 0.22);
});

it('returns to off when Web Audio is unavailable', async () => {
  engine.start.mockRejectedValue(new Error('unavailable'));
  render(<AmbientHarness engine={engine} />);
  await user.click(screen.getByRole('button', { name: /brown noise/i }));
  expect(screen.getByRole('status')).toHaveTextContent(/audio is unavailable/i);
});
```

- [ ] **Step 5: Implement `useAmbientAudio` and verify**

The hook creates one engine lazily, starts only inside `chooseSound`, persists selection/volume, stops for Off, exposes an unavailable state, and disposes on unmount.

Run: `npm test -- --run src/features/audio --reporter=default`

Expected: PASS.

- [ ] **Step 6: Commit**

Commit: `feat: add local ambient focus sounds`

---

### Task 3: Modal focus experience

**Files:**
- Modify: `src/features/timer/FocusTimer.tsx`
- Modify: `src/features/timer/FocusTimer.test.tsx`
- Create: `src/features/timer/FocusDialog.tsx`
- Modify: `src/features/timer/useFocusTimer.ts`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: timer reducer state/actions and `useAmbientAudio`
- Produces: compact header trigger labelled `Open focus timer, Focus, 25:00`
- Produces: native `<dialog aria-labelledby="focus-dialog-title">`
- Preserves: timer state while the dialog closes and reopens

- [ ] **Step 1: Replace the existing timer component test with failing modal tests**

```tsx
it('opens a large focus dialog and keeps the timer running after close', async () => {
  render(<FocusTimer />);
  await user.click(screen.getByRole('button', { name: /open focus timer/i }));
  expect(screen.getByRole('dialog')).toBeVisible();
  expect(screen.getByText('25:00', { selector: '.focus-dialog-time' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: /^start$/i }));
  await user.click(screen.getByRole('button', { name: /close focus timer/i }));
  expect(screen.getByRole('button', { name: /pause focus timer/i })).toBeVisible();
});
```

Also test preset selection, break switching, ambient choices, volume label, Escape/close, and reopening without reset.

- [ ] **Step 2: Run and verify RED**

Run: `npm test -- --run src/features/timer/FocusTimer.test.tsx --reporter=default`

Expected: FAIL because the timer is inline and no dialog exists.

- [ ] **Step 3: Implement `FocusDialog` and rebuild `FocusTimer`**

Use `dialog.showModal()`/`close()`, `Timer`, `X`, `Play`, `Pause`, `RotateCcw`, `Coffee`, `CloudRain`, and `Waves` icons. The trigger remains mounted with the timer hook. The dialog receives state/actions and ambient controls as props. Clicking the backdrop closes only when `event.target === event.currentTarget`.

- [ ] **Step 4: Add progress presentation**

Calculate the session duration from mode and preset, expose `--timer-progress` as a percentage, and render a quiet circular timer frame with tabular digits. Avoid animation when `prefers-reduced-motion` is active.

- [ ] **Step 5: Run timer tests and commit**

Run: `npm test -- --run src/features/timer --reporter=default`

Expected: PASS.

Commit: `feat: add premium modal focus timer`

---

### Task 4: Premium theme and app-shell redesign

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `index.html`
- Modify: `src/main.tsx`
- Modify: `src/app/AppShell.tsx`
- Modify: `src/app/App.test.tsx`
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `useAppearance` and modal `FocusTimer`
- Produces: persistent theme toggle labelled for its destination state
- Produces: complete semantic token sets for `[data-theme='light']` and `[data-theme='dark']`

- [ ] **Step 1: Install and import Inter Variable**

Run: `npm install @fontsource-variable/inter`

Import `@fontsource-variable/inter` before local styles in `src/main.tsx`. Keep the system font stack as fallback.

- [ ] **Step 2: Write failing app-shell theme tests**

```tsx
it('switches the complete app shell between dark and light themes', async () => {
  render(<MemoryRouter><App /></MemoryRouter>);
  await user.click(screen.getByRole('button', { name: /switch to dark mode/i }));
  expect(document.documentElement.dataset.theme).toBe('dark');
  expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeVisible();
});
```

- [ ] **Step 3: Run and verify RED**

Run: `npm test -- --run src/app/App.test.tsx --reporter=default`

Expected: FAIL because the shell lacks a theme control.

- [ ] **Step 4: Implement the shell**

Use `BookOpenText` for the wordmark, `Sun`/`Moon` for appearance, and the new Focus trigger. Keep one header height on every route. Add an inline `index.html` bootstrap that reads the stored version 2 appearance and system preference before the app renders, sets `data-theme`, and updates `theme-color`.

- [ ] **Step 5: Replace color tokens and restyle shared primitives**

Create semantic tokens including `--bg`, `--surface`, `--surface-elevated`, `--text`, `--text-soft`, `--border`, `--accent`, `--accent-soft`, `--success`, `--danger`, `--shadow`, and `--focus-ring` for both themes. Update body, links, buttons, inputs, focus rings, headers, dialogs, and feedback states to use only semantic tokens.

- [ ] **Step 6: Run app tests and commit**

Run: `npm test -- --run src/app/App.test.tsx src/features/timer/FocusTimer.test.tsx --reporter=default`

Expected: PASS.

Commit: `feat: add premium light and dark app shell`

---

### Task 5: Restyle Home, Subject, Study, Test, and McCumber surfaces

**Files:**
- Modify: `src/app/routes/HomePage.tsx`
- Modify: `src/app/routes/SubjectPage.tsx`
- Modify: `src/app/routes/StudyPage.tsx`
- Modify: `src/app/routes/TestPage.tsx`
- Modify: `src/features/study/StudyLesson.tsx`
- Modify: `src/features/study/McCumberCube.tsx`
- Modify: `src/features/test/QuizRunner.tsx`
- Modify: `src/styles/global.css`
- Modify: `tests/e2e/reviewer.spec.ts`

**Interfaces:**
- Preserves all route URLs, accessible names used by existing tests, question data, and callbacks
- Produces: BookOpen/ClipboardCheck navigation icon treatment and full theme support on all learning surfaces

- [ ] **Step 1: Add failing browser assertions for theme and focus modal**

```ts
test('theme and focus setup persist across routes', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /switch to dark mode/i }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: /open focus timer/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: /45 minutes/i }).click();
  await expect(page.locator('.focus-dialog-time')).toHaveText('45:00');
  await page.getByRole('button', { name: /close focus timer/i }).click();
  await page.getByRole('link', { name: /cit\.017/i }).click();
  await expect(page.getByRole('button', { name: /open focus timer.*45:00/i })).toBeVisible();
});
```

- [ ] **Step 2: Run the focused E2E test and verify RED**

Run: `npm run test:e2e -- --grep "theme and focus"`

Expected: FAIL because the controls and modal do not exist.

- [ ] **Step 3: Simplify route markup and icons**

Remove decorative status pills and numbered icon blocks where they do not aid navigation. Use restrained `BookOpen`, `ClipboardCheck`, `ArrowRight`, `CircleCheck`, and `CircleX` icons with adjacent labels. Keep the existing headings and all test-accessible labels stable unless the new test explicitly defines them.

- [ ] **Step 4: Restyle every route with semantic tokens**

Use a maximum reading width near 72ch, smaller `clamp()` heading ranges, flat/elevated surfaces, 12–16px radii, restrained 1px borders, and minimal shadows only for modal elevation. Replace neon selected states with `--accent-soft` plus border/icon indicators. Make results editorial and informational rather than celebratory.

- [ ] **Step 5: Verify 300px reflow and touch sizes**

Extend the existing narrow browser test to open the focus dialog, assert no document overflow, and check the primary timer controls are at least 44px high.

- [ ] **Step 6: Run browser tests and commit**

Run: `npm run test:e2e`

Expected: all desktop and mobile projects PASS.

Commit: `style: create calm premium study experience`

---

### Task 6: Full verification, visual QA, and documentation

**Files:**
- Modify: `README.md`
- Modify: `docs/superpowers/plans/2026-09-05-premium-study-ui-redesign.md`

**Interfaces:**
- Produces: documented theme, modal focus timer, ambient sound controls, and verification commands

- [ ] **Step 1: Update README**

Document light/dark appearance, the modal focus timer, locally generated Soft rain/Brown noise, audio-off default, and browser-local preferences.

- [ ] **Step 2: Run the complete automated suite**

Run each command and require exit code 0:

```bash
npm test -- --run --reporter=default
npm run typecheck
npm run lint
npm run build
npm run test:e2e
git diff --check
```

- [ ] **Step 3: Run built-in browser QA**

At `http://127.0.0.1:4173/`, inspect and interact with:

1. Home in light and dark themes.
2. Subject dashboard and theme persistence after navigation.
3. Focus modal: 15/25/45, Break, Start/Pause, close/reopen, rain/noise toggle, volume, and Off.
4. Study lesson, active recall, and McCumber controls in both themes.
5. Test selection, all three question formats, answer feedback, and results.
6. Desktop, 390px mobile, and 300px narrow panel.
7. Console warnings/errors and framework overlays.

- [ ] **Step 4: Capture and inspect screenshots**

Save current light Home, dark Study, dark Focus modal, and mobile Test screenshots outside the repository in the visualization output directory. Inspect each with `view_image` and fix clipping, hierarchy, contrast, spacing, and theme inconsistencies before completion.

- [ ] **Step 5: Request independent code review**

Review the full implementation against the approved spec. Fix every Critical and Important issue, then rerun affected checks.

- [ ] **Step 6: Mark plan complete and commit**

Check every completed task box, run `git status --short`, and commit documentation/final polish as:

`docs: finish premium study UI redesign`
