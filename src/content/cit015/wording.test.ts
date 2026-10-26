import { describe, expect, it } from 'vitest';
import { cit015TestSets } from './questions';
import { slideCopy } from './slideCopy';
import transcript from './source-slides.json';
import { cit015Subject } from './index';
import { osCrosswordBanks } from './crossword';
import { contextualStatements } from './questionPrompts';
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
  it('keeps source definitions literal while asking direct, contextual questions', () => {
    for (const question of questions) {
      const passage = Object.values(slideCopy).find((p) => p.text === question.sourceText);
      expect(passage, question.id).toBeDefined();
      expect(question.explanation.endsWith(question.sourceText!), question.id).toBe(true);
      const correct = question.options.find((option) => option.id === question.correctOptionId)!;
      expect(question.prompt, question.id).not.toMatch(/complete the slide text|which term matches the slide text|according to the (?:slide|powerpoint)/i);
      expect(question.prompt, question.id).not.toContain('this type of allocation technique');
      if (question.kind === 'true-false' && correct.label === 'True') {
        expect(question.prompt, question.id).toBe(contextualStatements[question.id] ?? question.explanation);
      } else if (question.kind === 'true-false') {
        expect(question.correctedStatement, question.id).toBe(contextualStatements[question.id] ?? question.explanation);
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
    expect(question.prompt).toBe('Which file-system layer acts as a bridge, allowing different file systems to work under a single interface?');
    expect(question.explanation).toBe(expected);
    const section = cit015Subject.topics[1].sections.find((s) => s.id === 'file-systems')!;
    expect(section.terms?.find((t) => t.term === 'Virtual File System (VFS)')?.definition).toBe(expected);
    expect(section.recallAnswer).toBe(expected);
    expect(osCrosswordBanks[1].terms.find((t) => t.displayAnswer === 'Virtual file system')?.clue).toBe(expected);
  });
  it('identifies the method or scenario instead of leaving slide context implicit', () => {
    const expectedContext: Array<[string, RegExp]> = [
      ['finals-file-disk-management-mc-27', /contiguous allocation/],
      ['finals-file-disk-management-mc-28', /linked allocation/],
      ['finals-file-disk-management-mc-30', /allocation technique.*own index block/],
      ['finals-file-disk-management-mc-18', /ordinary files/],
      ['finals-file-disk-management-mc-21', /Special files/],
      ['finals-file-disk-management-mc-23', /direct\/random access/],
      ['finals-file-disk-management-mc-24', /direct\/random access/],
      ['finals-concurrent-processing-mc-13', /Alice.*Bob/],
      ['finals-concurrent-processing-mc-14', /book-and-calculator deadlock/],
      ['finals-concurrent-processing-mc-20', /Two agents.*airline seat/],
      ['finals-concurrent-processing-mc-21', /airline booking system/],
      ['finals-file-disk-management-tf-9', /Ordinary files/],
      ['finals-file-disk-management-tf-13', /direct\/random access/],
      ['finals-file-disk-management-tf-14', /indexed sequential access/],
      ['finals-file-disk-management-tf-16', /contiguous allocation/],
      ['finals-file-disk-management-tf-17', /linked allocation/],
      ['finals-file-disk-management-tf-19', /indexed allocation/],
      ['finals-file-disk-management-tf-20', /indexed allocation/],
    ];
    for (const [id, context] of expectedContext) expect(questions.find((q) => q.id === id)?.prompt, id).toMatch(context);
    expect(questions.find((q) => q.id === 'finals-file-disk-management-mc-27')?.prompt).toBe('____ is a major issue with contiguous allocation.');
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
