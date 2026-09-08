import { describe, expect, it } from 'vitest';
import { createPracticeSet, gradeProblem, getWorkedSolution } from './problems';

describe('preprocessing practice generator', () => {
  it('creates a deterministic six-question 30-point set', () => {
    const set = createPracticeSet(412);
    expect(set).toEqual(createPracticeSet(412));
    expect(set.problems.map((problem) => problem.kind)).toEqual(['equal-frequency', 'bin-means', 'bin-boundaries', 'min-max', 'z-score', 'decimal-scaling']);
    expect(set.problems).toHaveLength(6);
    expect(set.totalPoints).toBe(30);
    expect(set.problems.every((problem) => problem.points === 5)).toBe(true);
  });
  it('grades flexible numeric input and provides worked steps', () => {
    const problem = createPracticeSet(412).problems[3];
    const answer = String(problem.expected.flat()[0]);
    expect(gradeProblem(problem, answer).correct).toBe(true);
    expect(getWorkedSolution(problem).length).toBeGreaterThanOrEqual(3);
  });
});
