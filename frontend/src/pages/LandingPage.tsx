import { Link } from 'react-router-dom';

const reviews = [
  { name: 'Priya S.', role: 'Makeup Artist', text: 'ASTREA accurately detected my warm undertone and recommended shades I never would have tried. The AI reasoning is spot-on.', avatar: 'P' },
  { name: 'Ananya M.', role: 'Beauty Blogger', text: 'The face analysis is incredibly precise. It identified my face shape and eye shape perfectly. Game changer for content creators.', avatar: 'A' },
  { name: 'Ritika K.', role: 'Bridal Client', text: 'Used this before my wedding consultation. The bridal recommendations matched exactly what my makeup artist suggested. Impressed!', avatar: 'R' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen pt-16">

      {/* ── Section 1: Hero ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          >
            <source src="https://v1.pinimg.com/videos/iht/720p/f1/44/46/f14446ab19c46e69104b8e08d65f720f.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="inline-block rounded-full border border-white/20 bg-white/10 px-5 py-1.5 text-xs font-medium tracking-wider text-white/90 backdrop-blur-sm">
            AI-POWERED BEAUTY PLATFORM
          </div>
          <h1 className="mt-6 font-serif text-5xl leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl">
            Your Perfect Shade,
            <br />
            <span className="italic text-pink-300">Found by AI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            Upload a selfie and receive personalized beauty recommendations powered by Computer Vision, LLMs, and Explainable AI.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/auth"
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-sand-900 shadow-lg transition hover:translate-y-[-2px] hover:shadow-xl"
            >
              Try Demo Free
            </Link>
            <a
              href="#about"
              className="rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Learn More
            </a>
          </div>

          {/* Trusted logos */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/40">
            <span className="text-xs font-medium tracking-widest uppercase">PyTorch</span>
            <span className="text-white/20">|</span>
            <span className="text-xs font-medium tracking-widest uppercase">FastAPI</span>
            <span className="text-white/20">|</span>
            <span className="text-xs font-medium tracking-widest uppercase">Ollama</span>
            <span className="text-white/20">|</span>
            <span className="text-xs font-medium tracking-widest uppercase">PostgreSQL</span>
            <span className="text-white/20">|</span>
            <span className="text-xs font-medium tracking-widest uppercase">React</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <svg className="h-6 w-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Section 2: About ── */}
      <section id="about" className="relative overflow-hidden">
        {/* Beige background + maroon right column */}
        <div className="absolute inset-0 flex">
          <div className="w-[80%] bg-[#F5F0EB]" />
          <div className="w-[20%] bg-[#6B1D2A]" />
        </div>

        <div className="relative px-6 py-24 md:py-32">
          <div className="mx-auto max-w-6xl">
            {/* Title */}
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cocoa/40">About ASTREA</p>
              <h2 className="mt-3 font-serif text-3xl tracking-tight text-sand-900 md:text-5xl">Intelligence Meets Beauty</h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-cocoa/60">
                We combine deep learning, computer vision, and large language models to deliver hyper-personalized makeup recommendations that understand you.
              </p>
            </div>

            {/* Eye Palette Card 1 + Cursive Quote */}
            <div className="mt-16 flex flex-col items-center gap-10 md:flex-row md:items-center md:justify-center">
              <div className="relative w-full max-w-md">
                <div className="rounded-[2rem] border-2 border-[#8B5C5F]/30 bg-gradient-to-br from-[#2C2C2C] to-[#1A1A1A] p-6 shadow-2xl">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-serif text-sm font-semibold tracking-wider text-white/70">ASTREA</span>
                    <span className="text-[0.6rem] uppercase tracking-widest text-white/30">Eyeshadow Palette</span>
                  </div>
                  <div className="grid grid-cols-4 grid-rows-3 gap-2.5">
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-rose-300 to-pink-400 shadow-inner" />
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-amber-200 to-orange-300 shadow-inner" />
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-fuchsia-300 to-purple-400 shadow-inner" />
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-red-300 to-rose-500 shadow-inner" />
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-pink-200 to-rose-300 shadow-inner" />
                    <div className="col-span-2 row-span-2 aspect-square overflow-hidden rounded-2xl border-2 border-white/20 shadow-lg">
                      <video autoPlay loop muted playsInline className="h-full w-full object-cover">
                        <source src="https://v1.pinimg.com/videos/iht/expMp4/68/81/5e/68815e08d2c14dfbf89a8f7d18258aaf_720w.mp4" type="video/mp4" />
                      </video>
                    </div>
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-red-400 to-pink-500 shadow-inner" />
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-orange-300 to-amber-400 shadow-inner" />
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-rose-400 to-red-400 shadow-inner" />
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-pink-400 to-fuchsia-400 shadow-inner" />
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-amber-300 to-orange-400 shadow-inner" />
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                    <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
                    <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                  </div>
                </div>
              </div>
              <div className="text-center md:text-left md:max-w-sm">
                <p className="font-serif text-4xl leading-snug italic tracking-wide text-sand-900 md:text-5xl">
                  This is your time to shine, diva
                </p>
                <p className="mt-4 text-sm leading-relaxed text-cocoa/55">
                  Let AI find the shades that make you glow. Your beauty, amplified by intelligence.
                </p>
              </div>
            </div>

            {/* Eye Palette Card 2 + Know Your Skin Type */}
            <div className="mt-16 flex flex-col-reverse items-center gap-10 md:flex-row md:items-center md:justify-center">
              <div className="text-center md:text-right md:max-w-sm">
                <p className="font-serif text-4xl leading-snug italic tracking-wide text-sand-900 md:text-5xl">
                  Know your skin type
                </p>
                <p className="mt-4 text-sm leading-relaxed text-cocoa/55">
                  Our CNN detects your exact skin tone, undertone, and face shape in seconds. Precision beauty starts with understanding you.
                </p>
              </div>
              <div className="relative w-full max-w-md">
                <div className="rounded-[2rem] border-2 border-[#8B5C5F]/30 bg-gradient-to-br from-[#2C2C2C] to-[#1A1A1A] p-6 shadow-2xl">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-serif text-sm font-semibold tracking-wider text-white/70">ASTREA</span>
                    <span className="text-[0.6rem] uppercase tracking-widest text-white/30">Skin Analysis</span>
                  </div>
                  <div className="grid grid-cols-4 grid-rows-3 gap-2.5">
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-amber-200 to-yellow-300 shadow-inner" />
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-orange-300 to-amber-400 shadow-inner" />
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-rose-300 to-pink-400 shadow-inner" />
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-red-300 to-rose-400 shadow-inner" />
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-amber-300 to-orange-300 shadow-inner" />
                    <div className="col-span-2 row-span-2 aspect-square overflow-hidden rounded-2xl border-2 border-white/20 shadow-lg">
                      <video autoPlay loop muted playsInline className="h-full w-full object-cover">
                        <source src="https://v1.pinimg.com/videos/iht/720p/73/90/c4/7390c46af4c2b04106ef003291f74ee7.mp4" type="video/mp4" />
                      </video>
                    </div>
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-rose-400 to-red-400 shadow-inner" />
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-orange-200 to-amber-300 shadow-inner" />
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-pink-300 to-rose-400 shadow-inner" />
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-red-200 to-pink-300 shadow-inner" />
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-amber-200 to-orange-300 shadow-inner" />
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                    <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
                    <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: '🔍', title: 'AI Face Detection', desc: 'CNN-powered analysis using PyTorch and OpenCV for skin tone, undertone, and face shape detection.', tag: 'Computer Vision' },
                { icon: '🤖', title: 'LLM Beauty Assistant', desc: 'RAG-powered chatbot that answers beauty questions using your personal profile.', tag: 'Ollama' },
                { icon: '🎯', title: 'Recommendation Engine', desc: 'Cosine similarity matching against product catalog with feedback-driven re-ranking.', tag: 'Personalized' },
                { icon: '📈', title: 'Feedback Learning', desc: 'System improves over time using exponential moving average preference weighting.', tag: 'Adaptive' },
              ].map((f) => (
                <div key={f.title} className="group rounded-2xl border border-white/50 bg-white/70 p-6 backdrop-blur-sm transition hover:border-pink-200 hover:bg-white hover:shadow-lg">
                  <span className="text-3xl">{f.icon}</span>
                  <span className="ml-2 rounded-full bg-pink-50 px-2.5 py-0.5 text-[0.6rem] font-semibold text-pink-600">{f.tag}</span>
                  <h3 className="mt-3 font-serif text-lg font-semibold text-sand-900">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cocoa/60">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Architecture preview */}
            <div className="mt-16 rounded-3xl border border-white/50 bg-white/70 p-8 backdrop-blur-sm md:p-12">
              <h3 className="text-center text-xs font-semibold uppercase tracking-widest text-cocoa/40">System Architecture</h3>
              <pre className="mx-auto mt-6 max-w-lg overflow-x-auto text-center text-xs leading-relaxed text-cocoa/60 font-mono">
{`    Image Upload
         │
         ▼
  ┌──────────────┐
  │   PyTorch    │
  │  Face Analysis│
  └──────┬───────┘
         ▼
  ┌──────────────┐
  │  Cosine Sim  │
  │Recommendation│
  └──────┬───────┘
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────┐
│ Ollama│ │  DB   │
│  LLM  │ │ Postgr│
└───────┘ └───────┘`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Get Started ── */}
      <section className="px-6 py-24 md:py-32 bg-sand-50/50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cocoa/40">How It Works</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-sand-900 md:text-5xl">Get Started in 4 Steps</h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { num: '01', title: 'Sign Up', desc: 'Create your free account in seconds.', icon: '👤' },
              { num: '02', title: 'Upload Photo', desc: 'Take a selfie or upload any face photo.', icon: '📷' },
              { num: '03', title: 'AI Analysis', desc: 'Get instant face and skin tone analysis.', icon: '🧠' },
              { num: '04', title: 'Get Matched', desc: 'Receive personalized product recommendations.', icon: '💄' },
            ].map((s) => (
              <div key={s.num} className="relative rounded-2xl border border-sand-100 bg-white p-6 text-center transition hover:shadow-lg">
                <span className="text-3xl">{s.icon}</span>
                <div className="mx-auto mt-3 flex h-10 w-10 items-center justify-center rounded-full bg-sand-900 font-serif text-sm font-semibold text-white">
                  {s.num}
                </div>
                <h3 className="mt-3 font-serif text-lg font-semibold text-sand-900">{s.title}</h3>
                <p className="mt-1 text-sm text-cocoa/60">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/auth"
              className="inline-block rounded-full bg-sand-900 px-10 py-4 text-sm font-semibold text-white shadow-glow transition hover:translate-y-[-2px]"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 4: Reviews ── */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cocoa/40">Testimonials</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-sand-900 md:text-5xl">Loved by Beauty Enthusiasts</h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.name} className="rounded-2xl border border-sand-100 bg-white p-6 transition hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-300 to-rose-300 font-serif text-sm font-semibold text-white">
                    {r.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-sand-900">{r.name}</p>
                    <p className="text-xs text-cocoa/50">{r.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-cocoa/65">{r.text}</p>
                <div className="mt-3 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: CTA ── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-3xl bg-sand-900 p-12 text-center text-pearl shadow-glow md:p-16">
            <h2 className="font-serif text-3xl leading-tight md:text-5xl">Ready to discover your perfect shade?</h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-pearl/70">
              Join ASTREA and experience AI-powered beauty recommendations tailored to your unique features.
            </p>
            <Link to="/auth" className="mt-10 inline-block rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-sand-900 shadow-lg transition hover:translate-y-[-2px]">
              Start Now — It's Free
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
