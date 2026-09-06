import { describe, expect, it } from 'vitest';
import { cit016Subject } from './index';

describe('CIT.016 course content', () => {
  it('organizes the supplied material into five complete study topics', () => {
    expect(cit016Subject.topics.map((topic) => topic.id)).toEqual([
      'digital-analog',
      'error-control',
      'tcp-ip',
      'transmission-media',
      'multiplexing',
    ]);

    expect(cit016Subject.topics.map((topic) => topic.sections.length)).toEqual([14, 12, 6, 9, 7]);
  });

  it('gives every lesson section an active-recall prompt and answer', () => {
    const sections = cit016Subject.topics.flatMap((topic) => topic.sections);

    expect(sections).toHaveLength(48);
    expect(sections.every((section) => section.recallPrompt.trim().length > 0)).toBe(true);
    expect(sections.every((section) => section.recallAnswer.trim().length > 0)).toBe(true);
  });

  it('preserves the supplied Hamming formula, redundant-bit positions, and final parity values', () => {
    const hamming = cit016Subject.topics
      .find((topic) => topic.id === 'error-control')
      ?.sections.filter((section) => section.id.startsWith('hamming')) ?? [];
    const studyText = JSON.stringify(hamming);

    expect(studyText).toContain('2^p >= d + p + 1');
    expect(studyText).toContain('1, 2, 4, and 8');
    expect(studyText).toContain('R1 = 0, R2 = 1, R4 = 1, and R8 = 0');
  });
});
