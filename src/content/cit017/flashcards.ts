import type { Flashcard, FlashcardDeck } from '../types';
import { psychologicalTactics, socialTechniques } from './social';
import { securityPrinciples } from './principles';
import { threatCategories } from './threats';

const foundationCards: Flashcard[] = [
  {
    id: 'flash-foundation-cia-triad',
    topicId: 'cia',
    prompt: 'What framework uses Confidentiality, Integrity, and Availability to guide security policies, strategies, and controls?',
    answer: 'CIA Triad',
    detail: 'It protects data and helps maintain secure, reliable systems.',
  },
  {
    id: 'flash-foundation-confidentiality',
    topicId: 'cia',
    prompt: 'Which CIA property ensures information is accessible only to authorized individuals, systems, or processes?',
    answer: 'Confidentiality',
    detail: 'Its goal is to prevent unauthorized disclosure of sensitive information.',
  },
  {
    id: 'flash-foundation-integrity',
    topicId: 'cia',
    prompt: 'Which CIA property keeps information accurate, complete, and unaltered except by authorized users?',
    answer: 'Integrity',
    detail: 'Data should not be modified accidentally or maliciously.',
  },
  {
    id: 'flash-foundation-availability',
    topicId: 'cia',
    prompt: 'Which CIA property keeps information and services accessible whenever authorized users need them?',
    answer: 'Availability',
    detail: 'A secure system is useless if legitimate users cannot access it.',
  },
  {
    id: 'flash-foundation-confidentiality-controls',
    topicId: 'cia',
    prompt: 'Which CIA property uses user authentication, access control, encryption, and strong passwords as controls?',
    answer: 'Confidentiality',
  },
  {
    id: 'flash-foundation-integrity-controls',
    topicId: 'cia',
    prompt: 'Which CIA property uses digital signatures, checksums, version control, and access controls?',
    answer: 'Integrity',
  },
  {
    id: 'flash-foundation-availability-controls',
    topicId: 'cia',
    prompt: 'Which CIA property uses backup systems, UPS, cloud services, and preventive maintenance?',
    answer: 'Availability',
  },
  {
    id: 'flash-foundation-aaa',
    topicId: 'cia',
    prompt: 'Which framework manages access to computer resources, enforces policies, and audits user activity?',
    answer: 'AAA Framework',
    detail: 'AAA stands for Authentication, Authorization, and Accounting.',
  },
  {
    id: 'flash-foundation-authentication',
    topicId: 'cia',
    prompt: 'Which AAA function verifies the identity of a user before access is granted?',
    answer: 'Authentication',
    detail: 'It confirms that users are who they claim to be.',
  },
  {
    id: 'flash-foundation-know',
    topicId: 'cia',
    prompt: 'Which authentication-factor group includes a password and PIN?',
    answer: 'Something You Know',
  },
  {
    id: 'flash-foundation-have',
    topicId: 'cia',
    prompt: 'Which authentication-factor group includes a smart card, OTP, and mobile phone?',
    answer: 'Something You Have',
  },
  {
    id: 'flash-foundation-are',
    topicId: 'cia',
    prompt: 'Which authentication-factor group includes a fingerprint, face recognition, and iris scan?',
    answer: 'Something You Are',
  },
  {
    id: 'flash-foundation-authorization',
    topicId: 'cia',
    prompt: 'Which AAA function determines what an authenticated user is allowed to access?',
    answer: 'Authorization',
    detail: 'Different users receive different permissions.',
  },
  {
    id: 'flash-foundation-accounting',
    topicId: 'cia',
    prompt: 'Which AAA function records all user activities performed within a system and provides accountability?',
    answer: 'Accounting (Auditing)',
  },
  {
    id: 'flash-foundation-accounting-records',
    topicId: 'cia',
    prompt: 'Which AAA function records who logged in, what was accessed or changed, and when activities occurred?',
    answer: 'Accounting (Auditing)',
    detail: 'It helps detect attacks, investigate incidents, monitor activity, support compliance, and produce audit reports.',
  },
  {
    id: 'flash-foundation-mccumber-dimensions',
    topicId: 'cia',
    prompt: 'What are the three dimensions of the McCumber Cube?',
    answer: 'Security goals, information states, and safeguards',
    detail: 'Goals: CIA. States: Storage, Processing, Transmission. Safeguards: Technology, Policy and practices, Education/training/awareness.',
  },
  {
    id: 'flash-foundation-mccumber-intersections',
    topicId: 'cia',
    prompt: 'How many intersections does the McCumber Cube contain?',
    answer: '27 intersections',
    detail: 'Three goals × three information states × three safeguard categories.',
  },
];

const principleCards: Flashcard[] = securityPrinciples.map((principle) => ({
  id: `flash-principle-${principle.id}`,
  topicId: 'principles',
  prompt: principle.definition,
  answer: principle.name,
  detail: principle.example,
}));

const threatCards: Flashcard[] = threatCategories.map((category) => ({
  id: `flash-threat-${category.id}`,
  topicId: 'threats',
  prompt: `Which threat category includes: ${category.example}?`,
  answer: category.name,
}));

const techniqueCards: Flashcard[] = socialTechniques.map((technique) => ({
  id: `flash-social-${technique.id}`,
  topicId: 'social',
  prompt: technique.description,
  answer: technique.name,
  detail: technique.example,
}));

const tacticCards: Flashcard[] = psychologicalTactics.map((tactic) => ({
  id: `flash-tactic-${tactic.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  topicId: 'social',
  prompt: `Which psychological tactic is shown here? ${tactic.example}`,
  answer: tactic.name,
}));

export const cit017FlashcardDecks: FlashcardDeck[] = [
  {
    id: 'foundations',
    title: 'Foundations',
    description: 'CIA, AAA, authentication factors, auditing, and the McCumber Cube.',
    cards: foundationCards,
  },
  {
    id: 'principles',
    title: 'Security Principles',
    description: 'Identify each of the nine principles from its definition.',
    cards: principleCards,
  },
  {
    id: 'threats',
    title: 'Threat Categories',
    description: 'Recall every threat category from its supplied attack examples.',
    cards: threatCards,
  },
  {
    id: 'social',
    title: 'Social Engineering',
    description: 'All techniques and psychological tactics in one self-check deck.',
    cards: [...techniqueCards, ...tacticCards],
  },
];
