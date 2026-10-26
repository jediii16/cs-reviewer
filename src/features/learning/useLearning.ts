import { useSyncExternalStore } from 'react';
import type { ChoiceQuestion } from '../../content/types';
import { activeContent } from './syllabus';
import { defaultLearning, emptyPeriod, finishSession, gradeAnswer, positionKey, sectionKey } from './model';
import type { LearningState, PeriodProgress } from './model';
import { learningStorageKey, loadLearning } from './persistence';
import type { SyllabusBundle } from './persistence';

function browserStorage() { try { return window.localStorage; } catch { return undefined; } }
const listeners = new Set<() => void>();
const serverState = defaultLearning();
let current = loadLearning(typeof window === 'undefined' ? undefined : browserStorage());
let storageError: string | null = null;
function emit(next: LearningState) {
  current = next;
  try {
    const storage = browserStorage();
    if (!storage) throw new Error('Storage unavailable');
    storage.setItem(learningStorageKey, JSON.stringify(next));
    storageError = null;
  } catch { storageError = 'Your changes are available in this tab, but could not be saved to this browser. Export a backup before closing.'; }
  listeners.forEach((listener) => listener());
}
function updatePeriod(update: (draft: PeriodProgress) => void) {
  const draft = structuredClone(current.data[current.activePeriodId] ?? emptyPeriod());
  update(draft);
  emit({ ...current, data: { ...current.data, [current.activePeriodId]: draft } });
}
const subscribe = (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener); };
const makeId = () => `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const learningActions = {
  setPeriod(id: string) {
    if (current.periods.some((p) => p.id === id && !p.archived)) emit({ ...current, activePeriodId: id });
  },
  setCalm(calmMascot: boolean) { emit({ ...current, calmMascot }); },
  saveNote(id: string, note: string) { updatePeriod((draft) => { draft.notes = { ...draft.notes, [id]: note.slice(0, 10000) }; }); },
  selectNote(id: string) { updatePeriod((draft) => { draft.selectedNoteId = id; }); },
  archivePeriod(id: string, archived: boolean) {
    const nextPeriods = current.periods.map((p) => p.id === id ? { ...p, archived } : p);
    const available = nextPeriods.find((p) => !p.archived);
    if (!available) return;
    emit({ ...current, periods: nextPeriods, activePeriodId: nextPeriods.find((p) => p.id === current.activePeriodId && !p.archived)?.id ?? available.id });
  },
  importPeriod(bundle: SyllabusBundle) {
    const id = `import-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    emit({ ...current, activePeriodId: id,
      periods: [...current.periods, { ...bundle.period, id, archived: false, label: `${bundle.period.label} (imported)` }],
      data: { ...current.data, [id]: structuredClone(bundle.progress ?? emptyPeriod()) },
    });
  },
  savePosition(subjectId: string, topicId: string, sectionId: string) {
    const saved = current.data[current.activePeriodId]?.positions[positionKey(subjectId, topicId)];
    if (saved?.sectionId === sectionId && current.data[current.activePeriodId]?.lastActivity?.kind === 'study' && current.data[current.activePeriodId]?.lastActivity?.subjectId === subjectId) return;
    updatePeriod((draft) => {
      const now = Date.now();
      draft.positions[positionKey(subjectId, topicId)] = { subjectId, topicId, sectionId, updatedAt: now };
      draft.lastActivity = { kind: 'study', subjectId, updatedAt: now };
    });
  },
  reviewSection(subjectId: string, topicId: string, sectionId: string) {
    updatePeriod((draft) => {
      const key = sectionKey(subjectId, topicId, sectionId);
      if (!draft.reviewedSections.includes(key)) draft.reviewedSections.push(key);
    });
  },
  reviewTopic(subjectId: string, topicId: string) {
    const topic = activeContent(current).subjects.find((s) => s.id === subjectId)?.topics.find((t) => t.id === topicId);
    if (!topic) return;
    updatePeriod((draft) => { draft.reviewedSections = [...new Set([...draft.reviewedSections, ...topic.sections.map((s) => sectionKey(subjectId, topicId, s.id))])]; });
  },
  startQuiz(subjectId: string, title: string, questions: ChoiceQuestion[], mode: 'learn' | 'exam' = 'learn', minutes = 0) {
    if (!questions.length) return;
    const id = makeId();
    updatePeriod((draft) => {
      const now = Date.now();
      draft.sessions[subjectId] = { id, subjectId, title, questions, mode, answers: {}, index: 0, gradedIds: [], startedAt: now, ...(minutes ? { deadlineAt: now + minutes * 60000 } : {}) };
      draft.lastActivity = { kind: 'quiz', subjectId, updatedAt: now };
    });
    return id;
  },
  answer(subjectId: string, questionId: string, optionId: string) {
    updatePeriod((draft) => {
      const session = draft.sessions[subjectId];
      const question = session?.questions.find((q) => q.id === questionId);
      if (!session || session.finishedAt !== undefined || !question || (session.mode === 'learn' && session.gradedIds.includes(questionId)) || !question.options.some((o) => o.id === optionId)) return;
      if (session.deadlineAt && Date.now() >= session.deadlineAt) { finishSession(draft, session, Date.now(), true); return; }
      session.answers[questionId] = optionId;
      delete session.contentUpdated;
      draft.lastActivity = { kind: 'quiz', subjectId, updatedAt: Date.now() };
    });
  },
  submitAnswer(subjectId: string) {
    updatePeriod((draft) => {
      const session = draft.sessions[subjectId];
      if (!session || session.mode !== 'learn' || session.finishedAt !== undefined) return;
      if (session.deadlineAt && Date.now() >= session.deadlineAt) { finishSession(draft, session, Date.now(), true); return; }
      const question = session.questions[session.index];
      if (session.answers[question.id]) gradeAnswer(draft, session, question, Date.now());
    });
  },
  moveQuestion(subjectId: string, index: number) {
    updatePeriod((draft) => {
      const session = draft.sessions[subjectId];
      if (session && session.finishedAt === undefined) {
        session.index = Math.max(0, Math.min(index, session.questions.length - 1));
        draft.lastActivity = { kind: 'quiz', subjectId, updatedAt: Date.now() };
      }
    });
  },
  resumeQuiz(subjectId: string, id: string) {
    updatePeriod((draft) => {
      const session = draft.sessions[subjectId];
      if (session?.id === id && session.finishedAt === undefined) draft.lastActivity = { kind: 'quiz', subjectId, updatedAt: Date.now() };
    });
  },
  finishQuiz(subjectId: string, timedOut = false) {
    updatePeriod((draft) => {
      const session = draft.sessions[subjectId];
      if (session) finishSession(draft, session, Date.now(), timedOut);
    });
  },
  discardQuiz(subjectId: string) { updatePeriod((draft) => { delete draft.sessions[subjectId]; }); },
  bookmark(subjectId: string, questionId: string) {
    updatePeriod((draft) => {
      if (draft.bookmarks[questionId]) delete draft.bookmarks[questionId];
      else draft.bookmarks[questionId] = { subjectId, questionId, note: '', createdAt: Date.now() };
    });
  },
  saveBookmarkNote(questionId: string, note: string) {
    updatePeriod((draft) => { if (draft.bookmarks[questionId]) draft.bookmarks[questionId].note = note.slice(0, 10000); });
  },
  removeMistake(questionId: string) { updatePeriod((draft) => { delete draft.mistakes[questionId]; }); },
  resetSubject(subjectId: string) {
    const content = activeContent(current);
    const ids = new Set((content.questions[subjectId] ?? []).map((q) => q.id));
    updatePeriod((draft) => {
      draft.positions = Object.fromEntries(Object.entries(draft.positions).filter(([, p]) => p.subjectId !== subjectId));
      draft.reviewedSections = draft.reviewedSections.filter((key) => !key.startsWith(`${subjectId}/`));
      delete draft.sessions[subjectId];
      for (const key of ids) { delete draft.history[key]; delete draft.mistakes[key]; }
      draft.results = draft.results.filter((r) => r.subjectId !== subjectId);
      if (draft.lastActivity?.subjectId === subjectId) delete draft.lastActivity;
    });
  },
};
const empty = emptyPeriod();
export function useLearning() {
  const state = useSyncExternalStore(subscribe, () => current, () => serverState);
  const content = activeContent(state);
  return { state, ...content, data: state.data[state.activePeriodId] ?? empty, actions: learningActions, storageError };
}
