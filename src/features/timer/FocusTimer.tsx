import { useRef, useState } from 'react';
import { Timer } from 'lucide-react';
import { useAmbientAudio } from '../audio/useAmbientAudio';
import { FocusDialog } from './FocusDialog';
import { useFocusTimer } from './useFocusTimer';

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remainder = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
}

export function FocusTimer() {
  const { state, dispatch, selectPreset } = useFocusTimer();
  const ambient = useAmbientAudio();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modeLabel = state.mode === 'focus' ? 'Focus' : 'Break';
  const runningLabel = state.running ? 'running ' : '';

  function closeDialog() {
    setOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }

  return (
    <div className="focus-timer">
      <button
        ref={triggerRef}
        className="focus-trigger"
        type="button"
        aria-label={`Open focus timer, ${runningLabel}${modeLabel}, ${formatTime(state.remainingSeconds)}`}
        onClick={() => setOpen(true)}
      >
        <Timer aria-hidden="true" />
        <span>{modeLabel}</span>
        <span aria-hidden="true">·</span>
        <strong>{formatTime(state.remainingSeconds)}</strong>
      </button>
      {open ? (
        <FocusDialog
          state={state}
          dispatch={dispatch}
          selectPreset={selectPreset}
          onClose={closeDialog}
          ambient={ambient}
        />
      ) : null}
    </div>
  );
}
