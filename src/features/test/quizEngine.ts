import type { QuizQuestion, QuizTopic } from '../../content/types';

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
  questions: readonly QuizQuestion[],
  filter: QuizFilter,
  count: number,
  random: () => number = Math.random,
): QuizQuestion[] {
  const eligible = filter === 'mixed'
    ? questions
    : questions.filter((question) => question.topicId === filter);

  const selected: QuizQuestion[] = [];
  const requestedCount = Math.max(0, count);

  if (filter === 'mixed') {
    const topics = shuffled([...new Set(eligible.map((question) => question.topicId))], random);
    const reservedKinds = shuffled([...new Set(eligible.map((question) => question.kind))], random);
    for (let index = 0; index < topics.length && selected.length < requestedCount; index += 1) {
      const topic = topics[index];
      const preferredKind = reservedKinds[index % reservedKinds.length];
      const candidates = eligible.filter((question) => (
        question.topicId === topic
        && question.kind === preferredKind
        && !selected.some((item) => item.id === question.id)
      ));
      const fallback = eligible.filter((question) => (
        question.topicId === topic && !selected.some((item) => item.id === question.id)
      ));
      const next = shuffled(candidates.length ? candidates : fallback, random)[0];
      if (next) selected.push(next);
    }
  }

  const remaining = eligible.filter((question) => !selected.some((item) => item.id === question.id));
  const kinds = shuffled([...new Set(remaining.map((question) => question.kind))], random);
  const groups = new Map(kinds.map((kind) => [
    kind,
    shuffled(remaining.filter((question) => question.kind === kind), random),
  ]));

  while (selected.length < requestedCount) {
    let added = false;
    for (const kind of kinds) {
      const next = groups.get(kind)?.shift();
      if (next) {
        selected.push(next);
        added = true;
        if (selected.length === count) break;
      }
    }
    if (!added) break;
  }

  return shuffled(selected, random).map((question) => question.kind === 'multiple-choice'
    ? { ...question, options: shuffled(question.options, random) }
    : { ...question });
}

function normalizeAnswer(value: string): string {
  return value
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function isQuestionCorrect(question: QuizQuestion, answer = ''): boolean {
  if (question.kind === 'multiple-choice') return answer === question.correctOptionId;
  if (question.kind === 'true-false') return answer === String(question.correctAnswer);
  const normalized = normalizeAnswer(answer);
  return question.acceptableAnswers.some((acceptable) => normalizeAnswer(acceptable) === normalized);
}

export function getCorrectAnswerLabel(question: QuizQuestion): string {
  if (question.kind === 'multiple-choice') {
    return question.options.find((option) => option.id === question.correctOptionId)?.label ?? question.concept;
  }
  if (question.kind === 'true-false') return question.correctAnswer ? 'True' : 'False';
  return question.correctAnswer;
}

export function scoreQuiz(questions: readonly QuizQuestion[], answers: QuizAnswers): QuizScore {
  const byTopic: Partial<Record<QuizTopic, TopicScore>> = {};
  let correct = 0;

  for (const question of questions) {
    const isCorrect = isQuestionCorrect(question, answers[question.id]);
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
  questions: readonly QuizQuestion[],
  answers: QuizAnswers,
): QuizQuestion[] {
  return questions.filter((question) => !isQuestionCorrect(question, answers[question.id]));
}
