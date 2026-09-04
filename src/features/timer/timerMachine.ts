export type TimerMode = 'focus' | 'break';
export type FocusPreset = 15 | 25 | 45;

export interface TimerState {
  mode: TimerMode;
  remainingSeconds: number;
  presetMinutes: FocusPreset;
  running: boolean;
}

export type TimerAction =
  | { type: 'tick' }
  | { type: 'toggle' }
  | { type: 'reset' }
  | { type: 'switchMode'; mode: TimerMode }
  | { type: 'selectPreset'; minutes: FocusPreset };

export const initialTimerState: TimerState = {
  mode: 'focus',
  remainingSeconds: 25 * 60,
  presetMinutes: 25,
  running: false,
};

export function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'tick':
      if (!state.running) return state;
      if (state.remainingSeconds > 1) {
        return { ...state, remainingSeconds: state.remainingSeconds - 1 };
      }
      return state.mode === 'focus'
        ? { ...state, mode: 'break', remainingSeconds: 5 * 60, running: false }
        : { ...state, mode: 'focus', remainingSeconds: state.presetMinutes * 60, running: false };
    case 'toggle':
      return { ...state, running: !state.running };
    case 'reset':
      return {
        ...state,
        remainingSeconds: state.mode === 'focus' ? state.presetMinutes * 60 : 5 * 60,
        running: false,
      };
    case 'switchMode':
      return {
        ...state,
        mode: action.mode,
        remainingSeconds: action.mode === 'focus' ? state.presetMinutes * 60 : 5 * 60,
        running: false,
      };
    case 'selectPreset':
      return {
        mode: 'focus',
        remainingSeconds: action.minutes * 60,
        presetMinutes: action.minutes,
        running: false,
      };
  }
}
