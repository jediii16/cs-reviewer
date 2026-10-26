import type { ChoiceQuestion, TestSet } from '../types';
import { makeFalseStatement } from './corrections';
import { quotedPassage, slideCopy, slideReference, type SlideCopyKey } from './slideCopy';

type MCSeed = readonly [concept: string, passage: SlideCopyKey, correct: string, distractors: readonly string[], blank?: string];
type TFSeed = readonly [concept: string, passage: SlideCopyKey, answer: boolean, includeTerm?: boolean];
const concurrentId = 'finals-concurrent-processing';
const filesId = 'finals-file-disk-management';

function multipleChoice(topicId: string, seeds: readonly MCSeed[]): ChoiceQuestion[] {
  return seeds.map(([concept, key, correct, distractors, blank], index) => {
    const passage = slideCopy[key];
    if (blank && (!passage.text.includes(blank) || blank !== correct)) throw new Error(`Invalid slide blank for ${key}`);
    const id = `${topicId}-mc-${index + 1}`;
    return {
      id, topicId, concept, kind: 'multiple-choice',
      prompt: blank ? `Complete the slide text:\n\n${passage.text.replace(blank, '____')}` : `Which term matches the slide text?\n\n${passage.text}`,
      explanation: passage.text, sourceText: passage.text, source: slideReference(passage),
      options: [correct, ...distractors].map((label, i) => ({ id: `${id}-${i}`, label })), correctOptionId: `${id}-0`,
    };
  });
}
function trueFalse(topicId: string, seeds: readonly TFSeed[]): ChoiceQuestion[] {
  return seeds.map(([concept, key, answer, includeTerm], index) => {
    const passage = slideCopy[key];
    const statement = quotedPassage(key, includeTerm);
    const id = `${topicId}-tf-${index + 1}`;
    return {
      id, topicId, concept, kind: 'true-false', prompt: statement,
      explanation: statement, sourceText: passage.text, source: slideReference(passage),
      options: [{ id: `${id}-true`, label: 'True' }, { id: `${id}-false`, label: 'False' }],
      correctOptionId: `${id}-${answer ? 'true' : 'false'}`,
      ...(!answer ? makeFalseStatement(id, statement) : {}),
    };
  });
}

const concurrentMC = multipleChoice(concurrentId, [
  ['Multiprogramming', 'multiprogramming', 'multiprogramming', ['multiprocessing', 'file locking', 'indexed allocation'], 'multiprogramming'],
  ['Multiprocessing', 'multiprocessing', 'multiprocessing', ['multiprogramming', 'sequential access', 'read locking'], 'multiprocessing'],
  ['Performance', 'performance', 'Better Performance', ['Better Resource Utilization', 'Running Multiple Applications', 'Disadvantages']],
  ['Resource utilization', 'utilization', 'Better Resource Utilization', ['Better Performance', 'Running Multiple Applications', 'Disadvantages']],
  ['Coordination', 'coordination', 'extra techniques', ['no techniques', 'index blocks', 'file structures'], 'extra techniques'],
  ['Protection', 'protection', 'protect multiple applications from each other', ['prevent all applications from running', 'disable every shared resource', 'remove all file permissions'], 'protect multiple applications from each other'],
  ['Switching overhead', 'overhead', 'Additional performance overheads and complexities in OS', ['No performance overheads or complexities in OS', 'Only external fragmentation', 'Only file structure changes'], 'Additional performance overheads and complexities in OS'],
  ['Independent processes', 'independent', 'Fully independent', ['Independent but related', 'Deadlock', 'Write lock']],
  ['Related processes', 'related', 'Independent but related', ['Fully independent', 'Deadlock', 'Read lock']],
  ['Printer exclusion', 'printerMix', 'mixed together', ['kept separate automatically', 'printed on different devices', 'removed from the queue'], 'mixed together'],
  ['Printer queue', 'printerQueue', 'queue', ['critical region', 'index block', 'partition'], 'queue'],
  ['Mutual exclusion', 'mutualExclusion', 'for as long as process requires', ['until another process requests it', 'for exactly one instruction', 'only while no other process waits'], 'for as long as process requires'],
  ['Deadlock', 'standoff', 'deadlock', ['read lock', 'race condition', 'multiprogramming'], 'deadlock'],
  ['Resource ordering', 'resourceOrder', 'same fixed order', ['opposite order', 'random order', 'order of their own choosing'], 'same fixed order'],
  ['All resources at once', 'allResources', 'get all the resources they need at once', ['keep one resource and wait indefinitely', 'lock the entire database', 'never release any resource'], 'get all the resources they need at once'],
  ['Deadlock definition', 'deadlock', 'Deadlock', ['Multiprocessing', 'Read lock', 'Sequential Access'], 'Deadlock'],
  ['Printer-file deadlock', 'circularWait', 'held by the other', ['held by itself', 'already released', 'not required by any process'], 'held by the other'],
  ['Critical region', 'criticalRegion', 'critical region', ['index block', 'directory file', 'storage partition'], 'critical region'],
  ['Critical-region entry', 'criticalEntry', 'one process', ['two processes', 'every process', 'no process'], 'one process'],
  ['Race condition', 'race', 'race condition', ['deadlock', 'read lock', 'contiguous allocation'], 'race condition'],
  ['Record lock scope', 'seatLock', 'specific seat (record)', ['entire database', 'entire flight schedule', 'agents’ display screens'], 'specific seat (record)'],
  ['File lock', 'fileLock', 'File lock', ['Write lock', 'Read lock', 'Deadlock']],
  ['Write lock', 'writeLock', 'write locked', ['read locked', 'unlocked', 'deleted'], 'write locked'],
  ['Read lock', 'readLock', 'read locked', ['write locked', 'unlocked', 'deleted'], 'read locked'],
]);

