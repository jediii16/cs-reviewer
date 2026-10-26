// False items change one marked phrase. The correction restores the exact slide statement.
const falseEdits: Record<string, readonly [from: string, to: string]> = {
  'finals-concurrent-processing-tf-2': ['two or more processors', 'one processor'],
  'finals-concurrent-processing-tf-4': ['It is necessary', 'It is unnecessary'],
  'finals-concurrent-processing-tf-6': ['one job', 'two jobs'],
  'finals-concurrent-processing-tf-10': ['will never occur', 'will always occur'],
  'finals-concurrent-processing-tf-11': ['only one process', 'two processes'],
  'finals-concurrent-processing-tf-12': ['only one process', 'any number of processes'],
  'finals-concurrent-processing-tf-14': ['only the specific seat (record)', 'the entire database'],
  'finals-concurrent-processing-tf-15': ['no process can modify it', 'any process can modify it'],
  'finals-file-disk-management-tf-2': ['characters organized into lines', 'bytes organized into blocks'],
  'finals-file-disk-management-tf-4': ['also contains the code', 'does not contain the code'],
  'finals-file-disk-management-tf-7': ['allowing different file systems to work', 'preventing different file systems from working'],
  'finals-file-disk-management-tf-10': ['Directory Files', 'Special Files'],
  'finals-file-disk-management-tf-13': ['need not be in adjacent locations', 'must be in adjacent locations'],
  'finals-file-disk-management-tf-17': ['first block', 'last block'],
  'finals-file-disk-management-tf-18': ['sequential access file. Inefficient in case of direct', 'direct access file. Inefficient in case of sequential'],
  'finals-file-disk-management-tf-19': ['Each file has its own', 'All files share one'],
};
export function makeFalseStatement(id: string, slideStatement: string) {
  const edit = falseEdits[id];
  if (!edit || !slideStatement.includes(edit[0])) throw new Error(`Missing source phrase for false statement ${id}`);
  return { prompt: slideStatement.replace(edit[0], edit[1]), incorrectPhrase: edit[1], correctedStatement: slideStatement };
}
