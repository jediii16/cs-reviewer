import type { LessonTopic } from '../types';

export const tcpIpTopic: LessonTopic = {
  id: 'tcp-ip',
  title: 'TCP/IP Stack',
  description: 'TCP and IP roles, the four TCP/IP layers, and comparison with OSI.',
  sections: [
    {
      id: 'tcp-and-ip',
      title: 'TCP and IP',
      summary: 'TCP manages reliable, ordered, error-checked delivery between applications. IP supplies addressing and routes packets from source to destination across networks.',
      recallPrompt: 'Which protocol focuses on reliability, and which focuses on addressing and routing?',
      recallAnswer: 'TCP focuses on reliable delivery; IP focuses on addressing and routing.',
    },
    {
      id: 'application-layer',
      title: 'Application Layer',
      summary: 'The application layer provides network services directly to end-user applications.',
      examples: ['Web browsing', 'Email', 'File transfer'],
      recallPrompt: 'Which TCP/IP layer directly serves end-user applications?',
      recallAnswer: 'The Application layer.',
    },
    {
      id: 'transport-layer',
      title: 'Transport Layer',
      summary: 'The transport layer manages end-to-end communication between devices.',
      bullets: ['Data integrity', 'Error recovery', 'Flow control'],
      recallPrompt: 'Which TCP/IP layer manages end-to-end communication and flow control?',
      recallAnswer: 'The Transport layer.',
    },
    {
      id: 'internet-layer',
      title: 'Internet Layer',
      summary: 'The internet or network layer moves packets across the complete network and directs them using IP addresses.',
      recallPrompt: 'Which TCP/IP layer performs logical packet transmission using IP addresses?',
      recallAnswer: 'The Internet (Network) layer.',
    },
    {
      id: 'network-access-layer',
      title: 'Network Access / Data Link Layer',
      summary: 'The network access layer handles local network communication, generates frames, requests connections, and helps prevent transmission errors.',
      recallPrompt: 'Which TCP/IP layer is responsible for framing and local network access?',
      recallAnswer: 'The Network Access, or Data Link, layer.',
    },
    {
      id: 'tcp-ip-vs-osi',
      title: 'TCP/IP vs. OSI',
      summary: 'TCP/IP combines session and presentation functions into its application layer, while OSI keeps separate session and presentation layers.',
      bullets: [
        'TCP/IP is described as a horizontal, connectionless approach; OSI as vertical.',
        'TCP/IP itself does not guarantee packet delivery, though TCP provides connections at the transport layer; OSI supports connectionless and connection-oriented services.',
        'TCP/IP protocols are broadly covered and easier to replace; OSI protocols are described as harder to replace.',
      ],
      recallPrompt: 'Where does TCP/IP place the functions that OSI assigns to session and presentation layers?',
      recallAnswer: 'Inside the TCP/IP Application layer.',
    },
  ],
};
