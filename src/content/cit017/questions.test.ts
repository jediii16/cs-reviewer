import { describe, expect, it } from 'vitest';
import { cit017Questions } from './questions';

describe('CIT.017 question bank', () => {
  it('keeps the scenario bank and adds every requested test format to each topic', () => {
    for (const topicId of ['threats', 'cia', 'principles', 'social'] as const) {
      const topicQuestions = cit017Questions.filter((question) => question.topicId === topicId);
      expect(topicQuestions.length).toBeGreaterThanOrEqual(12);
      expect(new Set(topicQuestions.map((question) => question.kind))).toEqual(
        new Set(['multiple-choice', 'identification', 'true-false']),
      );
    }
  });

  it('uses unique ids and valid answer definitions', () => {
    const ids = cit017Questions.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const question of cit017Questions) {
      if (question.kind === 'multiple-choice') {
        expect(question.options.some((option) => option.id === question.correctOptionId)).toBe(true);
      } else if (question.kind === 'identification') {
        expect(question.acceptableAnswers.length).toBeGreaterThan(0);
      } else {
        expect(typeof question.correctAnswer).toBe('boolean');
      }
    }
  });
});
