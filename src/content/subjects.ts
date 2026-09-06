import { cit016Subject } from './cit016';
import { cit016FlashcardDecks } from './cit016/flashcards';
import { cit016TestSets, cit016TestTopicLabels } from './cit016/questions';
import { cit017Subject } from './cit017';
import { cit017FlashcardDecks } from './cit017/flashcards';
import { cit017TestSets, testSetTopicLabels } from './cit017/questions';

const subjectTests = {
  cit016: { sets: cit016TestSets, labels: cit016TestTopicLabels },
  cit017: { sets: cit017TestSets, labels: testSetTopicLabels },
};

const subjectFlashcards = {
  cit016: cit016FlashcardDecks,
  cit017: cit017FlashcardDecks,
};

export const subjects = [cit016Subject, cit017Subject];

export function getSubject(subjectId: string | undefined) {
  return subjects.find((subject) => subject.id === subjectId);
}

export function getSubjectTests(subjectId: string | undefined) {
  return subjectId && subjectId in subjectTests
    ? subjectTests[subjectId as keyof typeof subjectTests]
    : undefined;
}

export function getSubjectFlashcards(subjectId: string | undefined) {
  return subjectId && subjectId in subjectFlashcards
    ? subjectFlashcards[subjectId as keyof typeof subjectFlashcards]
    : undefined;
}
