import type { LessonTopic } from '../types';

export const threatCategories = [
  { id: 'intellectual-property', name: 'Compromises to intellectual property', example: 'Piracy, copyright infringement' },
  { id: 'quality-of-service', name: 'Deviations in quality of service', example: 'Internet service provider (ISP), power, or WAN service problems' },
  { id: 'espionage-trespass', name: 'Espionage or trespass', example: 'Unauthorized access and/or data collection' },
  { id: 'forces-of-nature', name: 'Forces of nature', example: 'Fire, floods, earthquakes, lightning' },
  { id: 'human-error', name: 'Human error or failure', example: 'Accidents, employee mistakes' },
  { id: 'information-extortion', name: 'Information extortion', example: 'Blackmail, information disclosure' },
  { id: 'sabotage-vandalism', name: 'Sabotage or vandalism', example: 'Destruction of systems or information' },
  { id: 'software-attacks', name: 'Software attacks', example: 'Viruses, worms, macros, denial of service' },
  { id: 'hardware-failures', name: 'Technical hardware failures or errors', example: 'Equipment failure' },
  { id: 'software-failures', name: 'Technical software failures or errors', example: 'Bugs, code problems, unknown loopholes' },
  { id: 'obsolescence', name: 'Technological obsolescence', example: 'Antiquated or outdated technologies' },
  { id: 'theft', name: 'Theft', example: 'Illegal confiscation of equipment or information' },
] as const;

export const threatsTopic: LessonTopic = {
  id: 'threat-categories',
  title: 'Categories of Threats',
  description: 'Twelve categories used to identify threats to information security.',
  sections: threatCategories.map((category) => ({
    id: category.id,
    title: category.name,
    summary: category.example,
    examples: [category.example],
    recallPrompt: `Which threat category includes ${category.example.toLowerCase()}?`,
    recallAnswer: category.name,
  })),
};
