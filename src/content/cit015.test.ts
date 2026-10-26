import { describe, expect, it } from 'vitest';
import { getSubject, getSubjectTests, subjects } from './subjects';
import { createQuiz } from '../features/test/quizEngine';
import { createSeededRandom } from '../lib/seededRandom';

const tests = getSubjectTests('cit015')!;
const focused = tests.sets.slice(0, 4).flatMap((set) => set.questions);

describe('Operating Systems finals syllabus', () => {
  it('registers only the supplied finals lessons and retires every old subject', () => {
    expect(subjects.map((subject) => subject.id)).toEqual(['cit015']);
    expect(getSubject('cit015')?.topics.map((topic) => topic.id)).toEqual(['finals-concurrent-processing', 'finals-file-disk-management']);
    for (const id of ['cit016', 'cit017', 'cs412', 'cognate4']) {
      expect(getSubject(id)).toBeUndefined();
      expect(getSubjectTests(id)).toBeUndefined();
    }
    expect(getSubject('cit015')?.topics.every((topic) => topic.sections.length > 0 && topic.sections.every((section) => section.source))).toBe(true);
  });
  it('provides focused MC and true-or-false banks with unique, source-traceable questions', () => {
    expect(tests.sets.slice(0, 4).map((set) => set.questions.length)).toEqual([24, 16, 30, 20]);
    expect(new Set(focused.map((q) => q.id)).size).toBe(90);
    for (const question of focused) {
      expect(question.options).toHaveLength(question.kind === 'true-false' ? 2 : 4);
      expect(new Set(question.options.map((option) => option.label)).size).toBe(question.options.length);
      expect(question.options.filter((option) => option.id === question.correctOptionId)).toHaveLength(1);
      expect(question.explanation.length).toBeGreaterThan(15);
      expect(question.source).toMatch(/slide \d+/);
    }
    for (const set of tests.sets.filter((set) => set.questions.every((q) => q.kind === 'true-false'))) {
      const labels = set.questions.map((q) => q.options.find((option) => option.id === q.correctOptionId)?.label);
      expect(labels).toContain('True');
      expect(labels).toContain('False');
    }
  });
  it('samples five questions of each format from each lesson in a changing mixed review', () => {
    const set = tests.sets.at(-1)!;
    const quizzes = [1, 2, 3].map((seed) => createQuiz(set.questions, createSeededRandom(seed), {
      limit: set.questionLimit, balanceByTopic: set.balanceTopics, balanceByKind: set.balanceKinds,
    }));
    for (const quiz of quizzes) {
      expect(quiz).toHaveLength(20);
      for (const topic of getSubject('cit015')!.topics) {
        for (const kind of ['multiple-choice', 'true-false']) {
          expect(quiz.filter((q) => q.topicId === topic.id && q.kind === kind)).toHaveLength(5);
        }
      }
      for (const question of quiz.filter((q) => q.kind === 'true-false')) {
        expect(question.options.map((o) => o.label)).toEqual(['True', 'False']);
      }
    }
    expect(quizzes[0].map((q) => q.id)).not.toEqual(quizzes[1].map((q) => q.id));
  });
});
