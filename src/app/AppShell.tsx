import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Study Desk home">
          <span className="brand-mark" aria-hidden="true">SD</span>
          <span>Study Desk</span>
        </Link>
        <span className="header-note">Private to this browser</span>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
