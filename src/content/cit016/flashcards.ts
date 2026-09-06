import type { FlashcardDeck } from '../types';
import { cit016Subject } from './index';

export const cit016FlashcardDecks: FlashcardDeck[] = cit016Subject.topics.map((topic) => ({
  id: `cit016-${topic.id}`,
  title: topic.title,
  description: topic.description,
  cards: topic.sections.map((section) => ({
    id: `cit016-flash-${section.id}`,
    topicId: topic.id,
    prompt: section.recallPrompt,
    answer: section.recallAnswer,
    detail: section.summary,
  })),
}));
