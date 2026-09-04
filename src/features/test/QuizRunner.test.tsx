import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { ChoiceQuestion } from '../../content/types';
import { QuizRunner } from './QuizRunner';

const sampleQuestion: ChoiceQuestion = {
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
});
