# Focus Player and Blurting Notes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an independent global audio player with draggable waveform seeking, a calmer animated Pomodoro modal, and locally autosaved topic-based Blurting Notes.

**Architecture:** Keep all three tools mounted from `AppShell` so route changes do not interrupt them. Extend the existing media engine and audio controller for transport telemetry, render the audio trigger/dialog/dock through one persistent `AudioPlayer`, keep `FocusTimer` timer-only, and store notes in a separate versioned local-storage record.

**Tech Stack:** React 19.2.8, TypeScript 6.0.3, React Router 7.18.3, Vite 8.2.2, Lucide React 1.40.0, CSS, Vitest 5, Testing Library, Playwright 1.62.1

**Spec:** `docs/superpowers/specs/2026-09-05-focus-player-blurting-notes-design.md`

## Global Constraints

- Keep the application browser-only; add no account, backend, synchronization service, or external streaming service.
- Use only audio files discovered from `src/assets/audio/**/*.{mp3,wav,m4a,ogg}`.
- Music and background noise remain independently playable and independently volume-controlled.
- Default music repeat mode remains `playlist`; background noise always loops.
- Never autoplay audio after refresh.
- Do not persist music playback position, active playback, or dock expansion.
- Keep Blurting Notes in a separate versioned local-storage record so progress reset cannot erase them.
- Preserve the existing Apple-like light/dark visual system and provide complete keyboard, touch, narrow-screen, and reduced-motion behavior.
- Use no fixed skip-forward or skip-back controls; the waveform is the seek control.

## File Structure

### Audio transport

- Modify `src/features/audio/mediaAudio.ts`: expose playback telemetry, pause/resume, and seek without losing stale-request safety.
- Modify `src/features/audio/mediaAudio.test.ts`: verify metadata, time updates, seek, pause/resume, restart, and stale starts.
- Modify `src/features/audio/useFocusAudio.ts`: own playlist transport state and expose previous, next, restart, seek, current time, and duration.
- Modify `src/features/audio/useFocusAudio.test.tsx`: verify wrapping, one-track repeat, pause/resume, seeking, and independent noise.

### Audio interface

- Create `src/features/audio/WaveformSeek.tsx`: accessible range input rendered over deterministic waveform bars.
- Create `src/features/audio/AudioDock.tsx`: retracting global transport dock and inactivity behavior.
- Create `src/features/audio/AudioDialog.tsx`: music library, repeat, volume, and independent noise controls.
- Create `src/features/audio/AudioPlayer.tsx`: single persistent audio owner coordinating trigger, dialog, and dock.
- Create `src/features/audio/AudioPlayer.test.tsx`: dialog, transport, waveform, dock, and accessibility coverage.
- Modify `src/app/AppShell.tsx`: mount the persistent `AudioPlayer` in the header action group.

### Timer

- Modify `src/features/timer/timerMachine.ts`: count completed sessions so the UI can trigger a completion effect exactly once.
- Modify `src/features/timer/timerMachine.test.ts`: verify completion count and mode transition.
- Modify `src/features/timer/FocusTimer.tsx`: remove audio ownership and derive the short-lived completion effect while the modal is open.
- Modify `src/features/timer/FocusDialog.tsx`: remove sound controls and expose running/completion visual states.
- Modify `src/features/timer/FocusTimer.test.tsx`: verify timer-only dialog, running visuals, closing persistence, and completion styling contract.

### Blurting Notes

- Create `src/features/notes/notesStorage.ts`: validate, load, save, and clear the separate notes record.
- Create `src/features/notes/notesStorage.test.ts`: malformed data, topic separation, round trip, and clear behavior.
- Create `src/features/notes/useBlurtingNotes.ts`: in-memory editor state, debounced autosave status, note selection, and clearing.
- Create `src/features/notes/useBlurtingNotes.test.tsx`: autosave timing, switching, and restoration.
- Create `src/features/notes/NotesDialog.tsx`: focused plain-text editor dialog.
- Create `src/features/notes/BlurtingNotes.tsx`: persistent header trigger and dialog owner.
- Create `src/features/notes/BlurtingNotes.test.tsx`: editing, topic switching, saved status, word count, and clear confirmation.
- Modify `src/app/AppShell.tsx`: mount `BlurtingNotes` in the header action group.

### Styling and end-to-end verification

- Modify `src/styles/global.css`: audio dialog, waveform, retracting dock, timer effects, notes editor, responsive spacing, dark mode, and reduced motion.
- Modify `src/styles/tokens.css` only if a reusable halo or player color token is required.
- Modify `tests/e2e/reviewer.spec.ts`: cover notes persistence, draggable seek availability, audio/timer independence, dark mode, and 300px layout safety.

