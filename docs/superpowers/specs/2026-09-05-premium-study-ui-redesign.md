# Premium Study UI Redesign

## Goal

Redesign the existing CIT.017 browser reviewer so it feels minimal, calm, premium, and study-focused rather than game-like. Preserve all current learning content, quiz behavior, local progress, and responsive support.

## Visual direction

Use a quiet editorial product style called **Calm Studio**.

- Replace the navy-and-neon-lime palette with warm neutral light surfaces and charcoal dark surfaces.
- Use one restrained blue-violet accent for primary actions, selected states, and progress.
- Remove chunky icon tiles, exaggerated score treatments, heavy uppercase labeling, and playful visual cues.
- Prefer thin borders, restrained radii, minimal shadows, generous whitespace, and clear text hierarchy.
- Use Inter Variable, bundled locally, for clean interface and long-form reading typography.
- Keep content columns readable and avoid excessive heading sizes.
- Use Lucide line icons consistently at a restrained stroke weight. Icons must support text labels rather than replace ambiguous actions.

## Theme system

- Support complete light and dark themes across every route, modal, control, answer state, and McCumber visualization.
- Use the operating-system preference on first visit.
- Provide an accessible light/dark toggle in the app header and persist the explicit choice locally.
- Dark mode uses a dim base background and slightly brighter elevated surfaces rather than pure black.
- All normal text meets WCAG 2.2 AA contrast of at least 4.5:1; selected, correct, and incorrect states use both color and a visible icon or textual label.
- Set the browser `color-scheme` and theme color so native controls match the active appearance without a bright flash.

## App shell

- Keep a slim sticky header with the Study Desk wordmark on the left.
- On the right, show a compact theme toggle and one clear focus button: `Focus · 25:00` with a Timer icon.
- Remove timer setup and preset controls from the header.
- On the home route, keep the same shell so theme and focus controls remain discoverable.
- On mobile, preserve labels where space permits and collapse secondary words only at unusually narrow widths.

## Focus modal

- Clicking the focus button opens an accessible native dialog with a dimmed backdrop and elevated surface.
- The timer is the visual focus: large tabular digits, a quiet Focus/Break label, and a subtle progress ring or bar.
- Place 15, 25, and 45 minute presets in a compact segmented control.
- Provide Start/Pause as the primary action, with Reset and Focus/Break switching as secondary controls.
- Closing the modal does not stop or reset an active timer; the header continues showing the remaining time.
- Escape and backdrop interaction close the dialog, keyboard focus remains contained by native dialog behavior, and focus returns to the trigger.
- Preserve the current automatic transition from Focus to a paused five-minute break and from Break back to a paused focus session.

## Ambient focus sound

- Add an optional ambient sound section inside the focus modal.
- Offer `Off`, `Soft rain`, and `Brown noise`; default to Off.
- Generate sound locally with the Web Audio API. Do not stream, embed, or depend on copyrighted music.
- Audio starts only from an explicit user click to comply with browser autoplay policies.
- Include a labeled volume slider and an always-visible stop/off control.
- Persist the selected sound and volume, but never resume sound automatically after reload.
- If Web Audio is unavailable or fails, the timer continues normally and the UI returns safely to Off.

## Page redesign

### Home

- Use a restrained welcome heading and a compact subject row with BookOpen and ArrowRight icons.
- Keep the page sparse; no badges, gamification, or decorative illustration.

### Subject dashboard

- Present CIT.017, course progress, latest score, and Study/Test actions as a balanced grid of low-contrast surfaces.
- Use BookOpen for Study and ClipboardCheck for Test.
- Keep Reset progress visually secondary.

### Study

- Keep the topic navigation and active-recall flow, but reduce bright fills and use a quiet selected border/surface.
- Style note sections as editorial blocks with subtle semantic accents.
- Preserve the interactive McCumber Cube while adapting all faces and controls to both themes.

### Test

- Keep all 74 questions and every quiz format unchanged.
- Reduce visual noise in mode selection and answer options.
- Selected answers use a restrained accent; feedback uses calm success/error surfaces with icons and text.
- Results emphasize readable feedback and topic breakdown rather than a game-like score celebration.

## State and architecture

- Add a small appearance store/hook responsible for system preference, persisted override, and applying `data-theme` to the root element.
- Keep the timer state mounted in the header component so it survives modal open/close operations.
- Add an isolated ambient-audio engine plus hook. The engine owns AudioContext nodes and exposes start, stop, sound selection, volume, and cleanup.
- Extend the versioned local progress schema for appearance, ambient selection, and volume with safe migration from version 1 so existing scores and reviewed topics are retained.
- No backend, accounts, external audio service, analytics, or new navigation subsystem.

## Error handling

- Local storage failures fall back to safe defaults without blocking study.
- Unsupported Web Audio leaves ambient sound Off and announces that audio is unavailable.
- Dialog controls remain usable without audio.
- Theme initialization falls back to the system preference, then light when media queries are unavailable.

## Testing and verification

- Add tests first for progress-schema migration, theme selection/persistence, modal behavior, timer continuity, audio preference behavior, and unavailable-audio fallback.
- Preserve all existing content, study, quiz, timer, and browser tests.
- Add browser coverage for theme switching, focus dialog setup, modal close/reopen continuity, and mobile layout.
- Run unit/component tests, TypeScript, lint, production build, and desktop/mobile Playwright flows.
- Inspect live light and dark routes in the built-in browser, including Home, Study, Test, the focus modal, feedback states, and a narrow mobile viewport. Confirm no console errors, bright-theme flashes, clipping, or horizontal overflow.

## Research basis

- Apple Human Interface Guidelines: respect appearance preference, distinguish dark base and elevated surfaces, and verify legibility.
- WCAG 2.2: 4.5:1 minimum contrast for normal text and non-color indicators for meaningful state.
- Official Pomodoro web timer: a focused countdown, task controls, break state, volume, and saved settings.
- MDN Web Audio guidance: create or resume audio only in response to a user gesture.
- Inter: a screen-focused interface typeface with optical sizing and tabular-number support.

## Explicit exclusions

- No points, streaks, trophies, confetti, avatars, or game mechanics.
- No autoplaying audio.
- No copyrighted lo-fi stream or third-party player.
- No account system or cloud sync.
- No change to the source-faithful course material or question bank.