const filesMC = multipleChoice(filesId, [
  ['File definition', 'file', 'file', ['process', 'partition', 'device driver'], 'file'],
  ['File meaning', 'fileMeaning', 'files creator and user', ['disk manufacturer', 'CPU scheduler', 'printer queue'], 'files creator and user'],
  ['Secondary storage', 'file', 'magnetic disks, magnetic tapes and optical disks', ['CPU registers, cache and stack pointers', 'ready queues, timers and process counters', 'keyboards, mice and display menus'], 'magnetic disks, magnetic tapes and optical disks'],
  ['Text structure', 'text', 'text file', ['source file', 'object file', 'device file'], 'text file'],
  ['Source structure', 'source', 'source file', ['text file', 'object file', 'directory file'], 'source file'],
  ['Object structure', 'object', 'object file', ['text file', 'source file', 'directory file'], 'object file'],
  ['Structure support', 'structureSupport', 'the code to support these file structure', ['a separate processor for each file', 'a ban on all text files', 'one shared record address'], 'the code to support these file structure'],
  ['Minimal structures', 'minimalStructures', 'Unix, MS-DOS', ['FAT, NTFS', 'HFS, APFS', 'Logical File System, Virtual File System'], 'Unix, MS-DOS'],
  ['File-system purpose', 'fileSystem', 'File systems', ['Process schedulers', 'Printer queues', 'CPU registers'], 'File systems'],
  ['File-system examples', 'fileSystemNames', 'APFS', ['VFS', 'PCB', 'PID'], 'APFS'],
  ['Application layer', 'userApplication', 'User Application', ['Physical File System', 'Logical File System', 'Virtual File System (VFS)']],
  ['Logical layer', 'logical', 'Logical File System', ['Physical File System', 'User Application', 'Virtual File System (VFS)']],
  ['VFS layer', 'vfs', 'Virtual File System (VFS)', ['Physical File System', 'Logical File System', 'User Application']],
  ['Physical layer', 'physical', 'Physical File System', ['Logical File System', 'User Application', 'Virtual File System (VFS)']],
  ['Partition', 'partition', 'Partition 1, Partition 2, Partition 3', ['Logical File System', 'Virtual File System (VFS)', 'User Application']],
  ['File type', 'fileType', 'File type', ['Process state', 'CPU priority', 'Shared memory'], 'File type'],
  ['Ordinary file', 'ordinary', 'Ordinary Files', ['Directory Files', 'Special Files', 'File System']],
  ['Ordinary operations', 'ordinaryOperations', 'add, modify, delete or even remove the entire file', ['only read the file name', 'only schedule the CPU', 'only change the number of processors'], 'add, modify, delete or even remove the entire file'],
  ['Directory file', 'directory', 'Directory Files', ['Ordinary Files', 'Special Files', 'File System']],
  ['Special file', 'special', 'Special Files', ['Directory Files', 'Ordinary Files', 'File Structure']],
  ['Device file', 'specialAlias', 'device files', ['index blocks', 'source files', 'directory entries'], 'device files'],
  ['Sequential access', 'sequential', 'sequential access', ['random access', 'indexed allocation', 'file locking'], 'sequential access'],
  ['Direct access', 'recordAddress', 'its own address', ['the same address as every other record', 'only the first record’s address', 'only the last record’s address'], 'its own address'],
  ['Random placement', 'recordLocations', 'in adjacent locations on the storage medium', ['in different files', 'in shared memory only', 'in the process queue'], 'in adjacent locations on the storage medium'],
  ['Indexed sequential access', 'indexedSequential', 'Indexed sequential access', ['Sequential Access', 'Direct/Random access', 'Contiguous Allocation']],
  ['Contiguous allocation', 'contiguous', 'Contiguous Allocation', ['Linked Allocation', 'Indexed Allocation', 'Direct/Random access']],
  ['External fragmentation', 'fragmentation', 'External fragmentation', ['File locking', 'Read locking', 'Context switching'], 'External fragmentation'],
  ['Linked allocation', 'firstBlock', 'first block', ['last block', 'index block', 'CPU register'], 'first block'],
  ['Linked access tradeoff', 'linkedTradeoffs', 'Linked Allocation', ['Contiguous Allocation', 'Indexed Allocation', 'Direct/Random access']],
  ['Indexed allocation', 'indexBlock', 'Indexed Allocation', ['Linked Allocation', 'Contiguous Allocation', 'Sequential Access']],
]);

