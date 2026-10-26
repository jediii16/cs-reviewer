import type { LessonTopic } from '../types';
import { slideCopy as s } from './slideCopy';

// Definitions and recall answers use the supplied slides verbatim. Section navigation stays concise.
export const concurrentProcessing: LessonTopic = {
  id: 'finals-concurrent-processing', title: 'Concurrent Processing',
  description: 'Shared resources, mutual exclusion, deadlock, critical regions, and file locking.',
  sections: [
    { id: 'concurrent-environments', title: 'Concurrent processing environments', summary: s.concurrency.text,
      source: 'Concurrent Processing · slides 3–5', bullets: [s.multiprogramming.text, s.multiprocessing.text],
      recallPrompt: 'How do the slides define the two environments?', recallAnswer: `${s.multiprogramming.text} ${s.multiprocessing.text}` },
    { id: 'concurrency-tradeoffs', title: 'Advantages and coordination costs', summary: s.performance.text,
      source: 'Concurrent Processing · slides 6–8', bullets: [s.utilization.text, s.applications.text, s.protection.text, s.coordination.text, s.overhead.text],
      terms: [{ term: 'Fully independent', definition: s.independent.text }, { term: 'Independent but related', definition: s.related.text }],
      recallPrompt: 'What coordination and protection requirements do the slides list?', recallAnswer: `${s.protection.text} ${s.coordination.text} ${s.overhead.text}` },
    { id: 'mutual-exclusion', title: 'Mutual exclusion', summary: s.mutualExclusion.text,
      source: 'Concurrent Processing · slides 9–12', bullets: [s.serialResources.text], examples: [s.printerExclusive.text, s.printerQueue.text, s.printerAllocation.text],
      recallPrompt: 'What do the slides say about serial reusable resources?', recallAnswer: s.serialResources.text },
    { id: 'deadlock', title: 'Deadlock and resource ordering', summary: s.deadlock.text,
      source: 'Concurrent Processing · slides 13–17', examples: [s.standoff.text, s.printerFileExample.text, s.circularWait.text],
      bullets: [s.resourceOrder.text, s.bookFirst.text, s.allResources.text],
      recallPrompt: 'What rule does the lesson propose for requesting resources?', recallAnswer: s.resourceOrder.text },
    { id: 'critical-region', title: 'Critical regions and waiting', summary: s.criticalRegion.text,
      source: 'Concurrent Processing · slides 18–20', bullets: [s.criticalEntry.text],
      recallPrompt: 'How do the slides guarantee mutual exclusion?', recallAnswer: s.criticalEntry.text },
    { id: 'race-and-lock-scope', title: 'Race conditions and record locking', summary: s.race.text,
      source: 'Concurrent Processing · slides 21–25', bullets: [s.seatLock.text, s.databaseLock.text, s.seatConcurrency.text, s.fileProcessing.text, s.lockingSolution.text],
      recallPrompt: 'What should the system lock in the seat-booking example?', recallAnswer: s.seatLock.text },
    { id: 'lock-types', title: 'File, write, and read locks', summary: s.fileLock.text,
      source: 'Concurrent Processing · slide 26', terms: [
        { term: 'File lock', definition: s.fileLock.text }, { term: 'Write lock', definition: s.writeLock.text }, { term: 'Read lock', definition: s.readLock.text },
      ], recallPrompt: 'What does the slide say about a read lock?', recallAnswer: s.readLock.text },
  ],
};
export const fileAndDiskManagement: LessonTopic = {
  id: 'finals-file-disk-management', title: 'File and Disk Management',
  description: 'File structures, file-system layers, file types, access mechanisms, and disk allocation.',
  sections: [
    { id: 'files-and-structures', title: 'Files and file structures', summary: `${s.file.text} ${s.fileMeaning.text}`,
      source: 'File and Disk Management · slides 5–6', terms: [
        { term: 'Text file', definition: s.text.text }, { term: 'Source file', definition: s.source.text }, { term: 'Object file', definition: s.object.text },
      ], bullets: [s.structure.text, s.structureSupport.text, s.minimalStructures.text, s.structureFormat.text],
      recallPrompt: 'How do the slides describe text, source, and object files?', recallAnswer: `${s.text.text} ${s.source.text} ${s.object.text}` },
    { id: 'file-systems', title: 'File systems and their layers', summary: `${s.fileSystem.text} ${s.fileSystemNames.text}`,
      source: 'File and Disk Management · slides 8–9', terms: [
        { term: 'User Application', definition: s.userApplication.text }, { term: 'Logical File System', definition: s.logical.text },
        { term: 'Virtual File System (VFS)', definition: s.vfs.text }, { term: 'Physical File System', definition: s.physical.text },
        { term: 'Partition 1, Partition 2, Partition 3', definition: s.partition.text },
      ], recallPrompt: 'What is the slide’s definition of Virtual File System (VFS)?', recallAnswer: s.vfs.text },
    { id: 'file-types', title: 'Ordinary, directory, and special files', summary: s.fileType.text,
      source: 'File and Disk Management · slides 11–14', terms: [
        { term: 'Ordinary Files', definition: s.ordinary.text, notes: [s.ordinaryContents.text, s.ordinaryOperations.text] },
        { term: 'Directory Files', definition: s.directory.text }, { term: 'Special Files', definition: s.special.text, notes: [s.specialAlias.text] },
      ], recallPrompt: 'What does the slide say directory files contain?', recallAnswer: s.directory.text },
    { id: 'access-mechanisms', title: 'File access mechanisms', summary: s.sequential.text,
      source: 'File and Disk Management · slide 15', terms: [
        { term: 'Sequential Access', definition: s.sequential.text },
        { term: 'Direct/Random access', definition: s.random.text, notes: [s.recordAddress.text, s.recordLocations.text] },
        { term: 'Indexed sequential access', definition: s.indexedSequential.text },
      ], recallPrompt: 'How does the slide describe indexed sequential access?', recallAnswer: s.indexedSequential.text },
    { id: 'contiguous-linked', title: 'Contiguous and linked allocation', summary: s.contiguous.text,
      source: 'File and Disk Management · slide 17', terms: [
        { term: 'Contiguous Allocation', definition: s.contiguous.text, notes: [s.linearAddresses.text, s.easyAllocation.text, s.fragmentation.text] },
        { term: 'Linked Allocation', definition: s.linked.text, notes: [s.firstBlock.text, s.linkedTradeoffs.text] },
      ], recallPrompt: 'What access tradeoff does the slide list for linked allocation?', recallAnswer: s.linkedAccess.text },
    { id: 'indexed-allocation', title: 'Indexed allocation', summary: s.indexBlock.text,
      source: 'File and Disk Management · slide 17', bullets: [s.indexed.text, s.indexCreation.text, s.indexDirectory.text],
      recallPrompt: 'What does the directory contain in indexed allocation?', recallAnswer: s.indexDirectory.text },
  ],
};
