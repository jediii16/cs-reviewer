import type { LessonTopic } from '../types';

export const multiplexingTopic: LessonTopic = {
  id: 'multiplexing',
  title: 'Multiplexing',
  description: 'Combining multiple signals so they share one medium or bandwidth.',
  sections: [
    {
      id: 'multiplexing-overview',
      title: 'Multiplexing Overview',
      summary: 'Multiplexing combines signals from multiple sources for transmission over one communication or physical line.',
      recallPrompt: 'What resource does multiplexing allow multiple signals to share?',
      recallAnswer: 'A communication medium or its bandwidth.',
    },
    {
      id: 'frequency-division',
      title: 'Frequency-Division Multiplexing (FDM)',
      summary: 'FDM carries simultaneous signals in different frequency bands within the same communication channel.',
      recallPrompt: 'How does FDM keep simultaneous signals separate?',
      recallAnswer: 'It assigns them different frequency bands.',
    },
    {
      id: 'time-division',
      title: 'Time-Division Multiplexing (TDM)',
      summary: 'TDM lets signals share one channel by taking turns in different time slots.',
      recallPrompt: 'How does TDM divide access to a shared channel?',
      recallAnswer: 'By assigning different time slots.',
    },
    {
      id: 'wavelength-division',
      title: 'Wavelength-Division Multiplexing (WDM)',
      summary: 'WDM carries signals through one optical fiber on different wavelengths, or colors, of light.',
      recallPrompt: 'Which multiplexing method separates optical signals by color or wavelength?',
      recallAnswer: 'Wavelength-Division Multiplexing (WDM).',
    },
    {
      id: 'space-division',
      title: 'Space-Division Multiplexing (SDM)',
      summary: 'SDM carries signals over separate physical paths or channels, such as different fibers or wires.',
      recallPrompt: 'What separates signals in SDM?',
      recallAnswer: 'Separate physical paths or channels.',
    },
    {
      id: 'code-division',
      title: 'Code-Division Multiplexing (CDM)',
      summary: 'CDM shares the same frequency channel while unique codes distinguish each signal.',
      recallPrompt: 'How does CDM distinguish signals sharing one frequency channel?',
      recallAnswer: 'By assigning a unique code to each signal.',
    },
    {
      id: 'multiplexing-tradeoffs',
      title: 'Advantages and Disadvantages',
      summary: 'Multiplexing improves the use and capacity of shared communication resources but introduces coordination and quality challenges.',
      benefits: ['Efficient bandwidth use', 'Increased data transmission', 'Scalability', 'Flexibility'],
      bullets: ['Disadvantages: synchronization issues, latency, signal degradation, and resource management.'],
      recallPrompt: 'Name two challenges introduced by multiplexing.',
      recallAnswer: 'Any two of synchronization issues, latency, signal degradation, and resource management.',
    },
  ],
};