---

### Task 1: Extend the media engine and audio controller

**Files:**
- Modify: `src/features/audio/mediaAudio.ts`
- Modify: `src/features/audio/mediaAudio.test.ts`
- Modify: `src/features/audio/useFocusAudio.ts`
- Modify: `src/features/audio/useFocusAudio.test.tsx`
- Include existing migration files in the commit: `src/features/audio/audioLibrary.ts`, `src/features/audio/audioLibrary.test.ts`, `src/assets/audio/**`, and removal of the four obsolete ambient-audio files

**Interfaces:**
- Produces: `MediaPlaybackSnapshot { currentTime: number; duration: number }`
- Produces: `MediaAudioEngine.pause(): void`, `resume(): Promise<void>`, `seek(seconds: number): void`, and `getSnapshot(): MediaPlaybackSnapshot`
- Produces on `FocusAudioController.music`: `previous`, `next`, `restart`, `seek`, `currentTime`, `duration`, and `paused`
- Consumes: existing `MusicTrack[]`, `NoiseTrack[]`, `MusicLoopMode`, and persisted volume/selection setters

- [ ] **Step 1: Write failing media-engine transport tests**

Add a fake audio element that captures `loadedmetadata`, `durationchange`, `timeupdate`, `play`, `pause`, and `ended` listeners, then add these assertions:

```ts
await engine.start({
  src: '/track-a.mp3',
  volume: 0.28,
  loop: false,
  onTimeChange,
});
fake.element.duration = 180;
fake.element.currentTime = 42;
fake.emit('loadedmetadata');
fake.emit('timeupdate');
expect(onTimeChange).toHaveBeenLastCalledWith({ currentTime: 42, duration: 180 });

engine.seek(75);
expect(fake.element.currentTime).toBe(75);
engine.pause();
expect(fake.element.pause).toHaveBeenCalled();
await engine.resume();
expect(fake.element.play).toHaveBeenCalledTimes(2);
expect(engine.getSnapshot()).toEqual({ currentTime: 75, duration: 180 });
```

Also verify `seek(999)` clamps to duration, `seek(-4)` clamps to zero, and `pause()` does not remove `src`.

- [ ] **Step 2: Run the media-engine tests and confirm RED**

Run: `npm test -- --run src/features/audio/mediaAudio.test.ts`

Expected: FAIL because telemetry, `pause`, `resume`, `seek`, and `getSnapshot` do not exist.

- [ ] **Step 3: Add transport methods and telemetry to the media engine**

Use these exact public contracts:

```ts
export interface MediaPlaybackSnapshot {
  currentTime: number;
  duration: number;
}

export interface MediaPlaybackRequest {
  src: string;
  volume: number;
  loop: boolean;
  onEnded?: () => void;
  onTimeChange?: (snapshot: MediaPlaybackSnapshot) => void;
}

export interface MediaAudioEngine {
  start(request: MediaPlaybackRequest): Promise<void>;
  pause(): void;
  resume(): Promise<void>;
  seek(seconds: number): void;
  getSnapshot(): MediaPlaybackSnapshot;
  setVolume(volume: number): void;
  setLoop(loop: boolean): void;
  stop(): void;
  dispose(): void;
}
```

Normalize non-finite media values before publishing them:

```ts
function snapshot(element: HTMLAudioElement | undefined): MediaPlaybackSnapshot {
  const duration = element && Number.isFinite(element.duration) ? Math.max(0, element.duration) : 0;
  const currentTime = element && Number.isFinite(element.currentTime) ? Math.max(0, element.currentTime) : 0;
  return { currentTime: Math.min(currentTime, duration || currentTime), duration };
}
```

Register the same telemetry callback for `loadedmetadata`, `durationchange`, and `timeupdate`; remove all registered listeners during unload. `pause()` only pauses. `stop()` pauses, removes `src`, and loads the empty element. `resume()` calls `play()` on the current source. `seek()` clamps and publishes the resulting snapshot.

- [ ] **Step 4: Run media-engine tests and confirm GREEN**

Run: `npm test -- --run src/features/audio/mediaAudio.test.ts`

Expected: all media-engine tests PASS.

- [ ] **Step 5: Write failing audio-controller transport tests**

Expand the fake engine to store a snapshot and call `request.onTimeChange`. Add harness controls and assertions for these behaviors:

