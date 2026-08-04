import { useNavigate } from 'react-router-dom';
import { setApiToken } from '../services/api';

export default function ProfilePage() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('makeup_token');
    setApiToken(null);
    navigate('/');
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif italic text-3xl font-semibold text-[#1a1a1a]">Profile</h1>
        <p className="mt-1 text-sm text-[#5A4F43]/55">Your account and beauty profile.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Profile Card */}
        <div className="rounded-2xl border border-[#E5DDD3] bg-white p-8">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#550000] font-serif text-2xl font-semibold text-white">
              R
            </div>
            <div>
              <h2 className="font-serif italic text-xl font-semibold text-[#1a1a1a]">Rishika</h2>
              <p className="text-sm text-[#5A4F43]/55">demo@beauty.ai</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {[
              { label: 'Age', value: '24' },
              { label: 'Skin Type', value: 'Combination' },
              { label: 'Undertone', value: 'Warm' },
              { label: 'Skin Tone', value: 'Medium' },
            ].map((field) => (
              <div key={field.label} className="flex items-center justify-between border-b border-[#F0EBE3] pb-3">
                <span className="text-sm text-[#5A4F43]/55">{field.label}</span>
                <span className="text-sm font-medium text-[#1a1a1a]">{field.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E5DDD3] bg-white p-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#550000]/40">Activity</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {[
                { label: 'Saved Looks', value: '5' },
                { label: 'Saved Products', value: '12' },
                { label: 'Total Analyses', value: '28' },
                { label: 'AI Chats', value: '41' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-[#F0EBE3]/50 p-4 text-center">
                  <p className="font-serif text-xl font-semibold text-[#1a1a1a]">{s.value}</p>
                  <p className="mt-1 text-xs text-[#5A4F43]/50">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleLogout} className="w-full rounded-xl border border-[#550000]/20 bg-[#550000]/5 py-3 text-sm font-medium text-[#550000] transition hover:bg-[#550000]/10">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
