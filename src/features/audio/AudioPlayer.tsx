import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Music2 } from 'lucide-react';
import { AudioDialog } from './AudioDialog';
import { AudioDock } from './AudioDock';
import { useFocusAudio, type FocusAudioController } from './useFocusAudio';

export function AudioPlayer() {
  const audio = useFocusAudio();
  return <AudioPlayerSurface audio={audio} />;
}

export function AudioPlayerSurface({ audio }: { audio: FocusAudioController }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function closeDialog() {
    setDialogOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }

  return (
    <>
      <button ref={triggerRef} className="header-tool" type="button" aria-label="Open music and ambience" onClick={() => setDialogOpen(true)}><Music2 aria-hidden="true" /></button>
      {createPortal(
        <>
          {dialogOpen ? <AudioDialog audio={audio} onClose={closeDialog} /> : null}
          <AudioDock audio={audio} onOpenDialog={() => setDialogOpen(true)} />
        </>,
        document.body,
      )}
    </>
  );
}
