export interface TestResultSummary {
  subjectId?: string;
  completedAt: string;
  correct: number;
  total: number;
}

export type AppearancePreference = 'system' | 'light' | 'dark';
export type MusicLoopMode = 'playlist' | 'track';

export interface ReviewerProgress {
  version: 3;
  reviewedTopicIds: string[];
  recentResults: TestResultSummary[];
  timerPresetMinutes: 15 | 25 | 45;
  appearance: AppearancePreference;
  musicTrackId: string | null;
  musicLoopMode: MusicLoopMode;
  musicVolume: number;
  noiseTrackId: string | null;
  noiseVolume: number;
}

interface LegacyReviewerProgress {
  version: 1;
  reviewedTopicIds: string[];
  recentResults: TestResultSummary[];
  timerPresetMinutes: 15 | 25 | 45;
}

interface VersionTwoReviewerProgress {
  version: 2;
  reviewedTopicIds: string[];
  recentResults: TestResultSummary[];
  timerPresetMinutes: 15 | 25 | 45;
  appearance: AppearancePreference;
  ambientSound: 'off' | 'rain' | 'brown-noise';
  ambientVolume: number;
}

export const progressStorageKey = 'cit017-reviewer-progress';

export const defaultProgress: ReviewerProgress = {
  version: 3,
  reviewedTopicIds: [],
  recentResults: [],
  timerPresetMinutes: 25,
  appearance: 'system',
  musicTrackId: null,
  musicLoopMode: 'playlist',
  musicVolume: 0.28,
  noiseTrackId: null,
  noiseVolume: 0.22,
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
  return (item.subjectId === undefined || typeof item.subjectId === 'string')
    && typeof item.completedAt === 'string'
    && typeof item.correct === 'number'
    && typeof item.total === 'number';
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

function isVersionTwoProgress(value: unknown): value is VersionTwoReviewerProgress {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return item.version === 2
    && hasValidStudyData(item)
    && ['system', 'light', 'dark'].includes(item.appearance as string)
    && ['off', 'rain', 'brown-noise'].includes(item.ambientSound as string)
    && isVolume(item.ambientVolume);
}

function isVolume(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1;
}

function isProgress(value: unknown): value is ReviewerProgress {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return item.version === 3
    && hasValidStudyData(item)
    && ['system', 'light', 'dark'].includes(item.appearance as string)
    && (item.musicTrackId === null || typeof item.musicTrackId === 'string')
    && ['playlist', 'track'].includes(item.musicLoopMode as string)
    && isVolume(item.musicVolume)
    && (item.noiseTrackId === null || typeof item.noiseTrackId === 'string')
    && isVolume(item.noiseVolume);
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
    version: 3,
    reviewedTopicIds: [...progress.reviewedTopicIds],
    recentResults: [...progress.recentResults],
    appearance: 'system',
    musicTrackId: null,
    musicLoopMode: 'playlist',
    musicVolume: 0.28,
    noiseTrackId: null,
    noiseVolume: 0.22,
  };
}

function migrateVersionTwo(progress: VersionTwoReviewerProgress): ReviewerProgress {
  return {
    version: 3,
    reviewedTopicIds: [...progress.reviewedTopicIds],
    recentResults: [...progress.recentResults],
    timerPresetMinutes: progress.timerPresetMinutes,
    appearance: progress.appearance,
    musicTrackId: null,
    musicLoopMode: 'playlist',
    musicVolume: 0.28,
    noiseTrackId: progress.ambientSound === 'off' ? null : progress.ambientSound,
    noiseVolume: progress.ambientVolume,
  };
}

export function loadProgress(storage = getDefaultStorage()): ReviewerProgress {
  if (!storage) return { ...defaultProgress };
  try {
    const raw = storage.getItem(progressStorageKey);
    if (!raw) return { ...defaultProgress };
    const parsed: unknown = JSON.parse(raw);
    if (isProgress(parsed)) return cloneProgress(parsed);
    if (isVersionTwoProgress(parsed)) return migrateVersionTwo(parsed);
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
