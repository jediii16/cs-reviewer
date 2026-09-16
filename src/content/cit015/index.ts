import type { LessonTopic, SubjectManifest } from '../types';

const topic = (id: string, title: string, description: string): LessonTopic => ({
  id,
  title,
  description,
  sections: [],
});

export const cit015Subject: SubjectManifest = {
  id: 'cit015',
  code: 'CIT.015',
  title: 'Operating Systems',
  description: 'Operating-system foundations, process management, and memory management.',
  reviewModes: ['test'],
  topics: [
    topic('os-introduction', 'Introduction to Operating Systems', 'Foundations, functions, types, interfaces, and popular operating systems.'),
    topic('process-management', 'Process Management', 'Processes, scheduling, process state, and CPU scheduling algorithms.'),
    topic('memory-management', 'Memory Management', 'Address spaces, loading, swapping, fragmentation, paging, and segmentation.'),
  ],
  mccumber: { goals: [], states: [], safeguards: [] },
};
