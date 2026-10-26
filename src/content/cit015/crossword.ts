import type { TheoryTerm } from '../types';
import { slideCopy, type SlideCopyKey } from './slideCopy';

type TermSeed = readonly [answer: string, source: SlideCopyKey, blank?: string];
function terms(module: string, seeds: readonly TermSeed[]): TheoryTerm[] {
  return seeds.map(([answer, source, blank], index) => {
    const text = slideCopy[source].text;
    if (blank && !text.includes(blank)) throw new Error(`Missing crossword source phrase for ${source}`);
    return { id: `${module}-word-${index + 1}`, module, answer, displayAnswer: answer, clue: blank ? text.replace(blank, '____') : text };
  });
}
export const osCrosswordBanks = [
  { id: 'finals-concurrent-processing', title: 'Concurrent Processing', source: 'Concurrent Processing · slides 4–26', terms: terms('finals-concurrent-processing', [
    ['Multiprogramming', 'multiprogramming', 'multiprogramming'], ['Multiprocessing', 'multiprocessing', 'multiprocessing'],
    ['Mutual exclusion', 'serialResources', 'mutual exclusion'], ['Deadlock', 'deadlock', 'Deadlock'],
    ['Critical region', 'criticalRegion', 'critical region'], ['File lock', 'fileLock'], ['Read lock', 'readLock'], ['Write lock', 'writeLock'],
    ['Race condition', 'race', 'race condition'], ['Record locking', 'seatLock'], ['Shared memory', 'multiprocessing', 'shared memory'],
    ['Resource utilization', 'utilization'], ['Printer', 'printerExclusive', 'printer'], ['Queue', 'printerQueue', 'queue'], ['Coordination', 'coordination'],
  ]) },
  { id: 'finals-file-disk-management', title: 'File and Disk Management', source: 'File and Disk Management · slides 5–17', terms: terms('finals-file-disk-management', [
    ['Text file', 'text', 'text file'], ['Source file', 'source', 'source file'], ['Object file', 'object', 'object file'],
    ['File system', 'fileSystem'], ['Virtual file system', 'vfs'], ['Logical file system', 'logical'], ['Physical file system', 'physical'],
    ['Ordinary file', 'ordinary'], ['Directory file', 'directory'], ['Special file', 'special'], ['Sequential access', 'sequential', 'sequential access'],
    ['Random access', 'random', 'Random access'], ['Indexed sequential access', 'indexedSequential'], ['Contiguous allocation', 'contiguous'],
    ['Linked allocation', 'linked'], ['Indexed allocation', 'indexBlock'],
  ]) },
];
