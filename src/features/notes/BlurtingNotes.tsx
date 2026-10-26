import { useRef, useState } from 'react';
import { NotebookPen } from 'lucide-react';
import { useLearning } from '../learning/useLearning';
import { NotesDialog, type NoteOption } from './NotesDialog';
import type { BlurtingNotesController } from './useBlurtingNotes';

export function BlurtingNotes() {
  const { subjects, data, actions } = useLearning();
  const options: NoteOption[] = [{ id: 'general', label: 'General' }, ...subjects.flatMap((subject) => subject.topics.map((topic) => ({ id: `${subject.id}:${topic.id}`, label: `${subject.code} · ${topic.title}` })))];
  const selectedId = options.some((o) => o.id === data.selectedNoteId) ? data.selectedNoteId! : 'general';
  const text = data.notes?.[selectedId] ?? '';
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const notes: BlurtingNotesController = {
    state: { version: 1, notes: data.notes ?? {}, selectedId }, selectedId, text, saveStatus: 'saved',
    setText: (value) => actions.saveNote(selectedId, value),
    selectNote: (id) => { if (options.some((o) => o.id === id)) actions.selectNote(id); },
    clearCurrent: () => actions.saveNote(selectedId, ''),
  };
  function closeDialog() { setOpen(false); window.setTimeout(() => triggerRef.current?.focus(), 0); }
  return <><button ref={triggerRef} className="header-tool" type="button" aria-label="Open Blurting Notes" onClick={() => setOpen(true)}><NotebookPen aria-hidden="true" /></button>{open ? <NotesDialog notes={notes} options={options} onClose={closeDialog} /> : null}</>;
}
