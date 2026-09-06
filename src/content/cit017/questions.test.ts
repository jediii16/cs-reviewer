import { describe, expect, it } from 'vitest';
import { psychologicalTactics, socialTechniques } from './social';
import { securityPrinciples } from './principles';
import { threatCategories } from './threats';
import { cit017Questions, cit017TestSets } from './questions';

describe('CIT.017 graded practice sets', () => {
  it('contains every question in the seven focused sets', () => {
    expect(Object.fromEntries(cit017TestSets.map((set) => [set.id, set.questions.length]))).toEqual({
      'foundations-cia-scenarios': 10,
      'foundations-concepts': 24,
      'principles-definitions': 9,
      'threat-scenarios': 12,
      'social-definitions': 17,
      'social-examples': 17,
      'social-tactics': 9,
    });

    expect(cit017Questions).toHaveLength(98);
    expect(cit017Questions.every((question) => question.kind === 'multiple-choice')).toBe(true);
  });

  it('uses unique ids and valid multiple-choice answers', () => {
    const ids = cit017Questions.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const question of cit017Questions) {
      expect(question.options.some((option) => option.id === question.correctOptionId)).toBe(true);
      expect(new Set(question.options.map((option) => option.id)).size).toBe(question.options.length);
    }
  });

  it('covers all ten CIA scenarios and every foundations concept family', () => {
    const ciaScenarios = cit017TestSets.find((set) => set.id === 'foundations-cia-scenarios');
    const foundations = cit017TestSets.find((set) => set.id === 'foundations-concepts');

    expect(ciaScenarios?.questions).toHaveLength(10);
    expect(new Set(ciaScenarios?.questions.map((question) => question.concept))).toEqual(
      new Set(['Confidentiality', 'Integrity', 'Availability']),
    );
    expect(foundations?.questions.map((question) => question.concept)).toEqual(expect.arrayContaining(
      [
        'CIA Triad',
        'AAA Framework',
        'Authentication',
        'Authorization',
        'Accounting (Auditing)',
        'Something You Know',
        'Something You Have',
        'Something You Are',
        'Security goals, information states, and safeguards',
        'Storage, Processing, and Transmission',
        'Technology; Policy and practices; Education, training, and awareness',
        '27 intersections',
      ],
    ));
  });

  it('covers all nine Security Principles once by definition', () => {
    const set = cit017TestSets.find((item) => item.id === 'principles-definitions');

    expect(set?.questions.map((question) => question.concept)).toEqual(
      securityPrinciples.map((principle) => principle.name),
    );
  });

  it('covers every exact threat category once with a scenario', () => {
    const set = cit017TestSets.find((item) => item.id === 'threat-scenarios');

    expect(set?.questions.map((question) => question.concept)).toEqual(
      threatCategories.map((category) => category.name),
    );
  });

  it('covers every social technique by definition and supplied example', () => {
    const definitions = cit017TestSets.find((set) => set.id === 'social-definitions');
    const examples = cit017TestSets.find((set) => set.id === 'social-examples');
    const names = socialTechniques.map((technique) => technique.name);

    expect(definitions?.questions.map((question) => question.concept)).toEqual(names);
    expect(examples?.questions.map((question) => question.concept)).toEqual(names);
  });

  it('covers every supplied psychological tactic example', () => {
    const set = cit017TestSets.find((item) => item.id === 'social-tactics');

    expect(set?.questions.map((question) => question.concept)).toEqual(
      psychologicalTactics.map((tactic) => tactic.name),
    );
  });
});
