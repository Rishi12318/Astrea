import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const token = localStorage.getItem('makeup_token');
  const isLanding = location.pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#E5DDD3]/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[#550000]" />
          <span className="font-serif italic text-lg font-bold tracking-tight text-[#1a1a1a]">Astrea</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {isLanding && (
            <>
              <a href="#about" className="text-sm text-[#5A4F43]/70 transition hover:text-[#1a1a1a]">About</a>
              <a href="#features" className="text-sm text-[#5A4F43]/70 transition hover:text-[#1a1a1a]">Features</a>
              <a href="#architecture" className="text-sm text-[#5A4F43]/70 transition hover:text-[#1a1a1a]">Architecture</a>
            </>
          )}
          {token && (
            <Link to="/app" className="text-sm text-[#5A4F43]/70 transition hover:text-[#1a1a1a]">Dashboard</Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {token ? (
            <Link to="/app" className="rounded-full bg-[#550000] px-5 py-2 text-sm font-medium text-white transition hover:translate-y-[-1px]">Dashboard</Link>
          ) : (
            <>
              <Link to="/auth" className="text-sm font-medium text-[#5A4F43]/70 transition hover:text-[#1a1a1a]">Login</Link>
              <Link to="/auth" className="rounded-full bg-[#550000] px-5 py-2 text-sm font-medium text-white transition hover:translate-y-[-1px]">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
