import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearNote,
  loadNotes,
  notesStorageKey,
  saveNotes,
} from './notesStorage';

const noteIds = ['general', 'foundations', 'principles'];

describe('blurting notes storage', () => {
  beforeEach(() => localStorage.clear());

  it('returns clean defaults when stored data is malformed or unsupported', () => {
    localStorage.setItem(notesStorageKey, '{bad json');
    expect(loadNotes(noteIds)).toEqual({ version: 1, notes: {}, selectedId: 'general' });

    localStorage.setItem(notesStorageKey, JSON.stringify({ version: 8 }));
    expect(loadNotes(noteIds)).toEqual({ version: 1, notes: {}, selectedId: 'general' });
  });

  it('round-trips separate topic notes and the selected topic', () => {
    saveNotes({
      version: 1,
      notes: {
        foundations: 'CIA means confidentiality, integrity, and availability.',
        principles: 'Least privilege limits access.',
      },
      selectedId: 'foundations',
    });

    expect(loadNotes(noteIds)).toEqual({
      version: 1,
      notes: {
        foundations: 'CIA means confidentiality, integrity, and availability.',
        principles: 'Least privilege limits access.',
      },
      selectedId: 'foundations',
    });
  });

  it('filters unknown note IDs and falls back from an invalid selection', () => {
    localStorage.setItem(notesStorageKey, JSON.stringify({
      version: 1,
      notes: { foundations: 'Known', unknown: 'Ignore me' },
      selectedId: 'unknown',
    }));

    expect(loadNotes(noteIds)).toEqual({
      version: 1,
      notes: { foundations: 'Known' },
      selectedId: 'general',
    });
  });

  it('rejects non-string note values', () => {
    localStorage.setItem(notesStorageKey, JSON.stringify({
      version: 1,
      notes: { foundations: 42 },
      selectedId: 'foundations',
    }));

    expect(loadNotes(noteIds)).toEqual({ version: 1, notes: {}, selectedId: 'general' });
  });

  it('clears only the requested note', () => {
    const cleared = clearNote({
      version: 1,
      notes: { foundations: 'Remove', principles: 'Keep' },
      selectedId: 'foundations',
    }, 'foundations');

    expect(cleared).toEqual({
      version: 1,
      notes: { principles: 'Keep' },
      selectedId: 'foundations',
    });
  });
});
