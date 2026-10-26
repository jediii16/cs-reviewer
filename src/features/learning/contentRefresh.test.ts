import { describe, expect, it } from 'vitest';
import { defaultLearning, emptyPeriod } from './model';
import type { QuizSession } from './model';
import { finalsQuestions } from './syllabus';
import { learningStorageKey, loadLearning } from './persistence';

function storedState(graded: boolean) {
  const state = defaultLearning(); const progress = emptyPeriod();
  const vfs = finalsQuestions.find((q) => q.id === 'finals-file-disk-management-mc-13')!;
  const snapshot = { ...structuredClone(vfs), prompt: 'Which layer lets different file systems work under a single interface?', explanation: 'VFS bridges different file systems through a common interface.' };
  delete snapshot.sourceText;
  const order = [snapshot.options[2], snapshot.options[0], snapshot.options[3], snapshot.options[1]];
  snapshot.options = order;
  const session: QuizSession = { id: 'old-session', subjectId: 'cit015', title: 'Saved practice', mode: 'learn', questions: [snapshot], answers: { [vfs.id]: vfs.correctOptionId }, index: 0, gradedIds: graded ? [vfs.id] : [], startedAt: 1000, deadlineAt: 301000 };
  progress.sessions.cit015 = session;
  progress.bookmarks[vfs.id] = { questionId: vfs.id, subjectId: 'cit015', note: 'My VFS note', createdAt: 1000 };
  state.data['2026-finals'] = progress;
  return { state, vfs, order };
}
describe('saved question wording refresh', () => {
  it('updates an old snapshot and clears only its unchecked selection, keeping order and notes', () => {
    localStorage.clear(); const { state, vfs, order } = storedState(false);
    localStorage.setItem(learningStorageKey, JSON.stringify(state));
    const loaded = loadLearning(localStorage); const session = loaded.data['2026-finals'].sessions.cit015;
    expect(session.questions[0].prompt).toBe(vfs.prompt);
    expect(session.questions[0].options.map((o) => o.id)).toEqual(order.map((o) => o.id));
    expect(session.answers).toEqual({}); expect(session.deadlineAt).toBe(301000); expect(session.contentUpdated).toBe(true);
    expect(loaded.data['2026-finals'].bookmarks[vfs.id].note).toBe('My VFS note'); localStorage.clear();
  });
  it('retains checked answers and completed results', () => {
    localStorage.clear(); const { state, vfs } = storedState(true);
    state.data['2026-finals'].sessions.cit015.finishedAt = 5000;
    state.data['2026-finals'].results = [{ id: 'old-session', subjectId: 'cit015', title: 'Saved practice', mode: 'learn', completedAt: 5000, correct: 1, total: 1 }];
    localStorage.setItem(learningStorageKey, JSON.stringify(state));
    const loaded = loadLearning(localStorage).data['2026-finals'];
    expect(loaded.sessions.cit015.answers[vfs.id]).toBe(vfs.correctOptionId);
    expect(loaded.results).toEqual(state.data['2026-finals'].results); localStorage.clear();
  });
  it('leaves independently imported syllabi and their snapshots alone', () => {
    localStorage.clear(); const { state } = storedState(false);
    state.periods = [{ id: 'import-custom', label: 'My copy', archived: false }]; state.activePeriodId = 'import-custom';
    state.data = { 'import-custom': state.data['2026-finals'] };
    localStorage.setItem(learningStorageKey, JSON.stringify(state));
    expect(loadLearning(localStorage)).toEqual(state); localStorage.clear();
  });
});
