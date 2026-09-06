import { useCallback, useSyncExternalStore } from 'react';
import {
  defaultProgress,
  loadProgress,
  resetProgress,
  saveProgress,
  type ReviewerProgress,
  type AppearancePreference,
  type MusicLoopMode,
  type TestResultSummary,
} from './storage';

let currentProgress: ReviewerProgress = typeof window === 'undefined' ? defaultProgress : loadProgress();
const listeners = new Set<() => void>();

function emit(next: ReviewerProgress) {
  currentProgress = next;
  saveProgress(next);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useProgress() {
  const progress = useSyncExternalStore(subscribe, () => currentProgress, () => defaultProgress);

  const markTopicReviewed = useCallback((topicId: string) => {
    if (currentProgress.reviewedTopicIds.includes(topicId)) return;
    emit({
      ...currentProgress,
      reviewedTopicIds: [...currentProgress.reviewedTopicIds, topicId],
    });
  }, []);

  const recordResult = useCallback((result: TestResultSummary) => {
    emit({ ...currentProgress, recentResults: [result, ...currentProgress.recentResults].slice(0, 5) });
  }, []);

  const setTimerPreset = useCallback((minutes: 15 | 25 | 45) => {
    emit({ ...currentProgress, timerPresetMinutes: minutes });
  }, []);

  const setAppearance = useCallback((appearance: AppearancePreference) => {
    emit({ ...currentProgress, appearance });
  }, []);

  const setMusicTrackId = useCallback((musicTrackId: string | null) => {
    emit({ ...currentProgress, musicTrackId });
  }, []);

  const setMusicLoopMode = useCallback((musicLoopMode: MusicLoopMode) => {
    emit({ ...currentProgress, musicLoopMode });
  }, []);

  const setMusicVolume = useCallback((musicVolume: number) => {
    emit({ ...currentProgress, musicVolume: Math.min(1, Math.max(0, musicVolume)) });
  }, []);

  const setNoiseTrackId = useCallback((noiseTrackId: string | null) => {
    emit({ ...currentProgress, noiseTrackId });
  }, []);

  const setNoiseVolume = useCallback((noiseVolume: number) => {
    emit({ ...currentProgress, noiseVolume: Math.min(1, Math.max(0, noiseVolume)) });
  }, []);

  const reset = useCallback(() => {
    currentProgress = resetProgress();
    listeners.forEach((listener) => listener());
  }, []);

  const resetSubject = useCallback((subjectId: string, topicIds: readonly string[]) => {
    const topicIdSet = new Set(topicIds);
    emit({
      ...currentProgress,
      reviewedTopicIds: currentProgress.reviewedTopicIds.filter((id) => !topicIdSet.has(id)),
      recentResults: currentProgress.recentResults.filter((result) => (
        result.subjectId ? result.subjectId !== subjectId : subjectId !== 'cit017'
      )),
    });
  }, []);

  return {
    progress,
    markTopicReviewed,
    recordResult,
    setTimerPreset,
    setAppearance,
    setMusicTrackId,
    setMusicLoopMode,
    setMusicVolume,
    setNoiseTrackId,
    setNoiseVolume,
    reset,
    resetSubject,
  };
}
