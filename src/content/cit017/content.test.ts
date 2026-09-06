import { describe, expect, it } from 'vitest';
import { cit017Subject } from './index';
import { securityPrinciples } from './principles';
import { foundationsTopic } from './foundations';
import { psychologicalTactics, socialTechniques } from './social';
import { threatCategories } from './threats';

describe('CIT.017 course content', () => {
  it('contains the complete supplied topic inventory', () => {
    expect(cit017Subject.topics.map((topic) => topic.id)).toEqual([
      'foundations',
      'security-principles',
      'threat-categories',
      'social-engineering',
    ]);
    expect(securityPrinciples).toHaveLength(9);
    expect(threatCategories).toHaveLength(12);
    expect(socialTechniques).toHaveLength(17);
    expect(psychologicalTactics).toHaveLength(9);
  });

  it('preserves the exact 12 threat category labels', () => {
    expect(threatCategories.map((item) => item.name)).toEqual([
      'Compromises to intellectual property',
      'Deviations in quality of service',
      'Espionage or trespass',
      'Forces of nature',
      'Human error or failure',
      'Information extortion',
      'Sabotage or vandalism',
      'Software attacks',
      'Technical hardware failures or errors',
      'Technical software failures or errors',
      'Technological obsolescence',
      'Theft',
    ]);
  });

  it('keeps Security Principles to the nine supplied principles without case studies', () => {
    const principles = cit017Subject.topics.find((topic) => topic.id === 'security-principles');

    expect(principles?.sections.map((section) => section.id)).toEqual(
      securityPrinciples.map((principle) => principle.id),
    );
    expect(principles?.sections.map((section) => section.id)).not.toEqual(expect.arrayContaining([
      'payroll-audit',
      'procurement-control',
      'exam-records',
    ]));
  });

  it('labels the supplied accounting outcomes as benefits', () => {
    const accounting = foundationsTopic.sections.find((section) => section.id === 'accounting');

    expect(accounting?.benefits).toEqual([
      'Detect attacks',
      'Investigate incidents',
      'Monitor employee activities',
      'Support compliance',
      'Produce audit reports',
    ]);
    expect(accounting?.controls).toBeUndefined();
  });

  it('keeps all three McCumber dimensions complete', () => {
    const cube = cit017Subject.mccumber;
    expect(cube.goals).toEqual(['Confidentiality', 'Integrity', 'Availability']);
    expect(cube.states).toEqual(['Storage', 'Processing', 'Transmission']);
    expect(cube.safeguards).toEqual([
      'Technology',
      'Policy and practices',
      'Education, training, and awareness',
    ]);
  });
});
