import { Pause, Play, RotateCcw } from 'lucide-react';
import { useFocusTimer } from './useFocusTimer';
import type { FocusPreset } from './timerMachine';

const presets: FocusPreset[] = [15, 25, 45];

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remainder = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
}

export function FocusTimer() {
  const { state, dispatch, selectPreset } = useFocusTimer();

  return (
    <aside className="focus-timer" aria-label="Focus timer">
      <div className="timer-readout">
        <span>{state.mode === 'focus' ? 'Focus' : 'Break'}</span>
        <strong aria-live="off">{formatTime(state.remainingSeconds)}</strong>
      </div>
      <div className="timer-controls">
        <button type="button" onClick={() => dispatch({ type: 'toggle' })}>
          {state.running ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          {state.running ? 'Pause' : 'Start'}
        </button>
        <button type="button" aria-label="Reset timer" onClick={() => dispatch({ type: 'reset' })}>
          <RotateCcw aria-hidden="true" />
        </button>
      </div>
      <div className="timer-presets" aria-label="Focus length">
        {presets.map((minutes) => (
          <button
            key={minutes}
            type="button"
            aria-label={`${minutes} minutes`}
            aria-pressed={state.mode === 'focus' && state.presetMinutes === minutes}
            onClick={() => selectPreset(minutes)}
          >
            {minutes}
          </button>
        ))}
        <button
          type="button"
          aria-label="5 minute break"
          aria-pressed={state.mode === 'break'}
          onClick={() => dispatch({ type: 'switchMode', mode: 'break' })}
        >
          Break
        </button>
      </div>
    </aside>
  );
}
