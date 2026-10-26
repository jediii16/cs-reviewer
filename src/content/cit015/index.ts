import type { SubjectManifest } from '../types';
import { concurrentProcessing, fileAndDiskManagement } from './lessons';

export const cit015Subject: SubjectManifest = {
  id: 'cit015',
  code: 'CIT.015',
  title: 'Operating Systems',
  description: 'Finals review: Concurrent Processing and File and Disk Management.',
  reviewModes: ['study', 'test'],
  topics: [concurrentProcessing, fileAndDiskManagement],
  mccumber: { goals: [], states: [], safeguards: [] },
};
