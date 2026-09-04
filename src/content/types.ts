export interface LessonSection {
  id: string;
  title: string;
  summary: string;
  bullets?: string[];
  examples?: string[];
  controls?: string[];
  benefits?: string[];
  applicablePrinciples?: string[];
  recallPrompt: string;
  recallAnswer: string;
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

export type QuizTopic = 'threats' | 'cia' | 'principles' | 'social';

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

export interface IdentificationQuestion extends BaseQuestion {
  kind: 'identification';
  correctAnswer: string;
  acceptableAnswers: string[];
}

export interface TrueFalseQuestion extends BaseQuestion {
  kind: 'true-false';
  correctAnswer: boolean;
}

export type QuizQuestion = ChoiceQuestion | IdentificationQuestion | TrueFalseQuestion;