```tsx
<button type="button" onClick={() => void audio.music.previous()}>Previous</button>
<button type="button" onClick={() => void audio.music.next()}>Next</button>
<button type="button" onClick={audio.music.restart}>Restart</button>
<button type="button" onClick={() => audio.music.seek(81)}>Seek</button>
<output aria-label="music time">{audio.music.currentTime}/{audio.music.duration}</output>
```

```ts
await user.click(screen.getByRole('button', { name: /toggle music/i }));
await user.click(screen.getByRole('button', { name: /next/i }));
expect(screen.getByLabelText('current music')).toHaveTextContent('music-b');
await user.click(screen.getByRole('button', { name: /next/i }));
expect(screen.getByLabelText('current music')).toHaveTextContent('music-a');
await user.click(screen.getByRole('button', { name: /previous/i }));
expect(screen.getByLabelText('current music')).toHaveTextContent('music-b');

act(() => musicEngine.publish({ currentTime: 34, duration: 180 }));
expect(screen.getByLabelText('music time')).toHaveTextContent('34/180');
await user.click(screen.getByRole('button', { name: /seek/i }));
expect(musicEngine.seek).toHaveBeenCalledWith(81);
await user.click(screen.getByRole('button', { name: /restart/i }));
expect(musicEngine.seek).toHaveBeenCalledWith(0);
```

Add a separate assertion that pausing and resuming keeps the selected track and does not call `start` a second time.

- [ ] **Step 6: Run controller tests and confirm RED**

Run: `npm test -- --run src/features/audio/useFocusAudio.test.tsx`

Expected: FAIL because the transport state and methods are missing.

- [ ] **Step 7: Implement controller transport state**

Track media telemetry in React state:

```ts
const [musicTime, setMusicTime] = useState({ currentTime: 0, duration: 0 });
const [musicPaused, setMusicPaused] = useState(false);
```

Pass `onTimeChange: setMusicTime` into music starts. Expose transport with these semantics:

```ts
async function playRelative(offset: -1 | 1) {
  const current = resolveMusicTrack(dependencies.musicTracks, progress.musicTrackId);
  const index = Math.max(0, dependencies.musicTracks.findIndex((track) => track.id === current?.id));
  const nextIndex = (index + offset + dependencies.musicTracks.length) % dependencies.musicTracks.length;
  const nextTrack = dependencies.musicTracks[nextIndex];
  if (nextTrack) await startMusic(nextTrack);
}

function seekMusic(seconds: number) {
  musicEngineRef.current?.seek(seconds);
}

function restartMusic() {
  musicEngineRef.current?.seek(0);
}
```

When toggling off, call `pause()` and set `paused`; when toggling on with a paused loaded track, call `resume()` instead of `start()`. Track the loaded source separately with `loadedMusicTrackIdRef`. Selecting, previous, or next starts the chosen track immediately only when music is currently playing. While paused, stop the old loaded source, clear `loadedMusicTrackIdRef`, change the persisted selection, reset displayed time to zero, and do not autoplay; the next toggle must start the newly selected track rather than resume the old source.

- [ ] **Step 8: Run both audio suites and confirm GREEN**

Run: `npm test -- --run src/features/audio/mediaAudio.test.ts src/features/audio/useFocusAudio.test.tsx src/features/audio/audioLibrary.test.ts`

Expected: all audio tests PASS.

- [ ] **Step 9: Commit the audio transport foundation**

```bash
git add src/assets/audio src/features/audio
git commit -m "feat: add local audio transport controls"
```

### Task 2: Build the independent audio dialog and retracting dock

**Files:**
- Create: `src/features/audio/WaveformSeek.tsx`
- Create: `src/features/audio/AudioDock.tsx`
- Create: `src/features/audio/AudioDialog.tsx`
- Create: `src/features/audio/AudioPlayer.tsx`
- Create: `src/features/audio/AudioPlayer.test.tsx`
- Modify: `src/app/AppShell.tsx`
- Modify: `src/features/timer/FocusTimer.tsx`
- Modify: `src/features/timer/FocusDialog.tsx`
- Modify: `src/features/timer/FocusTimer.test.tsx`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: the `FocusAudioController` transport API from Task 1
- Produces: `<AudioPlayer />`, which owns the only `useFocusAudio()` instance
- Produces: `<WaveformSeek currentTime duration onSeek />`
- Produces: timer components with no audio props or audio hooks

- [ ] **Step 1: Write failing independent-player tests**

Mock `useFocusAudio` with a complete controller and assert:

