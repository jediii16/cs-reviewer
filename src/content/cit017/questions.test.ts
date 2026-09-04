import { describe, expect, it } from 'vitest';
import { cit017Questions } from './questions';

describe('CIT.017 question bank', () => {
  it('contains the required scenario coverage', () => {
    expect(cit017Questions.filter((question) => question.topicId === 'threats')).toHaveLength(12);
    expect(cit017Questions.filter((question) => question.topicId === 'cia')).toHaveLength(9);
    expect(cit017Questions.filter((question) => question.topicId === 'principles')).toHaveLength(9);
    expect(cit017Questions.filter((question) => question.topicId === 'social')).toHaveLength(6);
  });

  it('uses unique ids and valid correct option references', () => {
    const ids = cit017Questions.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const question of cit017Questions) {
      expect(question.options.some((option) => option.id === question.correctOptionId)).toBe(true);
    }
  });
});
