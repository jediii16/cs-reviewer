import { describe, expect, it } from 'vitest';
import { initialTimerState, timerReducer } from './timerMachine';

describe('timerReducer', () => {
  it('moves from an expired focus session to a five-minute break', () => {
    const state = { mode: 'focus', remainingSeconds: 1, presetMinutes: 25, running: true } as const;

    expect(timerReducer(state, { type: 'tick' })).toEqual({
      mode: 'break',
      remainingSeconds: 300,
      presetMinutes: 25,
      running: false,
    });
  });

  it('resets to the selected focus preset', () => {
    const changed = timerReducer(initialTimerState, { type: 'selectPreset', minutes: 45 });

    expect(changed).toEqual({
      mode: 'focus',
      remainingSeconds: 2700,
      presetMinutes: 45,
      running: false,
    });
  });
});