const concurrentTF = trueFalse(concurrentId, [
  ['Multiprogramming', 'multiprogramming', true],
  ['Multiprocessing', 'multiprocessing', false],
  ['Resource utilization', 'utilization', true, true],
  ['Coordination cost', 'coordination', false],
  ['Related processes', 'related', true, true],
  ['Printer queue', 'printerExclusive', false],
  ['Resource ownership', 'printerAllocation', true],
  ['Deadlock', 'standoff', true],
  ['Resource ordering', 'resourceOrder', true],
  ['Deadlock definition', 'deadlock', false],
  ['Critical region', 'criticalEntry', false],
  ['Critical-region timeline', 'criticalEntry', false],
  ['Race condition', 'race', true],
  ['Lock scope', 'seatLock', false],
  ['Read lock', 'readLock', false],
  ['Write lock', 'writeLock', true],
]);
const filesTF = trueFalse(filesId, [
  ['File definition', 'file', true],
  ['Text structure', 'text', false],
  ['Source structure', 'source', true],
  ['Structure support', 'structureSupport', false],
  ['File systems', 'fileSystem', true],
  ['Logical layer', 'logical', true, true],
  ['VFS layer', 'vfs', false, true],
  ['Physical layer', 'physical', true, true],
  ['Ordinary files', 'ordinaryContents', true],
  ['Directory files', 'directory', false, true],
  ['Special files', 'specialAlias', true, true],
  ['Sequential access', 'sequential', true],
  ['Random access', 'recordLocations', false],
  ['Indexed sequential access', 'indexPointers', true],
  ['Contiguous allocation', 'contiguous', true],
  ['External fragmentation', 'fragmentation', true, true],
  ['Linked allocation', 'firstBlock', false, true],
  ['Linked direct access', 'linkedAccess', false, true],
  ['Index block', 'indexBlock', false],
  ['Directory index pointer', 'indexDirectory', true, true],
]);

function focusedSet(topicId: string, id: string, title: string, questions: ChoiceQuestion[]): TestSet {
  const isTF = questions[0].kind === 'true-false';
  return { id, topicId, title, questions,
    description: isTF ? 'Slide wording, with deliberate phrase changes for false statements. Feedback restores the original text.' : 'Exact slide definitions and fill-in-the-blank slide statements, with four choices.',
    instruction: isTF ? 'Judge each slide statement. False items deliberately change a phrase from the original.' : 'Match or complete the exact text from your slides.',
  };
}
export const cit015TestSets: TestSet[] = [
  focusedSet(concurrentId, 'finals-concurrent-mc', 'Concurrent Processing · Multiple choice', concurrentMC),
  focusedSet(concurrentId, 'finals-concurrent-tf', 'Concurrent Processing · True or false', concurrentTF),
  focusedSet(filesId, 'finals-files-mc', 'File and Disk Management · Multiple choice', filesMC),
  focusedSet(filesId, 'finals-files-tf', 'File and Disk Management · True or false', filesTF),
  { id: 'finals-mixed', topicId: 'finals-mixed', title: 'Mixed finals review',
    description: '20 questions: five of each test type from each lesson. A fresh mix every time.',
    instruction: 'Answer multiple-choice questions and true-or-false statements using the slide wording.',
    questions: [...concurrentMC, ...concurrentTF, ...filesMC, ...filesTF], questionLimit: 20, balanceTopics: true, balanceKinds: true,
  },
];
export const cit015TestTopicLabels: Record<string, string> = {
  [concurrentId]: 'Concurrent Processing', [filesId]: 'File and Disk Management', 'finals-mixed': 'Both finals lessons',
};
