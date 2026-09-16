import { describe, expect, it } from 'vitest';
import { getSubject, getSubjectTests } from './subjects';

describe('CIT.015 Operating Systems exam content', () => {
  it('provides exhaustive focused banks and one balanced 20-item comprehensive exam', () => {
    const subject = getSubject('cit015');
    const tests = getSubjectTests('cit015');

    expect(subject?.code).toBe('CIT.015');
    expect(subject?.reviewModes).toEqual(['test']);
    expect(subject?.topics.map((topic) => topic.id)).toEqual([
      'os-introduction',
      'process-management',
      'memory-management',
    ]);
    expect(tests?.sets.map((set) => [set.id, set.questions.length, set.questionLimit])).toEqual([
      ['cit015-os-introduction', 40, undefined],
      ['cit015-process-management', 47, undefined],
      ['cit015-memory-management', 36, undefined],
      ['cit015-comprehensive', 123, 20],
    ]);
    expect(tests?.sets.at(-1)?.balanceTopics).toBe(true);
  });

  it('keeps every question valid, unique, and traceable to one supplied topic', () => {
    const sets = getSubjectTests('cit015')?.sets ?? [];
    const focused = sets.slice(0, 3).flatMap((set) => set.questions);

    expect(new Set(focused.map((question) => question.id)).size).toBe(123);
    expect(focused.every((question) => question.options.length === 4)).toBe(true);
    expect(focused.every((question) => (
      question.options.some((option) => option.id === question.correctOptionId)
      && question.explanation.trim().length > 0
    ))).toBe(true);
    expect(focused.map((question) => question.concept)).toEqual(expect.arrayContaining([
      'Hardware Abstraction',
      'Real-Time Operating System',
      'Graphical User Interface',
      'Process Control Block',
      'Context Switch',
      'Round Robin Scheduling',
      'Memory Management Unit',
      'Dynamic Loading',
      'Segmentation Map Table',
    ]));
  });
});
