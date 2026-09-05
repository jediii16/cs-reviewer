import { useRef, useState } from 'react';
import { NotebookPen } from 'lucide-react';
import { cit017Subject } from '../../content/cit017';
import { NotesDialog, type NoteOption } from './NotesDialog';
import { useBlurtingNotes } from './useBlurtingNotes';

const noteOptions: NoteOption[] = [
  { id: 'general', label: 'General' },
  ...cit017Subject.topics.map((topic) => ({ id: topic.id, label: topic.title })),
];

const noteIds = noteOptions.map((option) => option.id);

export function BlurtingNotes() {
  const notes = useBlurtingNotes(noteIds);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function closeDialog() {
    setOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }

  return (
    <>
      <button ref={triggerRef} className="header-tool" type="button" aria-label="Open Blurting Notes" onClick={() => setOpen(true)}>
        <NotebookPen aria-hidden="true" />
      </button>
      {open ? <NotesDialog notes={notes} options={noteOptions} onClose={closeDialog} /> : null}
    </>
  );
}
