import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

export function JeopardyDialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const trigger = document.activeElement;
    if (dialog && !dialog.open) dialog.showModal();
    return () => { if (dialog?.open) dialog.close(); if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus(); };
  }, []);
  return <dialog ref={ref} className="bappi-jeopardy-dialog" aria-labelledby="jeopardy-dialog-title" onCancel={event => { event.preventDefault(); onClose(); }}>
    <div className="bappi-jeopardy-dialog-panel"><header><h2 id="jeopardy-dialog-title">{title}</h2><button className="icon-button" type="button" aria-label="Close Jeopardy dialog" onClick={onClose}><X size={19} /></button></header>{children}</div>
  </dialog>;
}
