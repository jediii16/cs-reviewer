import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { LessonTopic } from '../../content/types';
import { StudyLesson } from './StudyLesson';

const topic: LessonTopic = {
  id: 'sample',
  title: 'Sample lesson',
  description: 'A test lesson.',
  sections: [{
    id: 'sample-section',
    title: 'Confidentiality',
    summary: 'This summary does not reveal the recall response.',
    recallPrompt: 'Who should see protected information?',
    recallAnswer: 'Authorized individuals only.',
    benefits: ['Detect attacks'],
    applicablePrinciples: ['Least Privilege', 'Defense in Depth'],
  }],
};

describe('StudyLesson', () => {
  it('uses Bappi to frame the active-recall prompt', () => {
    render(<StudyLesson topic={topic} onComplete={vi.fn()} />);

    expect(screen.getByRole('img', { name: /bappi is thinking/i })).toBeVisible();
  });

  it('keeps an active-recall answer hidden until requested', async () => {
    const user = userEvent.setup();
    render(<StudyLesson topic={topic} onComplete={vi.fn()} />);

    expect(screen.queryByText('Authorized individuals only.')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /reveal answer/i }));

    expect(screen.getByText('Authorized individuals only.')).toBeVisible();
  });

  it('reports completion from the final section', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<StudyLesson topic={topic} onComplete={onComplete} />);

    await user.click(screen.getByRole('button', { name: /mark topic reviewed/i }));

    expect(onComplete).toHaveBeenCalledWith('sample');
  });

  it('uses source-faithful headings for benefits and applicable principles', () => {
    render(<StudyLesson topic={topic} onComplete={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Benefits' })).toBeVisible();
    expect(screen.getByText('Detect attacks')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Applicable security principles' })).toBeVisible();
    expect(screen.getByText('Least Privilege')).toBeVisible();
  });
});
