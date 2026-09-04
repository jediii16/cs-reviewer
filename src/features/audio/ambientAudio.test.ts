import { describe, expect, it, vi } from 'vitest';
import { createAmbientAudio } from './ambientAudio';

function createFakeAudioContext() {
  const channelData = new Float32Array(64);
  const source = {
    buffer: null,
    loop: false,
    connect: vi.fn(),
    disconnect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  };
  const filter = {
    type: 'lowpass',
    frequency: { value: 0 },
    Q: { value: 0 },
    connect: vi.fn(),
    disconnect: vi.fn(),
  };
  const gain = {
    gain: {
      value: 0,
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      cancelScheduledValues: vi.fn(),
    },
    connect: vi.fn(),
    disconnect: vi.fn(),
  };

  const context = {
    state: 'suspended',
    currentTime: 0,
    sampleRate: 32,
    destination: {},
    resume: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
    createBuffer: vi.fn(() => ({ getChannelData: () => channelData })),
    createBufferSource: vi.fn(() => source),
    createBiquadFilter: vi.fn(() => filter),
    createGain: vi.fn(() => gain),
  };

  return { context, source, filter, gain };
}

describe('ambient audio engine', () => {
  it('starts only when requested and disconnects every node on stop', async () => {
    const fake = createFakeAudioContext();
    const engine = createAmbientAudio(() => fake.context as unknown as AudioContext);

    expect(fake.context.createBufferSource).not.toHaveBeenCalled();
    await engine.start('brown-noise', 0.2);

    expect(fake.context.resume).toHaveBeenCalledOnce();
    expect(fake.context.createBufferSource).toHaveBeenCalledOnce();
    expect(fake.source.start).toHaveBeenCalledOnce();

    engine.stop();

    expect(fake.source.stop).toHaveBeenCalledOnce();
    expect(fake.source.disconnect).toHaveBeenCalledOnce();
    expect(fake.filter.disconnect).toHaveBeenCalledOnce();
    expect(fake.gain.disconnect).toHaveBeenCalledOnce();
  });

  it('clamps volume before applying it to the gain node', async () => {
    const fake = createFakeAudioContext();
    const engine = createAmbientAudio(() => fake.context as unknown as AudioContext);

    await engine.start('rain', 3);

    expect(fake.gain.gain.linearRampToValueAtTime).toHaveBeenCalledWith(1, 0.08);
  });
});
