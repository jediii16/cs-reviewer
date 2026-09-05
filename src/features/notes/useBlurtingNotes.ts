import { useEffect, useRef, useState } from 'react';
import {
  clearNote,
  loadNotes,
  saveNotes,
  type BlurtingNotesState,
} from './notesStorage';

export interface BlurtingNotesController {
  state: BlurtingNotesState;
  selectedId: string;
  text: string;
  saveStatus: 'saved' | 'saving';
  setText: (text: string) => void;
  selectNote: (id: string) => void;
  clearCurrent: () => void;
}

export function useBlurtingNotes(
  noteIds: readonly string[],
  autosaveDelayMs = 300,
): BlurtingNotesController {
  const [validIdSet] = useState(() => new Set(noteIds));
  const pendingSaveRef = useRef(false);
  const [state, setState] = useState(() => loadNotes(noteIds));
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  useEffect(() => {
    if (!pendingSaveRef.current) return undefined;
    const timeout = window.setTimeout(() => {
      saveNotes(state);
      pendingSaveRef.current = false;
      setSaveStatus('saved');
    }, autosaveDelayMs);
    return () => window.clearTimeout(timeout);
  }, [autosaveDelayMs, state]);

  function setText(text: string) {
    pendingSaveRef.current = true;
    setSaveStatus('saving');
    setState((current) => ({
      ...current,
      notes: { ...current.notes, [current.selectedId]: text },
    }));
  }

  function selectNote(id: string) {
    if (!validIdSet.has(id) || id === state.selectedId) return;
    pendingSaveRef.current = true;
    setSaveStatus('saving');
    setState((current) => ({ ...current, selectedId: id }));
  }

  function clearCurrent() {
    const next = clearNote(state, state.selectedId);
    pendingSaveRef.current = false;
    setState(next);
    saveNotes(next);
    setSaveStatus('saved');
  }

  return {
    state,
    selectedId: state.selectedId,
    text: state.notes[state.selectedId] ?? '',
    saveStatus,
    setText,
    selectNote,
    clearCurrent,
  };
}
