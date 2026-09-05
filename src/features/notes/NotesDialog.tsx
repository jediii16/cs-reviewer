import type { MouseEvent } from 'react';
import { useEffect, useRef } from 'react';
import { ChevronDown, Trash2, X } from 'lucide-react';
import type { BlurtingNotesController } from './useBlurtingNotes';

export interface NoteOption {
  id: string;
  label: string;
}

interface NotesDialogProps {
  notes: BlurtingNotesController;
  options: NoteOption[];
  onClose: () => void;
}

export function NotesDialog({ notes, options, onClose }: NotesDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const wordCount = notes.text.trim() ? notes.text.trim().split(/\s+/).length : 0;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    if (!dialog.open) dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  function closeFromBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  function clearCurrentNote() {
    if (!notes.text || !window.confirm('Clear this note? This cannot be undone.')) return;
    notes.clearCurrent();
  }

  return (
    <dialog
      ref={dialogRef}
      className="notes-dialog"
      aria-labelledby="notes-dialog-title"
      onClick={closeFromBackdrop}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="notes-dialog-panel">
        <header className="notes-dialog-header">
          <div>
            <h2 id="notes-dialog-title">Blurting Notes</h2>
            <p>Write everything you remember before checking the lesson.</p>
          </div>
          <button className="icon-button" type="button" aria-label="Close Blurting Notes" onClick={onClose}>
            <X aria-hidden="true" />
          </button>
        </header>

        <label className="notes-topic-control">
          <span>Note topic</span>
          <span className="notes-select-wrap">
            <select
              aria-label="Note topic"
              value={notes.selectedId}
              onChange={(event) => notes.selectNote(event.currentTarget.value)}
            >
              {options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
            <ChevronDown aria-hidden="true" />
          </span>
        </label>

        <textarea
          className="notes-editor"
          aria-label="Blurting note"
          value={notes.text}
          placeholder="Start with what you remember. It does not need to be organized yet."
          spellCheck="true"
          onChange={(event) => notes.setText(event.currentTarget.value)}
        />

        <footer className="notes-dialog-footer">
          <div className="notes-status" aria-live="polite">
            <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
            <span>{notes.saveStatus === 'saving' ? 'Saving…' : 'Saved locally'}</span>
          </div>
          <button className="notes-clear" type="button" disabled={!notes.text} onClick={clearCurrentNote}>
            <Trash2 aria-hidden="true" /> Clear note
          </button>
        </footer>
      </div>
    </dialog>
  );
}
