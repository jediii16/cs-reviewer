import { finalsQuestions } from './syllabus';
import type { LearningState } from './model';

// Built-in sessions store snapshots. Refresh their wording without changing question/option order,
// checked answers, scores, timers, bookmarks, or user-authored/imported syllabi.
export function refreshFinalsSessionWording(state: LearningState) {
  const builtin = state.periods.find((period) => period.id === '2026-finals');
  if (!builtin || builtin.questions !== undefined) return;
  const sessions = state.data['2026-finals']?.sessions;
  if (!sessions) return;
  const bank = new Map(finalsQuestions.map((question) => [question.id, question]));
  for (const session of Object.values(sessions)) {
    if (session.subjectId !== 'cit015') continue;
    session.questions = session.questions.map((snapshot) => {
      const current = bank.get(snapshot.id);
      if (!current || snapshot.kind !== current.kind || snapshot.correctOptionId !== current.correctOptionId) return snapshot;
      const sameOptions = snapshot.options.length === current.options.length && snapshot.options.every((option) => current.options.some((candidate) => candidate.id === option.id));
      if (!sameOptions) return snapshot;
      const options = snapshot.options.map((option) => current.options.find((candidate) => candidate.id === option.id)!);
      const refreshed = { ...current, options };
      if (JSON.stringify(snapshot) === JSON.stringify(refreshed)) return snapshot;
      if (session.finishedAt === undefined && !session.gradedIds.includes(snapshot.id)) delete session.answers[snapshot.id];
      session.contentUpdated = true;
      return refreshed;
    });
  }
}
