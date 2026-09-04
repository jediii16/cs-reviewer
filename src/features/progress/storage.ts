export interface TestResultSummary {
  completedAt: string;
  correct: number;
  total: number;
}

export interface ReviewerProgress {
  version: 1;
  reviewedTopicIds: string[];
  recentResults: TestResultSummary[];
  timerPresetMinutes: 15 | 25 | 45;
}

export const progressStorageKey = 'cit017-reviewer-progress';

export const defaultProgress: ReviewerProgress = {
  version: 1,
  reviewedTopicIds: [],
  recentResults: [],
  timerPresetMinutes: 25,
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

function isProgress(value: unknown): value is ReviewerProgress {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return item.version === 1
    && Array.isArray(item.reviewedTopicIds)
    && item.reviewedTopicIds.every((id) => typeof id === 'string')
    && Array.isArray(item.recentResults)
    && item.recentResults.every(isResult)
    && [15, 25, 45].includes(item.timerPresetMinutes as number);
}

export function loadProgress(storage = getDefaultStorage()): ReviewerProgress {
  if (!storage) return { ...defaultProgress };
  try {
    const raw = storage.getItem(progressStorageKey);
    if (!raw) return { ...defaultProgress };
    const parsed: unknown = JSON.parse(raw);
    return isProgress(parsed)
      ? { ...parsed, reviewedTopicIds: [...parsed.reviewedTopicIds], recentResults: [...parsed.recentResults] }
      : { ...defaultProgress };
  } catch {
    return { ...defaultProgress };
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
  return { ...defaultProgress };
}
