import { Link } from 'react-router-dom';

const features = [
  { icon: '🔍', title: 'AI Face Detection', desc: 'Computer Vision', detail: 'CNN-based face analysis using PyTorch and OpenCV for precise skin tone, undertone, and face shape detection.' },
  { icon: '🤖', title: 'LLM Beauty Assistant', desc: 'Ollama', detail: 'RAG-powered chatbot that answers beauty questions using your personal profile and product knowledge.' },
  { icon: '🎯', title: 'Recommendation Engine', desc: 'Personalized Products', detail: 'Cosine similarity matching against product catalog with feedback-driven re-ranking.' },
  { icon: '📈', title: 'Feedback Learning', desc: 'Improves Over Time', detail: 'Exponential moving average preference weighting based on your ratings and history.' },
];

const techStack = [
  { category: 'Frontend', items: ['React', 'TypeScript', 'Tailwind CSS'] },
  { category: 'Backend', items: ['FastAPI', 'JWT Auth', 'REST APIs'] },
  { category: 'AI/ML', items: ['PyTorch', 'Ollama', 'RAG', 'OpenCV'] },
  { category: 'Database', items: ['PostgreSQL', 'SQLAlchemy'] },
  { category: 'Deployment', items: ['Docker', 'Render', 'Vercel'] },
];

const pipeline = [
  { step: 'Image Upload', icon: '📷' },
  { step: 'PyTorch Face Analysis', icon: '🧠' },
  { step: 'Feature Extraction', icon: '⚙️' },
  { step: 'Recommendation Engine', icon: '🎯' },
  { step: 'Ollama LLM', icon: '🤖' },
  { step: 'Personalized Suggestions', icon: '✨' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-24 md:py-36">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-pink-200/30 blur-3xl" />
        <div className="absolute -right-24 top-16 h-80 w-80 rounded-full bg-orange-100/40 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-block rounded-full bg-pink-50 px-4 py-1.5 text-xs font-medium text-pink-600">AI-Powered Beauty Platform</div>
          <h1 className="mt-6 font-serif text-5xl leading-[1.08] tracking-tight text-sand-900 md:text-7xl">
            AI Beauty<br />Recommendation Platform
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cocoa/65 md:text-lg">
            Upload a selfie and receive personalized beauty recommendations powered by Computer Vision, LLMs, and Explainable AI.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/auth" className="rounded-full bg-sand-900 px-8 py-3.5 text-sm font-medium text-white shadow-glow transition hover:translate-y-[-2px]">Try Demo</Link>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="rounded-full border border-sand-200 bg-white px-8 py-3.5 text-sm font-medium text-sand-900 transition hover:bg-sand-50">View GitHub</a>
          </div>
        </div>
      </section>

      {/* Trusted Technologies */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cocoa/40">Trusted Technologies</p>
          <p className="mt-3 text-sm text-cocoa/60">PyTorch &bull; FastAPI &bull; Ollama &bull; PostgreSQL &bull; JWT &bull; React</p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cocoa/40">Capabilities</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-sand-900 md:text-5xl">Built for Real Beauty Tech</h2>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="group rounded-2xl border border-sand-100 bg-white p-6 transition hover:border-pink-200 hover:shadow-lg">
                <span className="text-3xl">{f.icon}</span>
                <p className="mt-3 text-xs font-medium text-pink-500">{f.desc}</p>
                <h3 className="mt-1 font-serif text-lg font-semibold text-sand-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cocoa/60">{f.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Pipeline */}
      <section className="px-6 py-24 bg-sand-50/50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cocoa/40">AI Pipeline</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-sand-900 md:text-5xl">End-to-End Intelligence</h2>
          </div>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
            {pipeline.map((p, i) => (
              <div key={p.step} className="flex items-center gap-3">
                <div className="flex items-center gap-3 rounded-2xl border border-sand-100 bg-white px-5 py-4 transition hover:shadow-md">
                  <span className="text-2xl">{p.icon}</span>
                  <span className="text-sm font-medium text-sand-900">{p.step}</span>
                </div>
                {i < pipeline.length - 1 && (
                  <svg className="h-5 w-5 shrink-0 text-cocoa/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id="tech" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cocoa/40">Tech Stack</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-sand-900 md:text-5xl">Production-Grade Stack</h2>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {techStack.map((t) => (
              <div key={t.category} className="rounded-2xl border border-sand-100 bg-white p-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-pink-500">{t.category}</p>
                <div className="mt-3 space-y-1.5">
                  {t.items.map((item) => (
                    <p key={item} className="text-sm font-medium text-sand-900">{item}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" className="px-6 py-24 bg-sand-50/50">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cocoa/40">Architecture</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-sand-900 md:text-5xl">System Design</h2>
          </div>
          <div className="mt-16 rounded-3xl border border-sand-100 bg-white p-8 md:p-12">
            <pre className="overflow-x-auto text-center text-sm leading-relaxed text-cocoa/70 font-mono">
{`        User
          │
          ▼
    ┌──────────┐
    │  React   │
    │ Frontend │
    └────┬─────┘
         │ REST APIs
         ▼
    ┌──────────┐
    │ FastAPI  │
    │ Backend  │
    └────┬─────┘
    ┌────┴─────────┐
    │              │
    ▼              ▼
┌────────┐   ┌──────────┐
│PyTorch │   │ Ollama   │
│  CV    │   │  LLM     │
└───┬────┘   └────┬─────┘
    │              │
    └──────┬───────┘
           ▼
  ┌────────────────┐
  │ Recommendation │
  │    Engine      │
  └───────┬────────┘
          ▼
  ┌────────────────┐
  │  PostgreSQL    │
  │  + Analytics   │
  └────────────────┘`}
            </pre>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-3xl bg-sand-900 p-12 text-center text-pearl shadow-glow md:p-16">
            <h2 className="font-serif text-3xl leading-tight md:text-5xl">Ready to discover your perfect shade?</h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-pearl/70">
              Experience AI-powered beauty recommendations tailored to your unique features.
            </p>
            <Link to="/auth" className="mt-10 inline-block rounded-full bg-white px-8 py-3.5 text-sm font-medium text-sand-900 shadow-lg transition hover:translate-y-[-2px]">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
