import { beforeEach, describe, expect, it } from 'vitest';
import {
  defaultProgress,
  loadProgress,
  progressStorageKey,
  saveProgress,
} from './storage';

describe('reviewer progress storage', () => {
  beforeEach(() => localStorage.clear());

  it('returns clean defaults when persisted JSON is malformed', () => {
    localStorage.setItem('cit017-reviewer-progress', '{bad json');

    expect(loadProgress()).toEqual(defaultProgress);
  });

  it('returns clean defaults for an unsupported storage version', () => {
    localStorage.setItem('cit017-reviewer-progress', JSON.stringify({ version: 99 }));

    expect(loadProgress()).toEqual(defaultProgress);
  });

  it('migrates version 1 progress without losing study data', () => {
    localStorage.setItem(progressStorageKey, JSON.stringify({
      version: 1,
      reviewedTopicIds: ['foundations'],
      recentResults: [{ completedAt: '2026-09-04T12:00:00.000Z', correct: 8, total: 10 }],
      timerPresetMinutes: 45,
    }));

    expect(loadProgress()).toMatchObject({
      version: 2,
      reviewedTopicIds: ['foundations'],
      recentResults: [{ completedAt: '2026-09-04T12:00:00.000Z', correct: 8, total: 10 }],
      timerPresetMinutes: 45,
      appearance: 'system',
      ambientSound: 'off',
      ambientVolume: 0.22,
    });
  });

  it('rejects invalid version 2 preferences', () => {
    localStorage.setItem(progressStorageKey, JSON.stringify({
      ...defaultProgress,
      appearance: 'sepia',
      ambientVolume: 4,
    }));

    expect(loadProgress()).toEqual(defaultProgress);
  });

  it('round-trips reviewed topics and recent results', () => {
    const progress = {
      ...defaultProgress,
      reviewedTopicIds: ['foundations'],
      recentResults: [{ completedAt: '2026-09-04T12:00:00.000Z', correct: 8, total: 10 }],
    };

    saveProgress(progress);

    expect(loadProgress()).toEqual(progress);
  });
});
