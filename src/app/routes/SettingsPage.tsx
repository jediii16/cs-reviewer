import { Archive, ArrowUpRight, Download, FileJson, Leaf, RotateCcw, Upload } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { useLearning } from '../../features/learning/useLearning';
import { exportSyllabus, parseSyllabus } from '../../features/learning/persistence';
import type { SyllabusBundle } from '../../features/learning/persistence';

export function SettingsPage() {
  const { state, period, actions } = useLearning();
  const [preview, setPreview] = useState<SyllabusBundle | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  async function readFile(file?: File) {
    setError(''); setMessage(''); setPreview(null);
    if (!file) return;
    if (file.size > 2_000_000) { setError('Choose a Bappi JSON file smaller than 2 MB.'); return; }
    try { setPreview(parseSyllabus(await file.text())); } catch (e) { setError(e instanceof Error ? e.message : 'This file could not be read.'); }
  }
  function download() {
    const bundle = exportSyllabus(state);
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = `bappi-${period.id}-backup.json`; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage('Backup downloaded. It includes this period’s syllabus, progress, sessions, bookmarks, and question notes.');
  }
  return <section className="settings-page"><header className="page-intro"><div><span className="eyebrow">Make yourself at home</span><h1>Your desk, <em>your way.</em></h1><p>A little organization. A little less distraction.</p></div></header>
    <section className="settings-section"><div className="settings-heading"><Leaf size={23} /><div><h2>A calmer Bappi</h2><p>Keep the companion, pause the rolling animation. Reduced-motion preferences also pause it automatically.</p></div></div><label className="toggle-setting"><input type="checkbox" checked={state.calmMascot} onChange={(event) => actions.setCalm(event.currentTarget.checked)} /><span>Calm mascot mode</span></label></section>
    <section className="settings-section"><div className="settings-heading"><Archive size={23} /><div><h2>Your exam periods</h2><p>Each period has its own lessons, sessions, mistakes, and bookmarks. Archiving hides a period from the selector and keeps its data.</p></div></div><div className="period-list">{state.periods.map((p) => <div key={p.id}><span><strong>{p.label}</strong><small>{p.archived ? 'Archived · data kept' : p.id === state.activePeriodId ? 'Current period' : 'Available'}</small></span><div>{p.archived ? <Button variant="ghost" onClick={() => { actions.archivePeriod(p.id, false); setMessage(`${p.label} restored to your period selector.`); }}><RotateCcw size={15} />Restore</Button> : <>{p.id !== state.activePeriodId ? <button className="text-button" type="button" onClick={() => actions.setPeriod(p.id)}>Open<ArrowUpRight size={15} /></button> : null}<button className="text-button" type="button" disabled={state.periods.filter((item) => !item.archived).length <= 1} onClick={() => { actions.archivePeriod(p.id, true); setMessage(`${p.label} archived. Its saved data is still here.`); }}><Archive size={15} />Archive</button></>}</div></div>)}</div></section>
    <section className="settings-section"><div className="settings-heading"><FileJson size={23} /><div><h2>Bring your syllabus with you</h2><p>Export the selected period as a Bappi JSON backup. Import a backup or a syllabus in the same format. Imports always create a separate period.</p></div></div><div className="transfer-actions"><Button variant="secondary" onClick={download}><Download size={17} />Export {period.label} & progress</Button><label className="button button-secondary file-import"><Upload size={17} />Choose Bappi JSON<input type="file" aria-label="Import Bappi syllabus" accept=".json,application/json" onChange={(event) => { void readFile(event.currentTarget.files?.[0]); event.currentTarget.value = ''; }} /></label></div>
      <details className="import-format"><summary>How do I prepare a new syllabus?</summary><p>Export the current Finals period for a complete example. Its <code>period.subjects</code> contains lessons and sections, and <code>period.questions</code> maps subject IDs to question arrays. Include stable IDs, answers, explanations, and source references. Remove <code>progress</code> for a fresh start. This import accepts Bappi JSON; PDFs and slides need to be converted into reviewed lesson content first.</p></details>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      {preview ? <div className="import-preview"><span className="eyebrow">Ready to import</span><h3>{preview.period.label}</h3><p>{preview.period.subjects?.length ?? 0} subjects · {preview.period.subjects?.reduce((sum, s) => sum + s.topics.length, 0)} lessons · {Object.values(preview.period.questions ?? {}).flat().length} questions</p><p>{preview.progress ? 'Saved progress will be included.' : 'This syllabus will start with fresh progress.'} Your existing periods will stay saved.</p><Button onClick={() => { actions.importPeriod(preview); setPreview(null); setMessage('Imported as a separate period and selected. Your existing periods are still available.'); }}>Import as a new period</Button><button className="text-button" type="button" onClick={() => setPreview(null)}>Cancel</button></div> : null}
    </section>
    {message ? <p className="settings-message" role="status">{message}</p> : null}
    <p className="privacy-note">Your study data stays in this browser. Export a backup before moving devices or clearing browser data. Appearance and audio preferences stay shared across periods.</p>
  </section>;
}
