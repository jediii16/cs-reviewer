import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AmbientAudioEngine } from './ambientAudio';
import { useAmbientAudio } from './useAmbientAudio';

function createMockEngine(): AmbientAudioEngine {
  return {
    start: vi.fn().mockResolvedValue(undefined),
    setVolume: vi.fn(),
    stop: vi.fn(),
    dispose: vi.fn(),
  };
}

function AmbientHarness({ engine }: { engine: AmbientAudioEngine }) {
  const audio = useAmbientAudio(() => engine);

  return (
    <div>
      <button type="button" onClick={() => void audio.chooseSound('rain')}>Soft rain</button>
      <button type="button" onClick={() => void audio.chooseSound('brown-noise')}>Brown noise</button>
      <button type="button" onClick={() => void audio.chooseSound('off')}>Off</button>
      <output>{audio.selectedSound}</output>
      {audio.unavailable ? <p role="status">Audio is unavailable on this browser.</p> : null}
    </div>
  );
}

describe('useAmbientAudio', () => {
  beforeEach(() => localStorage.clear());

  it('stores a selection but never starts it until the user chooses it', async () => {
    const user = userEvent.setup();
    const engine = createMockEngine();
    render(<AmbientHarness engine={engine} />);

    expect(engine.start).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: /soft rain/i }));

    expect(engine.start).toHaveBeenCalledWith('rain', 0.22);
    expect(screen.getByText('rain')).toBeVisible();
  });

  it('returns to off when Web Audio is unavailable', async () => {
    const user = userEvent.setup();
    const engine = createMockEngine();
    vi.mocked(engine.start).mockRejectedValue(new Error('unavailable'));
    render(<AmbientHarness engine={engine} />);

    await user.click(screen.getByRole('button', { name: /brown noise/i }));

    expect(screen.getByText(/audio is unavailable/i)).toBeVisible();
    expect(screen.getByText('off')).toBeVisible();
  });
});
