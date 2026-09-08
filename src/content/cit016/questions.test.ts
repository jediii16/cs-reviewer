import { describe, expect, it } from 'vitest';
import { cit016Subject } from './index';
import { cit016Questions, cit016TestSets } from './questions';

describe('CIT.016 practice questions', () => {
  it('covers every study section exactly once', () => {
    const sectionTitles = cit016Subject.topics.flatMap((topic) => (
      topic.sections.map((section) => section.title)
    ));

    expect(cit016TestSets).toHaveLength(5);
    expect(cit016Questions).toHaveLength(48);
    expect(cit016Questions.map((question) => question.concept)).toEqual(sectionTitles);
  });

  it('provides four distinct options and a valid answer for every question', () => {
    for (const question of cit016Questions) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options.map((option) => option.label)).size).toBe(4);
      expect(question.options.map((option) => option.id)).toContain(question.correctOptionId);
    }
  });
});
