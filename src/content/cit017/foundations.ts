import type { LessonTopic } from '../types';

export const mccumberDimensions = {
  goals: ['Confidentiality', 'Integrity', 'Availability'],
  states: ['Storage', 'Processing', 'Transmission'],
  safeguards: ['Technology', 'Policy and practices', 'Education, training, and awareness'],
} as const;

export const foundationsTopic: LessonTopic = {
  id: 'foundations',
  title: 'Foundations of Information Security',
  description: 'The CIA Triad, AAA Framework, and McCumber Cube.',
  sections: [
    {
      id: 'cia-triad',
      title: 'CIA Triad',
      summary: 'A fundamental framework in cybersecurity used to guide policies, strategies, and controls to protect data and maintain secure, reliable systems.',
      bullets: ['Confidentiality', 'Integrity', 'Availability'],
      recallPrompt: 'What are the three parts of the CIA Triad?',
      recallAnswer: 'Confidentiality, Integrity, and Availability.',
    },
    {
      id: 'confidentiality',
      title: 'Confidentiality',
      summary: 'Ensures that information is accessible only to authorized individuals, systems, or processes. The goal is to prevent unauthorized disclosure of sensitive information.',
      examples: [
        'Student grades can only be viewed by authorized faculty members.',
        'Hospital records can only be accessed by doctors and authorized staff.',
        'Payroll information is only available to HR personnel.',
      ],
      controls: ['User authentication', 'Access control', 'Encryption', 'Strong passwords'],
      recallPrompt: 'Which CIA property prevents unauthorized disclosure?',
      recallAnswer: 'Confidentiality.',
    },
    {
      id: 'integrity',
      title: 'Integrity',
      summary: 'Ensures that information remains accurate, complete, and unaltered except by authorized users. Data should not be modified accidentally or maliciously.',
      examples: [
        'Bank account balances must remain accurate.',
        'Election results must not be altered.',
        'Medical prescriptions should not be changed without authorization.',
      ],
      controls: ['Digital signatures', 'Checksums', 'Version control', 'Access controls'],
      recallPrompt: 'Which CIA property keeps information accurate and unaltered?',
      recallAnswer: 'Integrity.',
    },
    {
      id: 'availability',
      title: 'Availability',
      summary: 'Ensures that information and services are accessible whenever authorized users need them. A secure system is useless if legitimate users cannot access it.',
      examples: ['Online banking should be available 24/7.', 'Hospital systems should always be operational.'],
      controls: ['Backup systems', 'UPS', 'Cloud services', 'Preventive maintenance'],
      recallPrompt: 'Which CIA property means authorized users can access systems when needed?',
      recallAnswer: 'Availability.',
    },
    {
      id: 'aaa-framework',
      title: 'AAA Framework',
      summary: 'A framework used to manage access to computer resources, enforce policies, and audit user activity. It ensures that only legitimate users can access resources, defines what they are allowed to do, and records their actions for accountability and auditing purposes.',
      bullets: ['Authentication', 'Authorization', 'Accounting'],
      recallPrompt: 'What are the three parts of the AAA Framework?',
      recallAnswer: 'Authentication, Authorization, and Accounting.',
    },
    {
      id: 'authentication',
      title: 'Authentication',
      summary: 'Verifies the identity of a user before access is granted. It confirms that users are who they claim to be.',
      bullets: [
        'Something you know: password or PIN',
        'Something you have: smart card, OTP, or mobile phone',
        'Something you are: fingerprint, face recognition, or iris scan',
      ],
      recallPrompt: 'What question does authentication answer?',
      recallAnswer: 'Who are you?',
    },
    {
      id: 'authorization',
      title: 'Authorization',
      summary: 'Determines what an authenticated user is allowed to access. Different users receive different permissions.',
      examples: [
        'A student can view grades and register courses, but cannot edit grades.',
        'A faculty member can enter grades and manage classes, but cannot approve payroll.',
      ],
      recallPrompt: 'What question does authorization answer?',
      recallAnswer: 'What are you allowed to do?',
    },
    {
      id: 'accounting',
      title: 'Accounting (Auditing)',
      summary: 'Records all user activities performed within the system and provides accountability.',
      bullets: ['Who logged in', 'What was accessed', 'What changes were made', 'When activities occurred'],
      benefits: ['Detect attacks', 'Investigate incidents', 'Monitor employee activities', 'Support compliance', 'Produce audit reports'],
      recallPrompt: 'Which AAA function records user activity?',
      recallAnswer: 'Accounting, also called auditing.',
    },
    {
      id: 'mccumber-cube',
      title: 'McCumber Cube',
      summary: 'A three-dimensional information security model. Its 27 intersections connect a security goal, an information state, and a safeguard so protection is considered from more than one angle.',
      bullets: [
        'Security goals: Confidentiality, Integrity, Availability',
        'Information states: Storage, Processing, Transmission',
        'Safeguards: Technology; Policy and practices; Education, training, and awareness',
      ],
      examples: ['Use encryption technology to protect confidentiality while information is being transmitted.'],
      recallPrompt: 'What three dimensions make up the McCumber Cube?',
      recallAnswer: 'Security goals, information states, and safeguards.',
    },
  ],
};