```ts
expect(screen.getByRole('button', { name: /open music and ambience/i })).toBeVisible();
await user.click(screen.getByRole('button', { name: /open music and ambience/i }));
expect(screen.getByRole('dialog', { name: /music and ambience/i })).toBeVisible();
expect(screen.getByRole('combobox', { name: /music track/i })).toBeVisible();
expect(screen.getByRole('combobox', { name: /background noise/i })).toBeVisible();
expect(screen.getByRole('slider', { name: /seek through/i })).toBeDisabled();

audio.music.duration = 180;
audio.music.currentTime = 45;
rerender(<AudioPlayer />);
fireEvent.change(screen.getByRole('slider', { name: /seek through/i }), { target: { value: '90' } });
expect(audio.music.seek).toHaveBeenCalledWith(90);
```

Test previous, restart, play/pause, next, repeat, and volume controls by accessible name. Verify the dock handle reopens a retracted dock and focused controls prevent the inactivity timer from hiding it.

- [ ] **Step 2: Run the player test and confirm RED**

Run: `npm test -- --run src/features/audio/AudioPlayer.test.tsx`

Expected: FAIL because the player components do not exist.

- [ ] **Step 3: Implement the waveform seek control**

Use a fixed waveform so layout is stable and cheap:

```tsx
const waveform = [8, 13, 18, 11, 22, 29, 17, 25, 34, 19, 27, 15, 31, 23, 12, 20, 28, 16, 24, 10, 18, 30, 21, 14];

export function WaveformSeek({ currentTime, duration, onSeek }: WaveformSeekProps) {
  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;
  return (
    <label className="waveform-seek" style={{ '--seek-progress': `${progress * 100}%` } as CSSProperties}>
      <span className="sr-only">Seek through current track</span>
      <span className="waveform-bars" aria-hidden="true">
        {waveform.map((height, index) => <i key={`${height}-${index}`} style={{ height }} />)}
      </span>
      <input
        aria-label="Seek through current track"
        type="range"
        min="0"
        max={duration || 0}
        step="0.1"
        value={duration ? Math.min(currentTime, duration) : 0}
        disabled={!duration}
        onChange={(event) => onSeek(Number(event.currentTarget.value))}
      />
    </label>
  );
}
```

Render played bars with a gradient mask controlled by `--seek-progress`; keep the range input transparent and positioned over the full waveform.

- [ ] **Step 4: Implement the dialog and dock components**

`AudioDialog` receives `{ audio, onClose }`, uses a native `<dialog>`, and moves all music/noise configuration markup currently inside `FocusDialog` into the dedicated surface.

`AudioDock` receives `{ audio, onOpenDialog }`. Use these visibility rules:

```ts
const collapseDelayMs = 3200;
const [expanded, setExpanded] = useState(true);
const collapseTimer = useRef<number | undefined>(undefined);

function cancelCollapse() {
  if (collapseTimer.current !== undefined) window.clearTimeout(collapseTimer.current);
}

function scheduleCollapse() {
  cancelCollapse();
  collapseTimer.current = window.setTimeout(() => setExpanded(false), collapseDelayMs);
}
```

Cancel collapse on pointer enter, focus capture, and range pointer down. Schedule collapse on pointer leave, focus leaving the dock, range pointer up, and after transport clicks. The retracted handle uses `aria-label="Show music player"`; the expanded dock uses `aria-label="Music player"`.

Format elapsed and duration with the existing zero-padded `mm:ss` convention. Use Lucide `SkipBack`, `Play`/`Pause`, `SkipForward`, `RotateCcw`, `Repeat`/`Repeat1`, `Volume2`, and `SlidersHorizontal` icons.

- [ ] **Step 5: Implement the persistent player owner and app-shell mount**

Use one hook instance for every audio surface:

```tsx
export function AudioPlayer() {
  const audio = useFocusAudio();
  const [dialogOpen, setDialogOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function closeDialog() {
    setDialogOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }

  return (
    <>
      <button ref={triggerRef} className="header-tool" type="button" aria-label="Open music and ambience" onClick={() => setDialogOpen(true)}>
        <Music2 aria-hidden="true" />
      </button>
      {dialogOpen ? <AudioDialog audio={audio} onClose={closeDialog} /> : null}
      <AudioDock audio={audio} onOpenDialog={() => setDialogOpen(true)} />
    </>
  );
}
```

Mount `<AudioPlayer />` inside `.header-actions`. Remove `useFocusAudio` from `FocusTimer`, remove the `audio` prop from `FocusDialog`, and delete the complete Sound section from the timer dialog. Keep the timer trigger and all timer controls unchanged in this task.

- [ ] **Step 6: Add functional audio-player styles**

Add CSS for:

