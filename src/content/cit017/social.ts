import type { LessonTopic } from '../types';

export interface SocialTechnique {
  id: string;
  name: string;
  group: string;
  description: string;
  example: string;
}

export const socialTechniques: SocialTechnique[] = [
  { id: 'phishing', name: 'Phishing', group: 'Email-Based', description: 'Fraudulent emails or messages that appear to come from a legitimate organization to trick victims into revealing credentials or clicking malicious links.', example: 'An email claiming to be from your bank asks you to verify your account information.' },
  { id: 'spear-phishing', name: 'Spear Phishing', group: 'Email-Based', description: 'A targeted form of phishing directed at a specific individual or organization using personalized information.', example: 'An email addresses a university professor, mentions a current research project, and requests login verification.' },
  { id: 'whaling', name: 'Whaling', group: 'Email-Based', description: 'A phishing attack specifically targeting high-ranking executives or senior officials.', example: 'A fake email sent to a CEO requests approval for an urgent financial transaction.' },
  { id: 'bec', name: 'Business Email Compromise (BEC)', group: 'Email-Based', description: 'An attacker compromises or spoofs a business email account to request money transfers or confidential information.', example: 'The finance department receives an email appearing to come from the company president requesting an urgent wire transfer.' },
  { id: 'vishing', name: 'Vishing', group: 'Phone-Based', description: 'Voice phishing using telephone calls or voice messages.', example: 'Someone pretending to be from the bank calls and asks you to confirm your account number and OTP.' },
  { id: 'pretexting', name: 'Pretexting', group: 'Phone-Based', description: 'The attacker invents a believable story or false identity to persuade the victim to disclose information.', example: 'A caller pretends to be an IT technician who needs your password to fix your computer.' },
  { id: 'smishing', name: 'Smishing', group: 'Mobile-Based', description: 'Phishing conducted through SMS or text messages.', example: 'A text message claims you have won a prize and asks you to click a link.' },
  { id: 'tailgating', name: 'Tailgating (Piggybacking)', group: 'Physical Attacks', description: 'Gaining unauthorized physical access by following an authorized person into a restricted area.', example: 'An individual carrying boxes asks an employee to hold the secure office door open.' },
  { id: 'shoulder-surfing', name: 'Shoulder Surfing', group: 'Physical Attacks', description: 'Observing someone entering confidential information such as passwords or PINs.', example: 'Someone watches a person enter an ATM PIN or office login password.' },
  { id: 'dumpster-diving', name: 'Dumpster Diving', group: 'Physical Attacks', description: 'Searching discarded documents or devices for confidential information.', example: 'An attacker retrieves printed payroll reports or customer records from an unsecured trash bin.' },
  { id: 'baiting', name: 'Baiting', group: 'Physical Attacks', description: 'Offering something attractive to entice victims into performing an action that compromises security.', example: 'A USB drive labeled “Employee Salary List” is left in a parking lot in the hope that someone plugs it into a computer.' },
  { id: 'impersonation', name: 'Impersonation', group: 'Online and Social Media', description: 'Pretending to be a trusted person or authority to gain access or information.', example: 'An attacker wears a delivery uniform and claims to be delivering equipment to enter a restricted office.' },
  { id: 'honey-trap', name: 'Honey Trap (Romance Scam)', group: 'Online and Social Media', description: 'Building a personal or romantic relationship to gain trust and eventually obtain money or confidential information.', example: 'Someone develops an online relationship before asking for financial assistance or sensitive company information.' },
  { id: 'watering-hole', name: 'Watering Hole Attack', group: 'Online and Social Media', description: 'Compromising a website frequently visited by intended victims to infect their devices.', example: 'Attackers compromise an industry association website knowing employees regularly visit it.' },
  { id: 'quid-pro-quo', name: 'Quid Pro Quo', group: 'Multiple Communication Methods', description: 'Offering a service or benefit in exchange for information or access.', example: 'Someone offers free technical support if an employee provides login credentials.' },
  { id: 'scareware', name: 'Scareware', group: 'Multiple Communication Methods', description: 'Displaying fake warnings or security alerts to frighten users into installing malicious software or paying for fake services.', example: 'A pop-up claims that your computer is infected and instructs you to download a “security tool.”' },
  { id: 'reverse-social-engineering', name: 'Reverse Social Engineering', group: 'Multiple Communication Methods', description: 'The attacker creates a problem and then presents themselves as the person who can solve it, causing victims to seek their help voluntarily.', example: 'An attacker disrupts a printer, then offers technical support and asks for administrator credentials.' },
];

