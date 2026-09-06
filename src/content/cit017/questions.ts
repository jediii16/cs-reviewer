import type { ChoiceQuestion, QuizTopic, TestSet } from '../types';
import { securityPrinciples } from './principles';
import { psychologicalTactics, socialTechniques } from './social';
import { threatCategories } from './threats';

function optionId(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function makeQuestion(
  id: string,
  topicId: QuizTopic,
  concept: string,
  prompt: string,
  labels: readonly string[],
  explanation: string,
): ChoiceQuestion {
  return {
    kind: 'multiple-choice',
    id,
    topicId,
    concept,
    prompt,
    options: labels.map((label) => ({ id: optionId(label), label })),
    correctOptionId: optionId(concept),
    explanation,
  };
}

function nearbyOptions(labels: readonly string[], correctIndex: number): string[] {
  return Array.from({ length: Math.min(4, labels.length) }, (_, offset) => (
    labels[(correctIndex + offset) % labels.length]
  ));
}

const ciaOptions = ['Confidentiality', 'Integrity', 'Availability'] as const;

const ciaScenarioQuestions: ChoiceQuestion[] = [
  makeQuestion('cia-conf-grades', 'cia', 'Confidentiality', 'A university must ensure that only authorized faculty members can view student grades. Which CIA property is the priority?', ciaOptions, 'Confidentiality ensures information is accessible only to authorized individuals, systems, or processes.'),
  makeQuestion('cia-conf-records', 'cia', 'Confidentiality', 'A hospital encrypts patient records so unauthorized people cannot read them. Which CIA property is being protected?', ciaOptions, 'Preventing unauthorized disclosure protects confidentiality.'),
  makeQuestion('cia-conf-payroll', 'cia', 'Confidentiality', 'Payroll information must be visible only to HR personnel. Which CIA property is the priority?', ciaOptions, 'Restricting payroll data to authorized HR personnel protects confidentiality.'),
  makeQuestion('cia-int-bank', 'cia', 'Integrity', 'A bank needs assurance that account balances remain accurate and are not changed without authorization. Which CIA property is the priority?', ciaOptions, 'Integrity keeps information accurate, complete, and unaltered except by authorized users.'),
  makeQuestion('cia-int-election', 'cia', 'Integrity', 'Election results must not be altered after votes are counted. Which CIA property is the priority?', ciaOptions, 'Preventing unauthorized modification protects integrity.'),
  makeQuestion('cia-int-prescription', 'cia', 'Integrity', 'A medical prescription must not be changed unless an authorized clinician approves it. Which CIA property is the priority?', ciaOptions, 'Protecting a prescription from unauthorized change preserves integrity.'),
  makeQuestion('cia-int-checksum', 'cia', 'Integrity', 'A file is checked with a checksum so unauthorized or accidental changes can be detected. Which CIA property is being protected?', ciaOptions, 'Checksums help ensure information remains accurate, complete, and unaltered.'),
  makeQuestion('cia-avail-bank', 'cia', 'Availability', 'Customers need access to online banking at any hour of the day. Which CIA property is the priority?', ciaOptions, 'Availability ensures services are accessible whenever authorized users need them.'),
  makeQuestion('cia-avail-hospital', 'cia', 'Availability', 'A hospital requires its clinical system to remain operational during a power interruption. Which CIA property is the priority?', ciaOptions, 'Keeping a hospital system operational protects availability.'),
  makeQuestion('cia-avail-backup', 'cia', 'Availability', 'An organization installs backup systems and a UPS so services remain accessible during failures. Which CIA property is strengthened?', ciaOptions, 'Backup systems and a UPS are controls that support availability.'),
];

const foundationConceptQuestions: ChoiceQuestion[] = [
  makeQuestion(
    'foundation-cia-framework',
    'cia',
    'CIA Triad',
    'Which fundamental cybersecurity framework guides policies, strategies, and controls to protect data and maintain secure, reliable systems?',
    ['CIA Triad', 'AAA Framework', 'McCumber Cube', 'Defense in Depth'],
    'The CIA Triad is a fundamental framework used to guide policies, strategies, and controls.',
  ),
  makeQuestion(
    'foundation-cia-components',
    'cia',
    'Confidentiality, Integrity, and Availability',
    'Which three properties make up the CIA Triad?',
    ['Confidentiality, Integrity, and Availability', 'Authentication, Authorization, and Accounting', 'Storage, Processing, and Transmission', 'Technology, Policy, and Education'],
    'CIA stands for Confidentiality, Integrity, and Availability.',
  ),
  makeQuestion(
    'foundation-confidentiality-definition',
    'cia',
    'Confidentiality',
    'Which CIA property ensures information is accessible only to authorized individuals, systems, or processes?',
    ciaOptions,
    'Confidentiality prevents unauthorized disclosure of sensitive information.',
  ),
  makeQuestion(
    'foundation-integrity-definition',
    'cia',
    'Integrity',
    'Which CIA property ensures information remains accurate, complete, and unaltered except by authorized users?',
    ciaOptions,
    'Integrity protects information from accidental or malicious unauthorized modification.',
  ),
  makeQuestion(
    'foundation-availability-definition',
    'cia',
    'Availability',
    'Which CIA property ensures information and services are accessible whenever authorized users need them?',
    ciaOptions,
    'Availability keeps information and services accessible to legitimate users when needed.',
  ),
  makeQuestion(
    'foundation-confidentiality-controls',
    'cia',
    'User authentication, access control, encryption, and strong passwords',
    'Which set contains controls supplied for Confidentiality?',
    [
      'User authentication, access control, encryption, and strong passwords',
      'Digital signatures, checksums, version control, and access controls',
      'Backup systems, UPS, cloud services, and preventive maintenance',
      'Firewalls, antivirus, physical security, and training',
    ],
    'The supplied Confidentiality controls are user authentication, access control, encryption, and strong passwords.',
  ),
  makeQuestion(
    'foundation-integrity-controls',
    'cia',
    'Digital signatures, checksums, version control, and access controls',
    'Which set contains controls supplied for Integrity?',
    [
      'Digital signatures, checksums, version control, and access controls',
      'User authentication, access control, encryption, and strong passwords',
      'Backup systems, UPS, cloud services, and preventive maintenance',
      'Account locks, biometrics, audit reports, and firewalls',
    ],
    'Digital signatures, checksums, version control, and access controls help preserve Integrity.',
  ),
  makeQuestion(
    'foundation-availability-controls',
    'cia',
    'Backup systems, UPS, cloud services, and preventive maintenance',
    'Which set contains controls supplied for Availability?',
    [
      'Backup systems, UPS, cloud services, and preventive maintenance',
      'Digital signatures, checksums, version control, and access controls',
      'User authentication, access control, encryption, and strong passwords',
      'Passwords, PINs, fingerprints, and face recognition',
    ],
    'The supplied Availability controls are backup systems, UPS, cloud services, and preventive maintenance.',
  ),
  makeQuestion(
    'foundation-aaa-framework',
    'cia',
    'AAA Framework',
    'Which framework manages access to computer resources, enforces policies, and audits user activity?',
    ['AAA Framework', 'CIA Triad', 'McCumber Cube', 'Defense in Depth'],
    'The AAA Framework manages access, enforces policies, and audits user activity.',
  ),
  makeQuestion(
    'foundation-aaa-components',
    'cia',
    'Authentication, Authorization, and Accounting',
    'Which three functions make up the AAA Framework?',
    ['Authentication, Authorization, and Accounting', 'Confidentiality, Integrity, and Availability', 'Storage, Processing, and Transmission', 'Prevention, Detection, and Recovery'],
    'AAA stands for Authentication, Authorization, and Accounting.',
  ),
  makeQuestion(
    'foundation-authentication',
    'cia',
    'Authentication',
    'Which AAA function verifies a user’s identity before access is granted?',
    ['Authentication', 'Authorization', 'Accounting (Auditing)', 'Confidentiality'],
    'Authentication confirms that users are who they claim to be.',
  ),
  makeQuestion(
    'foundation-factor-know',
    'cia',
    'Something You Know',
    'Passwords and PINs belong to which authentication-factor group?',
    ['Something You Know', 'Something You Have', 'Something You Are', 'Something You Do'],
    'A password or PIN is Something You Know.',
  ),
  makeQuestion(
    'foundation-factor-have',
    'cia',
    'Something You Have',
    'A smart card, OTP, and mobile phone belong to which authentication-factor group?',
    ['Something You Have', 'Something You Know', 'Something You Are', 'Something You Share'],
    'A smart card, OTP, or mobile phone is Something You Have.',
  ),
  makeQuestion(
    'foundation-factor-are',
    'cia',
    'Something You Are',
    'A fingerprint, face recognition, and iris scan belong to which authentication-factor group?',
    ['Something You Are', 'Something You Know', 'Something You Have', 'Something You Share'],
    'Fingerprint, face recognition, and iris scans are Something You Are.',
  ),
  makeQuestion(
    'foundation-authorization',
    'cia',
    'Authorization',
    'Which AAA function determines what an authenticated user is allowed to access?',
    ['Authorization', 'Authentication', 'Accounting (Auditing)', 'Availability'],
    'Authorization determines permissions after identity has been authenticated.',
  ),
  makeQuestion(
    'foundation-authorization-example',
    'cia',
    'Authorization',
    'A student may view grades and register courses but may not edit grades. Which AAA function defines these permissions?',
    ['Authorization', 'Authentication', 'Accounting (Auditing)', 'Integrity'],
    'Different allowed actions for different roles are enforced through Authorization.',
  ),
  makeQuestion(
    'foundation-accounting',
    'cia',
    'Accounting (Auditing)',
    'Which AAA function records all user activities performed within a system and provides accountability?',
    ['Accounting (Auditing)', 'Authentication', 'Authorization', 'Availability'],
    'Accounting, also called Auditing, records user activity for accountability.',
  ),
  makeQuestion(
    'foundation-accounting-records',
    'cia',
    'Who logged in, what was accessed, what changed, and when it occurred',
    'Which set of details should Accounting (Auditing) allow an organization to know?',
    [
      'Who logged in, what was accessed, what changed, and when it occurred',
      'Who owns the software, what it costs, and when it expires',
      'Which data is public, private, archived, and deleted',
      'Which server is fastest, newest, closest, and least expensive',
    ],
    'The source lists who logged in, what was accessed, what changes were made, and when activities occurred.',
  ),
  makeQuestion(
    'foundation-accounting-benefits',
    'cia',
    'Detect attacks, investigate incidents, monitor employee activities, support compliance, and produce audit reports',
    'Which set lists the supplied benefits of Accounting (Auditing)?',
    [
      'Detect attacks, investigate incidents, monitor employee activities, support compliance, and produce audit reports',
      'Encrypt records, create passwords, scan irises, and restrict network access',
      'Back up systems, provide UPS power, use cloud services, and perform maintenance',
      'Approve payroll, register courses, edit grades, and manage classes',
    ],
    'These five outcomes are the supplied benefits of Accounting (Auditing).',
  ),
  makeQuestion(
    'foundation-mccumber-dimensions',
    'cia',
    'Security goals, information states, and safeguards',
    'Which set names the three dimensions of the McCumber Cube?',
    ['Security goals, information states, and safeguards', 'People, process, and technology', 'Authentication, authorization, and accounting', 'Prevention, detection, and recovery'],
    'The McCumber Cube connects security goals, information states, and safeguards.',
  ),
  makeQuestion(
    'foundation-mccumber-goals',
    'cia',
    'Confidentiality, Integrity, and Availability',
    'Which items form the security-goals dimension of the McCumber Cube?',
    ['Confidentiality, Integrity, and Availability', 'Storage, Processing, and Transmission', 'Technology, Policy, and Education', 'Authentication, Authorization, and Accounting'],
    'The cube uses the CIA Triad as its security-goals dimension.',
  ),
  makeQuestion(
    'foundation-mccumber-states',
    'cia',
    'Storage, Processing, and Transmission',
    'Which items form the information-states dimension of the McCumber Cube?',
    ['Storage, Processing, and Transmission', 'Confidentiality, Integrity, and Availability', 'Technology, Policy, and Education', 'Authentication, Authorization, and Accounting'],
    'The information states are Storage, Processing, and Transmission.',
  ),
  makeQuestion(
    'foundation-mccumber-safeguards',
    'cia',
    'Technology; Policy and practices; Education, training, and awareness',
    'Which items form the safeguards dimension of the McCumber Cube?',
    ['Technology; Policy and practices; Education, training, and awareness', 'Storage; Processing; Transmission', 'Confidentiality; Integrity; Availability', 'Authentication; Authorization; Accounting'],
    'The safeguard categories are Technology; Policy and practices; and Education, training, and awareness.',
  ),
  makeQuestion(
    'foundation-mccumber-intersections',
    'cia',
    '27 intersections',
    'How many intersections are produced by the three dimensions of the McCumber Cube?',
    ['27 intersections', '9 intersections', '12 intersections', '81 intersections'],
    'Three goals × three information states × three safeguard categories produce 27 intersections.',
  ),
];

const principleNames = securityPrinciples.map((principle) => principle.name);
const principleDefinitionQuestions = securityPrinciples.map((principle, index) => makeQuestion(
  `principle-definition-${principle.id}`,
  'principles',
  principle.name,
  principle.definition,
  nearbyOptions(principleNames, index),
  `${principle.name}: ${principle.definition}`,
));

const threatQuestions: ChoiceQuestion[] = [
  makeQuestion('threat-ip', 'threats', 'Compromises to intellectual property', 'A student copies licensed software and distributes it online without permission. Which category best describes the threat?', ['Compromises to intellectual property', 'Theft', 'Software attacks', 'Espionage or trespass'], 'Piracy and copyright infringement are compromises to intellectual property.'),
  makeQuestion('threat-qos', 'threats', 'Deviations in quality of service', 'A school portal becomes unreachable because its internet service provider is experiencing a major outage. Which category fits best?', ['Deviations in quality of service', 'Software attacks', 'Technical hardware failures or errors', 'Forces of nature'], 'ISP, power, and WAN service problems are deviations in quality of service.'),
  makeQuestion('threat-espionage', 'threats', 'Espionage or trespass', 'An unauthorized visitor enters a restricted records room and photographs confidential files. Which category fits best?', ['Espionage or trespass', 'Theft', 'Human error or failure', 'Information extortion'], 'Unauthorized access or data collection is espionage or trespass.'),
  makeQuestion('threat-nature', 'threats', 'Forces of nature', 'Floodwater enters a data center and damages several servers. Which category fits best?', ['Forces of nature', 'Sabotage or vandalism', 'Technical hardware failures or errors', 'Deviations in quality of service'], 'Fire, floods, earthquakes, and lightning are forces of nature.'),
  makeQuestion('threat-human', 'threats', 'Human error or failure', 'An employee accidentally deletes a shared folder while reorganizing files. Which category fits best?', ['Human error or failure', 'Sabotage or vandalism', 'Technical software failures or errors', 'Theft'], 'Accidents and employee mistakes are human error or failure.'),
  makeQuestion('threat-extortion', 'threats', 'Information extortion', 'An attacker threatens to publish private customer data unless the company pays money. Which category fits best?', ['Information extortion', 'Espionage or trespass', 'Theft', 'Software attacks'], 'Blackmail and threatened information disclosure are information extortion.'),
  makeQuestion('threat-sabotage', 'threats', 'Sabotage or vandalism', 'A disgruntled worker intentionally destroys a company database before leaving. Which category fits best?', ['Sabotage or vandalism', 'Human error or failure', 'Software attacks', 'Theft'], 'Intentional destruction of systems or information is sabotage or vandalism.'),
  makeQuestion('threat-software-attack', 'threats', 'Software attacks', 'A worm spreads across the laboratory network and prevents users from connecting. Which category fits best?', ['Software attacks', 'Technical software failures or errors', 'Deviations in quality of service', 'Technological obsolescence'], 'Viruses, worms, macros, and denial-of-service attacks are software attacks.'),
  makeQuestion('threat-hardware', 'threats', 'Technical hardware failures or errors', 'A storage drive stops working because of an equipment failure. Which category fits best?', ['Technical hardware failures or errors', 'Technical software failures or errors', 'Forces of nature', 'Theft'], 'Equipment failure is a technical hardware failure or error.'),
  makeQuestion('threat-software-failure', 'threats', 'Technical software failures or errors', 'A bug causes an application to calculate totals incorrectly. Which category fits best?', ['Technical software failures or errors', 'Software attacks', 'Human error or failure', 'Technological obsolescence'], 'Bugs, code problems, and unknown loopholes are technical software failures or errors.'),
  makeQuestion('threat-obsolescence', 'threats', 'Technological obsolescence', 'A critical system still uses an unsupported operating system that no longer receives updates. Which category fits best?', ['Technological obsolescence', 'Technical software failures or errors', 'Software attacks', 'Deviations in quality of service'], 'Antiquated or outdated technology is technological obsolescence.'),
  makeQuestion('threat-theft', 'threats', 'Theft', 'Someone takes a company laptop containing project information without permission. Which category fits best?', ['Theft', 'Espionage or trespass', 'Compromises to intellectual property', 'Sabotage or vandalism'], 'Illegal confiscation of equipment or information is theft.'),
];

const socialNames = socialTechniques.map((technique) => technique.name);
const socialDefinitionQuestions = socialTechniques.map((technique, index) => makeQuestion(
  `social-definition-${technique.id}`,
  'social',
  technique.name,
  technique.description,
  nearbyOptions(socialNames, index),
  `${technique.name}: ${technique.description}`,
));

const socialExampleQuestions = socialTechniques.map((technique, index) => makeQuestion(
  `social-example-${technique.id}`,
  'social',
  technique.name,
  technique.example,
  nearbyOptions(socialNames, index),
  `This is ${technique.name}. ${technique.description}`,
));

const tacticNames = psychologicalTactics.map((tactic) => tactic.name);
const socialTacticQuestions = psychologicalTactics.map((tactic, index) => makeQuestion(
  `social-tactic-${optionId(tactic.name)}`,
  'social',
  tactic.name,
  tactic.example,
  nearbyOptions(tacticNames, index),
  `${tactic.name} is the tactic used in this example.`,
));

export const cit017TestSets: TestSet[] = [
  {
    id: 'foundations-cia-scenarios',
    topicId: 'cia',
    title: 'CIA Scenario Practice',
    description: 'Choose the CIA property that best describes each of 10 situations.',
    questions: ciaScenarioQuestions,
  },
  {
    id: 'foundations-concepts',
    topicId: 'cia',
    title: 'Foundations Concepts',
    description: 'Complete coverage of CIA, AAA, authentication factors, auditing, and the McCumber Cube.',
    questions: foundationConceptQuestions,
  },
  {
    id: 'principles-definitions',
    topicId: 'principles',
    title: 'Principle Definitions',
    description: 'Identify each of the nine Security Principles from its definition.',
    instruction: 'Identify the security principle described in each question.',
    questions: principleDefinitionQuestions,
  },
  {
    id: 'threat-scenarios',
    topicId: 'threats',
    title: 'Threat Scenarios',
    description: 'Classify one scenario for every category of threat to information security.',
    questions: threatQuestions,
  },
  {
    id: 'social-definitions',
    topicId: 'social',
    title: 'Technique Definitions',
    description: 'Identify all 17 social-engineering techniques from their descriptions.',
    instruction: 'Identify the social-engineering technique described in each question.',
    questions: socialDefinitionQuestions,
  },
  {
    id: 'social-examples',
    topicId: 'social',
    title: 'Technique Examples',
    description: 'Identify all 17 social-engineering techniques from their supplied examples.',
    instruction: 'Identify the social-engineering technique shown in each example.',
    questions: socialExampleQuestions,
  },
  {
    id: 'social-tactics',
    topicId: 'social',
    title: 'Psychological Tactics',
    description: 'Recognize all nine psychological tactics from their examples.',
    instruction: 'Identify the psychological tactic shown in each example.',
    questions: socialTacticQuestions,
  },
];

export const cit017Questions = cit017TestSets.flatMap((set) => set.questions);

export const testSetTopicLabels: Record<QuizTopic, string> = {
  cia: 'Foundations of Information Security',
  principles: 'Security Principles',
  threats: 'Categories of Threats',
  social: 'Social Engineering',
};

export const sourceInventory = {
  threatCategories,
  securityPrinciples,
  socialTechniques,
  psychologicalTactics,
};
