import { useCallback, useSyncExternalStore } from 'react';
import {
  defaultProgress,
  loadProgress,
  resetProgress,
  saveProgress,
  type ReviewerProgress,
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

  const reset = useCallback(() => {
    currentProgress = resetProgress();
    listeners.forEach((listener) => listener());
  }, []);

  return { progress, markTopicReviewed, recordResult, setTimerPreset, reset };
}