```css
.audio-dock { position: fixed; z-index: 30; right: 50%; bottom: 14px; transform: translateX(50%); }
.audio-dock[data-expanded='false'] .audio-dock-panel { transform: translateY(calc(100% + 20px)); opacity: 0; pointer-events: none; }
.waveform-seek { position: relative; display: grid; min-width: 180px; height: 34px; }
.waveform-bars { display: flex; align-items: center; gap: 2px; color: var(--accent); }
.waveform-seek input { position: absolute; inset: 0; width: 100%; opacity: 0; cursor: pointer; }
```

Build the complete layouts using the existing color variables, thin borders, translucent elevated surfaces, `var(--shadow-soft)`, and 140–220ms transitions. Center the audio dialog on desktop. Below 680px, anchor its panel near the bottom edge with rounded top corners and a safe-area-aware bottom inset. Add bottom content padding while the audio dock is available. Under `(hover: none)`, keep the compact dock pill on-screen and expand it via its button state rather than hover. Give unavailable-audio messages `role="status"` without making time updates live regions.

- [ ] **Step 7: Update timer tests for separation and run UI tests**

Replace assertions for music/noise inside `FocusTimer.test.tsx` with:

```ts
expect(screen.queryByRole('heading', { name: /^music$/i })).not.toBeInTheDocument();
expect(screen.queryByRole('heading', { name: /background noise/i })).not.toBeInTheDocument();
expect(screen.getByRole('button', { name: /^break$/i })).toBeVisible();
```

Run: `npm test -- --run src/features/audio/AudioPlayer.test.tsx src/features/timer/FocusTimer.test.tsx src/app/App.test.tsx`

Expected: all player, timer, and shell tests PASS.

- [ ] **Step 8: Commit the independent player**

```bash
git add src/features/audio src/features/timer/FocusDialog.tsx src/features/timer/FocusTimer.tsx src/features/timer/FocusTimer.test.tsx src/app/AppShell.tsx src/styles/global.css
git commit -m "feat: add independent global audio player"
```

### Task 3: Add calm Pomodoro effects

**Files:**
- Modify: `src/features/timer/timerMachine.ts`
- Modify: `src/features/timer/timerMachine.test.ts`
- Modify: `src/features/timer/FocusTimer.tsx`
- Modify: `src/features/timer/FocusDialog.tsx`
- Modify: `src/features/timer/FocusTimer.test.tsx`
- Modify: `src/styles/global.css`

**Interfaces:**
- Produces: `TimerState.completedSessions: number`
- Produces: `FocusDialogProps.completionEffect: boolean`
- Consumes: existing timer reducer actions and persisted focus preset

- [ ] **Step 1: Write failing completion-state tests**

Update expected timer states to include `completedSessions: 0`, then verify the final tick increments exactly once:

```ts
const state = {
  mode: 'focus',
  remainingSeconds: 1,
  presetMinutes: 25,
  running: true,
  completedSessions: 2,
} as const;

expect(timerReducer(state, { type: 'tick' })).toEqual({
  mode: 'break',
  remainingSeconds: 300,
  presetMinutes: 25,
  running: false,
  completedSessions: 3,
});
```

In `FocusTimer.test.tsx`, assert that starting adds `.is-running` to the clock and that the dialog still closes without stopping the timer.

- [ ] **Step 2: Run timer tests and confirm RED**

Run: `npm test -- --run src/features/timer/timerMachine.test.ts src/features/timer/FocusTimer.test.tsx`

Expected: FAIL because completion count and running classes are missing.

- [ ] **Step 3: Implement completion state and effect lifetime**

Add `completedSessions` to every reducer state and increment it only in the final running tick. In `FocusTimer`, compare the current count with a ref and show the effect for 900ms only if the dialog is open when completion occurs:

```ts
const previousCompletions = useRef(state.completedSessions);
const [completionEffect, setCompletionEffect] = useState(false);

useEffect(() => {
  if (state.completedSessions === previousCompletions.current) return undefined;
  previousCompletions.current = state.completedSessions;
  if (!open) return undefined;
  setCompletionEffect(true);
  const timeout = window.setTimeout(() => setCompletionEffect(false), 900);
  return () => window.clearTimeout(timeout);
}, [open, state.completedSessions]);
```

Pass `completionEffect` into `FocusDialog`. Add `is-running` to the clock while active and render an `aria-hidden` ripple only while the effect is true.

- [ ] **Step 4: Add the restrained visual effects**

