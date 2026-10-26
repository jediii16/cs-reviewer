import { describe, expect, it } from 'vitest';
import { defaultLearning, dueMistakes, emptyPeriod, finishSession, gradeAnswer, learningStats } from './model';
import type { QuizSession } from './model';
import { exportSyllabus, isPeriodProgress, learningStorageKey, loadLearning, parseSyllabus } from './persistence';
import { finalsQuestions } from './syllabus';
import { subjects } from '../../content/subjects';
import { createCompleteCrossword, validatePuzzle } from '../crossword/builder';
import { osCrosswordBanks } from '../../content/cit015/crossword';
const makeSession = (): QuizSession => ({ id: 'sample-session', subjectId: 'cit015', title: 'Sample', mode: 'learn', questions: finalsQuestions.slice(0, 2), answers: {}, index: 0, gradedIds: [], startedAt: 1000 });

describe('durable learning and review scheduling', () => {
  it('counts a submitted answer once and schedules a miss tomorrow', () => {
    const data = emptyPeriod(); const session = makeSession(); const q = session.questions[0];
    session.answers[q.id] = q.options.find((o) => o.id !== q.correctOptionId)!.id;
    gradeAnswer(data, session, q, 1000); gradeAnswer(data, session, q, 2000);
    expect(data.history[q.id]).toMatchObject({ attempts: 1, correct: 0 });
    expect(data.mistakes[q.id]).toMatchObject({ wrongCount: 1, streak: 0, dueAt: 1000 + 86400000 });
    expect(dueMistakes(data, 1000)).toHaveLength(0);
    expect(dueMistakes(data, 1000 + 86400000)).toHaveLength(1);
  });
  it('moves correct reviews to 3, 7, and 14 days, and resets the interval after a new miss', () => {
    const data = emptyPeriod(); const first = makeSession(); const q = first.questions[0];
    gradeAnswer(data, first, q, 1000);
    for (const days of [3, 7, 14, 14]) {
      const session = makeSession(); session.answers[q.id] = q.correctOptionId;
      gradeAnswer(data, session, q, 2000);
      expect(data.mistakes[q.id].dueAt).toBe(2000 + days * 86400000);
    }
    gradeAnswer(data, makeSession(), q, 3000);
    expect(data.mistakes[q.id]).toMatchObject({ streak: 0, dueAt: 3000 + 86400000 });
  });
  it('grades an exam only at submission, treats blanks as wrong, and records completion once', () => {
    const data = emptyPeriod(); const session = makeSession(); session.mode = 'exam';
    session.answers[session.questions[0].id] = session.questions[0].correctOptionId;
    expect(data.history).toEqual({});
    finishSession(data, session, 10000, true); finishSession(data, session, 20000);
    expect(data.results).toHaveLength(1); expect(data.results[0]).toMatchObject({ correct: 1, total: 2 });
    expect(session.timedOut).toBe(true); expect(Object.keys(data.mistakes)).toHaveLength(1);
  });
  it('keeps reading coverage separate from practiced concepts and completed accuracy', () => {
    const data = emptyPeriod(); data.reviewedSections = ['cit015/finals-concurrent-processing/concurrent-environments'];
    expect(learningStats(data, subjects, finalsQuestions)).toMatchObject({ reviewed: 1, practiced: 0, accuracy: null, sections: 13 });
  });
  it('round-trips the complete period including session order, notes, and bookmarks', () => {
    const state = defaultLearning(); const data = emptyPeriod(); data.sessions.cit015 = makeSession();
    data.notes = { general: 'A useful note' }; data.bookmarks[finalsQuestions[0].id] = { questionId: finalsQuestions[0].id, subjectId: 'cit015', note: 'Check this again', createdAt: 1000 };
    state.data['2026-finals'] = data;
    const bundle = parseSyllabus(JSON.stringify(exportSyllabus(state)));
    expect(bundle.progress).toEqual(data); expect(bundle.period.subjects).toHaveLength(1);
    expect(bundle.period.questions?.cit015).toHaveLength(90);
    localStorage.setItem(learningStorageKey, JSON.stringify(state));
    expect(loadLearning(localStorage)).toEqual(state); localStorage.clear();
  });
  it('rejects corrupt imports and invalid session answers without changing the stored data', () => {
    expect(() => parseSyllabus('{bad')).toThrow(/valid JSON/);
    const bundle = exportSyllabus(defaultLearning()); bundle.period.questions!.cit015[0] = structuredClone(finalsQuestions[0]);
    bundle.period.questions!.cit015[0].correctOptionId = 'missing';
    expect(() => parseSyllabus(JSON.stringify(bundle))).toThrow(/format/);
    const data = emptyPeriod(); data.sessions.cit015 = makeSession(); data.sessions.cit015.answers.wrong = 'missing';
    expect(isPeriodProgress(data)).toBe(false);
  });
  it('validates false-statement correction phrases against the source-backed prompts', () => {
    const statements = finalsQuestions.filter((q) => q.kind === 'true-false' && q.options.find((o) => o.id === q.correctOptionId)?.label === 'False');
    expect(statements.length).toBe(16);
    for (const question of statements) { expect(question.incorrectPhrase).toBeTruthy(); expect(question.prompt).toContain(question.incorrectPhrase); expect(question.correctedStatement!.length).toBeGreaterThan(20); }
  });
  it('builds every new finals crossword as a valid connected complete puzzle', () => {
    for (const bank of osCrosswordBanks) for (const seed of [1, 42, 4173]) {
      const puzzle = createCompleteCrossword(bank.terms, seed, bank.title);
      expect(puzzle.entries).toHaveLength(bank.terms.length); expect(validatePuzzle(puzzle)).toEqual([]);
    }
  });
});

it('migrates only finals progress and carries the previous finals blurting notes forward', () => {
  localStorage.clear();
  localStorage.setItem('cit017-reviewer-progress', JSON.stringify({ version: 1, timerPresetMinutes: 25, reviewedTopicIds: ['foundations', 'finals-concurrent-processing'], recentResults: [
    { subjectId: 'cit015', syllabusId: '2026-finals', completedAt: '2026-10-26T00:00:00Z', correct: 4, total: 5 },
    { subjectId: 'cit015', completedAt: '2026-09-01T00:00:00Z', correct: 19, total: 20 },
  ] }));
  localStorage.setItem('cit017-reviewer-blurting-notes', JSON.stringify({ version: 1, notes: { 'finals-concurrent-processing': 'Locks coordinate access.', foundations: 'Old notes' }, selectedId: 'finals-concurrent-processing' }));
  const migrated = loadLearning(localStorage).data['2026-finals'];
  expect(migrated.results).toHaveLength(1); expect(migrated.reviewedSections).toHaveLength(7);
  expect(migrated.notes).toEqual({ 'cit015:finals-concurrent-processing': 'Locks coordinate access.' });
  localStorage.clear();
});
