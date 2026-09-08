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
    const answer = problem.expected.flat().join(', ');
    expect(gradeProblem(problem, answer).correct).toBe(true);
    expect(getWorkedSolution(problem).length).toBeGreaterThanOrEqual(3);
  });

  it('accepts either boundary when a value is equally distant from both', () => {
    const problem = createPracticeSet(412).problems[2];
    expect(gradeProblem(problem, '8, 8, 23, 23 | 29, 29, 33, 33 | 39, 48, 48, 48').correct).toBe(true);
    expect(gradeProblem(problem, '8, 8, 23, 23 | 29, 33, 33, 33 | 39, 48, 48, 48').correct).toBe(true);
    expect(getWorkedSolution(problem).some((step) => step.result.includes('29 or 33'))).toBe(true);
  });

  it('asks for and grades every value in each normalization problem', () => {
    const normalizations = createPracticeSet(412).problems.slice(3);
    expect(normalizations.every((problem) => problem.expected.flat().length >= 6)).toBe(true);
    expect(normalizations[1].prompt).toMatch(/all age values/i);
    for (const problem of normalizations) {
      expect(gradeProblem(problem, problem.expected.flat().join(', ')).correct).toBe(true);
      expect(gradeProblem(problem, problem.expected.flat().slice(0, 2).join(', ')).feedback).toMatch(/needs \d+ values/i);
    }
  });

  it('requires comma-separated lists for normalization answers', () => {
    const problem = createPracticeSet(412).problems[4];
    expect(gradeProblem(problem, problem.expected.flat().join(' '))).toEqual({
      correct: false,
      feedback: 'Separate every normalized value with a comma.',
    });
  });
});
