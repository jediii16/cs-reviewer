import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { ChoiceQuestion } from '../../content/types';
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

const secondQuestion: ChoiceQuestion = {
  ...sampleQuestion,
  id: 'sample-integrity',
  concept: 'Integrity',
  prompt: 'Records must remain accurate.',
  correctOptionId: 'integrity',
  explanation: 'Integrity keeps records accurate.',
};

describe('QuizRunner', () => {
  it('shows the set title and focused Bappi while a question is active', () => {
    render(
      <QuizRunner
        questions={[sampleQuestion]}
        setTitle="CIA Scenario Practice"
        onComplete={vi.fn()}
      />,
    );

    expect(screen.getByText('CIA Scenario Practice')).toBeVisible();
    expect(screen.getByRole('img', { name: /bappi is focused/i })).toBeVisible();
  });

  it('renders only multiple-choice controls', () => {
    render(<QuizRunner questions={[sampleQuestion]} onComplete={vi.fn()} />);

    expect(screen.getByRole('group', { name: /choose the best answer/i })).toBeVisible();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByText('Identification')).not.toBeInTheDocument();
    expect(screen.queryByText('True or false')).not.toBeInTheDocument();
  });

  it('requires submission, explains the answer, and records the full set total', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<QuizRunner questions={[sampleQuestion, secondQuestion]} onComplete={onComplete} />);

    expect(screen.getByText('Question 1 of 2')).toBeVisible();
    expect(screen.getByRole('button', { name: /submit answer/i })).toBeDisabled();
    await user.click(screen.getByRole('radio', { name: /confidentiality/i }));
    await user.click(screen.getByRole('button', { name: /submit answer/i }));

    expect(screen.getByRole('status')).toHaveTextContent(/correct/i);
    expect(screen.getByText(sampleQuestion.explanation)).toBeVisible();
    await user.click(screen.getByRole('button', { name: /next question/i }));

    expect(screen.getByText('Question 2 of 2')).toBeVisible();
    await user.click(screen.getByRole('radio', { name: /integrity/i }));
    await user.click(screen.getByRole('button', { name: /submit answer/i }));
    await user.click(screen.getByRole('button', { name: /see results/i }));

    expect(screen.getByLabelText('Total score')).toHaveTextContent('2 / 2');
    expect(screen.getByRole('img', { name: /bappi is celebrating/i })).toBeVisible();
    expect(onComplete).toHaveBeenCalledWith({ correct: 2, total: 2 });
  });

  it('shows worried Bappi and allows retrying only missed questions', async () => {
    const user = userEvent.setup();
    render(<QuizRunner questions={[sampleQuestion]} onComplete={vi.fn()} />);

    await user.click(screen.getByRole('radio', { name: /integrity/i }));
    await user.click(screen.getByRole('button', { name: /submit answer/i }));
    expect(screen.getByRole('img', { name: /bappi looks worried/i })).toBeVisible();

    await user.click(screen.getByRole('button', { name: /see results/i }));
    await user.click(screen.getByRole('button', { name: /retry missed/i }));

    expect(screen.getByText('Question 1 of 1')).toBeVisible();
    expect(screen.getByText(sampleQuestion.prompt)).toBeVisible();
  });
});
