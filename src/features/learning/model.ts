import type { ChoiceQuestion, SubjectManifest } from '../../content/types';
import type { QuizAnswers } from '../test/quizEngine';
import { isQuestionCorrect, scoreQuiz } from '../test/quizEngine';

export interface PeriodDefinition {
  id: string;
  label: string;
  archived: boolean;
  subjects?: SubjectManifest[];
  questions?: Record<string, ChoiceQuestion[]>;
}
export interface QuizSession {
  id: string;
  subjectId: string;
  title: string;
  mode: 'learn' | 'exam';
  questions: ChoiceQuestion[];
  answers: QuizAnswers;
  index: number;
  gradedIds: string[];
  startedAt: number;
  deadlineAt?: number;
  finishedAt?: number;
  timedOut?: boolean;
  contentUpdated?: boolean;
}
export interface Mistake {
  questionId: string;
  subjectId: string;
  wrongCount: number;
  streak: number;
  dueAt: number;
  lastAttemptAt: number;
}
export interface Attempt {
  id: string;
  subjectId: string;
  title: string;
  mode: 'learn' | 'exam';
  completedAt: number;
  correct: number;
  total: number;
}
export interface QuestionHistory { attempts: number; correct: number; lastAttemptAt: number }
export interface Bookmark { questionId: string; subjectId: string; note: string; createdAt: number }
export interface StudyPosition { subjectId: string; topicId: string; sectionId: string; updatedAt: number }
export interface PeriodProgress {
  positions: Record<string, StudyPosition>;
  reviewedSections: string[];
  sessions: Record<string, QuizSession>;
  history: Record<string, QuestionHistory>;
  mistakes: Record<string, Mistake>;
  bookmarks: Record<string, Bookmark>;
  results: Attempt[];
  notes?: Record<string, string>;
  selectedNoteId?: string;
  lastActivity?: { kind: 'study' | 'quiz'; subjectId: string; updatedAt: number };
}
export interface LearningState {
  version: 1;
  activePeriodId: string;
  periods: PeriodDefinition[];
  data: Record<string, PeriodProgress>;
  calmMascot: boolean;
}
export const sectionKey = (subjectId: string, topicId: string, sectionId: string) => `${subjectId}/${topicId}/${sectionId}`;
export const positionKey = (subjectId: string, topicId: string) => `${subjectId}/${topicId}`;
export const emptyPeriod = (): PeriodProgress => ({ positions: {}, reviewedSections: [], sessions: {}, history: {}, mistakes: {}, bookmarks: {}, results: [] });
export const defaultLearning = (): LearningState => ({
  version: 1, activePeriodId: '2026-finals', calmMascot: false,
  periods: [{ id: '2026-finals', label: 'Finals', archived: false }, { id: '2026-midterms', label: 'Midterms', archived: false }, { id: '2026-prelims', label: 'Prelims', archived: false }],
  data: {},
});

// Apply each submission once. Exam answers are passed here only on final submission.
export function gradeAnswer(data: PeriodProgress, session: QuizSession, question: ChoiceQuestion, now: number) {
  if (session.gradedIds.includes(question.id)) return;
  const correct = isQuestionCorrect(question, session.answers[question.id]);
  const prior = data.history[question.id] ?? { attempts: 0, correct: 0, lastAttemptAt: 0 };
  data.history[question.id] = { attempts: prior.attempts + 1, correct: prior.correct + Number(correct), lastAttemptAt: now };
  const mistake = data.mistakes[question.id];
  if (!correct || mistake) {
    const streak = correct ? (mistake?.streak ?? 0) + 1 : 0;
    const days = correct ? [1, 3, 7, 14][Math.min(streak, 3)] : 1;
    data.mistakes[question.id] = {
      questionId: question.id, subjectId: session.subjectId,
      wrongCount: (mistake?.wrongCount ?? 0) + Number(!correct), streak,
      dueAt: now + days * 86_400_000, lastAttemptAt: now,
    };
  }
  session.gradedIds.push(question.id);
}
export function finishSession(data: PeriodProgress, session: QuizSession, now: number, timedOut = false) {
  if (session.finishedAt !== undefined) return;
  for (const question of session.questions) gradeAnswer(data, session, question, now);
  session.finishedAt = now;
  session.timedOut = timedOut;
  const score = scoreQuiz(session.questions, session.answers);
  data.results = [{ id: session.id, subjectId: session.subjectId, title: session.title, mode: session.mode, completedAt: now, correct: score.correct, total: score.total }, ...data.results].slice(0, 50);
}
export function dueMistakes(data: PeriodProgress, now: number, subjectId?: string) {
  return Object.values(data.mistakes).filter((item) => item.dueAt <= now && (!subjectId || item.subjectId === subjectId)).sort((a, b) => a.dueAt - b.dueAt);
}
export function learningStats(data: PeriodProgress, subjects: SubjectManifest[], questions: ChoiceQuestion[]) {
  const keys = new Set(subjects.flatMap((subject) => subject.topics.flatMap((topic) => topic.sections.map((section) => sectionKey(subject.id, topic.id, section.id)))));
  const concepts = new Set(questions.map((q) => `${q.topicId}:${q.concept}`));
  const practiced = new Set(questions.filter((q) => data.history[q.id]).map((q) => `${q.topicId}:${q.concept}`));
  const results = data.results.filter((result) => subjects.some((s) => s.id === result.subjectId));
  const total = results.reduce((sum, r) => sum + r.total, 0);
  return {
    reviewed: data.reviewedSections.filter((key) => keys.has(key)).length,
    sections: keys.size, practiced: practiced.size, concepts: concepts.size,
    accuracy: total ? Math.round(results.reduce((sum, r) => sum + r.correct, 0) / total * 100) : null,
  };
}
export function weakestConcept(data: PeriodProgress, banks: Record<string, ChoiceQuestion[]>) {
  const groups = new Map<string, { subjectId: string; topicId: string; concept: string; correct: number; attempts: number }>();
  for (const [subjectId, questions] of Object.entries(banks)) for (const question of questions) {
    const history = data.history[question.id];
    if (!history) continue;
    const key = `${subjectId}:${question.topicId}:${question.concept}`;
    const group = groups.get(key) ?? { subjectId, topicId: question.topicId, concept: question.concept, correct: 0, attempts: 0 };
    group.correct += history.correct; group.attempts += history.attempts; groups.set(key, group);
  }
  return [...groups.values()].filter((g) => g.attempts).map((group) => ({ ...group, accuracy: group.correct / group.attempts })).sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts)[0];
}
