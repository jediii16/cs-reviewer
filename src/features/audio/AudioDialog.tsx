import type { MouseEvent } from 'react';
import { useEffect, useRef } from 'react';
import { ChevronDown, ListMusic, Music2, Pause, Play, Volume1, X } from 'lucide-react';
import type { FocusAudioController } from './useFocusAudio';

interface AudioDialogProps {
  audio: FocusAudioController;
  onClose: () => void;
}

export function AudioDialog({ audio, onClose }: AudioDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    if (!dialog.open) dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  function closeFromBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="audio-dialog"
      aria-labelledby="audio-dialog-title"
      onClick={closeFromBackdrop}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
    >
      <div className="audio-dialog-panel">
        <header className="audio-dialog-header">
          <div>
            <h2 id="audio-dialog-title">Music and ambience</h2>
            <p>Layer music and background noise independently.</p>
          </div>
          <button className="icon-button" type="button" aria-label="Close music and ambience" onClick={onClose}><X aria-hidden="true" /></button>
        </header>

        <div className="audio-layer-grid audio-dialog-layers">
          <section className="audio-layer" aria-labelledby="music-layer-title">
            <div className="audio-layer-heading">
              <span className="audio-layer-icon"><Music2 aria-hidden="true" /></span>
              <div><h3 id="music-layer-title">Music</h3><p>{audio.music.playing ? 'Playing now' : audio.music.paused ? 'Paused' : 'Ready when you are'}</p></div>
              <button className="audio-toggle" type="button" aria-label={`${audio.music.playing ? 'Pause' : 'Play'} music`} aria-pressed={audio.music.playing} disabled={audio.music.tracks.length === 0} onClick={() => void audio.music.toggle()}>
                {audio.music.playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
              </button>
            </div>

            <label className="audio-select-control">
              <span>Music track</span>
              <span className="audio-select-wrap">
                <select aria-label="Music track" value={audio.music.selectedTrack?.id ?? ''} disabled={audio.music.tracks.length === 0} onChange={(event) => void audio.music.selectTrack(event.currentTarget.value)}>
                  {audio.music.tracks.map((track) => <option key={track.id} value={track.id}>{track.collectionLabel} · {track.label}</option>)}
                </select>
                <ChevronDown aria-hidden="true" />
              </span>
            </label>

            <div className="repeat-control">
              <span>Repeat</span>
              <div className="repeat-segment" aria-label="Music repeat mode">
                <button type="button" aria-pressed={audio.music.loopMode === 'playlist'} onClick={() => audio.music.setLoopMode('playlist')}><ListMusic aria-hidden="true" /> Playlist</button>
                <button type="button" aria-pressed={audio.music.loopMode === 'track'} onClick={() => audio.music.setLoopMode('track')}>One track</button>
              </div>
            </div>

            <VolumeControl label="Music volume" value={audio.music.volume} onChange={audio.music.setVolume} />
            {audio.music.unavailable ? <p className="audio-status" role="status">This music file could not be played.</p> : audio.music.tracks.length === 0 ? <p className="audio-status">Add music files to this collection when you are ready.</p> : null}
          </section>

          <section className="audio-layer" aria-labelledby="noise-layer-title">
            <div className="audio-layer-heading">
              <span className="audio-layer-icon"><Volume1 aria-hidden="true" /></span>
              <div><h3 id="noise-layer-title">Background noise</h3><p>{audio.noise.playing ? 'Playing now' : 'Optional ambience'}</p></div>
              <button className="audio-toggle" type="button" aria-label={`${audio.noise.playing ? 'Pause' : 'Play'} background noise`} aria-pressed={audio.noise.playing} disabled={audio.noise.tracks.length === 0} onClick={() => void audio.noise.toggle()}>
                {audio.noise.playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
              </button>
            </div>

            <label className="audio-select-control">
              <span>Background noise</span>
              <span className="audio-select-wrap">
                <select aria-label="Background noise" value={audio.noise.selectedTrack?.id ?? ''} disabled={audio.noise.tracks.length === 0} onChange={(event) => void audio.noise.selectTrack(event.currentTarget.value)}>
                  {audio.noise.tracks.map((track) => <option key={track.id} value={track.id}>{track.label}</option>)}
                </select>
                <ChevronDown aria-hidden="true" />
              </span>
            </label>

            <p className="noise-loop-note">Loops continuously for uninterrupted focus.</p>
            <VolumeControl label="Noise volume" value={audio.noise.volume} onChange={audio.noise.setVolume} />
            {audio.noise.unavailable ? <p className="audio-status" role="status">This noise file could not be played.</p> : null}
          </section>
        </div>
      </div>
    </dialog>
  );
}

function VolumeControl({ label, value, onChange }: { label: string; value: number; onChange: (volume: number) => void }) {
  return (
    <label className="volume-control">
      <span>{label}</span>
      <input aria-label={label} type="range" min="0" max="1" step="0.01" value={value} onChange={(event) => onChange(Number(event.currentTarget.value))} />
      <output>{Math.round(value * 100)}%</output>
    </label>
  );
}
