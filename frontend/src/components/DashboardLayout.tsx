import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { setApiToken } from '../services/api';

const links = [
  { to: '/app', icon: '🏠', label: 'Dashboard', end: true },
  { to: '/app/analysis', icon: '📷', label: 'Face Analysis' },
  { to: '/app/recommendations', icon: '💄', label: 'Recommendations' },
  { to: '/app/assistant', icon: '🤖', label: 'AI Assistant' },
  { to: '/app/history', icon: '📜', label: 'History' },
  { to: '/app/profile', icon: '👤', label: 'Profile' },
];

export default function DashboardLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('makeup_token');
    setApiToken(null);
    navigate('/');
  }

  return (
    <div className="flex min-h-screen pt-16">
      {/* Sidebar */}
      <aside className="fixed left-0 top-16 bottom-0 w-64 border-r border-sand-100 bg-white/80 backdrop-blur-xl flex flex-col">
        <nav className="flex-1 px-3 py-6 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-sand-900 text-white shadow-glow'
                    : 'text-cocoa/70 hover:bg-sand-50 hover:text-sand-900'
                }`
              }
            >
              <span className="text-base">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-sand-100 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-cocoa/60 transition hover:bg-red-50 hover:text-red-600"
          >
            <span className="text-base">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
