import { BookOpenText, Moon, Sun } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { useAppearance } from '../features/appearance/useAppearance';
import { FocusTimer } from '../features/timer/FocusTimer';

export function AppShell() {
  const { resolvedTheme, toggleTheme } = useAppearance();

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="brand" to="/" aria-label="Study Desk home">
            <BookOpenText aria-hidden="true" />
            <span>Study Desk</span>
          </Link>
          <div className="header-actions">
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
