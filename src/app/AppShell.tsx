import { Link, Outlet, useLocation } from 'react-router-dom';
import { FocusTimer } from '../features/timer/FocusTimer';

export function AppShell() {
  const location = useLocation();
  const showTimer = location.pathname.startsWith('/subjects/cit017');
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Study Desk home">
          <span className="brand-mark" aria-hidden="true">SD</span>
          <span>Study Desk</span>
        </Link>
        {showTimer ? <FocusTimer /> : <span className="header-note">Private to this browser</span>}
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
