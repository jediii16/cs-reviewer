import { describe, expect, it } from 'vitest';
import { initialTimerState, timerReducer } from './timerMachine';

describe('timerReducer', () => {
  it('moves from an expired focus session to a five-minute break', () => {
    const state = {
      mode: 'focus',
      remainingSeconds: 1,
      presetMinutes: 25,
      running: true,
      completedSessions: 2,
      completionEffect: false,
    } as const;

    expect(timerReducer(state, { type: 'tick' })).toEqual({
      mode: 'break',
      remainingSeconds: 300,
      presetMinutes: 25,
      running: false,
      completedSessions: 3,
      completionEffect: true,
    });
  });

  it('resets to the selected focus preset', () => {
    const changed = timerReducer(initialTimerState, { type: 'selectPreset', minutes: 45 });

    expect(changed).toEqual({
      mode: 'focus',
      remainingSeconds: 2700,
      presetMinutes: 45,
      running: false,
      completedSessions: 0,
      completionEffect: false,
    });
  });

  it('dismisses a completion effect without changing the next timer mode', () => {
    const completed = {
      ...initialTimerState,
      mode: 'break' as const,
      remainingSeconds: 300,
      completedSessions: 1,
      completionEffect: true,
    };

    expect(timerReducer(completed, { type: 'dismissCompletion' })).toEqual({
      ...completed,
      completionEffect: false,
    });
  });
});
