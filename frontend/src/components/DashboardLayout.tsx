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
    <div className="flex min-h-screen pt-16 bg-[#FAF8F5]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-16 bottom-0 w-64 border-r border-[#E5DDD3] bg-white/80 backdrop-blur-xl flex flex-col">
        <nav className="flex-1 px-3 py-6 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#550000] text-white shadow-glow'
                    : 'text-[#5A4F43]/70 hover:bg-[#F0EBE3] hover:text-[#1a1a1a]'
                }`
              }
            >
              <span className="text-base">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-[#E5DDD3] p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#5A4F43]/60 transition hover:bg-[#550000]/10 hover:text-[#550000]"
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
