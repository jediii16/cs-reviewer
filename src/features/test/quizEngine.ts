import type { ChoiceQuestion, QuizTopic } from '../../content/types';

export type QuizFilter = QuizTopic | 'mixed';
export type QuizAnswers = Record<string, string>;

export interface TopicScore {
  correct: number;
  total: number;
}

export interface QuizScore {
  correct: number;
  total: number;
  percent: number;
  byTopic: Partial<Record<QuizTopic, TopicScore>>;
}

function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

export function createQuiz(
  questions: readonly ChoiceQuestion[],
  filter: QuizFilter,
  count: number,
  random: () => number = Math.random,
): ChoiceQuestion[] {
  const eligible = filter === 'mixed'
    ? questions
    : questions.filter((question) => question.topicId === filter);

  return shuffled(eligible, random)
    .slice(0, Math.max(0, count))
    .map((question) => ({ ...question, options: shuffled(question.options, random) }));
}

export function scoreQuiz(questions: readonly ChoiceQuestion[], answers: QuizAnswers): QuizScore {
  const byTopic: Partial<Record<QuizTopic, TopicScore>> = {};
  let correct = 0;

  for (const question of questions) {
    const isCorrect = answers[question.id] === question.correctOptionId;
    if (isCorrect) correct += 1;
    const current = byTopic[question.topicId] ?? { correct: 0, total: 0 };
    byTopic[question.topicId] = {
      correct: current.correct + (isCorrect ? 1 : 0),
      total: current.total + 1,
    };
  }

  return {
    correct,
    total: questions.length,
    percent: questions.length === 0 ? 0 : Math.round((correct / questions.length) * 100),
    byTopic,
  };
}

export function getMissedQuestions(
  questions: readonly ChoiceQuestion[],
  answers: QuizAnswers,
): ChoiceQuestion[] {
  return questions.filter((question) => answers[question.id] !== question.correctOptionId);
}
