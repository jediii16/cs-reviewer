export interface LessonSection {
  id: string;
  title: string;
  summary: string;
  source?: string;
  bullets?: string[];
  examples?: string[];
  controls?: string[];
  benefits?: string[];
  applicablePrinciples?: string[];
  terms?: GlossaryEntry[];
  recallPrompt: string;
  recallAnswer: string;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  notes?: string[];
}

export type TheoryModule = string;

export interface TheoryTerm {
  id: string;
  module: TheoryModule;
  answer: string;
  displayAnswer: string;
  clue: string;
}

export interface LessonTopic {
  id: string;
  title: string;
  description: string;
  sections: LessonSection[];
}

export interface McCumberDimensions {
  goals: readonly string[];
  states: readonly string[];
  safeguards: readonly string[];
}

export interface SubjectManifest {
  id: string;
  code: string;
  title: string;
  description: string;
  topics: LessonTopic[];
  mccumber: McCumberDimensions;
  reviewModes?: Array<'study' | 'flashcards' | 'test' | 'crossword'>;
}

export type QuizTopic = string;

export interface QuestionOption {
  id: string;
  label: string;
}

interface BaseQuestion {
  id: string;
  topicId: QuizTopic;
  concept: string;
  prompt: string;
  explanation: string;
  source?: string;
  sourceText?: string;
  incorrectPhrase?: string;
  correctedStatement?: string;
}

export interface ChoiceQuestion extends BaseQuestion {
  kind: 'multiple-choice' | 'true-false';
  options: QuestionOption[];
  correctOptionId: string;
}

export interface TestSet {
  id: string;
  topicId: QuizTopic;
  title: string;
  description: string;
  instruction?: string;
  questions: ChoiceQuestion[];
  questionLimit?: number;
  balanceTopics?: boolean;
  balanceKinds?: boolean;
}

export interface Flashcard {
  id: string;
  topicId: QuizTopic;
  prompt: string;
  answer: string;
  detail?: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  cards: Flashcard[];
}

export type QuizQuestion = ChoiceQuestion;
