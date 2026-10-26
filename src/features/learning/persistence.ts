import type { ChoiceQuestion, LessonSection, SubjectManifest } from '../../content/types';
import type { LearningState, PeriodDefinition, PeriodProgress, QuizSession } from './model';
import { defaultLearning, emptyPeriod, sectionKey } from './model';
import { subjects } from '../../content/subjects';
import { loadProgress } from '../progress/storage';
import { loadNotes } from '../notes/notesStorage';
import { periodContent } from './syllabus';
import { refreshFinalsSessionWording } from './contentRefresh';

export const learningStorageKey = 'bappi-learning-v1';
export const isRecord = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const text = (value: unknown, max = 10000): value is string => typeof value === 'string' && value.length <= max;
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.length < 2000 && value.every((v) => text(v));
const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0;
const integer = (value: unknown): value is number => finite(value) && Number.isInteger(value);
const recordOf = (value: unknown, check: (item: unknown) => boolean) => isRecord(value) && Object.keys(value).every(safeIdOrKey) && Object.values(value).every(check);
const safeIdOrKey = (value: string) => value.length < 300 && !['__proto__', 'prototype', 'constructor'].includes(value);
export const safeId = (value: unknown): value is string => text(value, 100) && /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(value) && safeIdOrKey(value);
const optionalText = (value: unknown) => value === undefined || text(value);

