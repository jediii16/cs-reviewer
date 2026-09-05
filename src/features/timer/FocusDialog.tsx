import type { CSSProperties, Dispatch, MouseEvent } from 'react';
import { useEffect, useRef } from 'react';
import { Coffee, Pause, Play, RotateCcw, X } from 'lucide-react';
import type { FocusPreset, TimerAction, TimerState } from './timerMachine';

const presets: FocusPreset[] = [15, 25, 45];

export interface FocusDialogProps {
  state: TimerState;
  dispatch: Dispatch<TimerAction>;
  selectPreset: (minutes: FocusPreset) => void;
  onClose: () => void;
  completionEffect?: boolean;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remainder = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
}

export function FocusDialog({ state, dispatch, selectPreset, onClose, completionEffect = false }: FocusDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const totalSeconds = state.mode === 'focus' ? state.presetMinutes * 60 : 5 * 60;
  const elapsedRatio = Math.min(1, Math.max(0, (totalSeconds - state.remainingSeconds) / totalSeconds));
  const timerStyle = { '--timer-progress': `${elapsedRatio * 360}deg` } as CSSProperties;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    if (!dialog.open) dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  function closeFromBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="focus-dialog"
      aria-labelledby="focus-dialog-title"
      onClick={closeFromBackdrop}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="focus-dialog-panel">
        <header className="focus-dialog-header">
          <div>
            <h2 id="focus-dialog-title">Focus</h2>
            <p>Settle in and give one thing your full attention.</p>
          </div>
          <button className="icon-button" type="button" aria-label="Close focus timer" onClick={onClose}>
            <X aria-hidden="true" />
          </button>
        </header>

        <div className="focus-mode-switch" aria-label="Timer mode">
          <button type="button" aria-pressed={state.mode === 'focus'} onClick={() => dispatch({ type: 'switchMode', mode: 'focus' })}>Focus</button>
          <button type="button" aria-pressed={state.mode === 'break'} onClick={() => dispatch({ type: 'switchMode', mode: 'break' })}>Break</button>
        </div>

        <div
          className={`focus-dialog-clock is-${state.mode}${state.running ? ' is-running' : ''}`}
          style={timerStyle}
        >
          <div className="focus-dialog-clock-inner">
            <span>{state.mode === 'focus' ? 'Focus' : 'Break'}</span>
            <strong className="focus-dialog-time" aria-live="off">{formatTime(state.remainingSeconds)}</strong>
            <small>{state.running ? 'Session in progress' : 'Ready when you are'}</small>
          </div>
          {completionEffect ? <span className="focus-completion-ripple" aria-hidden="true" /> : null}
        </div>

        <div className="focus-presets" aria-label="Focus length">
          {presets.map((minutes) => (
            <button
              key={minutes}
              type="button"
              aria-label={`${minutes} minutes`}
              aria-pressed={state.mode === 'focus' && state.presetMinutes === minutes}
              onClick={() => selectPreset(minutes)}
            >
              {minutes} min
            </button>
          ))}
        </div>

        <div className="focus-primary-actions">
          <button className="primary-button" type="button" onClick={() => dispatch({ type: 'toggle' })}>
            {state.running ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
            {state.running ? 'Pause' : 'Start'}
          </button>
          <button className="secondary-button" type="button" onClick={() => dispatch({ type: 'reset' })}>
            <RotateCcw aria-hidden="true" /> Reset
          </button>
          <button className="secondary-button" type="button" onClick={() => dispatch({ type: 'switchMode', mode: state.mode === 'focus' ? 'break' : 'focus' })}>
            <Coffee aria-hidden="true" />
            {state.mode === 'focus' ? 'Take a break' : 'Back to focus'}
          </button>
        </div>

        {state.running ? <p className="focus-running-note">You can close this window—the timer will keep running.</p> : null}
      </div>
    </dialog>
  );
}
