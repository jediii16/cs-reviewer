import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BlurtingNotes } from './BlurtingNotes';

describe('BlurtingNotes', () => {
  beforeEach(() => localStorage.clear());

  it('edits separate topic notes, counts words, confirms clearing, and restores trigger focus', async () => {
    const user = userEvent.setup();
    const confirm = vi.spyOn(window, 'confirm')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    render(<BlurtingNotes />);

    const trigger = screen.getByRole('button', { name: /open blurting notes/i });
    await user.click(trigger);

    const dialog = screen.getByRole('dialog', { name: /blurting notes/i });
    expect(dialog).toBeVisible();
    expect(screen.getByText(/write everything you remember before checking/i)).toBeVisible();
    expect(screen.getByRole('option', { name: /cit\.016.*digital vs\. analog/i })).toBeVisible();

    const editor = screen.getByRole('textbox', { name: /blurting note/i });
    await user.type(editor, 'Confidentiality integrity availability');
    expect(screen.getByText('3 words')).toBeVisible();
    expect(screen.getByText(/saving/i)).toBeVisible();

    await user.selectOptions(screen.getByRole('combobox', { name: /note topic/i }), 'foundations');
    expect(editor).toHaveValue('');
    await user.type(editor, 'CIA memory');

    await user.click(screen.getByRole('button', { name: /clear note/i }));
    expect(editor).toHaveValue('CIA memory');
    await user.click(screen.getByRole('button', { name: /clear note/i }));
    expect(editor).toHaveValue('');
    expect(confirm).toHaveBeenCalledTimes(2);

    fireEvent(dialog, new Event('cancel', { bubbles: false, cancelable: true }));
    await waitFor(() => expect(screen.queryByRole('dialog', { name: /blurting notes/i })).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
