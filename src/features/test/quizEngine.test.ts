import { describe, expect, it } from 'vitest';
import type { ChoiceQuestion } from '../../content/types';
import { createQuiz, getMissedQuestions, scoreQuiz } from './quizEngine';

const q1: ChoiceQuestion = {
  kind: 'multiple-choice',
  id: 'q1',
  topicId: 'cia',
  concept: 'Confidentiality',
  prompt: 'Only authorized users should see a file.',
  options: [
    { id: 'confidentiality', label: 'Confidentiality' },
    { id: 'integrity', label: 'Integrity' },
    { id: 'availability', label: 'Availability' },
  ],
  correctOptionId: 'confidentiality',
  explanation: 'Confidentiality prevents unauthorized disclosure.',
};

const q2: ChoiceQuestion = {
  ...q1,
  id: 'q2',
  concept: 'Integrity',
  correctOptionId: 'integrity',
};

const q3: ChoiceQuestion = {
  ...q1,
  id: 'q3',
  concept: 'Availability',
  correctOptionId: 'availability',
};

describe('quiz engine', () => {
  it('includes every supplied question exactly once', () => {
    const quiz = createQuiz([q1, q2, q3], () => 0.25);

    expect(quiz).toHaveLength(3);
    expect(new Set(quiz.map((question) => question.id))).toEqual(new Set(['q1', 'q2', 'q3']));
  });

  it('shuffles options without changing correct answer identity', () => {
    const [question] = createQuiz([q1], () => 0.25);

    expect(question.options.find((option) => option.id === question.correctOptionId)?.label)
      .toBe('Confidentiality');
  });

  it('does not mutate the supplied question bank', () => {
    const before = q1.options.map((option) => option.id);

    createQuiz([q1, q2], () => 0);

    expect(q1.options.map((option) => option.id)).toEqual(before);
  });

  it('scores answers and groups results by topic', () => {
    expect(scoreQuiz([q1, q2], { q1: 'confidentiality', q2: 'wrong' })).toEqual({
      correct: 1,
      total: 2,
      percent: 50,
      byTopic: { cia: { correct: 1, total: 2 } },
    });
  });

  it('returns only incorrectly answered questions for retry', () => {
    expect(getMissedQuestions([q1, q2], { q1: 'confidentiality', q2: 'wrong' }))
      .toEqual([q2]);
  });
});
