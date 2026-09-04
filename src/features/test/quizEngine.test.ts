import { describe, expect, it } from 'vitest';
import type { ChoiceQuestion, IdentificationQuestion, TrueFalseQuestion } from '../../content/types';
import { cit017Questions } from '../../content/cit017/questions';
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

const q2: ChoiceQuestion = { ...q1, id: 'q2', concept: 'Integrity', correctOptionId: 'integrity' };

const identificationQuestion: IdentificationQuestion = {
  kind: 'identification',
  id: 'q3',
  topicId: 'cia',
  concept: 'Authentication',
  prompt: 'What AAA function verifies a user’s identity?',
  correctAnswer: 'Authentication',
  acceptableAnswers: ['authentication'],
  explanation: 'Authentication confirms that users are who they claim to be.',
};

const trueFalseQuestion: TrueFalseQuestion = {
  kind: 'true-false',
  id: 'q4',
  topicId: 'cia',
  concept: 'Availability',
  prompt: 'True or false: Availability means authorized users can access services when needed.',
  correctAnswer: true,
  explanation: 'Availability keeps information and services accessible to authorized users.',
};

describe('quiz engine', () => {
  it('shuffles options without changing correct answer identity', () => {
    const [question] = createQuiz([q1], 'mixed', 1, () => 0.25);

    expect(question.kind).toBe('multiple-choice');
    if (question.kind !== 'multiple-choice') throw new Error('Expected a multiple-choice question');
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

  it('scores identification without penalizing case or punctuation', () => {
    expect(scoreQuiz([identificationQuestion], { q3: '  AUTHENTICATION! ' }).correct).toBe(1);
  });

  it('scores true-or-false answers', () => {
    expect(scoreQuiz([trueFalseQuestion], { q4: 'true' }).correct).toBe(1);
    expect(scoreQuiz([trueFalseQuestion], { q4: 'false' }).correct).toBe(0);
  });

  it('includes every available question format in a mixed set', () => {
    const quiz = createQuiz([q1, identificationQuestion, trueFalseQuestion], 'mixed', 3, () => 0.25);

    expect(new Set(quiz.map((question) => question.kind))).toEqual(
      new Set(['multiple-choice', 'identification', 'true-false']),
    );
  });

  it('includes every topic and format in a ten-question mixed review', () => {
    for (let seed = 1; seed <= 30; seed += 1) {
      let value = seed;
      const random = () => {
        value = (value * 16807) % 2147483647;
        return (value - 1) / 2147483646;
      };
      const quiz = createQuiz(cit017Questions, 'mixed', 10, random);

      expect(new Set(quiz.map((question) => question.topicId))).toEqual(
        new Set(['threats', 'cia', 'principles', 'social']),
      );
      expect(new Set(quiz.map((question) => question.kind))).toEqual(
        new Set(['multiple-choice', 'identification', 'true-false']),
      );
    }
  });
});
