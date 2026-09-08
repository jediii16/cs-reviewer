import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useProgress } from './useProgress';

describe('useProgress subject history', () => {
  it('retains five recent scores for each subject independently', () => {
    const { result } = renderHook(() => useProgress());
    act(() => result.current.reset());

    act(() => {
      for (let index = 0; index < 6; index += 1) {
        result.current.recordResult({
          subjectId: 'cit017',
          completedAt: `2026-09-06T00:0${index}:00.000Z`,
          correct: index,
          total: 10,
        });
      }
      result.current.recordResult({
        subjectId: 'cit016',
        completedAt: '2026-09-06T01:00:00.000Z',
        correct: 8,
        total: 10,
      });
    });

    expect(result.current.progress.recentResults.filter((item) => item.subjectId === 'cit017')).toHaveLength(5);
    expect(result.current.progress.recentResults.filter((item) => item.subjectId === 'cit016')).toHaveLength(1);

    act(() => result.current.reset());
  });
});
