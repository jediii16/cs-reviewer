export interface LessonSection {
  id: string;
  title: string;
  summary: string;
  bullets?: string[];
  examples?: string[];
  controls?: string[];
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

export interface ChoiceQuestion {
  id: string;
  topicId: QuizTopic;
  concept: string;
  prompt: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
}