export const communicationMethods = [
  { technique: 'Phishing', channels: ['Email'] },
  { technique: 'Spear Phishing', channels: ['Email', 'Social Media'] },
  { technique: 'Whaling', channels: ['Email'] },
  { technique: 'Smishing', channels: ['SMS'] },
  { technique: 'Vishing', channels: ['Phone'] },
  { technique: 'Pretexting', channels: ['Email', 'Phone', 'SMS', 'Social Media', 'In-Person'] },
  { technique: 'Baiting', channels: ['Email', 'In-Person', 'Physical'] },
  { technique: 'Quid Pro Quo', channels: ['Email', 'Phone', 'In-Person'] },
  { technique: 'Scareware', channels: ['Email', 'Website / Pop-Up'] },
  { technique: 'Reverse Social Engineering', channels: ['Email', 'Phone', 'In-Person'] },
  { technique: 'Tailgating', channels: ['In-Person'] },
  { technique: 'Shoulder Surfing', channels: ['In-Person'] },
  { technique: 'Dumpster Diving', channels: ['Physical'] },
  { technique: 'Impersonation', channels: ['Email', 'Phone', 'Social Media', 'In-Person'] },
] as const;

export const psychologicalTactics = [
  { name: 'Authority', example: '“I’m from the IT Department.”' },
  { name: 'Urgency', example: '“Respond within 30 minutes or your account will be suspended.”' },
  { name: 'Fear', example: '“Your bank account has been compromised.”' },
  { name: 'Curiosity', example: '“Confidential Salary Adjustments 2026.xlsx”' },
  { name: 'Greed', example: '“Claim your ₱10,000 reward now!”' },
  { name: 'Trust/Familiarity', example: 'Pretending to be a coworker, classmate, or friend.' },
  { name: 'Sympathy', example: 'Asking for help because of an alleged emergency.' },
  { name: 'Scarcity', example: '“Only the first 50 users will receive this benefit.”' },
  { name: 'Reciprocity', example: 'Offering free gifts, software, or assistance in exchange for information.' },
] as const;

export const socialTopic: LessonTopic = {
  id: 'social-engineering',
  title: 'Social Engineering',
  description: 'Techniques that exploit human psychology rather than technical vulnerabilities.',
  sections: [
    ...socialTechniques.map((technique) => ({
      id: technique.id,
      title: technique.name,
      summary: technique.description,
      bullets: [technique.group],
      examples: [technique.example],
      recallPrompt: 'Which social-engineering technique does this describe?',
      recallAnswer: technique.name,
    })),
    {
      id: 'psychological-tactics',
      title: 'Psychological Tactics',
      summary: 'Social engineers create pressure or trust by appealing to common human reactions.',
      bullets: psychologicalTactics.map((tactic) => `${tactic.name}: ${tactic.example}`),
      recallPrompt: 'Name four psychological tactics used in social engineering.',
      recallAnswer: psychologicalTactics.map((tactic) => tactic.name).join(', '),
    },
    {
      id: 'communication-methods',
      title: 'Communication Methods',
      summary: 'Social-engineering techniques may use email, phone, SMS, social media, websites or pop-ups, in-person contact, and physical media.',
      bullets: communicationMethods.map((item) => `${item.technique}: ${item.channels.join(', ')}`),
      recallPrompt: 'Which technique is voice phishing over the phone?',
      recallAnswer: 'Vishing.',
    },
  ],
};
