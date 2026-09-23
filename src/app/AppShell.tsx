import { Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BappiMascot } from '../components/BappiMascot';
import { useAppearance } from '../features/appearance/useAppearance';
import { AudioPlayer } from '../features/audio/AudioPlayer';
import { BlurtingNotes } from '../features/notes/BlurtingNotes';
import { FocusTimer } from '../features/timer/FocusTimer';

function RouteScrollReset() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

export function AppShell() {
  const { resolvedTheme, toggleTheme } = useAppearance();

  return (
    <div className="app-shell">
      <RouteScrollReset />
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
