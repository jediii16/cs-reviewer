import { cit015Subject } from './cit015';
import { cit015TestSets, cit015TestTopicLabels } from './cit015/questions';
import type { FlashcardDeck } from './types';

// Only the current finals syllabus is registered. Add other subjects when their finals lessons arrive.
export const subjects = [cit015Subject];

export function getSubject(subjectId: string | undefined) {
  return subjects.find((subject) => subject.id === subjectId);
}

export function getSubjectTests(subjectId: string | undefined) {
  return subjectId === 'cit015'
    ? { sets: cit015TestSets, labels: cit015TestTopicLabels }
    : undefined;
}

// Keep the reusable flashcard mode available for future syllabi.
const subjectFlashcards: Record<string, FlashcardDeck[]> = {};
export function getSubjectFlashcards(subjectId: string | undefined) {
  return subjectId ? subjectFlashcards[subjectId] : undefined;
}
