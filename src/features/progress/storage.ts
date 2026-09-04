export interface TestResultSummary {
  completedAt: string;
  correct: number;
  total: number;
}

export type AppearancePreference = 'system' | 'light' | 'dark';
export type AmbientSound = 'off' | 'rain' | 'brown-noise';

export interface ReviewerProgress {
  version: 2;
  reviewedTopicIds: string[];
  recentResults: TestResultSummary[];
  timerPresetMinutes: 15 | 25 | 45;
  appearance: AppearancePreference;
  ambientSound: AmbientSound;
  ambientVolume: number;
}

interface LegacyReviewerProgress {
  version: 1;
  reviewedTopicIds: string[];
  recentResults: TestResultSummary[];
  timerPresetMinutes: 15 | 25 | 45;
}

export const progressStorageKey = 'cit017-reviewer-progress';

export const defaultProgress: ReviewerProgress = {
  version: 2,
  reviewedTopicIds: [],
  recentResults: [],
  timerPresetMinutes: 25,
  appearance: 'system',
  ambientSound: 'off',
  ambientVolume: 0.22,
};

function getDefaultStorage(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

function isResult(value: unknown): value is TestResultSummary {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return typeof item.completedAt === 'string' && typeof item.correct === 'number' && typeof item.total === 'number';
}

function hasValidStudyData(item: Record<string, unknown>) {
  return Array.isArray(item.reviewedTopicIds)
    && item.reviewedTopicIds.every((id) => typeof id === 'string')
    && Array.isArray(item.recentResults)
    && item.recentResults.every(isResult)
    && [15, 25, 45].includes(item.timerPresetMinutes as number);
}

function isLegacyProgress(value: unknown): value is LegacyReviewerProgress {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return item.version === 1 && hasValidStudyData(item);
}

function isProgress(value: unknown): value is ReviewerProgress {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return item.version === 2
    && hasValidStudyData(item)
    && ['system', 'light', 'dark'].includes(item.appearance as string)
    && ['off', 'rain', 'brown-noise'].includes(item.ambientSound as string)
    && typeof item.ambientVolume === 'number'
    && Number.isFinite(item.ambientVolume)
    && item.ambientVolume >= 0
    && item.ambientVolume <= 1;
}

function cloneProgress(progress: ReviewerProgress): ReviewerProgress {
  return {
    ...progress,
    reviewedTopicIds: [...progress.reviewedTopicIds],
    recentResults: [...progress.recentResults],
  };
}

function migrateVersionOne(progress: LegacyReviewerProgress): ReviewerProgress {
  return {
    ...progress,
    version: 2,
    reviewedTopicIds: [...progress.reviewedTopicIds],
    recentResults: [...progress.recentResults],
    appearance: 'system',
    ambientSound: 'off',
    ambientVolume: 0.22,
  };
}

export function loadProgress(storage = getDefaultStorage()): ReviewerProgress {
  if (!storage) return { ...defaultProgress };
  try {
    const raw = storage.getItem(progressStorageKey);
    if (!raw) return { ...defaultProgress };
    const parsed: unknown = JSON.parse(raw);
    if (isProgress(parsed)) return cloneProgress(parsed);
    if (isLegacyProgress(parsed)) return migrateVersionOne(parsed);
    return cloneProgress(defaultProgress);
  } catch {
    return cloneProgress(defaultProgress);
  }
}

export function saveProgress(progress: ReviewerProgress, storage = getDefaultStorage()): void {
  if (!storage) return;
  try {
    storage.setItem(progressStorageKey, JSON.stringify({
      ...progress,
      recentResults: progress.recentResults.slice(0, 5),
    }));
  } catch {
    // Studying must continue even when storage is unavailable or full.
  }
}

export function resetProgress(storage = getDefaultStorage()): ReviewerProgress {
  if (storage) {
    try { storage.removeItem(progressStorageKey); } catch { /* continue with defaults */ }
  }
  return cloneProgress(defaultProgress);
}
