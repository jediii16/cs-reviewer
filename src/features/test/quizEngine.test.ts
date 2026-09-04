import { describe, expect, it } from 'vitest';
import type { ChoiceQuestion } from '../../content/types';
import { createQuiz, getMissedQuestions, scoreQuiz } from './quizEngine';

const q1: ChoiceQuestion = {
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

const q2: ChoiceQuestion = { ...q1, id: 'q2', concept: 'Integrity', correctOptionId: 'integrity' };

describe('quiz engine', () => {
  it('shuffles options without changing correct answer identity', () => {
    const [question] = createQuiz([q1], 'mixed', 1, () => 0.25);

    expect(question.options.find((option) => option.id === question.correctOptionId)?.label)
      .toBe('Confidentiality');
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
