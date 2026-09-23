import { describe, expect, it } from 'vitest';
import { cognate4Subject, cognate4Lessons } from '.';
import { cognate4CrosswordTerms } from './crossword';
import { cognate4TestSets } from './questions';
import { subjects } from '../subjects';

const expectedLessonIds = [
  'cognate4-introduction',
  'cognate4-introduction-extension',
  'cognate4-working-with-images',
  'cognate4-bitwise-operations',
  'cognate4-grayscale-methods',
];

describe('COGNATE4 content', () => {
  it('keeps all five supplied lessons in source order', () => {
    expect(cognate4Subject.code).toBe('COGNATE4');
    expect(cognate4Subject.title).toBe('Machine Vision');
    expect(cognate4Lessons.map((lesson) => lesson.id)).toEqual(expectedLessonIds);
    expect(cognate4Subject.topics.map((topic) => topic.id)).toEqual(expectedLessonIds);
  });

  it('uses globally unique topic IDs so progress cannot leak between subjects', () => {
    const topicIds = subjects.flatMap((subject) => subject.topics.map((topic) => topic.id));
    expect(new Set(topicIds).size).toBe(topicIds.length);
  });

  it('defines a digital image using finite, discrete coordinates and intensities', () => {
    const lesson = cognate4Subject.topics.find((topic) => topic.id === 'cognate4-introduction');
    expect(JSON.stringify(lesson)).toMatch(/finite, discrete/i);
    const question = cognate4TestSets
      .flatMap((set) => set.questions)
      .find((item) => item.id.endsWith('digital-condition'));
    const correctOption = question?.options.find((option) => option.id === question.correctOptionId);
    expect(correctOption?.label).toMatch(/finite, discrete/i);
    expect(question?.explanation).toMatch(/finite, discrete/i);
  });

  it('provides a substantial multiple-choice bank for every lesson', () => {
    const minimumQuestions: Record<string, number> = {
      'cognate4-introduction': 30,
      'cognate4-introduction-extension': 28,
      'cognate4-working-with-images': 22,
      'cognate4-bitwise-operations': 20,
      'cognate4-grayscale-methods': 18,
    };

    expect(cognate4TestSets.map((set) => set.topicId)).toEqual(expectedLessonIds);
    for (const set of cognate4TestSets) {
      expect(set.questions.length, set.title).toBeGreaterThanOrEqual(minimumQuestions[set.topicId]);
      expect(set.questionLimit).toBeUndefined();
      for (const question of set.questions) {
        expect(question.topicId).toBe(set.topicId);
        expect(question.options).toHaveLength(4);
        expect(question.options.some((option) => option.id === question.correctOptionId)).toBe(true);
        expect(question.explanation.trim().length).toBeGreaterThan(10);
      }
    }
  });

  it('provides crossword-ready key terms for every lesson without duplicate identities', () => {
    const minimumTerms: Record<string, number> = {
      'cognate4-introduction': 14,
      'cognate4-introduction-extension': 14,
      'cognate4-working-with-images': 12,
      'cognate4-bitwise-operations': 12,
      'cognate4-grayscale-methods': 8,
    };
    const ids = cognate4CrosswordTerms.map((term) => term.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const lessonId of expectedLessonIds) {
      const terms = cognate4CrosswordTerms.filter((term) => term.module === lessonId);
      expect(terms.length, lessonId).toBeGreaterThanOrEqual(minimumTerms[lessonId]);
      for (const term of terms) {
        expect(term.answer.replace(/[^A-Za-z]/g, '').length).toBeGreaterThanOrEqual(3);
        expect(term.clue.trim().length).toBeGreaterThan(10);
      }
    }

    expect(cognate4CrosswordTerms.some((term) => term.answer === 'Image Origin')).toBe(true);
    expect(cognate4CrosswordTerms.some((term) => term.answer === 'Upper Left')).toBe(false);
  });
});
