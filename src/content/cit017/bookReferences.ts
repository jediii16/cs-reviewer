import type { LessonTopic } from '../types';

export const bookReferencesTopic: LessonTopic = {
  id: 'book-references',
  title: 'Book References',
  description: 'Lesson 1 definitions and terminology from the book references.',
  sections: [
    {
      id: 'book-security-foundations',
      title: 'Lesson 1: Security Foundations',
      summary: 'Begin with the book’s foundational definitions of security and information security.',
      terms: [
        {
          term: 'What is security?',
          definition: 'Security is protection.',
        },
        {
          term: 'CNSS',
          definition: 'The Committee in National Security Systems',
        },
        {
          term: 'Information Security',
          definition: 'The protection of information and its critical elements, including the systems and hardware that use, store, and transmit the information. Protection of the confidentiality, integrity, and availability of information assets, whether in storage, processing, or transmission, via the application of policy, education, training and awareness, and technology.',
        },
        {
          term: 'Security',
          definition: 'A state of being secure and free from danger or harm; also, the actions taken to make someone or something secure.',
        },
        {
          term: 'Network Security',
          definition: 'A subset of communications security; the protection of voice and data networking components, connections, and content.',
        },
        {
          term: 'CIA triad',
          definition: 'The industry standard for computer security since the development of the mainframe; the standard is based on three characteristics that describe the attributes of information that are important to protect: confidentiality, integrity, and availability.',
        },
      ],
      recallPrompt: 'In the shortest possible terms, what is security?',
      recallAnswer: 'Security is protection.',
    },
    {
      id: 'book-core-terminology',
      title: 'Core Security Terminology',
      summary: 'Review the assets, actions, conditions, and protections used when describing security.',
      terms: [
        {
          term: 'Access',
          definition: 'A subject or object’s ability to use, manipulate, modify, or affect another subject or object. Authorized users have legal access to a system, whereas hackers must gain illegal access to a system. Access controls regulate this ability.',
        },
        {
          term: 'Asset',
          definition: 'The organizational resource that is being protected. An asset can be logical, such as a Website, software information, or data; or an asset can be physical, such as a person, computer system, hardware, or other tangible object. Assets, particularly information assets, are the focus of what security efforts are attempting',
        },
        {
          term: 'Attack',
          definition: 'An intentional or unintentional act that can damage or otherwise compromise information and the systems that support it. Attacks can be active or passive, intentional or unintentional, and direct or indirect.',
        },
        {
          term: 'Control, safeguard, or countermeasure',
          definition: 'Security mechanisms, policies, or procedures that can successfully counter attacks, reduce risk, resolve vulnerabilities, and otherwise improve security within an organization.',
        },
        {
          term: 'Exploit',
          definition: 'A technique used to compromise a system. This term can be a verb or a noun.',
        },
        {
          term: 'Exposure',
          definition: 'A condition or state of being exposed; in information security, exposure exists when a vulnerability is known to an attacker.',
        },
        {
          term: 'Loss',
          definition: 'A single instance of an information asset suffering damage or destruction, unintended or unauthorized modification or disclosure, or denial of use.',
        },
        {
          term: 'Protection profile or security posture',
          definition: 'The entire set of controls and safeguards—including policy, education, training and awareness, and technology that the organization implements to protect the asset. The terms are sometimes used interchangeably with the term security program, although a security program often comprises managerial aspects of security, including planning, personnel, and subordinate programs.',
        },
        {
          term: 'Risk',
          definition: 'The probability of an unwanted occurrence, such as an adverse event or loss. Organizations must minimize risk to match their risk appetite—the quantity and nature of risk they are willing to accept.',
        },
        {
          term: 'Subjects and objects of attack',
          definition: 'The subject performs an attack; the object is the target. A computer can be both.',
        },
      ],
      recallPrompt: 'Which term means the organizational resource being protected?',
      recallAnswer: 'Asset.',
    },
    {
      id: 'book-threat-terminology',
      title: 'Threats and Vulnerabilities',
      summary: 'Distinguish a broad threat from its source, agent, event, and exploitable weakness.',
      terms: [
        {
          term: 'Threat',
          definition: 'Any event or circumstance that has the potential to aversely affect operations and assets.',
        },
        {
          term: 'Threat agent',
          definition: 'The specific instance or a component of a threat.',
        },
        {
          term: 'Threat event',
          definition: 'An occurrence of an event caused by a threat agent.',
        },
        {
          term: 'Threat source',
          definition: 'A category of objects, people, or other entities that represents the origin of danger to an asset or, in other words, a category of threat agents.',
        },
        {
          term: 'Vulnerability',
          definition: 'A potential weakness in an asset or its defensive control system(s).',
        },
      ],
      recallPrompt: 'What is a vulnerability?',
      recallAnswer: 'A potential weakness in an asset or its defensive control system(s).',
    },
    {
      id: 'book-information-attributes',
      title: 'Information Attributes',
      summary: 'Study the characteristics that determine whether information remains protected and useful.',
      terms: [
        {
          term: 'Confidentiality',
          definition: 'An attribute of information that describes how data is protected from disclosure or exposure to unauthorized individuals or systems.',
        },
        {
          term: 'Personally Identifiable Information (PII)',
          definition: "Information about a person's history, background, and attributes that can be used to commit identity theft; typically inclused a person's name, address, Social Security number, family information, employment history, and financial information.",
        },
        {
          term: 'Integrity',
          definition: 'An attribute of information that describes how data is whole, complete, and uncorrupted.',
        },
        {
          term: 'Availability',
          definition: 'An attribute of information that describes how data is accessible and correctly formatted for use without interference or obstruction.',
        },
        {
          term: 'Accuracy',
          definition: 'An attribute of information that describes how data is free of errors and has the value that the user expects.',
        },
        {
          term: 'Authenticity',
          definition: 'An attribute of information that describes how data is genuine or original rather than reproduced or fabricated.',
        },
        {
          term: 'Utility',
          definition: 'An attribute of information that describes how data has value or usefulness for an end purpose.',
        },
        {
          term: 'Possession',
          definition: "An attribute of information that describes how the data's ownership or control is legitimate or authorized.",
        },
      ],
      recallPrompt: 'Which three information attributes form the CIA triad?',
      recallAnswer: 'Confidentiality, integrity, and availability.',
    },
    {
      id: 'book-system-security',
      title: 'McCumber Cube and System Security',
      summary: 'Connect the information-security model to systems, physical protection, and botnets.',
      terms: [
        {
          term: 'McCumber Cube',
          definition: "A graphical representation of the architectural approach used in computer and information security; commonly shown as a cube composed of 3x3x3 cells, similar to a Rubik's Cube.",
          notes: [
            'Created by John McCumber in 1991',
            'address the need to use technology to protect the integrity of information while in storage.',
          ],
        },
        {
          term: 'Information System (IS)',
          definition: 'The entire set of software, hardware, data, people, procedures, and networks that enable the use of information resources in the organization.',
        },
        {
          term: 'Physical Security',
          definition: 'The protection of material items, objects, or areas from unauthorized access and misuse.',
        },
        {
          term: 'botnet',
          definition: 'slang for robot network',
        },
      ],
      recallPrompt: 'Who created the McCumber Cube, and when?',
      recallAnswer: 'John McCumber in 1991.',
    },
  ],
};
