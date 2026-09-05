import { Moon, Sun } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { BappiMascot } from '../components/BappiMascot';
import { useAppearance } from '../features/appearance/useAppearance';
import { AudioPlayer } from '../features/audio/AudioPlayer';
import { BlurtingNotes } from '../features/notes/BlurtingNotes';
import { FocusTimer } from '../features/timer/FocusTimer';

export function AppShell() {
  const { resolvedTheme, toggleTheme } = useAppearance();

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="brand" to="/" aria-label="Bappi home">
            <BappiMascot className="brand-mascot" eager />
            <span>Bappi</span>
          </Link>
          <div className="header-actions">
            <BlurtingNotes />
            <AudioPlayer />
            <button
              className="theme-toggle"
              type="button"
              aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
              onClick={toggleTheme}
            >
              {resolvedTheme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
            </button>
            <FocusTimer />
          </div>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
