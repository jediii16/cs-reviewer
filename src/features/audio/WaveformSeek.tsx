import type { CSSProperties, PointerEvent } from 'react';

const waveform = [8, 13, 18, 11, 22, 29, 17, 25, 34, 19, 27, 15, 31, 23, 12, 20, 28, 16, 24, 10, 18, 30, 21, 14];

interface WaveformSeekProps {
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  onPointerDown?: (event: PointerEvent<HTMLInputElement>) => void;
  onPointerUp?: (event: PointerEvent<HTMLInputElement>) => void;
}

export function WaveformSeek({
  currentTime,
  duration,
  onSeek,
  onPointerDown,
  onPointerUp,
}: WaveformSeekProps) {
  const progress = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
  const style = { '--seek-progress': `${progress * 100}%` } as CSSProperties;

  return (
    <label className="waveform-seek" style={style}>
      <span className="sr-only">Seek through current track</span>
      <span className="waveform-bars" aria-hidden="true">
        {waveform.map((height, index) => (
          <i
            key={`${height}-${index}`}
            className={(index + 1) / waveform.length <= progress ? 'is-played' : undefined}
            style={{ height }}
          />
        ))}
      </span>
      <input
        aria-label="Seek through current track"
        type="range"
        min="0"
        max={duration || 0}
        step="0.1"
        value={duration ? Math.min(currentTime, duration) : 0}
        disabled={!duration}
        onChange={(event) => onSeek(Number(event.currentTarget.value))}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      />
    </label>
  );
}
