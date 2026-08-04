import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, setApiToken } from '../services/api';

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const auth = mode === 'register'
        ? await register({ email, password, full_name: fullName || undefined })
        : await login({ email, password });
      setApiToken(auth.access_token);
      localStorage.setItem('makeup_token', auth.access_token);
      navigate('/app');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-16">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-sand-100 bg-white p-10 shadow-soft">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-gradient-to-br from-pink-400 to-rose-300" />
            <h1 className="font-serif text-2xl font-semibold text-sand-900">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
            <p className="mt-2 text-sm text-cocoa/55">{mode === 'login' ? 'Sign in to your beauty dashboard' : 'Start your AI beauty journey'}</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {mode === 'register' && (
              <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-xl border border-sand-200 bg-sand-50/50 px-4 py-3 text-sm outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-100" />
            )}
            <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-sand-200 bg-sand-50/50 px-4 py-3 text-sm outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-100" />
            <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-sand-200 bg-sand-50/50 px-4 py-3 text-sm outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-100" />
            {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-xs text-red-600">{error}</p>}
            <button type="submit" disabled={busy} className="w-full rounded-xl bg-sand-900 py-3 text-sm font-medium text-white transition hover:bg-sand-800 disabled:opacity-50">
              {busy ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-cocoa/55">
            {mode === 'login' ? (
              <>New here? <button onClick={() => { setMode('register'); setError(''); }} className="font-medium text-sand-900 hover:underline">Sign up</button></>
            ) : (
              <>Have an account? <button onClick={() => { setMode('login'); setError(''); }} className="font-medium text-sand-900 hover:underline">Sign in</button></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
