import type { SubjectManifest } from '../types';
import { foundationsTopic, mccumberDimensions } from './foundations';
import { principlesTopic } from './principles';
import { socialTopic } from './social';
import { threatsTopic } from './threats';

export const cit017Subject: SubjectManifest = {
  id: 'cit017',
  code: 'CIT.017',
  title: 'Foundations of Information Security',
  description: 'Core frameworks, security principles, threat categories, and social engineering.',
  topics: [foundationsTopic, principlesTopic, threatsTopic, socialTopic],
  mccumber: mccumberDimensions,
};
