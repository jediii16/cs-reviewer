# Focus Player and Blurting Notes Design

## Goal

Refine the browser-only CIT.017 reviewer with three calm, independent study tools:

- a more polished Pomodoro modal;
- a global music and background-noise player with a retracting bottom dock;
- locally autosaved Blurting Notes for retrieval practice.

The result should remain minimal, premium, mobile-friendly, and useful for studying rather than feeling like a game.

## Product boundaries

- Keep the current React and Vite application and all existing study, test, theme, timer, and audio behavior.
- Use only the audio files in `src/assets/audio`; future files added to the supported folders should continue to be discovered automatically.
- Store settings and notes in the browser. No account, backend, synchronization, or external streaming service is required.
- Music and background noise remain independent layers, so either or both can play.
- Do not autoplay audio after a refresh.

## App-level structure

The timer, player, and notes will be mounted from the app shell so they remain available and retain state while the student moves between routes.

- `FocusTimer` owns the timer trigger and timer modal only.
- A global audio controller owns the single music element and single noise element.
- `AudioPlayer` owns the music/noise panel and bottom playback dock.
- `BlurtingNotes` owns the notes trigger and editor panel.

The global audio controller will be shared rather than instantiated inside the timer. This prevents playback from restarting or diverging when one surface opens or closes.

## Pomodoro modal

The Sound section will be removed from the Pomodoro modal, making the timer smaller and more focused.

The central clock will become the main visual element:

- a larger progress ring with a soft layered halo;
- a restrained breathing animation only while the timer is running;
- smooth visual transitions between Focus and Break;
- a brief, calm completion ripple when a session reaches zero;
- clear Focus/Break status and tabular time typography;
- existing preset, start/pause, reset, and mode-switch controls.

Effects will use opacity, transforms, and gradients instead of heavy canvas animation. `prefers-reduced-motion` will disable breathing and ripple motion while preserving state changes.

The timer continues running when its modal is closed.

## Independent audio experience

### Opening and configuration

A Music control in the app header opens a dedicated audio panel. The panel contains:

- the music library and selected track;
- playlist repeat or one-track repeat, with playlist repeat as the default;
- music volume;
- background-noise selection, toggle, and separate volume;
- clear status when a folder is empty or a file cannot be played.

The panel is a centered dialog on desktop and a comfortable bottom sheet-like dialog on small screens. It is independent from the Pomodoro modal.

### Bottom dock

Once music has been selected or started, a slim dock is available at the bottom of every page.

On pointer-capable desktop devices:

- a subtle bottom handle/hot zone remains available when the dock is retracted;
- moving the pointer into the bottom zone, focusing a dock control, or clicking the handle expands it;
- it retracts after a short period of pointer and keyboard inactivity;
- it stays expanded while hovered, focused, or actively dragging the seek control.

On touch devices, a compact persistent pill is used because hover is unavailable. Tapping it expands the controls. The dock must never become inaccessible through hover-only behavior.

The dock includes:

- current track title and collection;
- previous track;
- play/pause;
- next track;
- restart from the beginning;
- playlist/one-track repeat control;
- elapsed and total time;
- music volume;
- a button to open the full audio panel.

There are no fixed skip-forward or skip-back buttons.

### Waveform seek control

The ordinary progress line is replaced with a compact waveform-style seek control. It uses deterministic visual bars with a played/unplayed fill treatment; it does not require expensive live frequency analysis.

The waveform is backed by an accessible range input:

- clicking or tapping anywhere seeks to that position;
- dragging allows continuous selection of any time in the track;
- keyboard arrow controls remain available;
- elapsed and duration labels update from the media element;
- seeking is disabled until duration metadata is available.

### Playback behavior

- Previous and next wrap through the playlist.
- Restart sets the current track time to zero without changing play/pause state.
- Playlist mode advances to the next track at the end and wraps after the final track.
- One-track mode repeats the current track.
- Noise always loops continuously.
- Music/noise volume, selected tracks, and music repeat mode remain persisted.
- Playback position and active playback do not resume automatically after reload.

The media engine will expose duration, current time, seeking, and playback events to the controller. Request guards will continue preventing stale `play()` promises from stopping a newer track.

## Blurting Notes

The feature will be named **Blurting Notes**, with a short explanation that blurting is a form of active recall: write everything remembered before checking the lesson.

A Notes control in the app header opens a focused editor panel. Notes are organized as:

- one General note;
- one note for each CIT.017 topic.

The editor includes only:

- a note selector;
- a plain multiline writing area;
- a lightweight word count;
- an autosaved/saved indicator;
- a Clear action with confirmation.

Notes autosave locally after a short typing debounce and restore on the next visit. They use a separate versioned local-storage record from quiz/study progress so resetting progress does not accidentally erase personal notes. Clearing notes is handled explicitly inside the notes panel.

This remains a plain-text scratchpad rather than a rich-text document editor. The last opened note is remembered for convenience.

## Visual language

- Reuse the existing Apple-like neutral palette, typography, spacing, borders, and translucent elevated surfaces.
- Use Lucide line icons with visible tooltips or text where meaning is not obvious.
- Reserve the accent color for active states, played waveform bars, and key actions.
- Keep motion subtle and functional; no confetti, streak counters, points, or game effects.
- Ensure the dock does not cover page controls by reserving safe bottom spacing when it is available.

## Accessibility and resilience

- Both dialogs use native dialog semantics, Escape handling, focus restoration, and labelled controls.
- The dock can be opened and operated with pointer, touch, or keyboard.
- The seek waveform exposes an accessible name and current value through its range input.
- Status changes use restrained live regions where useful and avoid announcing every playback tick.
- All controls meet practical touch-target sizing on mobile.
- Audio errors affect only the unavailable layer; studying, notes, and the timer continue working.
- Local-storage failures leave notes usable for the current session and do not crash the app.

## Data and persistence

The existing reviewer progress schema remains unchanged unless implementation reveals a genuinely persistent preference that is not already represented. Playback state, position, and dock expansion are intentionally transient.

Blurting notes use a separate record shaped around a version, note map, and last selected note. Topic IDs from the existing CIT.017 content are the stable note keys.

## Verification

Implementation will be test-driven and will cover:

- media duration, current-time updates, seek, restart, previous/next, and repeat behavior;
- stale playback request protection;
- independent simultaneous music and noise playback;
- dock reveal, inactivity retraction, keyboard focus, and touch behavior;
- Pomodoro running, closing, reopening, completion effect state, and reduced motion;
- notes validation, autosave, reload restoration, topic separation, and clearing;
- responsive light and dark rendering on study and test routes;
- production typecheck, lint, unit tests, build, and browser-level smoke tests.
