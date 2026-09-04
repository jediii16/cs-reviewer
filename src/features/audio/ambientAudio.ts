import type { AmbientSound } from '../progress/storage';

export type PlayableAmbientSound = Exclude<AmbientSound, 'off'>;

export interface AmbientAudioEngine {
  start(sound: PlayableAmbientSound, volume: number): Promise<void>;
  setVolume(volume: number): void;
  stop(): void;
  dispose(): void;
}

interface ActiveNodes {
  source: AudioBufferSourceNode;
  filter: BiquadFilterNode;
  gain: GainNode;
}

type AudioContextFactory = () => AudioContext;

function clampVolume(volume: number) {
  return Math.min(1, Math.max(0, volume));
}

function fillNoise(channel: Float32Array, sound: PlayableAmbientSound) {
  let previous = 0;

  for (let index = 0; index < channel.length; index += 1) {
    const white = Math.random() * 2 - 1;
    if (sound === 'brown-noise') {
      previous = (previous + 0.02 * white) / 1.02;
      channel[index] = previous * 3.5;
    } else {
      channel[index] = white;
    }
  }
}

export function createAmbientAudio(
  createContext: AudioContextFactory = () => new AudioContext(),
): AmbientAudioEngine {
  let context: AudioContext | undefined;
  let active: ActiveNodes | undefined;

  function stop() {
    if (!active || !context) return;

    const { source, filter, gain } = active;
    const now = context.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.06);
    source.stop(now + 0.06);
    source.disconnect();
    filter.disconnect();
    gain.disconnect();
    active = undefined;
  }

  return {
    async start(sound, volume) {
      stop();
      context ??= createContext();

      if (context.state === 'suspended') await context.resume();

      const seconds = 2;
      const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
      fillNoise(buffer.getChannelData(0), sound);

      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();

      source.buffer = buffer;
      source.loop = true;
      filter.type = sound === 'rain' ? 'highpass' : 'lowpass';
      filter.frequency.value = sound === 'rain' ? 900 : 520;
      filter.Q.value = sound === 'rain' ? 0.45 : 0.2;

      const now = context.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(clampVolume(volume), now + 0.08);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      source.start();
      active = { source, filter, gain };
    },

    setVolume(volume) {
      if (!active || !context) return;
      const now = context.currentTime;
      active.gain.gain.cancelScheduledValues(now);
      active.gain.gain.linearRampToValueAtTime(clampVolume(volume), now + 0.05);
    },

    stop,

    dispose() {
      stop();
      if (context && context.state !== 'closed') void context.close();
      context = undefined;
    },
  };
}
