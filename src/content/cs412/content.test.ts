import { describe, expect, it } from 'vitest';
import { cs412Subject, cs412Terms } from '.';

describe('CS.412 content', () => {
  it('covers all three modules with unique definition-first terms', () => {
    expect(new Set(cs412Terms.map((term) => term.id)).size).toBe(cs412Terms.length);
    expect(new Set(cs412Terms.map((term) => term.module))).toEqual(
      new Set(['introduction', 'crisp-dm', 'warehousing']),
    );
    expect(cs412Terms.every((term) => term.clue.trim().length >= 20)).toBe(true);
  });

  it('contains the explicitly taught likely exam answers', () => {
    const answers = new Set(cs412Terms.map((term) => term.answer));
    for (const answer of [
      'DATA MINING', 'CLASSIFICATION', 'CLUSTERING', 'PREDICTION', 'REGRESSION',
      'ASSOCIATION RULES', 'CRISP DM', 'BUSINESS UNDERSTANDING', 'DATA UNDERSTANDING',
      'DATA PREPARATION', 'MODELING', 'EVALUATION', 'DEPLOYMENT', 'DATA WAREHOUSE',
      'DATABASE', 'DATA LAKE', 'DATA MART', 'DATA REFRESH', 'DATA CLEANING',
      'DATA EXTRACTION', 'DATA TRANSFORMATION', 'DATA LOADING', 'SOURCE LAYER',
      'STAGING LAYER', 'WAREHOUSE LAYER', 'CONSUMPTION LAYER', 'SUBJECT ORIENTED',
      'INTEGRATED', 'TIME VARIANT', 'NON VOLATILE',
    ]) expect(answers).toContain(answer);
  });

  it('registers CS.412 as Data Mining', () => {
    expect(cs412Subject).toMatchObject({ id: 'cs412', code: 'CS.412', title: 'Data Mining' });
    expect(cs412Subject.topics.map((topic) => topic.title)).toContain('Data Preprocessing Techniques');
  });
});
