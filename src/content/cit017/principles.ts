import type { LessonTopic } from '../types';

export interface SecurityPrinciple {
  id: string;
  name: string;
  definition: string;
  benefits?: string[];
  example: string;
}

export const securityPrinciples: SecurityPrinciple[] = [
  {
    id: 'least-privilege',
    name: 'Least Privilege',
    definition: 'Users should receive only the minimum permissions necessary.',
    benefits: ['Reduces accidental damage', 'Limits insider threats', 'Minimizes attack impact'],
    example: 'An accounting clerk cannot access HR records.',
  },
  {
    id: 'need-to-know',
    name: 'Need-to-Know Principle',
    definition: 'Even if users belong to a department, they should access only the information required for their specific tasks.',
    example: 'A nurse accesses only the records of patients under their care.',
  },
  {
    id: 'separation-of-duties',
    name: 'Separation of Duties',
    definition: 'Critical tasks should be divided among multiple individuals.',
    benefits: ['Prevents fraud', 'Prevents abuse of authority', 'Improves accountability'],
    example: 'One employee approves purchases, another processes payment, and a third performs auditing.',
  },
  {
    id: 'defense-in-depth',
    name: 'Defense in Depth',
    definition: 'Security should consist of multiple layers rather than relying on a single control. If one layer fails, the others continue to protect the system.',
    example: 'Layers include physical security, firewalls, antivirus, encryption, access control, intrusion detection systems, and security awareness training.',
  },
  {
    id: 'fail-safe',
    name: 'Fail-Safe (Secure by Default)',
    definition: 'When a system encounters an error or failure, it should default to a secure state.',
    example: 'If a user cannot be authenticated due to a system error, access should be denied rather than granted.',
  },
  {
    id: 'security-by-design',
    name: 'Security by Design',
    definition: 'Security should be considered from the beginning of system development, not added after deployment.',
    example: 'Conduct threat modeling during system design, validate inputs to prevent SQL injection, and use secure coding practices.',
  },
  {
    id: 'complete-mediation',
    name: 'Principle of Complete Mediation',
    definition: 'Every request to access a resource should be checked for authorization rather than relying solely on previous approvals.',
    example: 'Each time a user opens a confidential document, the system verifies that the user still has permission to access it.',
  },
  {
    id: 'economy-of-mechanism',
    name: 'Economy of Mechanism (Keep it Simple)',
    definition: 'Security mechanisms should be as simple as possible while remaining effective. Simpler systems are easier to understand, maintain, and verify, reducing the chance of security flaws.',
    example: 'Use a well-designed authentication process instead of a complex series of unnecessary security steps.',
  },
  {
    id: 'open-design',
    name: 'Open Design',
    definition: 'The security of a system should not depend on keeping its design secret. It should rely on strong algorithms, secure implementations, and well-managed secret keys or credentials.',
    example: 'Modern encryption standards such as AES are publicly known, but the encryption key remains secret.',
  },
];

export const principleScenarios = [
  {
    id: 'payroll-audit',
    title: 'Municipality payroll audit',
    scenario: 'A municipality uses an online payroll system. Salary adjustments, overtime approvals, and payroll releases are recorded, but audit reports do not show who approved a change, which workstation was used, or when it happened. Auditors cannot reconstruct the sequence of events.',
    answer: 'Principle of Complete Mediation',
    applicablePrinciples: ['Principle of Complete Mediation', 'Separation of Duties', 'Least Privilege', 'Security by Design'],
    implementation: 'Record details for every salary adjustment, overtime approval, and payroll correction, and re-check authorization whenever a sensitive payroll record is accessed or modified.',
  },
  {
    id: 'procurement-control',
    title: 'Government procurement control',
    scenario: 'A senior procurement officer can initiate purchase requests, approve supplier selection, certify delivery, and authorize payment. Auditors identify the concentration of responsibilities as a risk.',
    answer: 'Separation of Duties',
    applicablePrinciples: ['Separation of Duties', 'Least Privilege', 'Principle of Complete Mediation', 'Defense in Depth'],
    implementation: 'Use separate employees to create requests, approve suppliers, certify deliveries, and authorize payments.',
  },
  {
    id: 'exam-records',
    title: 'University examination records',
    scenario: 'An examination system stores final scores but does not preserve previous versions after changes. Administrators cannot determine whether differences came from review-stage changes or data-entry errors.',
    answer: 'Principle of Complete Mediation',
    applicablePrinciples: ['Principle of Complete Mediation', 'Separation of Duties', 'Least Privilege', 'Security by Design'],
    implementation: 'Record original and modified scores, who made each change, who approved it, and require authorization before a submitted grade can be changed.',
  },
] as const;

export const principlesTopic: LessonTopic = {
  id: 'security-principles',
  title: 'Security Principles',
  description: 'Nine principles that guide the design and operation of secure systems.',
  sections: [
    ...securityPrinciples.map((principle) => ({
      id: principle.id,
      title: principle.name,
      summary: principle.definition,
      bullets: principle.benefits,
      examples: [principle.example],
      recallPrompt: `What does ${principle.name} require?`,
      recallAnswer: principle.definition,
    })),
    ...principleScenarios.map((scenario) => ({
      id: scenario.id,
      title: scenario.title,
      summary: scenario.scenario,
      applicablePrinciples: [...scenario.applicablePrinciples],
      examples: [scenario.implementation],
      recallPrompt: 'Which security principle best applies?',
      recallAnswer: scenario.answer,
    })),
  ],
};
