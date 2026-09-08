import { describe, expect, it } from 'vitest';
import { cs412Subject, cs412Terms, cs412TheoryTopics } from '.';

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
      'ASSOCIATION RULES', 'CRISP DM', 'BUSINESS/PROJECT UNDERSTANDING', 'DATA UNDERSTANDING',
      'DATA PREPARATION', 'MODELLING', 'EVALUATION', 'DEPLOYMENT', 'DATA WAREHOUSE',
      'DATABASE', 'DATA LAKE', 'DATA MART', 'DATA REFRESH', 'DATA CLEANING',
      'EXTRACTION OF DATA', 'TRANSFORMATION OF DATA', 'DATA LOADING',
      'SOURCE LAYER', 'STAGING LAYER', 'WAREHOUSE LAYER', 'CONSUMPTION LAYER',
    ]) expect(answers).toContain(answer);
  });

  it('uses the user-supplied subtopics and definitions as the study source', () => {
    expect(cs412TheoryTopics).toHaveLength(3);
    expect(cs412Terms).toHaveLength(32);
    expect(cs412TheoryTopics[0].subtopics.map((subtopic) => subtopic.title)).toEqual([
      'WHAT IS DATA MINING?',
      'USES OF DATA MINING',
      'COMMON DATA MINING TECHNIQUES / TYPES OF DATA MINING',
    ]);
    expect(cs412Terms.find((term) => term.answer === 'DATA MINING')?.clue).toBe(
      'It is the process of sorting through large data sets to identify patterns and relationships that can help solve business problems through data analysis.',
    );
  });

  it('uses only the revised thirteen Data Warehousing definitions', () => {
    const warehousing = cs412Terms.filter((term) => term.module === 'warehousing');
    expect(warehousing).toHaveLength(13);
    expect(warehousing.find((term) => term.answer === 'DATA WAREHOUSE')?.clue).toBe(
      'Storage of information over time by a business or other organization. It becomes a library of historical data that can be retrieved and analyzed for decision-making.',
    );
    expect(warehousing.map((term) => term.answer)).not.toContain('ETL');
  });

  it('registers CS.412 as Data Mining', () => {
    expect(cs412Subject).toMatchObject({ id: 'cs412', code: 'CS.412', title: 'Data Mining' });
    expect(cs412Subject.topics.map((topic) => topic.title)).toContain('Data Preprocessing Techniques');
  });
});