export function isQuestion(value: unknown): value is ChoiceQuestion {
  if (!isRecord(value)) return false;
  if (!safeId(value.id) || !safeId(value.topicId) || !text(value.concept) || !text(value.prompt) || !text(value.explanation) || !safeId(value.correctOptionId)) return false;
  if (value.kind !== 'multiple-choice' && value.kind !== 'true-false') return false;
  if (!Array.isArray(value.options) || value.options.length < 2 || value.options.length > 6) return false;
  if (!value.options.every((o) => isRecord(o) && safeId(o.id) && text(o.label) && o.label.trim().length)) return false;
  const options = value.options as { id: string; label: string }[];
  if (new Set(options.map((o) => o.id)).size !== options.length || !options.some((o) => o.id === value.correctOptionId)) return false;
  if (value.kind === 'true-false' && (options.length !== 2 || !options.some((o) => o.label === 'True') || !options.some((o) => o.label === 'False'))) return false;
  return optionalText(value.source) && optionalText(value.sourceText) && optionalText(value.incorrectPhrase) && optionalText(value.correctedStatement);
}
function isSection(value: unknown): value is LessonSection {
  if (!isRecord(value) || !safeId(value.id) || !text(value.title) || !text(value.summary) || !text(value.recallPrompt) || !text(value.recallAnswer)) return false;
  for (const key of ['bullets', 'examples', 'controls', 'benefits', 'applicablePrinciples']) {
    if (value[key] !== undefined && !strings(value[key])) return false;
  }
  return optionalText(value.source) && (value.terms === undefined || (Array.isArray(value.terms) && value.terms.every((t) => isRecord(t) && text(t.term) && text(t.definition) && (t.notes === undefined || strings(t.notes)))));
}
export function isSubject(value: unknown): value is SubjectManifest {
  if (!isRecord(value) || !safeId(value.id) || !text(value.code) || !text(value.title) || !text(value.description) || !Array.isArray(value.topics)) return false;
  if (!value.topics.every((t) => isRecord(t) && safeId(t.id) && text(t.title) && text(t.description) && Array.isArray(t.sections) && t.sections.length > 0 && t.sections.every(isSection) && new Set(t.sections.map((s) => s.id)).size === t.sections.length)) return false;
  if (new Set(value.topics.map((t) => (t as { id: string }).id)).size !== value.topics.length) return false;
  return isRecord(value.mccumber) && strings(value.mccumber.goals) && strings(value.mccumber.states) && strings(value.mccumber.safeguards)
    && (value.reviewModes === undefined || (Array.isArray(value.reviewModes) && value.reviewModes.every((mode) => ['study', 'test', 'flashcards', 'crossword'].includes(String(mode)))));
}
function isSession(value: unknown): value is QuizSession {
  if (!isRecord(value) || !safeId(value.id) || !safeId(value.subjectId) || !text(value.title) || !['learn', 'exam'].includes(String(value.mode))) return false;
  if (!Array.isArray(value.questions) || !value.questions.length || !value.questions.every(isQuestion) || !integer(value.index) || value.index >= value.questions.length) return false;
  const questions = value.questions as ChoiceQuestion[];
  if (new Set(questions.map((q) => q.id)).size !== questions.length || !strings(value.gradedIds)) return false;
  if (!recordOf(value.answers, (v) => text(v)) || !isRecord(value.answers)) return false;
  if (!Object.entries(value.answers).every(([id, answer]) => questions.some((q) => q.id === id && q.options.some((o) => o.id === answer)))) return false;
  return value.gradedIds.every((id) => questions.some((q) => q.id === id)) && finite(value.startedAt)
    && (value.deadlineAt === undefined || finite(value.deadlineAt)) && (value.finishedAt === undefined || finite(value.finishedAt))
    && (value.timedOut === undefined || typeof value.timedOut === 'boolean')
    && (value.contentUpdated === undefined || typeof value.contentUpdated === 'boolean');
}
export function isPeriodProgress(value: unknown): value is PeriodProgress {
  if (!isRecord(value)) return false;
  return recordOf(value.positions, (p) => isRecord(p) && safeId(p.subjectId) && safeId(p.topicId) && safeId(p.sectionId) && finite(p.updatedAt))
    && strings(value.reviewedSections)
    && (value.notes === undefined || recordOf(value.notes, (note) => text(note)))
    && (value.selectedNoteId === undefined || text(value.selectedNoteId, 300))
    && recordOf(value.sessions, isSession)
    && recordOf(value.history, (h) => isRecord(h) && integer(h.attempts) && integer(h.correct) && h.correct <= h.attempts && finite(h.lastAttemptAt))
    && recordOf(value.mistakes, (m) => isRecord(m) && safeId(m.questionId) && safeId(m.subjectId) && integer(m.wrongCount) && integer(m.streak) && finite(m.dueAt) && finite(m.lastAttemptAt))
    && recordOf(value.bookmarks, (b) => isRecord(b) && safeId(b.questionId) && safeId(b.subjectId) && text(b.note) && finite(b.createdAt))
    && Array.isArray(value.results) && value.results.length <= 50 && value.results.every((r) => isRecord(r) && safeId(r.id) && safeId(r.subjectId) && text(r.title) && ['learn', 'exam'].includes(String(r.mode)) && finite(r.completedAt) && integer(r.correct) && integer(r.total) && r.total > 0 && r.correct <= r.total)
    && (value.lastActivity === undefined || (isRecord(value.lastActivity) && ['study', 'quiz'].includes(String(value.lastActivity.kind)) && safeId(value.lastActivity.subjectId) && finite(value.lastActivity.updatedAt)));
}
function isPeriod(value: unknown): value is PeriodDefinition {
  if (!isRecord(value) || !safeId(value.id) || !text(value.label, 100) || typeof value.archived !== 'boolean') return false;
  if (value.subjects === undefined && value.questions === undefined) return true;
  if (!Array.isArray(value.subjects) || !value.subjects.every(isSubject) || !recordOf(value.questions, (v) => Array.isArray(v) && v.every(isQuestion))) return false;
  const definitions = value.subjects as SubjectManifest[];
  const questions = value.questions as Record<string, ChoiceQuestion[]>;
  if (new Set(definitions.map((s) => s.id)).size !== definitions.length) return false;
  const ids = Object.values(questions).flat().map((q) => q.id);
  return new Set(ids).size === ids.length && Object.entries(questions).every(([subjectId, bank]) => {
    const subject = definitions.find((s) => s.id === subjectId);
    return !!subject && bank.every((q) => subject.topics.some((t) => t.id === q.topicId));
  });
}
export function loadLearning(storage?: Storage): LearningState {
  const fallback = defaultLearning();
  if (!storage) return fallback;
  try {
    const raw = storage.getItem(learningStorageKey);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isRecord(parsed) && parsed.version === 1 && safeId(parsed.activePeriodId) && typeof parsed.calmMascot === 'boolean' && Array.isArray(parsed.periods) && parsed.periods.length > 0 && parsed.periods.every(isPeriod) && new Set(parsed.periods.map((p) => p.id)).size === parsed.periods.length && parsed.periods.some((p) => p.id === parsed.activePeriodId && !p.archived) && recordOf(parsed.data, isPeriodProgress)) {
        const state = parsed as unknown as LearningState;
        if (state.data['2026-finals'] && state.data['2026-finals'].notes === undefined) migrateNotes(state.data['2026-finals'], storage);
        refreshFinalsSessionWording(state);
        return state;
      }
      return fallback;
    }
    // One-time migration: preserve finals learning, while global appearance/audio settings stay in their original store.
    const legacy = loadProgress(storage);
    const progress = emptyPeriod();
    migrateNotes(progress, storage);
    for (const subject of subjects) for (const topic of subject.topics) {
      if (legacy.reviewedTopicIds.includes(topic.id)) progress.reviewedSections.push(...topic.sections.map((s) => sectionKey(subject.id, topic.id, s.id)));
    }
    progress.results = legacy.recentResults.filter((r) => r.syllabusId === '2026-finals' && r.subjectId && r.total > 0 && r.correct >= 0 && r.correct <= r.total).map((r, i) => ({ id: `migrated-${i}`, subjectId: r.subjectId!, title: 'Earlier finals practice', mode: 'learn', correct: r.correct, total: r.total, completedAt: Date.parse(r.completedAt) || 0 }));
    fallback.data['2026-finals'] = progress;
  } catch { /* Continue with an empty, usable desk when storage cannot be read. */ }
  return fallback;
}
export interface SyllabusBundle { format: 'bappi-syllabus'; version: 1; period: PeriodDefinition; progress?: PeriodProgress }
function migrateNotes(progress: PeriodProgress, storage: Storage) {
  const topicIds = subjects.flatMap((s) => s.topics.map((t) => t.id));
  const saved = loadNotes(['general', ...topicIds], storage);
  progress.notes = Object.fromEntries(Object.entries(saved.notes).map(([key, note]) => [key === 'general' ? key : `cit015:${key}`, note]));
  progress.selectedNoteId = saved.selectedId === 'general' ? 'general' : `cit015:${saved.selectedId}`;
}
export function exportSyllabus(state: LearningState): SyllabusBundle {
  const period = state.periods.find((p) => p.id === state.activePeriodId)!;
  return structuredClone<SyllabusBundle>({ format: 'bappi-syllabus', version: 1, period: { ...period, ...periodContent(period) }, progress: state.data[period.id] ?? emptyPeriod() });
}
export function parseSyllabus(raw: string): SyllabusBundle {
  if (raw.length > 2_000_000) throw new Error('Choose a Bappi JSON file smaller than 2 MB.');
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { throw new Error('This file is not valid JSON.'); }
  if (!isRecord(parsed) || parsed.format !== 'bappi-syllabus' || parsed.version !== 1 || !isPeriod(parsed.period) || !parsed.period.subjects || !parsed.period.questions || (parsed.progress !== undefined && !isPeriodProgress(parsed.progress))) {
    throw new Error('This file does not match the Bappi syllabus format. Export a period from Bappi to see the supported structure.');
  }
  return parsed as unknown as SyllabusBundle;
}
