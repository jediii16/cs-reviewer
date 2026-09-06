import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { LessonTopic } from '../../content/types';
import { StudyLesson } from './StudyLesson';

const topic: LessonTopic = {
  id: 'sample',
  title: 'Sample lesson',
  description: 'A test lesson.',
  sections: [
    {
      id: 'sample-section',
      title: 'Confidentiality',
      summary: 'This summary does not reveal the recall response.',
      recallPrompt: 'Who should see protected information?',
      recallAnswer: 'Authorized individuals only.',
      benefits: ['Detect attacks'],
      applicablePrinciples: ['Least Privilege', 'Defense in Depth'],
    },
    {
      id: 'second-section',
      title: 'Integrity',
      summary: 'Information remains accurate.',
      recallPrompt: 'What should remain accurate?',
      recallAnswer: 'The information.',
    },
  ],
};

describe('StudyLesson', () => {
  const scrollIntoView = vi.fn();

  beforeEach(() => {
    scrollIntoView.mockReset();
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    });
  });

  it('uses Bappi to frame the active-recall prompt', () => {
    render(<StudyLesson topic={topic} onComplete={vi.fn()} />);

    expect(screen.getByRole('img', { name: /bappi is thinking/i })).toBeVisible();
  });

  it('keeps the answer in a stable focusable panel without reveal controls', () => {
    render(<StudyLesson topic={topic} onComplete={vi.fn()} />);

    const panel = screen.getByText('Active recall').closest('section');
    expect(panel).toHaveAttribute('tabindex', '0');
    expect(screen.getByText('Authorized individuals only.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /reveal answer|hide answer/i })).not.toBeInTheDocument();
    expect(screen.getByText(/hover or tap to reveal/i)).toBeVisible();
  });

  it('smoothly returns only to the lesson anchor on next and previous', async () => {
    const user = userEvent.setup();
    render(<StudyLesson topic={topic} onComplete={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(screen.getByRole('heading', { name: 'Integrity' })).toBeVisible();
    expect(screen.getByText('2 of 2')).toBeVisible();
    expect(scrollIntoView).toHaveBeenLastCalledWith({ behavior: 'smooth', block: 'start' });

    await user.click(screen.getByRole('button', { name: /previous/i }));
    expect(screen.getByRole('heading', { name: 'Confidentiality' })).toBeVisible();
    expect(scrollIntoView).toHaveBeenCalledTimes(2);
  });

  it('reports completion from the final section', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<StudyLesson topic={topic} onComplete={onComplete} />);

    await user.click(screen.getByRole('button', { name: /next/i }));
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