Use pseudo-elements around the clock for a layered halo, animate opacity and scale while running, and animate the completion ripple once. Set Focus and Break accent color through a local custom property. Keep the ring at least 280px on desktop and scale it down without overflow on 300px screens.

Under `prefers-reduced-motion: reduce`, explicitly set the clock halo and ripple to `animation: none` while retaining the progress ring and visible status.

- [ ] **Step 5: Run timer tests and confirm GREEN**

Run: `npm test -- --run src/features/timer/timerMachine.test.ts src/features/timer/FocusTimer.test.tsx`

Expected: all timer tests PASS.

- [ ] **Step 6: Commit the timer polish**

```bash
git add src/features/timer src/styles/global.css
git commit -m "feat: refine focus timer effects"
```

### Task 4: Add versioned Blurting Notes storage and autosave

**Files:**
- Create: `src/features/notes/notesStorage.ts`
- Create: `src/features/notes/notesStorage.test.ts`
- Create: `src/features/notes/useBlurtingNotes.ts`
- Create: `src/features/notes/useBlurtingNotes.test.tsx`

**Interfaces:**
- Produces: `BlurtingNotesState { version: 1; notes: Record<string, string>; selectedId: string }`
- Produces: `loadNotes(validIds, storage?)`, `saveNotes(state, storage?)`, and `clearNote(state, id)`
- Produces: `useBlurtingNotes(noteIds, autosaveDelayMs?)`
- Consumes: note IDs `general` plus `cit017Subject.topics[].id`

- [ ] **Step 1: Write failing storage tests**

Use the storage key `cit017-reviewer-blurting-notes` and verify:

```ts
const noteIds = ['general', 'foundations', 'principles'];
localStorage.setItem(notesStorageKey, '{bad json');
expect(loadNotes(noteIds)).toEqual({ version: 1, notes: {}, selectedId: 'general' });

saveNotes({ version: 1, notes: { foundations: 'CIA means confidentiality.' }, selectedId: 'foundations' });
expect(loadNotes(noteIds)).toEqual({
  version: 1,
  notes: { foundations: 'CIA means confidentiality.' },
  selectedId: 'foundations',
});

expect(clearNote({ version: 1, notes: { foundations: 'text' }, selectedId: 'foundations' }, 'foundations'))
  .toEqual({ version: 1, notes: {}, selectedId: 'foundations' });
```

Also verify unsupported versions and non-string note values return clean defaults, and unknown note IDs are filtered out.

- [ ] **Step 2: Run storage tests and confirm RED**

Run: `npm test -- --run src/features/notes/notesStorage.test.ts`

Expected: FAIL because notes storage does not exist.

- [ ] **Step 3: Implement defensive notes storage**

Use these exact exports:

```ts
export const notesStorageKey = 'cit017-reviewer-blurting-notes';

export interface BlurtingNotesState {
  version: 1;
  notes: Record<string, string>;
  selectedId: string;
}

export function createDefaultNotes(validIds: readonly string[]): BlurtingNotesState {
  return { version: 1, notes: {}, selectedId: validIds[0] ?? 'general' };
}
```

`loadNotes` accepts only version 1, string note values, and keys present in `validIds`; it falls back to the first valid ID if the selected ID is invalid. `saveNotes` catches storage failures. `clearNote` returns a new state with only the selected note removed.

- [ ] **Step 4: Run storage tests and confirm GREEN**

Run: `npm test -- --run src/features/notes/notesStorage.test.ts`

Expected: all storage tests PASS.

- [ ] **Step 5: Write failing autosave-hook tests**

Render a small harness and use fake timers:

```tsx
const notes = useBlurtingNotes(['general', 'foundations'], 300);
return (
  <>
    <textarea aria-label="note" value={notes.text} onChange={(event) => notes.setText(event.currentTarget.value)} />
    <button type="button" onClick={() => notes.selectNote('foundations')}>Foundations</button>
    <button type="button" onClick={notes.clearCurrent}>Clear</button>
    <output aria-label="save status">{notes.saveStatus}</output>
  </>
);
```

Verify text updates immediately, status becomes `saving`, no storage write occurs before 300ms, the write occurs at 300ms, status returns to `saved`, switching notes preserves separate text, and a remount restores both the text and selected note.

- [ ] **Step 6: Run hook tests and confirm RED**

Run: `npm test -- --run src/features/notes/useBlurtingNotes.test.tsx`

Expected: FAIL because the hook does not exist.

- [ ] **Step 7: Implement the autosave hook**

Expose this contract:

```ts
export interface BlurtingNotesController {
  state: BlurtingNotesState;
  selectedId: string;
  text: string;
  saveStatus: 'saved' | 'saving';
  setText(text: string): void;
  selectNote(id: string): void;
  clearCurrent(): void;
}
```

