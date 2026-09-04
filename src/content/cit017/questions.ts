import type { ChoiceQuestion, QuizTopic } from '../types';

function optionId(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function makeQuestion(
  id: string,
  topicId: QuizTopic,
  concept: string,
  prompt: string,
  labels: string[],
  explanation: string,
): ChoiceQuestion {
  return {
    id,
    topicId,
    concept,
    prompt,
    options: labels.map((label) => ({ id: optionId(label), label })),
    correctOptionId: optionId(concept),
    explanation,
  };
}

const threatQuestions: ChoiceQuestion[] = [
  makeQuestion('threat-ip', 'threats', 'Compromises to intellectual property', 'A student copies licensed software and distributes it online without permission. Which category best describes the threat?', ['Compromises to intellectual property', 'Theft', 'Software attacks', 'Espionage or trespass'], 'Piracy and copyright infringement are compromises to intellectual property.'),
  makeQuestion('threat-qos', 'threats', 'Deviations in quality of service', 'A school portal becomes unreachable because its internet service provider is experiencing a major outage. Which category fits best?', ['Deviations in quality of service', 'Software attacks', 'Technical hardware failures or errors', 'Forces of nature'], 'ISP, power, and WAN service problems are deviations in quality of service.'),
  makeQuestion('threat-espionage', 'threats', 'Espionage or trespass', 'An unauthorized visitor enters a restricted records room and photographs confidential files. Which category fits best?', ['Espionage or trespass', 'Theft', 'Human error or failure', 'Information extortion'], 'Unauthorized access or data collection is espionage or trespass.'),
  makeQuestion('threat-nature', 'threats', 'Forces of nature', 'Floodwater enters a data center and damages several servers. Which category fits best?', ['Forces of nature', 'Sabotage or vandalism', 'Technical hardware failures or errors', 'Deviations in quality of service'], 'Floods, fires, earthquakes, and lightning are forces of nature.'),
  makeQuestion('threat-human', 'threats', 'Human error or failure', 'An employee accidentally deletes a shared folder while reorganizing files. Which category fits best?', ['Human error or failure', 'Sabotage or vandalism', 'Technical software failures or errors', 'Theft'], 'Accidents and employee mistakes are human error or failure.'),
  makeQuestion('threat-extortion', 'threats', 'Information extortion', 'An attacker threatens to publish private customer data unless the company pays money. Which category fits best?', ['Information extortion', 'Espionage or trespass', 'Theft', 'Software attacks'], 'Blackmail and threatened information disclosure are information extortion.'),
  makeQuestion('threat-sabotage', 'threats', 'Sabotage or vandalism', 'A disgruntled worker intentionally destroys a company database before leaving. Which category fits best?', ['Sabotage or vandalism', 'Human error or failure', 'Software attacks', 'Theft'], 'Intentional destruction of systems or information is sabotage or vandalism.'),
  makeQuestion('threat-software-attack', 'threats', 'Software attacks', 'A worm spreads across the laboratory network and prevents users from connecting. Which category fits best?', ['Software attacks', 'Technical software failures or errors', 'Deviations in quality of service', 'Technological obsolescence'], 'Viruses, worms, macros, and denial-of-service attacks are software attacks.'),
  makeQuestion('threat-hardware', 'threats', 'Technical hardware failures or errors', 'A storage drive stops working because of an equipment failure. Which category fits best?', ['Technical hardware failures or errors', 'Technical software failures or errors', 'Forces of nature', 'Theft'], 'Equipment failure is a technical hardware failure or error.'),
  makeQuestion('threat-software-failure', 'threats', 'Technical software failures or errors', 'A bug causes an application to calculate totals incorrectly. Which category fits best?', ['Technical software failures or errors', 'Software attacks', 'Human error or failure', 'Technological obsolescence'], 'Bugs, code problems, and unknown loopholes are technical software failures or errors.'),
  makeQuestion('threat-obsolescence', 'threats', 'Technological obsolescence', 'A critical system still uses an unsupported operating system that no longer receives updates. Which category fits best?', ['Technological obsolescence', 'Technical software failures or errors', 'Software attacks', 'Deviations in quality of service'], 'Antiquated or outdated technology is technological obsolescence.'),
  makeQuestion('threat-theft', 'threats', 'Theft', 'Someone takes a company laptop containing project information without permission. Which category fits best?', ['Theft', 'Espionage or trespass', 'Compromises to intellectual property', 'Sabotage or vandalism'], 'Illegal confiscation of equipment or information is theft.'),
];

const ciaOptions = ['Confidentiality', 'Integrity', 'Availability'];
const ciaQuestions: ChoiceQuestion[] = [
  makeQuestion('cia-conf-grades', 'cia', 'Confidentiality', 'A university must ensure that only authorized faculty members can view student grades. Which CIA property is the priority?', ciaOptions, 'Confidentiality limits information access to authorized people, systems, or processes.'),
  makeQuestion('cia-conf-records', 'cia', 'Confidentiality', 'A hospital encrypts patient records so unauthorized people cannot read them. Which CIA property is being protected?', ciaOptions, 'Preventing unauthorized disclosure protects confidentiality.'),
  makeQuestion('cia-conf-payroll', 'cia', 'Confidentiality', 'Payroll information must be visible only to HR personnel. Which CIA property is the priority?', ciaOptions, 'Restricting payroll data to authorized HR personnel protects confidentiality.'),
  makeQuestion('cia-int-bank', 'cia', 'Integrity', 'A bank needs assurance that account balances remain accurate and are not changed without authorization. Which CIA property is the priority?', ciaOptions, 'Integrity keeps information accurate, complete, and unaltered except by authorized users.'),
  makeQuestion('cia-int-election', 'cia', 'Integrity', 'Election results must not be altered after votes are counted. Which CIA property is the priority?', ciaOptions, 'Preventing unauthorized modification protects integrity.'),
  makeQuestion('cia-int-prescription', 'cia', 'Integrity', 'A medical prescription must not be changed unless an authorized clinician approves it. Which CIA property is the priority?', ciaOptions, 'Protecting a prescription from unauthorized change preserves integrity.'),
  makeQuestion('cia-avail-bank', 'cia', 'Availability', 'Customers need access to online banking at any hour of the day. Which CIA property is the priority?', ciaOptions, 'Availability ensures services are accessible whenever authorized users need them.'),
  makeQuestion('cia-avail-hospital', 'cia', 'Availability', 'A hospital requires its clinical system to remain operational during a power interruption. Which CIA property is the priority?', ciaOptions, 'Keeping a hospital system operational protects availability.'),
  makeQuestion('cia-avail-backup', 'cia', 'Availability', 'An organization installs backup systems and a UPS so services remain accessible during failures. Which CIA property is strengthened?', ciaOptions, 'Backups and a UPS are controls that support availability.'),
];

const principleOptions = [
  'Least Privilege', 'Need-to-Know Principle', 'Separation of Duties', 'Defense in Depth',
  'Fail-Safe (Secure by Default)', 'Security by Design', 'Principle of Complete Mediation',
  'Economy of Mechanism (Keep it Simple)', 'Open Design',
];
const principleQuestions: ChoiceQuestion[] = [
  makeQuestion('principle-least', 'principles', 'Least Privilege', 'An accounting clerk can use payroll tools but cannot open HR medical records. Which principle applies?', principleOptions, 'Least privilege gives users only the minimum permissions necessary.'),
  makeQuestion('principle-need', 'principles', 'Need-to-Know Principle', 'A nurse can access only the records of patients currently under their care. Which principle applies?', principleOptions, 'Need-to-know limits information access to what a specific task requires.'),
  makeQuestion('principle-separation', 'principles', 'Separation of Duties', 'One employee creates purchase requests, another approves suppliers, and a third authorizes payment. Which principle applies?', principleOptions, 'Separation of duties divides critical tasks among multiple people.'),
  makeQuestion('principle-depth', 'principles', 'Defense in Depth', 'A company combines physical security, firewalls, antivirus, encryption, access controls, and staff training. Which principle applies?', principleOptions, 'Defense in depth uses multiple security layers so other controls remain if one fails.'),
  makeQuestion('principle-fail-safe', 'principles', 'Fail-Safe (Secure by Default)', 'An authentication service encounters an error and denies access instead of letting the user through. Which principle applies?', principleOptions, 'Fail-safe design defaults to a secure state when an error occurs.'),
  makeQuestion('principle-design', 'principles', 'Security by Design', 'A development team performs threat modeling and input validation before deploying a new system. Which principle applies?', principleOptions, 'Security by design considers security from the beginning of development.'),
  makeQuestion('principle-mediation', 'principles', 'Principle of Complete Mediation', 'The system checks a user’s permission every time they open a confidential document. Which principle applies?', principleOptions, 'Complete mediation checks authorization on every resource access request.'),
  makeQuestion('principle-economy', 'principles', 'Economy of Mechanism (Keep it Simple)', 'A team replaces a confusing chain of authentication steps with one well-designed process that is easier to verify. Which principle applies?', principleOptions, 'Economy of mechanism keeps security mechanisms as simple as possible while remaining effective.'),
  makeQuestion('principle-open', 'principles', 'Open Design', 'An encryption algorithm is publicly documented, while its secret key remains protected. Which principle applies?', principleOptions, 'Open design relies on strong implementation and secret keys rather than a secret system design.'),
];

const socialQuestions: ChoiceQuestion[] = [
  makeQuestion('social-phishing', 'social', 'Phishing', 'A message that appears to be from a bank asks many customers to click a link and verify their credentials. Which technique is this?', ['Phishing', 'Smishing', 'Vishing', 'Pretexting'], 'Fraudulent messages that imitate a legitimate organization are phishing.'),
  makeQuestion('social-spear', 'social', 'Spear Phishing', 'A professor receives a personalized email mentioning their current research project and asking them to verify a login. Which technique is this?', ['Spear Phishing', 'Whaling', 'Phishing', 'Impersonation'], 'Personalized phishing aimed at a specific person or organization is spear phishing.'),
  makeQuestion('social-whaling', 'social', 'Whaling', 'A fake urgent financial request is sent specifically to a company CEO. Which technique is this?', ['Whaling', 'Business Email Compromise (BEC)', 'Spear Phishing', 'Quid Pro Quo'], 'Whaling is phishing that specifically targets high-ranking executives or senior officials.'),
  makeQuestion('social-vishing', 'social', 'Vishing', 'A caller pretending to work for a bank asks for an account number and OTP. Which technique is this?', ['Vishing', 'Smishing', 'Pretexting', 'Phishing'], 'Voice phishing through calls or voice messages is vishing.'),
  makeQuestion('social-tailgating', 'social', 'Tailgating (Piggybacking)', 'A person carrying boxes asks an employee to hold open the secure office door so they can follow inside. Which technique is this?', ['Tailgating (Piggybacking)', 'Impersonation', 'Shoulder Surfing', 'Baiting'], 'Following an authorized person into a restricted area is tailgating or piggybacking.'),
  makeQuestion('social-baiting', 'social', 'Baiting', 'A USB drive labeled “Employee Salary List” is left in a parking lot in the hope that someone will plug it in. Which technique is this?', ['Baiting', 'Quid Pro Quo', 'Scareware', 'Dumpster Diving'], 'Baiting offers something attractive to entice a victim into compromising security.'),
];

export const cit017Questions: ChoiceQuestion[] = [
  ...threatQuestions,
  ...ciaQuestions,
  ...principleQuestions,
  ...socialQuestions,
];
