import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { notesStorageKey } from './notesStorage';
import { useBlurtingNotes } from './useBlurtingNotes';

const noteIds = ['general', 'foundations'];

function NotesHarness() {
  const notes = useBlurtingNotes(noteIds, 300);
  return (
    <>
      <textarea aria-label="note" value={notes.text} onChange={(event) => notes.setText(event.currentTarget.value)} />
      <button type="button" onClick={() => notes.selectNote('general')}>General</button>
      <button type="button" onClick={() => notes.selectNote('foundations')}>Foundations</button>
      <button type="button" onClick={notes.clearCurrent}>Clear</button>
      <output aria-label="selected note">{notes.selectedId}</output>
      <output aria-label="save status">{notes.saveStatus}</output>
    </>
  );
}

describe('useBlurtingNotes', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => vi.useRealTimers());

  it('updates immediately and saves after the debounce', () => {
    render(<NotesHarness />);

    fireEvent.change(screen.getByRole('textbox', { name: /note/i }), {
      target: { value: 'Confidentiality integrity availability' },
    });

    expect(screen.getByLabelText('save status')).toHaveTextContent('saving');
    expect(localStorage.getItem(notesStorageKey)).toBeNull();

    act(() => vi.advanceTimersByTime(299));
    expect(localStorage.getItem(notesStorageKey)).toBeNull();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByLabelText('save status')).toHaveTextContent('saved');
    expect(JSON.parse(localStorage.getItem(notesStorageKey) ?? '{}')).toMatchObject({
      notes: { general: 'Confidentiality integrity availability' },
    });
  });

  it('keeps topic notes separate and restores the last selected note', () => {
    const first = render(<NotesHarness />);
    const editor = screen.getByRole('textbox', { name: /note/i });

    fireEvent.change(editor, { target: { value: 'General memory' } });
    act(() => vi.advanceTimersByTime(300));
    fireEvent.click(screen.getByRole('button', { name: /foundations/i }));
    fireEvent.change(editor, { target: { value: 'CIA memory' } });
    act(() => vi.advanceTimersByTime(300));

    first.unmount();
    render(<NotesHarness />);

    expect(screen.getByLabelText('selected note')).toHaveTextContent('foundations');
    expect(screen.getByRole('textbox', { name: /note/i })).toHaveValue('CIA memory');

    fireEvent.click(screen.getByRole('button', { name: /general/i }));
    expect(screen.getByRole('textbox', { name: /note/i })).toHaveValue('General memory');
  });

  it('clears the current note from memory and storage immediately', () => {
    render(<NotesHarness />);
    fireEvent.change(screen.getByRole('textbox', { name: /note/i }), { target: { value: 'Remove me' } });
    act(() => vi.advanceTimersByTime(300));

    fireEvent.click(screen.getByRole('button', { name: /clear/i }));

    expect(screen.getByRole('textbox', { name: /note/i })).toHaveValue('');
    expect(JSON.parse(localStorage.getItem(notesStorageKey) ?? '{}')).toMatchObject({ notes: {} });
  });
});