Initialize once with `loadNotes(noteIds)`. Every edit updates memory immediately and sets `saving`; a 300ms default effect timer calls `saveNotes` and returns status to `saved`. Selection persists through the same save path. Clearing updates memory and saves immediately so a reload cannot restore cleared text.

- [ ] **Step 8: Run notes model tests and confirm GREEN**

Run: `npm test -- --run src/features/notes/notesStorage.test.ts src/features/notes/useBlurtingNotes.test.tsx`

Expected: all notes storage and hook tests PASS.

- [ ] **Step 9: Commit the notes model**

```bash
git add src/features/notes/notesStorage.ts src/features/notes/notesStorage.test.ts src/features/notes/useBlurtingNotes.ts src/features/notes/useBlurtingNotes.test.tsx
git commit -m "feat: add autosaved blurting notes model"
```

### Task 5: Build the Blurting Notes editor

**Files:**
- Create: `src/features/notes/NotesDialog.tsx`
- Create: `src/features/notes/BlurtingNotes.tsx`
- Create: `src/features/notes/BlurtingNotes.test.tsx`
- Modify: `src/app/AppShell.tsx`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `BlurtingNotesController` from Task 4 and `cit017Subject.topics`
- Produces: `<BlurtingNotes />` as the persistent notes trigger/dialog owner

- [ ] **Step 1: Write failing editor tests**

Render the editor in a router and verify:

```ts
await user.click(screen.getByRole('button', { name: /open blurting notes/i }));
expect(screen.getByRole('dialog', { name: /blurting notes/i })).toBeVisible();
expect(screen.getByText(/write everything you remember before checking/i)).toBeVisible();

const editor = screen.getByRole('textbox', { name: /blurting note/i });
await user.type(editor, 'Confidentiality integrity availability');
expect(screen.getByText('3 words')).toBeVisible();
expect(screen.getByText(/saving/i)).toBeVisible();

await user.selectOptions(screen.getByRole('combobox', { name: /note topic/i }), 'foundations');
expect(editor).toHaveValue('');
```

Stub `window.confirm` to return false and true on separate Clear clicks; assert cancellation preserves the text and confirmation removes only the active note. Verify Escape closes the dialog and focus returns to the header trigger.

- [ ] **Step 2: Run editor tests and confirm RED**

Run: `npm test -- --run src/features/notes/BlurtingNotes.test.tsx`

Expected: FAIL because the notes components do not exist.

- [ ] **Step 3: Implement the notes dialog**

Create options from the stable topic IDs:

```ts
const noteOptions = [
  { id: 'general', label: 'General' },
  ...cit017Subject.topics.map((topic) => ({ id: topic.id, label: topic.title })),
];
```

Render a native dialog with title `Blurting Notes`, the explanation `Write everything you remember before checking the lesson.`, a labelled selector, a plain `<textarea>`, word count, `Saving…`/`Saved locally` status, and a secondary Clear button. Count words with:

```ts
const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
```

Call `window.confirm('Clear this note? This cannot be undone.')` before `clearCurrent()`.

- [ ] **Step 4: Implement the persistent trigger and shell integration**

`BlurtingNotes` owns the controller and open state, stores a trigger ref, and restores focus after closing. Its header button uses `NotebookPen` and `aria-label="Open Blurting Notes"`. Mount it before `AudioPlayer` in `.header-actions`.

- [ ] **Step 5: Add editor and header styles**

Use a restrained translucent dialog, a compact native selector, and a large textarea with a minimum desktop height of 360px. The textarea uses `var(--surface)`, `var(--text)`, a thin border, comfortable line-height, and no rich-text toolbar. On small screens, use nearly the full viewport with at least 44px controls and a textarea that leaves room for the mobile keyboard.

Make `.header-tool`, `.theme-toggle`, and other icon-only header controls share the same 42px visual treatment. At 340px, hide the timer text but retain all four utility controls without horizontal overflow.

- [ ] **Step 6: Run notes and shell tests and confirm GREEN**

Run: `npm test -- --run src/features/notes/BlurtingNotes.test.tsx src/app/App.test.tsx`

Expected: all editor and shell tests PASS.

- [ ] **Step 7: Commit the notes interface**

```bash
git add src/features/notes src/app/AppShell.tsx src/styles/global.css
git commit -m "feat: add blurting notes editor"
```

### Task 6: Verify responsive behavior and complete the feature

