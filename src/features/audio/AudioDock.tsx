import type { FocusEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ListMusic, Music2, Pause, Play, Repeat, Repeat1, RotateCcw, Settings2, SkipBack, SkipForward, Volume2, X } from 'lucide-react';
import type { FocusAudioController } from './useFocusAudio';
import { WaveformSeek } from './WaveformSeek';

const collapseDelayMs = 3200;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remainder = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
}

interface AudioDockProps {
  audio: FocusAudioController;
  onOpenDialog: () => void;
}

export function AudioDock({ audio, onOpenDialog }: AudioDockProps) {
  const [expanded, setExpanded] = useState(false);
  const collapseTimer = useRef<number | undefined>(undefined);

  const cancelCollapse = useCallback(() => {
    if (collapseTimer.current !== undefined) {
      window.clearTimeout(collapseTimer.current);
      collapseTimer.current = undefined;
    }
  }, []);

  const scheduleCollapse = useCallback(() => {
    cancelCollapse();
    collapseTimer.current = window.setTimeout(() => setExpanded(false), collapseDelayMs);
  }, [cancelCollapse]);

  useEffect(() => {
    scheduleCollapse();
    return cancelCollapse;
  }, [cancelCollapse, scheduleCollapse]);

  function keepOpen() {
    cancelCollapse();
    setExpanded(true);
  }

  function closeAfterAction() {
    setExpanded(true);
    scheduleCollapse();
  }

  function leaveFocus(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) scheduleCollapse();
  }

  function finishSeeking() {
    scheduleCollapse();
  }

  const music = audio.music;
  const repeatLabel = music.loopMode === 'playlist' ? 'Repeat playlist' : 'Repeat one track';

  return (
    <section
      className="audio-dock"
      role="region"
      aria-label="Music player"
      data-expanded={expanded}
      onPointerEnter={cancelCollapse}
      onPointerLeave={scheduleCollapse}
      onFocusCapture={cancelCollapse}
      onBlurCapture={leaveFocus}
    >
      <button className="audio-dock-handle" type="button" aria-label="Show music player" aria-expanded={expanded} onClick={keepOpen}>
        <Music2 size={16} /><span>{music.playing ? music.selectedTrack?.label : 'A little background music'}</span>
      </button>

      <div className="audio-dock-panel" hidden={!expanded}>
        <button className="audio-dock-collapse" type="button" aria-label="Collapse music player" onClick={() => { cancelCollapse(); setExpanded(false); }}><X size={17} /></button>
        <div className="audio-dock-track">
          <span className="audio-dock-art"><ListMusic aria-hidden="true" /></span>
          <span>
            <strong>{music.selectedTrack?.label ?? 'No music yet'}</strong>
            <small>{music.selectedTrack?.collectionLabel ?? 'Add tracks to begin'}</small>
          </span>
        </div>

        <div className="audio-dock-transport" aria-label="Playback controls">
          <button type="button" aria-label="Previous track" onClick={() => { void music.previous(); closeAfterAction(); }}><SkipBack aria-hidden="true" /></button>
          <button type="button" aria-label="Restart current track" onClick={() => { music.restart(); closeAfterAction(); }}><RotateCcw aria-hidden="true" /></button>
          <button
            className="audio-dock-play"
            type="button"
            aria-label={music.playing ? 'Pause music' : 'Play music'}
            onClick={() => { void music.toggle(); closeAfterAction(); }}
            disabled={music.tracks.length === 0}
          >
            {music.playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          </button>
          <button type="button" aria-label="Next track" onClick={() => { void music.next(); closeAfterAction(); }}><SkipForward aria-hidden="true" /></button>
          <button
            type="button"
            aria-label={repeatLabel}
            aria-pressed={music.loopMode === 'track'}
            onClick={() => {
              music.setLoopMode(music.loopMode === 'playlist' ? 'track' : 'playlist');
              closeAfterAction();
            }}
          >
            {music.loopMode === 'playlist' ? <Repeat aria-hidden="true" /> : <Repeat1 aria-hidden="true" />}
          </button>
        </div>

        <div className="audio-dock-timeline">
          <time>{formatTime(music.currentTime)}</time>
          <WaveformSeek
            currentTime={music.currentTime}
            duration={music.duration}
            onSeek={music.seek}
            onPointerDown={cancelCollapse}
            onPointerUp={finishSeeking}
          />
          <time>{formatTime(music.duration)}</time>
        </div>

        <div className="audio-dock-secondary">
          <label className="audio-dock-volume">
            <Volume2 aria-hidden="true" />
            <span className="sr-only">Music volume</span>
            <input aria-label="Music volume" type="range" min="0" max="1" step="0.01" value={music.volume} onChange={(event) => music.setVolume(Number(event.currentTarget.value))} />
          </label>
          <button type="button" aria-label="Open music and ambience settings" onClick={() => { onOpenDialog(); closeAfterAction(); }}><Settings2 aria-hidden="true" /></button>
        </div>
      </div>
    </section>
  );
}
