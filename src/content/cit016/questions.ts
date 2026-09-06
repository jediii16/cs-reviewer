import type { ChoiceQuestion, LessonTopic, TestSet } from '../types';
import { cit016Subject } from './index';

function buildQuestions(topic: LessonTopic): ChoiceQuestion[] {
  const answerPool = topic.sections.map((section) => section.recallAnswer);

  return topic.sections.map((section, index) => {
    const optionLabels = [
      section.recallAnswer,
      ...Array.from({ length: topic.sections.length - 1 }, (_, offset) => (
        answerPool[(index + offset + 1) % answerPool.length]
      )),
    ].filter((label, optionIndex, labels) => labels.indexOf(label) === optionIndex).slice(0, 4);

    const options = optionLabels.map((label, optionIndex) => ({
      id: `${section.id}-option-${optionIndex + 1}`,
      label,
    }));

    return {
      id: `cit016-${section.id}`,
      topicId: topic.id,
      concept: section.title,
      prompt: section.recallPrompt,
      explanation: section.summary,
      options,
      correctOptionId: options[0].id,
      kind: 'multiple-choice' as const,
    };
  });
}

export const cit016TestSets: TestSet[] = cit016Subject.topics.map((topic) => ({
  id: `cit016-${topic.id}`,
  topicId: topic.id,
  title: topic.title,
  description: `Complete source coverage for ${topic.description.toLowerCase()}`,
  questions: buildQuestions(topic),
}));

export const cit016Questions = cit016TestSets.flatMap((set) => set.questions);

export const cit016TestTopicLabels = Object.fromEntries(
  cit016Subject.topics.map((topic) => [topic.id, topic.title]),
);
