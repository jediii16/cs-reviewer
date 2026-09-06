import type { SubjectManifest } from '../types';
import { digitalAnalogTopic } from './signals';
import { errorControlTopic } from './errors';
import { tcpIpTopic } from './tcpIp';
import { transmissionMediaTopic } from './media';
import { multiplexingTopic } from './multiplexing';

export const cit016Subject: SubjectManifest = {
  id: 'cit016',
  code: 'CIT.016',
  title: 'Data Communication',
  description: 'Signals, reliable transmission, network layers, media, and multiplexing.',
  topics: [
    digitalAnalogTopic,
    errorControlTopic,
    tcpIpTopic,
    transmissionMediaTopic,
    multiplexingTopic,
  ],
  mccumber: { goals: [], states: [], safeguards: [] },
};
