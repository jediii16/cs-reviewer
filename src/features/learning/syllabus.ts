import { subjects as finalsSubjects } from '../../content/subjects';
import { cit015TestSets } from '../../content/cit015/questions';
import type { ChoiceQuestion } from '../../content/types';
import type { LearningState, PeriodDefinition } from './model';

export const finalsQuestions = cit015TestSets.slice(0, 4).flatMap((set) => set.questions);
export function periodContent(period: PeriodDefinition) {
  return {
    subjects: period.subjects ?? (period.id === '2026-finals' ? finalsSubjects : []),
    questions: period.questions ?? (period.id === '2026-finals' ? { cit015: finalsQuestions } : {} as Record<string, ChoiceQuestion[]>),
  };
}
export function activeContent(state: LearningState) {
  const period = state.periods.find((item) => item.id === state.activePeriodId) ?? state.periods[0];
  return { period, ...periodContent(period) };
}
