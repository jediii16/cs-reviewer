import { BookOpen, Brain, ChevronDown, Home, Leaf, Moon, Search, Settings2, SlidersHorizontal, Sun, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { BappiMascot } from '../components/BappiMascot';
import { useAppearance } from '../features/appearance/useAppearance';
import { AudioPlayer } from '../features/audio/AudioPlayer';
import { BlurtingNotes } from '../features/notes/BlurtingNotes';
import { FocusTimer } from '../features/timer/FocusTimer';
import { useLearning } from '../features/learning/useLearning';

export function AppShell() {
  const { resolvedTheme, toggleTheme } = useAppearance();
  const { state, period, subjects, storageError, actions } = useLearning();
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const first = subjects[0];
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); }, [pathname, state.activePeriodId]);
  useEffect(() => {
    if (!toolsOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setToolsOpen(false); triggerRef.current?.focus(); } };
    const outside = (event: PointerEvent) => { if (event.target instanceof Node && !toolsRef.current?.contains(event.target)) setToolsOpen(false); };
    document.addEventListener('keydown', close); document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', outside); };
  }, [toolsOpen]);
  const nav = [{ to: '/', label: 'My desk', icon: Home, end: true }, { to: first ? `/subjects/${first.id}/study` : '/search', label: 'Lessons', icon: BookOpen }, { to: first ? `/subjects/${first.id}/test` : '/search', label: 'Practice', icon: Brain }, { to: '/review', label: 'Review', icon: Leaf }];
  return <div className={`app-shell study-desk-shell ${state.calmMascot ? 'calm-mode' : ''}`}>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <aside className="app-sidebar">
      <Link className="brand" to="/" aria-label="Bappi home"><BappiMascot className="brand-mascot" eager /><span>Bappi<span className="brand-subtitle">a little study companion</span></span></Link>
      <div className="sidebar-caption">YOUR SPACE</div>
      <nav className="desk-navigation" aria-label="Primary navigation">{nav.map(({ to, label, icon: Icon, end }) => <NavLink key={label} to={to} end={end} className={({ isActive }) => isActive ? 'active' : ''}><Icon size={19} /><span>{label}</span></NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="sidebar-quote"><Leaf size={19} /><p>A little focus.<br />A little progress.</p></div><label className="period-selector"><span>Exam period</span><span className="period-select-wrap"><select aria-label="Exam period" value={period.id} onChange={(event) => actions.setPeriod(event.currentTarget.value)}>{state.periods.filter((p) => !p.archived).map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</select><ChevronDown size={15} /></span></label><NavLink className="settings-link" to="/settings" aria-label="Settings & syllabus"><Settings2 size={18} /><span>Settings & syllabus</span></NavLink></div>
    </aside>
    <div className="workspace-frame"><header className="workspace-header"><span className="workspace-breadcrumb">YOUR STUDY DESK <span>/</span> {period.label}</span><div className="workspace-header-actions"><Link className="header-search" to="/search" aria-label="Search lessons"><Search size={19} /><span>Find a concept</span><kbd>⌕</kbd></Link><div className="study-tools" ref={toolsRef}><button className="tools-trigger" type="button" aria-label="Study tools" ref={triggerRef} aria-expanded={toolsOpen} aria-controls="tools-tray" onClick={() => setToolsOpen(!toolsOpen)}><SlidersHorizontal size={18} /><span>Study tools</span></button><div className="tools-tray" id="tools-tray" hidden={!toolsOpen}><div className="tools-tray-title"><strong>A little help focusing</strong><button type="button" className="icon-button" aria-label="Close study tools" onClick={() => { setToolsOpen(false); triggerRef.current?.focus(); }}><X size={17} /></button></div><div className="header-actions"><BlurtingNotes /><AudioPlayer /><button className="theme-toggle" type="button" aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`} onClick={toggleTheme}>{resolvedTheme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</button><FocusTimer /></div><div className="tools-labels"><span>Notes</span><span>Music</span><span>Theme</span><span>Focus timer</span></div></div></div></div></header>
      <main className="main-content" id="main-content" tabIndex={-1}>{storageError ? <p className="storage-alert" role="alert">{storageError}</p> : null}<div key={state.activePeriodId}><Outlet /></div></main><footer className="desk-footer"><Leaf size={13} /><span>A little progress is still progress.</span><span>Made for your pace.</span></footer>
    </div>
  </div>;
}
