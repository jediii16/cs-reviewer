export interface LessonSection {
  id: string;
  title: string;
  summary: string;
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
}

export interface ChoiceQuestion extends BaseQuestion {
  kind: 'multiple-choice';
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
