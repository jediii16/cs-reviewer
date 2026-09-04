import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { ChoiceQuestion, IdentificationQuestion, TrueFalseQuestion } from '../../content/types';
import { QuizRunner } from './QuizRunner';

const sampleQuestion: ChoiceQuestion = {
  kind: 'multiple-choice',
  id: 'sample-cia',
  topicId: 'cia',
  concept: 'Confidentiality',
  prompt: 'Only authorized faculty should view student grades.',
  options: [
    { id: 'confidentiality', label: 'Confidentiality' },
    { id: 'integrity', label: 'Integrity' },
    { id: 'availability', label: 'Availability' },
  ],
  correctOptionId: 'confidentiality',
  explanation: 'Confidentiality prevents unauthorized disclosure.',
};

const identificationQuestion: IdentificationQuestion = {
  kind: 'identification',
  id: 'sample-identification',
  topicId: 'cia',
  concept: 'Authentication',
  prompt: 'What AAA function verifies identity?',
  correctAnswer: 'Authentication',
  acceptableAnswers: ['authentication'],
  explanation: 'Authentication confirms identity.',
};

const trueFalseQuestion: TrueFalseQuestion = {
  kind: 'true-false',
  id: 'sample-true-false',
  topicId: 'cia',
  concept: 'Availability',
  prompt: 'Availability keeps services accessible when needed.',
  correctAnswer: true,
  explanation: 'That is the definition of availability.',
};

describe('QuizRunner', () => {
  it('requires submission, explains the answer, and reaches a scored result', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<QuizRunner questions={[sampleQuestion]} onComplete={onComplete} />);

    expect(screen.getByRole('button', { name: /submit answer/i })).toBeDisabled();
    await user.click(screen.getByRole('radio', { name: /confidentiality/i }));
    await user.click(screen.getByRole('button', { name: /submit answer/i }));

    expect(screen.getByRole('status')).toHaveTextContent(/correct/i);
    expect(screen.getByText(sampleQuestion.explanation)).toBeVisible();

    await user.click(screen.getByRole('button', { name: /see results/i }));

    expect(screen.getByLabelText('Total score')).toHaveTextContent('1 / 1');
    expect(onComplete).toHaveBeenCalledWith({ correct: 1, total: 1 });
  });

  it('accepts a typed identification answer', async () => {
    const user = userEvent.setup();
    render(<QuizRunner questions={[identificationQuestion]} onComplete={vi.fn()} />);

    expect(screen.getByText('Identification')).toBeVisible();
    await user.type(screen.getByRole('textbox', { name: /your answer/i }), 'AUTHENTICATION');
    await user.click(screen.getByRole('button', { name: /submit answer/i }));

    expect(screen.getByRole('status')).toHaveTextContent(/correct/i);
  });

  it('renders true-or-false choices', async () => {
    const user = userEvent.setup();
    render(<QuizRunner questions={[trueFalseQuestion]} onComplete={vi.fn()} />);

    expect(screen.getByText('True or false')).toBeVisible();
    await user.click(screen.getByRole('radio', { name: 'True' }));
    await user.click(screen.getByRole('button', { name: /submit answer/i }));

    expect(screen.getByRole('status')).toHaveTextContent(/correct/i);
  });
});
