import { describe, expect, it } from 'vitest';
import { cit015TestSets } from './questions';
import { slideCopy } from './slideCopy';
import transcript from './source-slides.json';
import { cit015Subject } from './index';
import { osCrosswordBanks } from './crossword';
const questions = cit015TestSets.slice(0, 4).flatMap((set) => set.questions);
const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();

describe('literal wording from the supplied finals slides', () => {
  it('keeps every canonical passage identical to its extracted source slide', () => {
    for (const [key, passage] of Object.entries(slideCopy)) {
      const pages = transcript[passage.document] as Record<string, string>;
      expect(normalize(pages[String(passage.slide)]), key).toContain(normalize(passage.text));
      if (passage.term) expect(normalize(pages[String(passage.slide)]), key).toContain(passage.term);
    }
  });
  it('uses literal slide statements for every question and explanation', () => {
    for (const question of questions) {
      const passage = Object.values(slideCopy).find((p) => p.text === question.sourceText);
      expect(passage, question.id).toBeDefined();
      expect(question.explanation.endsWith(question.sourceText!), question.id).toBe(true);
      const correct = question.options.find((option) => option.id === question.correctOptionId)!;
      if (question.kind === 'multiple-choice') {
        const body = question.prompt.split('\n\n')[1];
        expect(body, question.id).toBeDefined();
        expect(body.includes('____') ? body.replace('____', correct.label) : body, question.id).toBe(question.sourceText);
      } else if (correct.label === 'True') {
        expect(question.prompt, question.id).toBe(question.explanation);
      } else {
        expect(question.correctedStatement, question.id).toBe(question.explanation);
        const originalPhraseStart = question.prompt.indexOf(question.incorrectPhrase!);
        expect(originalPhraseStart, question.id).toBeGreaterThanOrEqual(0);
        const prefix = question.prompt.slice(0, originalPhraseStart);
        const suffix = question.prompt.slice(originalPhraseStart + question.incorrectPhrase!.length);
        expect(question.correctedStatement!.startsWith(prefix), question.id).toBe(true);
        expect(question.correctedStatement!.endsWith(suffix), question.id).toBe(true);
      }
    }
  });
  it('uses the exact VFS definition in the test, study notes, recall answer, and crossword', () => {
    const expected = 'Acts as a bridge, allowing different file systems to work under a single interface.';
    const question = questions.find((q) => q.id === 'finals-file-disk-management-mc-13')!;
    expect(question.prompt).toBe(`Which term matches the slide text?\n\n${expected}`);
    expect(question.explanation).toBe(expected);
    const section = cit015Subject.topics[1].sections.find((s) => s.id === 'file-systems')!;
    expect(section.terms?.find((t) => t.term === 'Virtual File System (VFS)')?.definition).toBe(expected);
    expect(section.recallAnswer).toBe(expected);
    expect(osCrosswordBanks[1].terms.find((t) => t.displayAnswer === 'Virtual file system')?.clue).toBe(expected);
  });
  it('keeps study definitions and recall answers as literal slide passages', () => {
    const passages = Object.values(slideCopy).map((p) => p.text).sort((a, b) => b.length - a.length);
    function isLiteralComposition(text: string) {
      let rest = text;
      while (rest) {
        const passage = passages.find((p) => rest.startsWith(p));
        if (!passage) return false;
        rest = rest.slice(passage.length).trimStart();
      }
      return true;
    }
    for (const topic of cit015Subject.topics) for (const section of topic.sections) {
      const text = [section.summary, section.recallAnswer, ...(section.bullets ?? []), ...(section.examples ?? []), ...(section.terms ?? []).flatMap((term) => [term.definition, ...(term.notes ?? [])])];
      for (const value of text) expect(isLiteralComposition(value), `${section.id}: ${value}`).toBe(true);
    }
  });
  it('copies crossword clue text from the same passages, allowing only a missing-answer blank', () => {
    const passages = Object.values(slideCopy).map((p) => p.text.toLowerCase());
    for (const bank of osCrosswordBanks) for (const term of bank.terms) {
      const restored = term.clue.replace('____', term.displayAnswer).toLowerCase();
      expect(passages, term.id).toContain(restored);
    }
  });
});
