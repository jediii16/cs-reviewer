import { useEffect, useReducer } from 'react';
import { useProgress } from '../progress/useProgress';
import { timerReducer, type FocusPreset } from './timerMachine';

export function useFocusTimer() {
  const { progress, setTimerPreset } = useProgress();
  const [state, dispatch] = useReducer(timerReducer, progress.timerPresetMinutes, (preset) => ({
    mode: 'focus' as const,
    remainingSeconds: preset * 60,
    presetMinutes: preset,
    running: false,
    completedSessions: 0,
    completionEffect: false,
  }));

  useEffect(() => {
    if (!state.running) return undefined;
    const interval = window.setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => window.clearInterval(interval);
  }, [state.running]);

  function selectPreset(minutes: FocusPreset) {
    setTimerPreset(minutes);
    dispatch({ type: 'selectPreset', minutes });
  }

  return { state, dispatch, selectPreset };
}
