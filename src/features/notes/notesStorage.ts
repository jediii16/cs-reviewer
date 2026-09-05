export const notesStorageKey = 'cit017-reviewer-blurting-notes';

export interface BlurtingNotesState {
  version: 1;
  notes: Record<string, string>;
  selectedId: string;
}

export function createDefaultNotes(validIds: readonly string[]): BlurtingNotesState {
  return { version: 1, notes: {}, selectedId: validIds[0] ?? 'general' };
}

function getDefaultStorage(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

function isStoredNotes(value: unknown): value is BlurtingNotesState {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  if (item.version !== 1 || typeof item.selectedId !== 'string') return false;
  if (!item.notes || typeof item.notes !== 'object' || Array.isArray(item.notes)) return false;
  return Object.values(item.notes).every((note) => typeof note === 'string');
}

export function loadNotes(
  validIds: readonly string[],
  storage = getDefaultStorage(),
): BlurtingNotesState {
  const defaults = createDefaultNotes(validIds);
  if (!storage) return defaults;

  try {
    const raw = storage.getItem(notesStorageKey);
    if (!raw) return defaults;
    const parsed: unknown = JSON.parse(raw);
    if (!isStoredNotes(parsed)) return defaults;

    const validIdSet = new Set(validIds);
    const notes = Object.fromEntries(
      Object.entries(parsed.notes).filter(([id]) => validIdSet.has(id)),
    );
    return {
      version: 1,
      notes,
      selectedId: validIdSet.has(parsed.selectedId) ? parsed.selectedId : defaults.selectedId,
    };
  } catch {
    return defaults;
  }
}

export function saveNotes(
  state: BlurtingNotesState,
  storage = getDefaultStorage(),
): void {
  if (!storage) return;
  try {
    storage.setItem(notesStorageKey, JSON.stringify(state));
  } catch {
    // Keep the current in-memory note usable when storage is unavailable.
  }
}

export function clearNote(state: BlurtingNotesState, id: string): BlurtingNotesState {
  const notes = { ...state.notes };
  delete notes[id];
  return { ...state, notes };
}