**Files:**
- Modify: `tests/e2e/reviewer.spec.ts`
- Modify if verification reveals a scoped issue: files already listed in Tasks 1–5

**Interfaces:**
- Consumes: completed timer, audio player, dock, and notes UI
- Produces: browser-level evidence that all tools coexist across routes and viewport sizes

- [ ] **Step 1: Add failing end-to-end coverage**

Add a notes persistence test:

```ts
test('blurting notes persist separately across routes and reloads', async ({ page }) => {
  await page.goto('/subjects/cit017/study');
  await page.getByRole('button', { name: /open blurting notes/i }).click();
  await page.getByRole('combobox', { name: /note topic/i }).selectOption('foundations');
  await page.getByRole('textbox', { name: /blurting note/i }).fill('CIA protects confidentiality, integrity, and availability.');
  await expect(page.getByText(/saved locally/i)).toBeVisible();
  await page.getByRole('button', { name: /close blurting notes/i }).click();
  await page.reload();
  await page.getByRole('button', { name: /open blurting notes/i }).click();
  await expect(page.getByRole('textbox', { name: /blurting note/i })).toHaveValue(/CIA protects/);
});
```

Add this audio/timer separation test. It verifies the waveform and transport structure without depending on headless audio-device availability:

```ts
test('audio player and focus timer stay independent', async ({ page }) => {
  await page.goto('/subjects/cit017/study');
  await page.getByRole('button', { name: /open music and ambience/i }).click();
  await expect(page.getByRole('dialog', { name: /music and ambience/i })).toBeVisible();
  await expect(page.getByRole('combobox', { name: /music track/i })).toBeVisible();
  await expect(page.getByRole('combobox', { name: /background noise/i })).toBeVisible();
  await page.getByRole('button', { name: /close music and ambience/i }).click();

  await page.getByRole('button', { name: /show music player/i }).click();
  await expect(page.getByRole('slider', { name: /seek through current track/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /previous track/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /next track/i })).toBeVisible();

  await page.getByRole('button', { name: /open focus timer/i }).click();
  await expect(page.getByRole('dialog', { name: /^focus$/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^music$/i })).toHaveCount(0);
  await page.getByRole('button', { name: /^start$/i }).click();
  await page.getByRole('button', { name: /close focus timer/i }).click();
  await expect(page.getByRole('button', { name: /open focus timer, running focus/i })).toBeVisible();
});
```

Extend the 300px test with these exact checks:

```ts
await page.getByRole('button', { name: /open blurting notes/i }).click();
expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
await page.getByRole('button', { name: /close blurting notes/i }).click();
await page.getByRole('button', { name: /open music and ambience/i }).click();
expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
```

- [ ] **Step 2: Run the focused browser tests and confirm RED or identify scoped failures**

Run: `npm run test:e2e -- --grep "blurting notes|audio and timer|300px"`

Expected before final corrections: new tests expose any missing focus, persistence timing, or narrow-layout behavior.

- [ ] **Step 3: Correct only issues demonstrated by the browser tests**

Apply fixes in the owning component or CSS rule. Keep the following acceptance values:

```css
@media (max-width: 680px) {
  .audio-dialog,
  .notes-dialog { width: min(100% - 20px, 620px); max-height: calc(100dvh - 20px); }
  .audio-dock { right: 10px; bottom: 10px; left: 10px; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .focus-dialog-clock::before,
  .focus-completion-ripple,
  .audio-dock-panel { animation: none; transition-duration: 0.01ms; }
}
```

Do not broaden changes into content, quiz generation, or route redesign.

- [ ] **Step 4: Run complete automated verification**

Run each command separately:

```bash
npm test -- --run
npm run typecheck
npm run lint
npm run build
npm run test:e2e
git diff --check
```

Expected: all unit tests, typecheck, lint, build, and both desktop/mobile Playwright projects PASS; `git diff --check` reports no whitespace errors.

- [ ] **Step 5: Perform the final browser visual check**

At `http://127.0.0.1:4173/subjects/cit017/study`, inspect:

- light and dark theme;
- desktop width around 1280px and mobile widths 390px and 300px;
- timer modal idle, running, and break states;
- audio dialog with music and noise, expanded and retracted dock, and waveform seek interaction;
- notes dialog with General and topic notes, long text, saved status, and mobile keyboard-safe height;
- focus rings, Escape closing, focus restoration, and reduced-motion emulation.

Record screenshots only after all states are visually correct.

- [ ] **Step 6: Commit the verified integration**

```bash
git add tests/e2e/reviewer.spec.ts src
git commit -m "test: verify focus tools across devices"
```
